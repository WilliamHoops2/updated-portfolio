import * as THREE from "three";

export type DeskId = "chess" | "hoops" | "markets" | "manga";

export interface Desk {
  focus(id: DeskId | null): void;
  dispose(): void;
}

const SQ = 0.3;
const WHITE = "#f1ead8";
const BLACK = "#262626";

/** Small seeded random so the wood grain and the chart are the same on every visit. */
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function canvasTexture(w: number, h: number, draw: (c: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  draw(canvas.getContext("2d")!);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

const std = (color: string, roughness = 0.6) => new THREE.MeshStandardMaterial({ color, roughness });

function mesh(geo: THREE.BufferGeometry, mat: THREE.Material | THREE.Material[]) {
  const m = new THREE.Mesh(geo, mat);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

function table() {
  const rand = seeded(7);
  const tex = canvasTexture(1024, 1024, (c) => {
    c.fillStyle = "#8a6a43";
    c.fillRect(0, 0, 1024, 1024);
    for (let i = 0; i < 260; i++) {
      c.fillStyle = rand() > 0.5 ? "rgba(60,38,16,0.12)" : "rgba(255,220,170,0.08)";
      c.fillRect(0, rand() * 1024, 1024, 1 + rand() * 5);
    }
  });
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 2);
  const top = mesh(new THREE.BoxGeometry(20, 0.4, 13), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.75 }));
  top.position.y = -0.2;
  top.castShadow = false;
  return top;
}

function chessSet() {
  const g = new THREE.Group();
  const size = SQ * 8;
  const frame = mesh(new THREE.BoxGeometry(size + 0.2, 0.1, size + 0.2), std("#2b2a28", 0.5));
  frame.position.y = 0.05;
  g.add(frame);

  const light = std("#eeeed2", 0.5);
  const dark = std("#769656", 0.5);
  const sq = new THREE.BoxGeometry(SQ, 0.04, SQ);
  for (let f = 0; f < 8; f++) {
    for (let r = 0; r < 8; r++) {
      const s = mesh(sq, (f + r) % 2 ? light : dark);
      s.position.set((f - 3.5) * SQ, 0.12, (3.5 - r) * SQ);
      g.add(s);
    }
  }

  const lathe = (pts: [number, number][]) => new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), 20);
  const pawn = lathe([[0, 0], [0.22, 0], [0.22, 0.05], [0.13, 0.12], [0.1, 0.3], [0.15, 0.34], [0.1, 0.4], [0.14, 0.5], [0.1, 0.58], [0, 0.6]]);
  const king = lathe([[0, 0], [0.24, 0], [0.24, 0.06], [0.14, 0.14], [0.1, 0.5], [0.17, 0.56], [0.1, 0.64], [0.13, 0.78], [0, 0.8]]);
  const rook = lathe([[0, 0], [0.24, 0], [0.24, 0.06], [0.16, 0.12], [0.16, 0.44], [0.22, 0.48], [0.22, 0.62], [0, 0.62]]);
  const cross = new THREE.BoxGeometry(0.05, 0.2, 0.05);
  const crossBar = new THREE.BoxGeometry(0.15, 0.05, 0.05);

  const place = (file: number, rank: number, kind: "p" | "r" | "k", white: boolean) => {
    const mat = std(white ? WHITE : BLACK, 0.35);
    const piece = mesh(kind === "p" ? pawn : kind === "r" ? rook : king, mat);
    if (kind === "k") {
      const v = mesh(cross, mat);
      v.position.y = 0.87;
      const h = mesh(crossBar, mat);
      h.position.y = 0.89;
      piece.add(v, h);
    }
    piece.scale.setScalar(0.62);
    piece.position.set((file - 3.5) * SQ, 0.14, (3.5 - rank) * SQ);
    g.add(piece);
  };

  // A tidy endgame, so the board reads as a puzzle and not a fresh set.
  const setup: [number, number, "p" | "r" | "k", boolean][] = [
    [6, 0, "k", true], [4, 3, "r", true], [0, 1, "p", true], [1, 1, "p", true], [5, 1, "p", true], [6, 1, "p", true], [7, 1, "p", true],
    [6, 7, "k", false], [3, 6, "r", false], [0, 6, "p", false], [1, 6, "p", false], [5, 6, "p", false], [6, 6, "p", false], [7, 5, "p", false],
  ];
  setup.forEach(([f, r, k, w]) => place(f, r, k, w));
  return g;
}

