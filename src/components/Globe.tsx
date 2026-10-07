import { useEffect, useRef } from "react";
import * as THREE from "three";
import { LAND_MASK, LAND_POINTS } from "../data/landMask";
import type { Place } from "../types";

const GOLDEN = Math.PI * (3 - Math.sqrt(5));

// Longitude is measured the same way landMask.ts was generated, with z flipped
// so east sits to the right when the globe faces the camera.
function latLon(lat: number, lon: number, radius = 1) {
  const phi = THREE.MathUtils.degToRad(lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);
  return new THREE.Vector3(
    Math.cos(phi) * Math.cos(theta),
    Math.sin(phi),
    -Math.cos(phi) * Math.sin(theta),
  ).multiplyScalar(radius);
}

function landDots() {
  const bytes = Uint8Array.from(atob(LAND_MASK), (c) => c.charCodeAt(0));
  const out: number[] = [];
  for (let i = 0; i < LAND_POINTS; i++) {
    if (!((bytes[i >> 3] ?? 0) & (1 << (i & 7)))) continue;
    const y = 1 - (i / (LAND_POINTS - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = (GOLDEN * i) % (Math.PI * 2);
    out.push(Math.cos(theta) * r, y, -Math.sin(theta) * r);
  }
  return new Float32Array(out);
}

const dotVertex = /* glsl */ `
  uniform float uSize;
  varying float vFacing;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vFacing = dot(normalize(normalMatrix * position), vec3(0.0, 0.0, 1.0));
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize / -mv.z;
  }
`;
const dotFragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vFacing;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float edge = smoothstep(0.0, 0.55, vFacing);
    gl_FragColor = vec4(uColor * (0.55 + 0.6 * edge), (0.25 + 0.75 * edge) * smoothstep(0.5, 0.2, d));
  }
`;

const atmosphereVertex = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const atmosphereFragment = /* glsl */ `
  uniform vec3 uColor;
  varying vec3 vNormal;
  void main() {
    float rim = pow(0.62 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 4.0);
    gl_FragColor = vec4(uColor, 1.0) * clamp(rim, 0.0, 1.0) * 0.9;
  }
`;

const arcVertex = /* glsl */ `
  varying float vT;
  void main() {
    vT = uv.x;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const arcFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uHead;
  varying float vT;
  void main() {
    // A faint trail along the whole arc, with a bright comet tail behind the head.
    float behind = uHead - vT;
    float tail = behind >= 0.0 ? exp(-behind * 7.0) : 0.0;
    gl_FragColor = vec4(uColor, 0.16 + tail * 0.84);
  }
`;

/**
 * Dotted night-side globe with flight arcs from `home` to each of `places`.
 * Inspired by ThreeUI's "dusk network world" globe; built here from scratch.
 */
interface GlobeProps {
  home: Place;
  places: Place[];
  className?: string;
}

interface Disposable {
  dispose(): void;
}

export default function Globe({ home, places, className = "" }: GlobeProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return undefined;
    }
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.cssText = "display:block;width:100%;height:100%;touch-action:pan-y;cursor:grab";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
    camera.position.set(0, 0, 4.6);

    // tilt (outer) * spin (inner): spin first, then tip the north pole toward us
    const tilt = new THREE.Group();
    const spin = new THREE.Group();
    tilt.add(spin);
    scene.add(tilt);

    // Everything created here is disposed together on unmount.
    const disposables: Disposable[] = [];
    const track = <T extends Disposable>(item: T): T => {
      disposables.push(item);
      return item;
    };

    // Ocean body: also hides the dots on the far side via the depth buffer.
    spin.add(
      new THREE.Mesh(
        track(new THREE.SphereGeometry(0.985, 64, 64)),
        track(new THREE.MeshBasicMaterial({ color: 0x100e0c })),
      ),
    );

    const dotsGeometry = track(new THREE.BufferGeometry());
    dotsGeometry.setAttribute("position", new THREE.BufferAttribute(landDots(), 3));
    spin.add(
      new THREE.Points(
        dotsGeometry,
        track(
          new THREE.ShaderMaterial({
            vertexShader: dotVertex,
            fragmentShader: dotFragment,
            uniforms: { uSize: { value: 12 * pixelRatio }, uColor: { value: new THREE.Color("#b9ae9f") } },
            transparent: true,
            depthWrite: false,
          }),
        ),
      ),
    );

    const atmosphere = new THREE.Mesh(
      track(new THREE.SphereGeometry(1.12, 64, 64)),
      track(
        new THREE.ShaderMaterial({
          vertexShader: atmosphereVertex,
          fragmentShader: atmosphereFragment,
          uniforms: { uColor: { value: new THREE.Color("#6b6156") } },
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
          transparent: true,
          depthWrite: false,
        }),
      ),
    );
    scene.add(atmosphere);

    // Markers: a solid dot plus a ring that keeps pulsing outward.
    const rings: { ring: THREE.Mesh<THREE.RingGeometry, THREE.MeshBasicMaterial>; offset: number }[] = [];
    const addMarker = (place: Place, color: THREE.Color, size: number) => {
      const pos = latLon(place.lat, place.lon, 1.003);
      const dot = new THREE.Mesh(
        track(new THREE.CircleGeometry(size, 24)),
        track(new THREE.MeshBasicMaterial({ color, transparent: true, depthWrite: false })),
      );
      const ring = new THREE.Mesh(
        track(new THREE.RingGeometry(size * 1.2, size * 1.6, 32)),
        track(new THREE.MeshBasicMaterial({ color, transparent: true, depthWrite: false, side: THREE.DoubleSide })),
      );
      [dot, ring].forEach((m) => {
        m.position.copy(pos);
        m.lookAt(pos.clone().multiplyScalar(2));
        spin.add(m);
      });
      rings.push({ ring, offset: Math.random() });
    };

    const homeColor = new THREE.Color("#ff6b35");
    const arcColor = new THREE.Color("#ff6b35");
    const placeColor = new THREE.Color("#f2ece2");
    addMarker(home, homeColor, 0.022);

    // Great-circle arcs lifted off the surface in proportion to their length.
    const arcs = places.map((place, i) => {
      const a = latLon(home.lat, home.lon);
      const b = latLon(place.lat, place.lon);
      const angle = a.angleTo(b);
      const lift = 0.04 + Math.min(angle, 1.2) * 0.22; // capped so long-haul arcs stay in frame
      const segments = 96;
      const pts: THREE.Vector3[] = [];
      for (let s = 0; s <= segments; s++) {
        const t = s / segments;
        const p = new THREE.Vector3().copy(a).lerp(b, t).normalize();
        pts.push(p.multiplyScalar(1 + Math.sin(Math.PI * t) * lift));
      }
      // A thin tube rather than a GL line, which is stuck at 1px. uv.x runs along it.
      const curve = new THREE.CatmullRomCurve3(pts);
      const geometry = track(new THREE.TubeGeometry(curve, segments, 0.0045, 6, false));
      // Kept as its own object so the frame loop can update it without a lookup.
      const uHead = { value: 0 };
      const material = track(
        new THREE.ShaderMaterial({
          vertexShader: arcVertex,
          fragmentShader: arcFragment,
          uniforms: { uColor: { value: arcColor }, uHead },
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      );
      spin.add(new THREE.Mesh(geometry, material));
      addMarker(place, placeColor, 0.016);
      return { uHead, phase: i * 0.37, speed: 0.22 / Math.max(angle, 0.35) };
    });

    // Face home: spin it to the front meridian, then tip it most of the way up.
    const homeVec = latLon(home.lat, home.lon);
    // Kochi sits just right of centre so Europe and the westbound arcs show.
    const restSpin = -Math.atan2(homeVec.x, homeVec.z) + 0.3;
    tilt.rotation.x = THREE.MathUtils.degToRad(home.lat) * 0.85 + 0.15;
    spin.rotation.y = restSpin;

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = mount;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    resize();

    // Horizontal drag spins the globe; it drifts back to home after release.
    const drag = { active: false, x: 0, offset: 0, velocity: 0, releasedAt: -Infinity };
    const canvas = renderer.domElement;
    const onDown = (e: PointerEvent) => {
      drag.active = true;
      drag.x = e.clientX;
      drag.velocity = 0;
      canvas.style.cursor = "grabbing";
      canvas.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!drag.active) return;
      const dx = (e.clientX - drag.x) / mount.clientWidth;
      drag.x = e.clientX;
      drag.offset += dx * Math.PI * 1.4;
      drag.velocity = dx * Math.PI * 1.4;
    };
    const onUp = () => {
      if (!drag.active) return;
      drag.active = false;
      drag.releasedAt = performance.now();
      canvas.style.cursor = "grab";
    };
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);

    let visible = false;
    let raf = 0;
    let last = performance.now();
    let time = 0;
    const tick = (now: number) => {
      raf = 0;
      if (!visible) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!reduceMotion) time += dt;

      if (!drag.active) {
        drag.offset += drag.velocity;
        drag.velocity *= 0.92;
        // after a beat, ease back toward home
        if (now - drag.releasedAt > 1800) drag.offset *= 0.97;
      }
      const sway = reduceMotion ? 0 : Math.sin(time * 0.25) * 0.22;
      spin.rotation.y = restSpin + sway + drag.offset;

      arcs.forEach((arc) => {
        arc.uHead.value = reduceMotion ? 1 : ((time * arc.speed + arc.phase) % 1.6) - 0.1;
      });
      rings.forEach(({ ring, offset }) => {
        const p = reduceMotion ? 0.5 : (time * 0.6 + offset) % 1;
        ring.scale.setScalar(1 + p * 2.2);
        ring.material.opacity = 0.9 * (1 - p);
      });

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      if (visible && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    });
    io.observe(mount);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      mount.removeChild(canvas);
    };
  }, [home, places]);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}
