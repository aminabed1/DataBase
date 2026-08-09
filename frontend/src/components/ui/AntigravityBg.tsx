"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const PALETTES = {
    allStar:      { color1: "#4ade80", color2: "#60a5fa", color3: "#f97316" },
    neonAction:   { color1: "#a3e635", color2: "#22d3ee", color3: "#f43f5e" },
    premiumArena: { color1: "#2dd4bf", color2: "#a78bfa", color3: "#fbbf24" },
};

const ACTIVE_PALETTE = PALETTES.premiumArena;
const CAMERA_CONFIG = { position: [0, 0, 5] as [number, number, number], fov: 45 };


const snoise = `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0);
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0/7.0;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

const vertexShader = `
  ${snoise}
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  attribute float aSize;
  varying vec3 vColor;
  varying float vEdgeFade;

  void main() {
    vec3 pos = position;
    vec3 noisePos = vec3(pos.x * 0.5 + uTime * 0.2, pos.y * 0.5 + uTime * 0.2, pos.z);
    pos.x += snoise(noisePos) * 0.4;
    pos.y += snoise(noisePos + 100.0) * 0.4;

    float force = smoothstep(1.2, 0.0, distance(pos.xy, uMouse));
    pos.xy += normalize(pos.xy - uMouse) * force * 1.2;
    pos.z  += force * 1.0;

    vec4 mvPos    = modelViewMatrix * vec4(pos, 1.0);
    vec4 clipPos  = projectionMatrix * mvPos;
    gl_Position   = clipPos;
    gl_PointSize  = aSize * (10.0 / -mvPos.z);

    float cn = snoise(noisePos * 0.15) * 0.5 + 0.5;
    vColor = cn < 0.5
      ? mix(uColor1, uColor2, cn * 2.0)
      : mix(uColor2, uColor3, cn * 2.0 - 1.0);

    vec2 sp = clipPos.xy / clipPos.w;
    vEdgeFade = smoothstep(1.0, 0.7, abs(sp.y)) * smoothstep(1.0, 0.9, abs(sp.x));
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vEdgeFade;
  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    if (d > 0.5) discard;
    gl_FragColor = vec4(vColor, smoothstep(0.5, 0.2, d) * 0.8 * vEdgeFade);
  }
`;

function ParticlesEngine({ count = 800 }) {
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const { gl, viewport } = useThree();
    const viewportRef = useRef(viewport);
    
    // Update viewport ref when it changes
    useEffect(() => {
        viewportRef.current = viewport;
    }, [viewport]);

    const targetMouse = useRef(new THREE.Vector2(-10, -10));

    const uniforms = useMemo(() => ({
        uTime:   { value: 0.0 },
        uMouse:  { value: new THREE.Vector2(-10, -10) },
        uColor1: { value: new THREE.Color(ACTIVE_PALETTE.color1) },
        uColor2: { value: new THREE.Color(ACTIVE_PALETTE.color2) },
        uColor3: { value: new THREE.Color(ACTIVE_PALETTE.color3) },
    }), []);

    const geometry = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const sz  = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            pos[i * 3]     = (Math.random() - 0.5) * 20;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 2;
            sz[i] = Math.random() * 10 + 3;
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        geo.setAttribute("aSize",    new THREE.BufferAttribute(sz,  1));
        return geo;
    }, [count]);

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            const { width, height } = viewportRef.current;
            // Use window dimensions instead of getBoundingClientRect to avoid layout thrashing (flickering)
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = -(e.clientY / window.innerHeight) * 2 + 1;
            targetMouse.current.set((x * width) / 2, (y * height) / 2);
        };
        window.addEventListener("mousemove", onMouseMove);
        return () => window.removeEventListener("mousemove", onMouseMove);
    }, []);

    useFrame(({ clock }) => {
        if (!materialRef.current) return;
        materialRef.current.uniforms.uTime.value = clock.elapsedTime;
        materialRef.current.uniforms.uMouse.value.lerp(targetMouse.current, 0.08);
    });

    return (
        <points geometry={geometry}>
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}


export default function AntigravityBg() {
    return (
        <div className="absolute inset-0 pointer-events-none" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
            <Canvas 
                camera={CAMERA_CONFIG} 
                dpr={[1, 2]} 
                gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
            >
                <ParticlesEngine count={1500} />
            </Canvas>
        </div>
    );
}