function basketball() {
  const g = new THREE.Group();
  const tex = canvasTexture(1024, 512, (c) => {
    c.fillStyle = "#d9622b";
    c.fillRect(0, 0, 1024, 512);
    c.strokeStyle = "#1b1b1b";
    c.lineWidth = 7;
    [0, 512, 1024].forEach((x) => {
      c.beginPath();
      c.moveTo(x, 0);
      c.lineTo(x, 512);
      c.stroke();
    });
    c.beginPath();
    c.moveTo(0, 256);
    c.lineTo(1024, 256);
    c.stroke();
    [256, 768].forEach((x) => {
      c.beginPath();
      c.moveTo(x, 0);
      c.bezierCurveTo(x + 120, 170, x + 120, 342, x, 512);
      c.stroke();
    });
  });
  g.add(mesh(new THREE.SphereGeometry(0.55, 48, 32), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.85 })));
  g.children[0].position.y = 0.55;
  return g;
}

function mangaStack() {
  const g = new THREE.Group();
  const covers = ["#d62828", "#2261e9", "#f7b32b", "#2a9d8f", "#161616"];
  const pages = std("#efe6cf", 0.9);
  let y = 0;
  covers.forEach((color, i) => {
    const w = 1.5 - i * 0.04;
    const h = 0.17 + (i % 2) * 0.04;
    const cover = std(color, 0.55);
    // face order: +x pages, -x spine, +y cover, -y cover, +z pages, -z pages
    const book = mesh(new THREE.BoxGeometry(w, h, 2.05), [pages, cover, cover, cover, pages, pages]);
    book.position.set(((i * 37) % 5) * 0.04 - 0.08, y + h / 2, ((i * 53) % 5) * 0.04 - 0.08);
    book.rotation.y = ((i * 71) % 9) * 0.02 - 0.08;
    g.add(book);
    y += h;
    if (i === covers.length - 1) {
      const label = canvasTexture(256, 128, (c) => {
        c.fillStyle = "#f4f1e8";
        c.fillRect(0, 0, 256, 128);
        c.fillStyle = "#0a0e11";
        c.font = "800 34px Inter, system-ui, sans-serif";
        c.textAlign = "center";
        c.fillText("VAGABOND", 128, 62);
        c.fillRect(40, 80, 176, 6);
      });
      const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.5), new THREE.MeshStandardMaterial({ map: label, roughness: 0.8 }));
      plane.rotation.x = -Math.PI / 2;
      plane.rotation.z = book.rotation.y;
      plane.position.set(book.position.x, y + 0.002, book.position.z);
      g.add(plane);
    }
  });
  return g;
}

function computer() {
  const g = new THREE.Group();
  const body = std("#1b1b1d", 0.4);
  const base = mesh(new THREE.CylinderGeometry(0.6, 0.65, 0.06, 32), body);
  base.position.y = 0.03;
  const neck = mesh(new THREE.BoxGeometry(0.18, 0.75, 0.12), body);
  neck.position.set(0, 0.42, -0.05);
  const frame = mesh(new THREE.BoxGeometry(2.7, 1.6, 0.12), body);
  frame.position.y = 1.5;

  const rand = seeded(21);
  const chart = canvasTexture(1024, 576, (c) => {
    c.fillStyle = "#0b0f14";
    c.fillRect(0, 0, 1024, 576);
    c.strokeStyle = "rgba(255,255,255,0.08)";
    c.lineWidth = 2;
    for (let i = 1; i < 6; i++) {
      c.beginPath();
      c.moveTo(0, i * 96);
      c.lineTo(1024, i * 96);
      c.stroke();
    }
    c.fillStyle = "#f2f1ec";
    c.font = "700 40px 'JetBrains Mono', ui-monospace, monospace";
    c.fillText("BTC / USD", 40, 66);
    c.fillStyle = "#2fd27a";
    c.fillText("+ 12.4%", 800, 66);
    const pts: number[] = [];
    let v = 420;
    for (let i = 0; i < 40; i++) {
      v += (rand() - 0.58) * 60;
      v = Math.max(120, Math.min(500, v));
      pts.push(v);
    }
    const x = (i: number) => 40 + (i * (1024 - 80)) / (pts.length - 1);
    c.beginPath();
    pts.forEach((p, i) => (i ? c.lineTo(x(i), p) : c.moveTo(x(i), p)));
    c.strokeStyle = "#2fd27a";
    c.lineWidth = 6;
    c.lineJoin = "round";
    c.stroke();
    c.lineTo(x(pts.length - 1), 560);
    c.lineTo(x(0), 560);
    c.closePath();
    c.fillStyle = "rgba(47,210,122,0.15)";
    c.fill();
  });
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 1.4), new THREE.MeshBasicMaterial({ map: chart }));
  screen.position.set(0, 1.5, 0.065);

  const keys = mesh(new THREE.BoxGeometry(1.7, 0.06, 0.55), std("#2a2a2d", 0.5));
  keys.position.set(0, 0.03, 0.95);
  g.add(base, neck, frame, screen, keys);
  return g;
}

