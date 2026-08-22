import { useEffect, useRef } from "react";

const vertexSource = `attribute vec2 a_position; void main(){ gl_Position=vec4(a_position,0.0,1.0); }`;
const fragmentSource = `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
float field(vec2 p, vec2 c, float r){ return exp(-dot(p-c,p-c)*r); }
void main(){
  vec2 p=(gl_FragCoord.xy-.5*u_resolution.xy)/min(u_resolution.x,u_resolution.y);
  float t=u_time*.12;
  float v=field(p,vec2(sin(t*.9),cos(t*.7))*.42,5.4);
  v+=field(p,vec2(cos(t*.63+1.7),sin(t*.81+.5))*.34,8.8)*.72;
  v+=sin((p.x-p.y)*7.0+t*.4)*.022;
  vec3 ink=vec3(.051,.051,.059);
  vec3 plum=vec3(.23,.065,.12);
  vec3 ember=vec3(.91,.30,.21);
  vec3 color=mix(ink,plum,clamp(v*.42,0.,1.));
  color=mix(color,ember,clamp(v*.12,0.,.18));
  color*=.62+smoothstep(1.18,.2,length(p))*.38;
  gl_FragColor=vec4(color,1.);
}`;

function shader(gl: WebGLRenderingContext, type: number, source: string) {
  const value = gl.createShader(type);
  if (!value) return null;
  gl.shaderSource(value, source);
  gl.compileShader(value);
  if (!gl.getShaderParameter(value, gl.COMPILE_STATUS)) { gl.deleteShader(value); return null; }
  return value;
}

export function MeshDriftShader({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", { alpha: true, antialias: false, powerPreference: "low-power" });
    if (!canvas || !gl) { if (canvas) canvas.dataset.webgl = "unavailable"; return; }
    const vertex = shader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragment = shader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) { canvas.dataset.webgl = "unavailable"; return; }
    gl.attachShader(program, vertex); gl.attachShader(program, fragment); gl.linkProgram(program);
    gl.deleteShader(vertex); gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { canvas.dataset.webgl = "unavailable"; gl.deleteProgram(program); return; }
    const buffer = gl.createBuffer();
    if (!buffer) { gl.deleteProgram(program); return; }
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const resolution = gl.getUniformLocation(program, "u_resolution");
    const time = gl.getUniformLocation(program, "u_time");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0; let visible = true; let lost = false; const started = performance.now();
    const resize = () => {
      const bounds = canvas.getBoundingClientRect(); const ratio = Math.min(window.devicePixelRatio || 1, 1.25);
      const scale = Math.min(1, Math.sqrt(1_100_000 / Math.max(1, bounds.width * bounds.height * ratio * ratio)));
      const width = Math.max(1, Math.round(bounds.width * ratio * scale)); const height = Math.max(1, Math.round(bounds.height * ratio * scale));
      if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; gl.viewport(0, 0, width, height); }
    };
    const request = () => { if (!frame && visible && !lost) frame = window.requestAnimationFrame(render); };
    const render = (now: number) => {
      frame = 0; if (!visible || lost || document.visibilityState !== "visible") return;
      resize(); gl.uniform2f(resolution, canvas.width, canvas.height); gl.uniform1f(time, reduced.matches ? 0 : (now - started) / 1000); gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduced.matches) request();
    };
    const observer = new ResizeObserver(request); observer.observe(canvas);
    const intersection = new IntersectionObserver(([entry]) => { visible = entry?.isIntersecting ?? true; if (visible) request(); else if (frame) { cancelAnimationFrame(frame); frame = 0; } }, { threshold: .05 }); intersection.observe(canvas);
    const onMotion = () => request(); const onVisibility = () => request();
    const onLost = (event: Event) => { event.preventDefault(); lost = true; canvas.dataset.webgl = "unavailable"; };
    reduced.addEventListener("change", onMotion); document.addEventListener("visibilitychange", onVisibility); canvas.addEventListener("webglcontextlost", onLost); request();
    return () => { if (frame) cancelAnimationFrame(frame); observer.disconnect(); intersection.disconnect(); reduced.removeEventListener("change", onMotion); document.removeEventListener("visibilitychange", onVisibility); canvas.removeEventListener("webglcontextlost", onLost); gl.deleteBuffer(buffer); gl.deleteProgram(program); gl.getExtension("WEBGL_lose_context")?.loseContext(); };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
