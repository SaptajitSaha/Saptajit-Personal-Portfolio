import * as THREE from "three";

/**
 * SignalField — the site's "signal" metaphor as a WebGL backdrop.
 *
 * Two layers share one fixed canvas:
 * 1. Threads — eight shader-displaced ribbons flowing behind the whole page,
 *    like oscilloscope traces. They drift with time, precess with scroll, and
 *    bulge away from the pointer.
 * 2. Rings — three tilted orbital rings with traveling dashes, anchored to the
 *    hero portrait's on-screen position, so they scroll away with the hero.
 *
 * CPU work per frame is limited to uniform updates and three dash transforms;
 * all thread motion lives in the vertex shader.
 */

export type SignalFieldHandles = {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  /** Point the orbital rings at the hero portrait's live DOM element. */
  followHero: (element: HTMLElement | null) => void;
  update: (elapsedSeconds: number) => void;
  resize: (width: number, height: number) => void;
  setPointer: (ndcX: number, ndcY: number, strength: number) => void;
  setScrollProgress: (progress: number) => void;
  setColors: (accent: string, dim: string, alpha: number) => void;
  dispose: () => void;
};

type SignalFieldOptions = {
  accent: string;
  dim: string;
  alpha: number;
  threadCount: number;
  segments: number;
};

const THREAD_VERTEX = /* glsl */ `
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uPointerStrength;
  uniform float uTurbulence;

  attribute float aPhase;
  attribute float aAccent;

  varying vec2 vUv;
  varying float vAccent;

  void main() {
    vUv = uv;
    vAccent = aAccent;

    vec3 p = position;
    float t = uv.x;
    float envelope = sin(t * 3.14159);

    // Layered sine waves: a slow swell, a mid ripple, and a fine shimmer.
    float swell = sin(t * 4.0 + uTime * 0.24 + aPhase * 7.0) * 0.62;
    float ripple = sin(t * 11.0 - uTime * 0.42 + aPhase * 19.0) * 0.24;
    float shimmer = sin(t * 27.0 + uTime * 0.9 + aPhase * 37.0) * 0.07;
    p.z += (swell + ripple + shimmer) * envelope * uTurbulence;
    p.y += sin(t * 5.0 + uTime * 0.31 + aPhase * 13.0) * 0.2 * envelope;

    // Pointer pressure: threads bend away from the cursor, then relax.
    vec2 toPointer = p.xy - uPointer;
    float dist = length(toPointer);
    float push = exp(-dist * dist * 1.05) * uPointerStrength;
    p.xy += normalize(toPointer + 0.0001) * push * 0.55;
    p.z += push * 0.4;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const THREAD_FRAGMENT = /* glsl */ `
  uniform vec3 uAccent;
  uniform vec3 uDim;
  uniform float uGlobalAlpha;

  varying vec2 vUv;
  varying float vAccent;

  void main() {
    // Soft edges across the ribbon height and a taper toward both ends.
    float across = smoothstep(0.0, 0.5, vUv.y) * smoothstep(1.0, 0.5, vUv.y);
    float along = smoothstep(0.0, 0.14, vUv.x) * smoothstep(1.0, 0.86, vUv.x);
    float breathe = 0.78 + 0.22 * sin(vUv.x * 21.0);
    vec3 color = mix(uDim, uAccent, vAccent);
    gl_FragColor = vec4(color, across * along * breathe * uGlobalAlpha);
  }