export function createDesk(host: HTMLElement, onPick: (id: DeskId | null) => void): Desk {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0x2a2118);
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xfff4e0, 0x6b5033, 1.4));
  const sun = new THREE.DirectionalLight(0xffffff, 2.4);
  sun.position.set(-4, 9, 5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8, near: 1, far: 25 });
  sun.shadow.bias = -0.0005;
  scene.add(sun);
  scene.add(table());

  const items: Record<DeskId, THREE.Group> = {
    chess: chessSet(),
    hoops: basketball(),
    markets: computer(),
    manga: mangaStack(),
  };
  items.chess.position.set(-3.1, 0, 0.2);
  items.hoops.position.set(-0.8, 0, 1.7);
  items.markets.position.set(0.7, 0, -1.9);
  items.manga.position.set(3.3, 0, 0.9);
  (Object.keys(items) as DeskId[]).forEach((id) => {
    items[id].userData.id = id;
    scene.add(items[id]);
  });

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 60);
  const camPos = new THREE.Vector3();
  const lookAt = new THREE.Vector3();
  const goalPos = new THREE.Vector3();
  const goalLook = new THREE.Vector3();
  let focused: DeskId | null = null;

  const setGoal = () => {
    const aspect = camera.aspect;
    if (!focused) {
      // Pull back on tall screens so all four objects still fit.
      const back = Math.min(2.2, Math.max(1, 1.3 / aspect));
      goalLook.set(0, 0, 0);
      goalPos.set(0, 8.5 * back, 7.5 * back);
      return;
    }
    // Slide the look-at point so the object sits left of the panel (wide) or above it (narrow).
    goalLook.copy(items[focused].position).add(aspect < 0.9 ? new THREE.Vector3(0, 0, 1.8) : new THREE.Vector3(2.3, 0, 0));
    goalPos.copy(goalLook).add(new THREE.Vector3(0, 3.6, 4.2));
  };

  const resize = () => {
    const w = host.clientWidth;
    const h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    setGoal();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();
  camPos.copy(goalPos);
  lookAt.copy(goalLook);

  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let hovered: DeskId | null = null;
  const pick = (e: PointerEvent): DeskId | null => {
    const r = renderer.domElement.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(Object.values(items), true)[0];
    let o: THREE.Object3D | null = hit?.object ?? null;
    while (o && !o.userData.id) o = o.parent;
    return (o?.userData.id as DeskId) ?? null;
  };
  const onMove = (e: PointerEvent) => {
    hovered = pick(e);
    renderer.domElement.style.cursor = hovered ? "pointer" : "";
  };
  const onClick = (e: MouseEvent) => onPick(pick(e as PointerEvent));
  renderer.domElement.addEventListener("pointermove", onMove);
  renderer.domElement.addEventListener("click", onClick);

  let visible = true;
  const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
  io.observe(host);

  const lift: Record<DeskId, number> = { chess: 0, hoops: 0, markets: 0, manga: 0 };
  let last = performance.now();
  let raf = 0;
  const tick = (now: number) => {
    raf = requestAnimationFrame(tick);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!visible) return;

    const k = reduced ? 1 : 1 - Math.exp(-dt * 4);
    camPos.lerp(goalPos, k);
    lookAt.lerp(goalLook, k);
    camera.position.copy(camPos);
    camera.lookAt(lookAt);

    (Object.keys(items) as DeskId[]).forEach((id) => {
      lift[id] += ((hovered === id ? 1 : 0) - lift[id]) * (reduced ? 1 : 1 - Math.exp(-dt * 10));
      items[id].position.y = lift[id] * 0.14;
    });
    if (!reduced) items.hoops.rotation.y += dt * (0.25 + lift.hoops * 2.5);

    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(tick);

  return {
    focus(id) {
      focused = id;
      setGoal();
    },
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      renderer.domElement.removeEventListener("pointermove", onMove);
      renderer.domElement.removeEventListener("click", onClick);
      scene.traverse((o) => {
        if (!(o instanceof THREE.Mesh)) return;
        o.geometry.dispose();
        [o.material].flat().forEach((m: THREE.Material & { map?: THREE.Texture | null }) => {
          m.map?.dispose();
          m.dispose();
        });
      });
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
