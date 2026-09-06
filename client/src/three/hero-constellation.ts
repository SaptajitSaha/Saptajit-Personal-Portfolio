import * as THREE from "three";

/**
 * HeroConstellation — a vermilion particle disc that orbits behind the portrait.
 *
 * Design intent:
 * - "Signal" particles echo the site's single vermilion accent; a smaller
 *   paper-colored population adds depth without a second accent color.
 * - The disc tilts toward the pointer (damped, never exactly tracking) so the
 *   hero feels hand-held; scroll progress adds a slow precession.
 * - Everything animates inside one custom shader; the CPU only uploads time,
 *   tilt targets, and colors. No per-frame geometry writes.
 */

export type HeroConstellationHandles = {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  material: THREE.ShaderMaterial;
  /** Damped tilt targets driven by pointer position, in radians. */
  setTiltTarget: (x: number, y: number) => void;
  /** 0..1 scroll progress of the page, adds a slow precession to the disc. */
  setScrollProgress: (p: number) => void;
  /** Theme colors, re-read from CSS variables when the theme flips. */
  setColors: (accent: string, dim: string, alpha?: number) => void;
  update: (elapsedSeconds: number) => void;
  resize: (width: number, height: number) => void;
  dispose: () => void;
};

const VERTEX_SHADER = /* glsl */ `
  attribute float aScale;
  attribute float aPhase;
  attribute float aTint;

  uniform float uTime;
  uniform float uSize;
  uniform vec2 uTilt;

  varying float vTint;
  varying float vPhase;

  void main() {
    vTint = aTint;
    vPhase = aPhase;

    // The whole disc leans toward the pointer; each ring lags a little
    // behind the one inside it, so the tilt reads as layered, not rigid.
    float ring = length(position.xz);
    vec3 tilted = position;
    tilted.y += uTilt.x * ring * 0.35;
    tilted.x += uTilt.y * ring * 0.35;

    vec4 world = modelMatrix * vec4(tilted, 1.0);
    vec4 view = viewMatrix * world;
    gl_Position = projectionMatrix * view;
    gl_PointSize = aScale * uSize * (1.0 / -view.z);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  uniform float uTime;
  uniform vec3 uAccent;
  uniform vec3 uDim;
  uniform float uGlobalAlpha;

  varying float vTint;
  varying float vPhase;

  void main() {
    // Soft round sprite with a light falloff; no textures needed.
    vec2 center = gl_PointCoord - 0.5;
    float d = length(center);
    float alpha = smoothstep(0.5, 0.26, d);

    // Twinkle: each particle breathes on its own phase offset.
    float twinkle = 0.62 + 0.38 * sin(uTime * (0.6 + vPhase * 0.9) + vPhase * 12.0);

    vec3 color = mix(uDim, uAccent, vTint);
    gl_FragColor = vec4(color, alpha * twinkle * uGlobalAlpha);
  }
`;

/** Bell-ish random via summed uniforms, for an organic radial density falloff. */
function bellRandom(random: () => number) {
  return (random() + random() + random()) / 3;
}

export function createHeroConstellation(
  canvas: HTMLCanvasElement,
  options: { accent: string; dim: string; alpha?: number; particleBudget: number },
): HeroConstellationHandles {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
    powerPreference: "low-power",
  });
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 40);
  camera.position.set(0, 0.35, 4.4);

  // Disc population: dense core, thinning rings, plus a sparse outer shell.
  const count = options.particleBudget;
  const random = (() => {
    let seed = 20260905;
    return () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
  })();

  const positions = new Float32Array(count * 3);
  const scales = new Float32Array(count);
  const phases = new Float32Array(count);
  const tints = new Float32Array(count);

  for (let i = 0; i < count; i += 1) {
    const shellParticle = i % 7 === 0;
    if (shellParticle) {
      // Sparse outer shell: a halo of dim paper-colored depth.
      const radius = 2.6 + bellRandom(random) * 1.6;
      const theta = random() * Math.PI * 2;
      const elevation = (random() - 0.5) * 2.4;
      positions[i * 3] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = elevation * 0.7;
      positions[i * 3 + 2] = Math.sin(theta) * radius;
      tints[i] = 0;
      scales[i] = 0.5 + random() * 0.9;
    } else {
      const radius = 0.45 + Math.pow(random(), 0.65) * 2.1;
      const theta = random() * Math.PI * 2;
      const thinning = 1 - radius / 2.9;
      positions[i * 3] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = (random() - 0.5) * 0.5 * thinning;
      positions[i * 3 + 2] = Math.sin(theta) * radius;
      tints[i] = 0.55 + random() * 0.45;
      scales[i] = 0.7 + random() * 1.4;
    }
    phases[i] = random();
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
  geometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
  geometry.setAttribute("aTint", new THREE.BufferAttribute(tints, 1));

  const material = new THREE.ShaderMaterial({
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
    transparent: true,
    depthWrite: false,
    // Additive glow belongs to ink; paper keeps clean alpha dots.
    blending: (options.alpha ?? 0.8) < 0.6 ? THREE.NormalBlending : THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uSize: { value: 24 },
      uTilt: { value: new THREE.Vector2(0, 0) },
      uAccent: { value: new THREE.Color(options.accent) },
      uDim: { value: new THREE.Color(options.dim) },
      uGlobalAlpha: { value: options.alpha ?? 0.8 },
    },
  });

  const points = new THREE.Points(geometry, material);
  points.rotation.x = -0.42; // lay the disc back so it reads as a plane behind the orb
  scene.add(points);

  const tiltTarget = new THREE.Vector2(0, 0);

  return {
    renderer,
    scene,
    camera,
    material,
    setTiltTarget: (x, y) => tiltTarget.set(x, y),
    setScrollProgress: (p) => {
      points.rotation.y = p * 1.6;
    },
    setColors: (accent, dim, alpha) => {
      (material.uniforms.uAccent.value as THREE.Color).set(accent);
      (material.uniforms.uDim.value as THREE.Color).set(dim);
      if (alpha !== undefined) material.uniforms.uGlobalAlpha.value = alpha;
    },
    update: (elapsed) => {
      material.uniforms.uTime.value = elapsed;
      // Damped tilt: the disc drifts toward the pointer instead of snapping.
      const tilt = material.uniforms.uTilt.value as THREE.Vector2;
      tilt.lerp(tiltTarget, 0.045);
      points.rotation.z = elapsed * 0.05;
    },
    resize: (width, height) => {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    },
    dispose: () => {
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    },
  };
}