`;

function threadFieldGeometry(threadCount: number, segments: number) {
  const positions: number[] = [];
  const uvs: number[] = [];
  const phases: number[] = [];
  const accents: number[] = [];
  const indices: number[] = [];

  let seed = 987654321;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  for (let thread = 0; thread < threadCount; thread += 1) {
    const row = thread / (threadCount - 1);
    const y = 2.35 - row * 4.6 + (random() - 0.5) * 0.55;
    const z = -1.4 + row * 2.2 + (random() - 0.5) * 0.9;
    const phase = random();
    // Three accent threads carry the vermilion; the rest stay quiet.
    const accent = thread % 3 === Math.floor(threadCount / 6) ? 1 : 0.06 + random() * 0.12;

    const base = positions.length / 3;
    for (let i = 0; i <= segments; i += 1) {
      const t = i / segments;
      const x = (t - 0.5) * 13.5;
      positions.push(x, y, z);
      positions.push(x, y + 0.085, z);
      uvs.push(t, 0, t, 1);
      phases.push(phase, phase);
      accents.push(accent, accent);
    }
    for (let i = 0; i < segments; i += 1) {
      const a = base + i * 2;
      indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setAttribute("aPhase", new THREE.Float32BufferAttribute(phases, 1));
  geometry.setAttribute("aAccent", new THREE.Float32BufferAttribute(accents, 1));
  geometry.setIndex(indices);
  return geometry;
}

export function createSignalField(canvas: HTMLCanvasElement, options: SignalFieldOptions) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 40);
  camera.position.set(0, 0.25, 4.6);

  // --- Threads: one merged mesh, one draw call for the whole field. ---
  const threadMaterial = new THREE.ShaderMaterial({
    vertexShader: THREAD_VERTEX,
    fragmentShader: THREAD_FRAGMENT,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: options.alpha < 0.6 ? THREE.NormalBlending : THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(99, 99) },
      uPointerStrength: { value: 0 },
      uTurbulence: { value: 1 },
      uAccent: { value: new THREE.Color(options.accent) },
      uDim: { value: new THREE.Color(options.dim) },
      uGlobalAlpha: { value: options.alpha },
    },
  });
  const threads = new THREE.Mesh(threadFieldGeometry(options.threadCount, options.segments), threadMaterial);
  scene.add(threads);

  // --- Rings: a gyroscope of orbits anchored to the hero portrait. ---
  const ringGroup = new THREE.Group();
  const ringSpecs = [
    { radius: 0.82, tiltX: 1.18, tiltZ: 0.42, speed: 0.5 },
    { radius: 1.06, tiltX: 1.02, tiltZ: -0.3, speed: -0.34 },
    { radius: 1.32, tiltX: 1.32, tiltZ: 0.16, speed: 0.22 },
  ];
  const ringMaterials: THREE.MeshBasicMaterial[] = [];
  const dashes: Array<{ mesh: THREE.Mesh; ring: number; phase: number }> = [];

  ringSpecs.forEach((spec, index) => {
    const ringTilt = new THREE.Group();
    ringTilt.rotation.set(spec.tiltX, 0, spec.tiltZ);

    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(options.accent),
      transparent: true,
      opacity: 0.5 - index * 0.1,
      blending: options.alpha < 0.6 ? THREE.NormalBlending : THREE.AdditiveBlending,
      depthWrite: false,
    });
    ringMaterials.push(material);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(spec.radius, 0.0055, 6, 180), material);
    ringTilt.add(ring);

    // A short glowing dash traveling along this ring, like a signal packet.
    const dashMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(options.accent),
      transparent: true,
      opacity: 0.95,
      blending: options.alpha < 0.6 ? THREE.NormalBlending : THREE.AdditiveBlending,
      depthWrite: false,
    });
    ringMaterials.push(dashMaterial);
    const dash = new THREE.Mesh(new THREE.CapsuleGeometry(0.011, 0.07, 3, 8), dashMaterial);
    ringTilt.add(dash);
    dashes.push({ mesh: dash, ring: index, phase: index / 3 });

    ringGroup.add(ringTilt);
  });
  scene.add(ringGroup);

  const pointerTarget = new THREE.Vector2(99, 99);
  let pointerStrength = 0;
  const pointerSmooth = new THREE.Vector2(99, 99);
  let scrollProgress = 0;
  let heroAnchor: HTMLElement | null = null;
  const worldPoint = new THREE.Vector3();

  const handles: SignalFieldHandles = {
    renderer,
    scene,
    camera,
    followHero: (element: HTMLElement | null) => {
      heroAnchor = element;
    },
    update: (elapsed) => {
      threadMaterial.uniforms.uTime.value = elapsed;

      // Damped pointer; strength decays so pressure pulses with movement.
      pointerSmooth.lerp(pointerTarget, 0.08);
      pointerStrength *= 0.94;
      threadMaterial.uniforms.uPointer.value.copy(pointerSmooth);
      threadMaterial.uniforms.uPointerStrength.value = pointerStrength;

      // Scroll precesses the field and steepens the waves slightly.
      scene.rotation.z = scrollProgress * 0.4;
      camera.position.y = 0.25 - scrollProgress * 0.7;
      threadMaterial.uniforms.uTurbulence.value = 1 + Math.sin(scrollProgress * Math.PI * 2) * 0.35;

      // Anchor the rings to the hero portrait's live screen position.
      if (heroAnchor) {
        const rect = heroAnchor.getBoundingClientRect();
        if (rect.width > 0) {
          const ndcX = ((rect.left + rect.width / 2) / window.innerWidth) * 2 - 1;
          const ndcY = -(((rect.top + rect.height / 2) / window.innerHeight) * 2 - 1);
          worldPoint.set(ndcX, ndcY, 0.5).unproject(camera);
          worldPoint.sub(camera.position).normalize();
          const distance = (0 - camera.position.z) / worldPoint.z;
          ringGroup.position.copy(camera.position).addScaledVector(worldPoint, distance);
        }
      }

      ringGroup.quaternion.copy(camera.quaternion);
      ringGroup.rotation.x += 0.12;
      ringGroup.rotation.y += elapsed * 0.06;

      ringSpecs.forEach((spec, index) => {
        const tiltGroup = ringGroup.children[index] as THREE.Group;
        tiltGroup.rotation.z = elapsed * spec.speed * 0.3;
        const dashRecord = dashes.find(d => d.ring === index)!;
        const angle = elapsed * spec.speed + dashRecord.phase * Math.PI * 2;
        dashRecord.mesh.position.set(
          Math.cos(angle) * spec.radius,
          Math.sin(angle) * spec.radius,
          0,
        );
        dashRecord.mesh.rotation.z = angle + Math.PI / 2;
      });
    },
    resize: (width, height) => {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    },
    setPointer: (ndcX, ndcY, strength) => {
      // Convert screen NDC to world space at the thread plane so the whole
      // viewport (not just its middle) drives the field.
      const halfHeight = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
      pointerTarget.set(ndcX * halfHeight * camera.aspect, ndcY * halfHeight + camera.position.y);
      pointerStrength = Math.min(1, pointerStrength + strength);
    },
    setScrollProgress: (progress) => {
      scrollProgress = progress;
    },
    setColors: (accent, dim, alpha) => {
      (threadMaterial.uniforms.uAccent.value as THREE.Color).set(accent);
      (threadMaterial.uniforms.uDim.value as THREE.Color).set(dim);
      threadMaterial.uniforms.uGlobalAlpha.value = alpha;
      const blending = alpha < 0.6 ? THREE.NormalBlending : THREE.AdditiveBlending;
      threadMaterial.blending = blending;
      ringMaterials.forEach(material => {
        material.color.set(accent);
        material.blending = blending;
      });
      threadMaterial.needsUpdate = true;
      ringMaterials.forEach(material => { material.needsUpdate = true; });
    },
    dispose: () => {
      threads.geometry.dispose();
      threadMaterial.dispose();
      ringGroup.traverse(child => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          (child.material as THREE.Material).dispose();
        }
      });
      renderer.dispose();
    },
  };

  handles.followHero = (element: HTMLElement | null) => {
    heroAnchor = element;
  };

  return handles;
}
