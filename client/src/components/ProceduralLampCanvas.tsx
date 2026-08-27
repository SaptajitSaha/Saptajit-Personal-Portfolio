import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { MousePointer2, Rotate3D, RotateCcw, Sparkles } from "lucide-react";
import { PROCEDURAL_LAMP_PART_LABELS, type ProceduralLampPartId } from "./proceduralLampParts";

type LampMesh = THREE.Mesh<THREE.BufferGeometry, THREE.MeshPhysicalMaterial>;

type LampPart = {
  id: ProceduralLampPartId;
  mesh: LampMesh;
  home: THREE.Vector3;
  exploded: THREE.Vector3;
};

type LampRuntime = {
  toggleExploded: () => void;
  toggleShade: () => void;
  reset: () => void;
};

const CAMERA_POSITION = new THREE.Vector3(8.6, 5.45, 9.7);
const CAMERA_TARGET = new THREE.Vector3(-0.35, 2.5, 0);

export default function ProceduralLampCanvas() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const runtimeRef = useRef<LampRuntime | null>(null);
  const [selectedPart, setSelectedPart] = useState<ProceduralLampPartId | null>(null);
  const [isExploded, setIsExploded] = useState(false);
  const [shadeVisible, setShadeVisible] = useState(true);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.copy(CAMERA_POSITION);
    camera.lookAt(CAMERA_TARGET);

    const root = new THREE.Group();
    root.name = "articulated-desk-lamp";
    root.rotation.y = -0.14;
    scene.add(root);

    const parts: LampPart[] = [];
    const shadePartIds = new Set<ProceduralLampPartId>(["shade-neck", "shade-shell", "shade-rim", "shade-interior"]);
    const materials = {
      base: new THREE.MeshPhysicalMaterial({ color: "#e5d7c6", roughness: 0.36, metalness: 0.02, clearcoat: 0.08 }),
      blue: new THREE.MeshPhysicalMaterial({ color: "#1b4e9e", roughness: 0.29, metalness: 0.14, clearcoat: 0.12 }),
      coral: new THREE.MeshPhysicalMaterial({ color: "#e24f43", roughness: 0.27, metalness: 0.06, clearcoat: 0.2 }),
      interior: new THREE.MeshPhysicalMaterial({ color: "#e9d7bd", roughness: 0.52, metalness: 0, side: THREE.DoubleSide }),
      brass: new THREE.MeshPhysicalMaterial({ color: "#c99a42", roughness: 0.25, metalness: 0.9 }),
      cable: new THREE.MeshPhysicalMaterial({ color: "#0b0d12", roughness: 0.54, metalness: 0.04 }),
    };

    const addPart = (id: ProceduralLampPartId, geometry: THREE.BufferGeometry, material: THREE.MeshPhysicalMaterial, position: THREE.Vector3, rotation?: THREE.Euler) => {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.name = id;
      mesh.position.copy(position);
      if (rotation) mesh.rotation.copy(rotation);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData.lampPart = id;
      root.add(mesh);
      const direction = position.clone().sub(new THREE.Vector3(0, 2.15, 0));
      direction.y *= 0.58;
      if (direction.lengthSq() < 0.001) direction.set(0, -0.1, 0);
      direction.normalize();
      parts.push({ id, mesh, home: position.clone(), exploded: position.clone().addScaledVector(direction, id === "base" ? 0 : 0.52) });
      return mesh;
    };

    const addBar = (id: "lower-link" | "upper-link", start: THREE.Vector3, end: THREE.Vector3) => {
      const direction = end.clone().sub(start);
      const mesh = addPart(id, new THREE.BoxGeometry(0.28, direction.length(), 0.34), materials.blue, start.clone().add(end).multiplyScalar(0.5));
      mesh.rotation.z = -Math.atan2(direction.x, direction.y);
    };

    addPart("base", new THREE.CylinderGeometry(2.04, 2.14, 0.42, 56), materials.base, new THREE.Vector3(0, 0.2, 0));
    addPart("base-pedestal", new THREE.BoxGeometry(0.62, 0.76, 0.64), materials.blue, new THREE.Vector3(0.25, 0.76, 0));
    addPart("base-pivot", new THREE.CylinderGeometry(0.34, 0.34, 0.22, 32), materials.brass, new THREE.Vector3(0.31, 1.08, 0.25), new THREE.Euler(Math.PI / 2, 0, 0));

    const lowerStart = new THREE.Vector3(0.3, 1.12, 0);
    const elbow = new THREE.Vector3(1.62, 3.04, 0);
    const upperEnd = new THREE.Vector3(-1.24, 5.08, 0);
    addBar("lower-link", lowerStart, elbow);
    addPart("elbow-pivot", new THREE.CylinderGeometry(0.38, 0.38, 0.24, 32), materials.brass, new THREE.Vector3(elbow.x, elbow.y, 0.25), new THREE.Euler(Math.PI / 2, 0, 0));
    addBar("upper-link", elbow, upperEnd);
    addPart("shade-pivot", new THREE.CylinderGeometry(0.36, 0.36, 0.24, 32), materials.brass, new THREE.Vector3(upperEnd.x, upperEnd.y, 0.25), new THREE.Euler(Math.PI / 2, 0, 0));
    addPart("shade-neck", new THREE.CylinderGeometry(0.48, 0.48, 0.82, 36), materials.coral, new THREE.Vector3(-1.64, 5.08, 0), new THREE.Euler(0, 0, -Math.PI / 2));
    addPart("shade-shell", new THREE.CylinderGeometry(0.48, 1.2, 1.68, 48, 1, true), materials.coral, new THREE.Vector3(-2.52, 5.08, 0), new THREE.Euler(0, 0, -Math.PI / 2));
    addPart("shade-rim", new THREE.TorusGeometry(1.2, 0.06, 10, 48), materials.coral, new THREE.Vector3(-3.36, 5.08, 0), new THREE.Euler(0, Math.PI / 2, 0));
    addPart("shade-interior", new THREE.CircleGeometry(1.12, 48), materials.interior, new THREE.Vector3(-3.37, 5.08, 0), new THREE.Euler(0, Math.PI / 2, 0));

    const cablePath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.78, 0.18, -0.04),
      new THREE.Vector3(2.35, 0.14, -0.14),
      new THREE.Vector3(3.1, 0.08, -0.1),
      new THREE.Vector3(4.2, 0.1, -0.05),
    ]);
    addPart("power-cable", new THREE.TubeGeometry(cablePath, 32, 0.052, 9, false), materials.cable, new THREE.Vector3());

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(24, 24),
      new THREE.ShadowMaterial({ color: 0xff654b, opacity: 0.18 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.03;
    ground.receiveShadow = true;
    scene.add(ground);

    const key = new THREE.DirectionalLight(0xffd5c6, 3.0);
    key.position.set(-3, 8, 6);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 24;
    const fill = new THREE.PointLight(0x5b92ff, 16, 18, 2);
    fill.position.set(5, 3, 5);
    const rim = new THREE.PointLight(0xee4c35, 14, 14, 2);
    rim.position.set(-4, 3, -3);
    scene.add(new THREE.HemisphereLight(0xffefe4, 0x10121a, 1.6), key, fill, rim);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let lastTime = performance.now();
    let visible = true;
    let lost = false;
    let dragging = false;
    let pointerStart = new THREE.Vector2();
    let pointerDistance = 0;
    let explodeProgress = 0;
    let explodeTarget = 0;
    let shadeIsVisible = true;
    let disposed = false;

    const resize = () => {
      const bounds = stage.getBoundingClientRect();
      const width = Math.max(1, Math.round(bounds.width));
      const height = Math.max(1, Math.round(bounds.height));
      const nativeRatio = Math.min(window.devicePixelRatio || 1, 1.35);
      const pixelCapScale = Math.min(1, Math.sqrt(840_000 / Math.max(1, width * height * nativeRatio * nativeRatio)));
      renderer.setPixelRatio(nativeRatio * pixelCapScale);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const draw = () => {
      if (disposed || lost) return;
      renderer.render(scene, camera);
      canvas.dataset.rendered = "true";
    };

    const requestFrame = () => {
      if (!frame && visible && !lost) frame = window.requestAnimationFrame(animate);
    };

    const animate = (now: number) => {
      frame = 0;
      if (!visible || lost || disposed || document.visibilityState !== "visible") return;
      const delta = Math.min(0.035, (now - lastTime) / 1000);
      lastTime = now;
      if (!reducedMotion.matches && !dragging) root.rotation.y += delta * 0.17;
      const nextProgress = THREE.MathUtils.damp(explodeProgress, explodeTarget, reducedMotion.matches ? 100 : 12, delta);
      if (Math.abs(nextProgress - explodeProgress) > 0.0001 || explodeProgress !== explodeTarget) {
        explodeProgress = nextProgress;
        for (const part of parts) part.mesh.position.lerpVectors(part.home, part.exploded, explodeProgress);
      }
      draw();
      if (!reducedMotion.matches || Math.abs(explodeProgress - explodeTarget) > 0.0001) requestFrame();
    };

    const setExploded = (next: boolean) => {
      explodeTarget = next ? 1 : 0;
      if (reducedMotion.matches) {
        explodeProgress = explodeTarget;
        for (const part of parts) part.mesh.position.lerpVectors(part.home, part.exploded, explodeProgress);
        draw();
      }
      setIsExploded(next);
      requestFrame();
    };

    const setShade = (next: boolean) => {
      shadeIsVisible = next;
      for (const part of parts) if (shadePartIds.has(part.id)) part.mesh.visible = next;
      setShadeVisible(next);
      draw();
    };

    const reset = () => {
      root.rotation.set(0, -0.14, 0);
      setExploded(false);
      setShade(true);
      setSelectedPart(null);
    };

    const pickPart = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(parts.map((part) => part.mesh), false)[0];
      const id = hit?.object.userData.lampPart as ProceduralLampPartId | undefined;
      setSelectedPart(id ?? null);
      canvas.style.cursor = id ? "pointer" : "grab";
    };

    const onPointerDown = (event: PointerEvent) => {
      dragging = true;
      pointerStart = new THREE.Vector2(event.clientX, event.clientY);
      pointerDistance = 0;
      canvas.setPointerCapture(event.pointerId);
      canvas.style.cursor = "grabbing";
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      const dx = event.clientX - pointerStart.x;
      const dy = event.clientY - pointerStart.y;
      pointerDistance += Math.hypot(dx, dy);
      root.rotation.y += dx * 0.006;
      root.rotation.x = THREE.MathUtils.clamp(root.rotation.x + dy * 0.002, -0.28, 0.28);
      pointerStart.set(event.clientX, event.clientY);
      draw();
    };
    const onPointerUp = (event: PointerEvent) => {
      dragging = false;
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
      if (pointerDistance < 7) pickPart(event);
      canvas.style.cursor = "grab";
      requestFrame();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (!(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"] as string[]).includes(event.key)) return;
      event.preventDefault();
      if (event.key === "ArrowLeft") root.rotation.y -= 0.12;
      if (event.key === "ArrowRight") root.rotation.y += 0.12;
      if (event.key === "ArrowUp") root.rotation.x = THREE.MathUtils.clamp(root.rotation.x - 0.08, -0.28, 0.28);
      if (event.key === "ArrowDown") root.rotation.x = THREE.MathUtils.clamp(root.rotation.x + 0.08, -0.28, 0.28);
      draw();
    };
    const onLost = (event: Event) => {
      event.preventDefault();
      lost = true;
      setUnavailable(true);
    };
    const onMotionChange = () => requestFrame();
    const onVisibilityChange = () => { if (document.visibilityState === "visible") requestFrame(); };

    const resizeObserver = new ResizeObserver(() => { resize(); draw(); });
    resizeObserver.observe(stage);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      if (visible) requestFrame();
      else if (frame) { window.cancelAnimationFrame(frame); frame = 0; }
    }, { threshold: 0.06 });
    intersection.observe(stage);

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("keydown", onKeyDown);
    canvas.addEventListener("webglcontextlost", onLost);
    reducedMotion.addEventListener("change", onMotionChange);
    document.addEventListener("visibilitychange", onVisibilityChange);
    runtimeRef.current = { toggleExploded: () => setExploded(!Boolean(explodeTarget)), toggleShade: () => setShade(!shadeIsVisible), reset };
    resize();
    draw();
    requestFrame();

    return () => {
      disposed = true;
      runtimeRef.current = null;
      if (frame) window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("keydown", onKeyDown);
      canvas.removeEventListener("webglcontextlost", onLost);
      delete canvas.dataset.rendered;
      reducedMotion.removeEventListener("change", onMotionChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      root.traverse((object) => {
        const mesh = object as THREE.Mesh;
        mesh.geometry?.dispose();
        if (Array.isArray(mesh.material)) mesh.material.forEach((material) => material.dispose());
        else mesh.material?.dispose();
      });
      ground.geometry.dispose();
      (ground.material as THREE.Material).dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, []);

  if (unavailable) return <div className="lamp-study__unavailable" role="status">The 3D scene is unavailable in this browser. The procedural study remains documented in the portfolio.</div>;

  return (
    <div className="lamp-study" ref={stageRef} data-procedural-lamp-study="ready">
      <canvas ref={canvasRef} className="lamp-study__canvas" tabIndex={0} role="application" aria-label="Interactive articulated desk lamp. Drag or use arrow keys to inspect it; click a component to identify it." />
      <div className="lamp-study__hud" aria-hidden="true"><span>THREE.Group / 12 parts</span><i /></div>
      <div className="lamp-study__caption"><MousePointer2 size={14} aria-hidden="true" /> Drag to inspect · Click a component</div>
      <div className="lamp-study__selection" aria-live="polite">{selectedPart ? <>Selected <strong>{PROCEDURAL_LAMP_PART_LABELS[selectedPart]}</strong></> : "Select a component"}</div>
      <div className="lamp-study__controls" aria-label="Desk lamp controls">
        <button type="button" onClick={() => runtimeRef.current?.toggleExploded()} aria-pressed={isExploded}><Sparkles size={15} aria-hidden="true" />{isExploded ? "Reassemble" : "Explode assembly"}</button>
        <button type="button" onClick={() => runtimeRef.current?.toggleShade()} aria-pressed={!shadeVisible}><Rotate3D size={15} aria-hidden="true" />{shadeVisible ? "Hide shade" : "Show shade"}</button>
        <button type="button" onClick={() => runtimeRef.current?.reset()}><RotateCcw size={15} aria-hidden="true" />Reset</button>
      </div>
    </div>
  );
}
