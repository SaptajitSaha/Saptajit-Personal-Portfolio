import { useEffect, useRef } from "react";

const VERTEX_SHADER = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const FRAGMENT_SHADER = `
precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;

float field(vec2 point, vec2 center, float radius) {
  return exp(-dot(point - center, point - center) * radius);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 point = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
  float time = u_time * 0.14;

  vec2 driftA = vec2(sin(time * 1.21), cos(time * 0.92)) * 0.46;
  vec2 driftB = vec2(cos(time * 0.78 + 1.7), sin(time * 1.08 + 0.4)) * 0.38;
  vec2 driftC = vec2(sin(time * 0.64 + 2.1), cos(time * 1.32 + 2.8)) * 0.29;

  float mesh = field(point, driftA, 4.8);
  mesh += field(point, driftB, 7.2) * 0.76;
  mesh += field(point, driftC, 10.0) * 0.42;
  mesh += sin((point.x + point.y) * 8.0 + time * 0.7) * 0.025;

  vec3 ink = vec3(0.051, 0.051, 0.059);
  vec3 ember = vec3(0.91, 0.30, 0.21);
  vec3 plum = vec3(0.22, 0.09, 0.18);
  vec3 color = mix(ink, plum, clamp(mesh * 0.32, 0.0, 1.0));
  color = mix(color, ember, clamp(mesh * 0.16, 0.0, 0.32));

  float vignette = smoothstep(1.24, 0.18, length(point));
  color *= 0.65 + vignette * 0.35;
  gl_FragColor = vec4(color, 1.0);
}`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function MeshDriftShader({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: true, antialias: false, powerPreference: "low-power" });
    if (!gl) {
      canvas.dataset.webgl = "unavailable";
      return;
    }

    const vertex = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragment = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) {
      canvas.dataset.webgl = "unavailable";
      if (vertex) gl.deleteShader(vertex);
      if (fragment) gl.deleteShader(fragment);
      if (program) gl.deleteProgram(program);
      return;
    }

    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      canvas.dataset.webgl = "unavailable";
      gl.deleteProgram(program);
      return;
    }

    const buffer = gl.createBuffer();
    if (!buffer) {
      gl.deleteProgram(program);
      return;
    }
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "a_position");
    const resolution = gl.getUniformLocation(program, "u_resolution");
    const time = gl.getUniformLocation(program, "u_time");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    let frame = 0;
    let inView = true;
    let contextLost = false;
    const startedAt = performance.now();
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      const scale = Math.min(1, Math.sqrt(1_200_000 / Math.max(1, bounds.width * bounds.height * pixelRatio * pixelRatio)));
      const width = Math.max(1, Math.round(bounds.width * pixelRatio * scale));
      const height = Math.max(1, Math.round(bounds.height * pixelRatio * scale));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    const render = (now: number) => {
      frame = 0;
      if (contextLost || !inView || document.visibilityState !== "visible") return;
      resize();
      gl.uniform2f(resolution, canvas.width, canvas.height);
      gl.uniform1f(time, motionQuery.matches ? 0 : (now - startedAt) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!motionQuery.matches) frame = window.requestAnimationFrame(render);
    };

    const requestRender = () => {
      if (!frame && !contextLost && inView) frame = window.requestAnimationFrame(render);
    };
    const observer = new ResizeObserver(requestRender);
    observer.observe(canvas);
    const intersection = new IntersectionObserver(([entry]) => {
      inView = entry?.isIntersecting ?? true;
      if (inView) requestRender();
      else if (frame) { window.cancelAnimationFrame(frame); frame = 0; }
    }, { threshold: 0.05 });
    intersection.observe(canvas);
    const onVisibility = () => requestRender();
    const onMotionChange = () => requestRender();
    const onContextLost = (event: Event) => {
      event.preventDefault();
      contextLost = true;
      canvas.dataset.webgl = "unavailable";
    };
    document.addEventListener("visibilitychange", onVisibility);
    motionQuery.addEventListener("change", onMotionChange);
    canvas.addEventListener("webglcontextlost", onContextLost);
    requestRender();

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      observer.disconnect();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      motionQuery.removeEventListener("change", onMotionChange);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
