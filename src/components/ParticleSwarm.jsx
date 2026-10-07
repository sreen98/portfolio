import { useEffect, useRef } from "react";
import * as THREE from "three";

// Width of the name in its own units; the group is scaled to fit the layout.
const NAME_W = 4.6;
// How long each phase lasts before morphing to the next one.
const PHASES = [
  { shape: "name", hold: 7000 },
  { shape: "cloud", hold: 500 },
];
const MORPH_MS = 2200;

const vertexShader = /* glsl */ `
  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute float aRand;

  uniform float uProgress;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uSettled;
  uniform vec3 uMouse;
  uniform float uMouseStrength;
  uniform vec3 uColorA;
  uniform vec3 uColorC;
  uniform float uSplitX;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // Stagger each particle so the morph ripples instead of snapping.
    float p = clamp(uProgress * 1.5 - aRand * 0.5, 0.0, 1.0);
    p = p * p * (3.0 - 2.0 * p);
    vec3 pos = mix(aFrom, aTo, p);

    // Mid-flight scatter, strongest halfway through the morph.
    float burst = sin(p * 3.14159);
    pos += burst * 0.55 * vec3(
      sin(aRand * 41.0 + uTime * 0.9),
      cos(aRand * 29.0 + uTime * 0.7),
      sin(aRand * 17.0 + uTime * 1.1)
    );

    // Idle "breathing" so the swarm never looks frozen.
    pos += (0.03 - 0.018 * uSettled) * vec3(
      sin(uTime * 0.8 + aRand * 20.0),
      cos(uTime * 0.7 + aRand * 13.0),
      sin(uTime * 0.6 + aRand * 7.0)
    );
    // While the name holds, a slow wave rolls through the letters.
    pos.z += uSettled * 0.12 * sin(pos.x * 1.6 - uTime * 1.4);

    vec4 world = modelMatrix * vec4(pos, 1.0);

    // Push particles away from the cursor.
    vec2 away = world.xy - uMouse.xy;
    float dist = length(away);
    float force = smoothstep(0.9, 0.0, dist) * uMouseStrength;
    world.xy += normalize(away + 0.0001) * force * 0.6;
    world.z += force * 0.4;

    vec4 mv = viewMatrix * world;
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (0.55 + aRand * 0.9) / -mv.z;

    // Warm white, with the last word picked out in the accent colour.
    vColor = mix(uColorA, uColorC, smoothstep(uSplitX - 0.04, uSplitX + 0.04, pos.x));
    vColor += force * 0.35;
    float twinkle = 0.75 + 0.25 * sin(uTime * 3.0 + aRand * 60.0);
    vAlpha = (0.45 + 0.55 * aRand) * twinkle + force * 0.4;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor, a * a * vAlpha);
  }
`;

/** Loose cloud the name bursts into and re-forms from. */
function cloud(n) {
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const u = Math.random() * 2 - 1;
    const theta = Math.random() * Math.PI * 2;
    const r = 1.2 + Math.cbrt(Math.random()) * 1.6;
    const s = Math.sqrt(1 - u * u);
    out[i * 3] = Math.cos(theta) * s * r * 1.5;
    out[i * 3 + 1] = u * r * 0.8;
    out[i * 3 + 2] = Math.sin(theta) * s * r;
  }
  return out;
}

/** Samples the filled pixels of `label` drawn on a canvas, centred, NAME_W wide. */
function text(n, label) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const font = '800 expanded 160px "Archivo", sans-serif';
  ctx.font = font;
  const w = Math.ceil(ctx.measureText(label).width) + 40;
  const h = 220;
  canvas.width = w;
  canvas.height = h;
  ctx.font = font;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, w / 2, h / 2 + 6);
  const data = ctx.getImageData(0, 0, w, h).data;
  const filled = [];
  for (let y = 0; y < h; y += 2) {
    for (let x = 0; x < w; x += 2) {
      if (data[(y * w + x) * 4 + 3] > 128) filled.push(x, y);
    }
  }
  if (!filled.length) return cloud(n);
  const out = new Float32Array(n * 3);
  const scale = NAME_W / w;
  // x where the last word starts, so it can be coloured separately.
  const lastWord = label.lastIndexOf(" ") + 1;
  const textW = ctx.measureText(label).width;
  out.splitX = (w / 2 - textW / 2 + ctx.measureText(label.slice(0, lastWord)).width - w / 2) * scale;
  for (let i = 0; i < n; i++) {
    const k = Math.floor(Math.random() * (filled.length / 2)) * 2;
    out[i * 3] = (filled[k] - w / 2 + Math.random() * 2) * scale;
    out[i * 3 + 1] = -(filled[k + 1] - h / 2 + Math.random() * 2) * scale;
    out[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
  }
  return out;
}

/**
 * A WebGL particle swarm that spells out `label`, bursts apart every few
 * seconds and re-forms, and scatters away from the cursor. Pauses itself
 * when scrolled out of view.
 */
export default function ParticleSwarm({ label = "Sreenath P", textRef, slotRef, className = "" }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isSmall = window.innerWidth < 768;
    const count = isSmall ? 7000 : 15000;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
    } catch {
      return undefined; // No WebGL: the hero still works without the swarm.
    }
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.cssText = "display:block;width:100%;height:100%";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const shapes = { cloud: cloud(count), name: null };
    const getShape = (name) => {
      if (!shapes[name]) {
        shapes[name] = text(count, label);
        uniforms.uSplitX.value = shapes[name].splitX ?? 99;
        measureName(shapes[name]);
        layout();
      }
      return shapes[name];
    };

    const geometry = new THREE.BufferGeometry();
    const rand = new Float32Array(count);
    for (let i = 0; i < count; i++) rand[i] = Math.random();
    geometry.setAttribute("position", new THREE.BufferAttribute(shapes.cloud.slice(), 3));
    geometry.setAttribute("aFrom", new THREE.BufferAttribute(shapes.cloud.slice(), 3));
    geometry.setAttribute("aTo", new THREE.BufferAttribute(shapes.cloud.slice(), 3));
    geometry.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));
    geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 5);

    const uniforms = {
      uProgress: { value: 1 },
      uTime: { value: 0 },
      uSize: { value: isSmall ? 22 : 24 },
      uPixelRatio: { value: pixelRatio },
      uSettled: { value: 0 },
      uMouse: { value: new THREE.Vector3(99, 99, 0) },
      uMouseStrength: { value: 0 },
      uColorA: { value: new THREE.Color("#f2ece2") },
      uColorC: { value: new THREE.Color("#ff6b35") },
      uSplitX: { value: 99 },
    };
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const group = new THREE.Group();
    group.add(new THREE.Points(geometry, material));
    scene.add(group);

    // Height / width of the sampled name, refined once the name is built.
    let nameAspect = 0.22;
    const measureName = (arr) => {
      let lo = Infinity;
      let hi = -Infinity;
      for (let i = 1; i < arr.length; i += 3) {
        lo = Math.min(lo, arr[i]);
        hi = Math.max(hi, arr[i]);
      }
      nameAspect = (hi - lo) / NAME_W;
    };

    // Place the name from the real layout so it never covers the copy: inside
    // the reserved slot on phones / portrait tablets, otherwise in the free
    // space to the right of the headline.
    const range = document.createRange();
    const layout = () => {
      const m = mount.getBoundingClientRect();
      if (!m.width || !m.height) return;
      const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
      const halfW = halfH * camera.aspect;
      const slot = slotRef?.current?.getBoundingClientRect();
      const textEl = textRef?.current;
      let cx;
      let cy;
      let widthPx;
      if (slot && slot.height > 0) {
        widthPx = Math.min(slot.width, slot.height / nameAspect);
        cx = slot.left + slot.width / 2;
        cy = slot.top + slot.height / 2;
      } else if (textEl) {
        let textRight = m.left;
        textEl.querySelectorAll("h1, p, [data-measure]").forEach((el) => {
          range.selectNodeContents(el);
          textRight = Math.max(textRight, range.getBoundingClientRect().right);
        });
        const h1 = textEl.querySelector("h1").getBoundingClientRect();
        const left = textRight + 40;
        const right = m.right - 32;
        widthPx = Math.max(0, Math.min(right - left, m.width * 0.42, (h1.height * 0.8) / nameAspect));
        cx = left + (right - left) / 2;
        cy = h1.top + h1.height / 2;
      } else {
        widthPx = m.width * 0.36;
        cx = m.left + m.width * 0.75;
        cy = m.top + m.height / 2;
      }
      group.visible = widthPx >= 120;
      const unitsPerPx = (halfW * 2) / m.width;
      group.scale.setScalar((widthPx * unitsPerPx) / NAME_W);
      group.position.set(((cx - m.left) / m.width) * 2 * halfW - halfW, halfH - ((cy - m.top) / m.height) * 2 * halfH, 0);
    };

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = mount;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      layout();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    if (textRef?.current) ro.observe(textRef.current);
    resize();
    // The headline animates in and swaps fonts; settle the layout after that.
    const settleTimer = setTimeout(layout, 1600);

    // Cursor to point on the z=0 plane in world space.
    const ndc = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const hit = new THREE.Vector3();
    const target = { x: 0, y: 0, active: false };
    const onPointerMove = (e) => {
      const rect = mount.getBoundingClientRect();
      ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
      raycaster.setFromCamera(ndc, camera);
      if (raycaster.ray.intersectPlane(plane, hit)) {
        uniforms.uMouse.value.copy(hit);
        target.x = ndc.x;
        target.y = ndc.y;
        target.active = e.clientY >= rect.top && e.clientY <= rect.bottom;
      }
    };
    const onPointerLeave = () => (target.active = false);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);

    // Phase cycle: start as a cloud, assemble the name once the font is ready.
    const fromAttr = geometry.getAttribute("aFrom");
    const toAttr = geometry.getAttribute("aTo");
    let phase = PHASES.length - 1; // "cloud"
    let morphStart = -Infinity;
    let nextSwitch = Infinity;
    const goTo = (index, now) => {
      fromAttr.array.set(toAttr.array);
      phase = index;
      toAttr.array.set(getShape(PHASES[phase].shape));
      fromAttr.needsUpdate = true;
      toAttr.needsUpdate = true;
      morphStart = now;
      nextSwitch = reduceMotion ? Infinity : now + MORPH_MS + PHASES[phase].hold;
    };
    let cancelled = false;
    const fontReady = Promise.race([
      document.fonts?.load('800 160px "Archivo"') ?? Promise.resolve(),
      new Promise((r) => setTimeout(r, 1500)),
    ]);
    fontReady.then(() => {
      if (cancelled) return;
      if (reduceMotion) {
        // No fly-in: show the name straight away.
        toAttr.array.set(getShape("name"));
        fromAttr.array.set(toAttr.array);
        fromAttr.needsUpdate = toAttr.needsUpdate = true;
        phase = 0;
      } else {
        goTo(0, performance.now());
      }
    });

    let visible = true;
    let last = performance.now();
    let raf = 0;
    let time = 0;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    });
    io.observe(mount);

    const tick = (now) => {
      raf = 0;
      if (!visible) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!reduceMotion) time += dt;
      uniforms.uTime.value = time;

      if (now >= nextSwitch && !document.hidden) goTo((phase + 1) % PHASES.length, now);
      const progress = Math.min((now - morphStart) / MORPH_MS, 1);
      uniforms.uProgress.value = progress;
      const settledGoal = PHASES[phase].shape === "name" && progress >= 1 ? 1 : 0;
      uniforms.uSettled.value += (settledGoal - uniforms.uSettled.value) * 0.03;

      const strengthGoal = target.active ? 1 : 0;
      uniforms.uMouseStrength.value += (strengthGoal - uniforms.uMouseStrength.value) * 0.08;

      // Face the viewer, leaning slightly toward the cursor.
      group.rotation.x += (target.y * 0.18 - group.rotation.x) * 0.04;
      group.rotation.y += (target.x * 0.22 - group.rotation.y) * 0.04;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      clearTimeout(settleTimer);
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [label, textRef, slotRef]);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}
