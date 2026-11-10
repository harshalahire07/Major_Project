import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Upload,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Layers,
  GitCompare,
  Cpu,
  Database,
  Server,
  Code2,
  BookOpen,
  ChevronRight,
  ChevronDown,
  RefreshCw,
  Check,
  Menu,
  X,
  CornerDownRight,
  Sparkles,
  Share2,
  Download,
  Maximize2,
  Play,
  Lock,
  Terminal,
  Box,
  Sliders,
  Eye,
  Compass
} from 'lucide-react';

// ============================================================================
// 1. CUSTOM VERITY AI ARCH-SHIELD LOGO (Inspired by NotebookLM + Antigravity)
// ============================================================================
const VerityArchLogo = ({ className = 'w-7 h-7', dark = false }) => (
  <svg
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Verity AI Logo"
  >
    <defs>
      <linearGradient id="verityArchGrad" x1="4" y1="30" x2="32" y2="6" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="38%" stopColor="#6366F1" />
        <stop offset="72%" stopColor="#EC4899" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
    </defs>
    {/* Outer Rainbow Arch */}
    <path
      d="M6 27C6 14.8497 11.3726 6 18 6C24.6274 6 30 14.8497 30 27"
      stroke="url(#verityArchGrad)"
      strokeWidth="3.8"
      strokeLinecap="round"
    />
    {/* Inner Concentric Document Arch */}
    <path
      d="M11.5 27C11.5 18.8 14.4101 12.5 18 12.5C21.5899 12.5 24.5 18.8 24.5 27"
      stroke={dark ? '#FFFFFF' : '#111215'}
      strokeWidth="2.6"
      strokeLinecap="round"
    />
    {/* Verification Check Dot */}
    <circle cx="18" cy="24.5" r="2.6" fill="#10B981" />
  </svg>
);

// ============================================================================
// 2. GOOGLE ANTIGRAVITY 4-COLOR VERTICAL CARET BAR
// ============================================================================
const RainbowCaret = ({ heightClass = 'h-[0.88em]' }) => (
  <span
    className={`inline-block w-[4px] ${heightClass} align-middle ml-1.5 rounded-full animate-pulse`}
    style={{
      background:
        'linear-gradient(180deg, #4285F4 0%, #EA4335 34%, #FBBC05 67%, #34A853 100%)'
    }}
    aria-hidden="true"
  />
);

// ============================================================================
// 3. ANTIGRAVITY HERO INTERACTIVE CONFETTI / DASH PARTICLE CANVAS (01:13)
// ============================================================================
const AntigravityConfettiCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const colors = [
      '#4285F4',
      '#EA4335',
      '#FBBC05',
      '#34A853',
      '#6366F1',
      '#EC4899'
    ];
    let width = (canvas.width = canvas.parentElement.clientWidth || 1200);
    let height = (canvas.height = canvas.parentElement.clientHeight || 620);

    const particles = Array.from({ length: 115 }, () => {
      // Bias particles toward left and right periphery like Antigravity hero
      const side = Math.random() > 0.5 ? 1 : -1;
      const xSpread =
        side === -1
          ? Math.random() * (width * 0.36)
          : width - Math.random() * (width * 0.36);
      return {
        x: xSpread,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -0.25 - Math.random() * 0.4,
        len: 4 + Math.random() * 6,
        thick: 1.8 + Math.random() * 1.4,
        angle: Math.random() * Math.PI * 2,
        vAngle: (Math.random() - 0.5) * 0.015,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.45 + Math.random() * 0.45
      };
    });

    const mouse = { x: -9999, y: -9999 };
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    window.addEventListener('mousemove', onMove);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.vAngle;

        // Gentle cursor repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120 && dist > 0) {
          const force = (120 - dist) / 120;
          p.x += (dx / dist) * force * 2.2;
          p.y += (dy / dist) * force * 2.2;
        }

        if (p.y < -15) p.y = height + 15;
        if (p.x < -15) p.x = width + 15;
        if (p.x > width + 15) p.x = -15;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.roundRect(-p.len / 2, -p.thick / 2, p.len, p.thick, 2);
        ctx.fill();
        ctx.restore();
      }
      animId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
};

// ============================================================================
// 4. ANTIGRAVITY DARK 3D PARTICLE ARCH / VERIFICATION CORE (Video 01:17-01:20)
// ============================================================================
const AntigravityParticleArch3D = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 900;
    const height = container.clientHeight || 480;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 7.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Create iconic Antigravity dotted rainbow arch + surrounding starfield
    const positions = [];
    const colors = [];
    const colorObj = new THREE.Color();

    // Arch particles
    const totalArch = 1600;
    for (let i = 0; i < totalArch; i++) {
      const t = (i / totalArch) * Math.PI; // 0 to PI arch
      const spread = (Math.random() - 0.5) * 0.48;
      const depth = (Math.random() - 0.5) * 0.65;
      const x = Math.cos(t) * (2.15 + spread);
      const y = Math.sin(t) * (2.55 + spread * 0.9) - 1.05;
      const z = depth;
      positions.push(x, y, z);

      // Gradient from Blue -> Indigo -> Coral/Pink -> Amber -> Emerald
      const norm = i / totalArch;
      if (norm < 0.33) {
        colorObj.setHSL(0.6 - norm * 0.15, 0.92, 0.62);
      } else if (norm < 0.66) {
        colorObj.setHSL(0.95 - (norm - 0.33) * 0.4, 0.9, 0.62);
      } else {
        colorObj.setHSL(0.12 + (norm - 0.66) * 0.25, 0.95, 0.6);
      }
      colors.push(colorObj.r, colorObj.g, colorObj.b);
    }

    // Ambient cosmic verification dust
    for (let i = 0; i < 420; i++) {
      positions.push(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 6.5,
        (Math.random() - 0.5) * 5
      );
      colorObj.setHSL(0.6 + Math.random() * 0.2, 0.7, 0.7);
      colors.push(colorObj.r, colorObj.g, colorObj.b);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.92
    });

    const points = new THREE.Points(geo, mat);
    group.add(points);

    let mouseX = 0;
    let mouseY = 0;
    const onMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 0.65;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 0.4;
    };
    window.addEventListener('mousemove', onMove);

    let animId;
    const clock = new THREE.Clock();
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      group.rotation.y += (mouseX - group.rotation.y) * 0.06 + Math.sin(t * 0.5) * 0.002;
      group.rotation.x += (-mouseY - group.rotation.x) * 0.06;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
};

// ============================================================================
// 5. INTERACTIVE 3D WORK ARCHITECTURE DIAGRAM (Three.js WebGL 4-Stage Pipeline)
// ============================================================================
const ARCHITECTURE_STAGES = [
  {
    id: 0,
    code: 'STAGE 01',
    name: 'PDF Ingestion & Page Chunking',
    tech: 'Python · PyMuPDF · PostgreSQL',
    summary:
      'Uploads PDF files, extracts text while preserving exact document filenames and page numbers, and segments content into overlapping semantic passages.',
    input: 'Research_Paper.pdf (18 pages), Project_Report.pdf (12 pages)',
    output: '134 Page-Linked Document Chunks stored in PostgreSQL',
    color: '#3B82F6'
  },
  {
    id: 1,
    code: 'STAGE 02',
    name: 'Dense Embeddings & FAISS Retrieval',
    tech: 'Embeddings · FAISS Vector Index · FastAPI',
    summary:
      'Encodes document chunks and user natural-language questions into dense vectors, executing sub-millisecond top-K similarity search in FAISS.',
    input: 'User Query: "What are the main limitations of the proposed system?"',
    output: 'Top-K Relevant Passages (Page 6, Page 14)',
    color: '#6366F1'
  },
  {
    id: 2,
    code: 'STAGE 03',
    name: 'Atomic Claim Split & NLI Verification',
    tech: 'Qwen · Ollama · Natural Language Inference (NLI)',
    summary:
      'Breaks the draft AI answer into standalone atomic claims and runs NLI classification against retrieved PDF passages to label each SUPPORTED, CONTRADICTED, or UNVERIFIABLE.',
    input: '3 Extracted Atomic Claims from Draft Response',
    output: 'Claim #1 SUPPORTED · Claim #2 CONTRADICTED · Claim #3 UNVERIFIABLE',
    color: '#EC4899'
  },
  {
    id: 3,
    code: 'STAGE 04',
    name: 'Targeted Claim Repair & Citation Grounding',
    tech: 'Evidence-Guided Rewrite · Page Citations',
    summary:
      'Automatically rewrites contradicted claims using the exact source passage on Page 14, withholds unverifiable claims, and attaches clickable page citations.',
    input: 'Contradicted Claim #2 + Page 14 Evidence Passage',
    output: 'Verified & Repaired Answer with [1] p.6 and [2] p.14 Citations',
    color: '#10B981'
  }
];

const Verity3DArchitectureDiagram = ({ activeStage, onSelectStage }) => {
  const mountRef = useRef(null);
  const activeStageRef = useRef(activeStage);

  useEffect(() => {
    activeStageRef.current = activeStage;
  }, [activeStage]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 960;
    const height = container.clientHeight || 480;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    camera.position.set(0, 5.2, 11.8);
    camera.lookAt(0, 0.2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Studio Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 1.35));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight.position.set(6, 12, 8);
    scene.add(dirLight);

    const world = new THREE.Group();
    scene.add(world);

    // Subtle architectural floor grid
    const grid = new THREE.GridHelper(13.5, 26, 0x334155, 0x1e293b);
    grid.position.y = -1.65;
    world.add(grid);

    const stageX = [-4.2, -1.45, 1.45, 4.2];
    const stageNodes = [];
    const hitMeshes = [];

    // ---- STAGE 1: 3D Stacked PDF Pages ----
    const s1Group = new THREE.Group();
    s1Group.position.set(stageX[0], 0, 0);
    for (let i = 0; i < 3; i++) {
      const pageGeo = new THREE.BoxGeometry(1.45, 0.08, 1.9);
      const pageMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.3
      });
      const mesh = new THREE.Mesh(pageGeo, pageMat);
      mesh.position.y = -0.35 + i * 0.34;
      mesh.rotation.y = (i - 1) * 0.08;
      mesh.userData = { stageIndex: 0 };
      s1Group.add(mesh);
      hitMeshes.push(mesh);

      const edge = new THREE.LineSegments(
        new THREE.EdgesGeometry(pageGeo),
        new THREE.LineBasicMaterial({ color: 0x3b82f6 })
      );
      edge.position.copy(mesh.position);
      edge.rotation.copy(mesh.rotation);
      s1Group.add(edge);
    }
    world.add(s1Group);
    stageNodes.push(s1Group);

    // ---- STAGE 2: 3D FAISS Vector Lattice Cube ----
    const s2Group = new THREE.Group();
    s2Group.position.set(stageX[1], 0, 0);
    const cubeGeo = new THREE.BoxGeometry(1.55, 1.55, 1.55);
    const cubeMat = new THREE.MeshPhysicalMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.25,
      roughness: 0.15
    });
    const cubeMesh = new THREE.Mesh(cubeGeo, cubeMat);
    cubeMesh.userData = { stageIndex: 1 };
    s2Group.add(cubeMesh);
    hitMeshes.push(cubeMesh);

    s2Group.add(
      new THREE.LineSegments(
        new THREE.EdgesGeometry(cubeGeo),
        new THREE.LineBasicMaterial({ color: 0x818cf8 })
      )
    );

    // Inner embedding spheres inside FAISS cube
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        const dot = new THREE.Mesh(
          new THREE.SphereGeometry(0.08, 10, 10),
          new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
        );
        dot.position.set(x * 0.42, y * 0.42, (x * y) * 0.35);
        s2Group.add(dot);
      }
    }
    world.add(s2Group);
    stageNodes.push(s2Group);

    // ---- STAGE 3: 3D NLI Verification Prism + 3 Claim Branches ----
    const s3Group = new THREE.Group();
    s3Group.position.set(stageX[2], 0, 0);
    const octaGeo = new THREE.OctahedronGeometry(0.95, 0);
    const octaMat = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      roughness: 0.25,
      metalness: 0.2
    });
    const octaMesh = new THREE.Mesh(octaGeo, octaMat);
    octaMesh.userData = { stageIndex: 2 };
    s3Group.add(octaMesh);
    hitMeshes.push(octaMesh);

    s3Group.add(
      new THREE.LineSegments(
        new THREE.EdgesGeometry(octaGeo),
        new THREE.LineBasicMaterial({ color: 0xfbcfe8 })
      )
    );

    // 3 Orbiting Claim Status Satellites (Green, Red, Amber)
    const satColors = [0x10b981, 0xef4444, 0xf59e0b];
    const satellites = [];
    satColors.forEach((col, idx) => {
      const sat = new THREE.Mesh(
        new THREE.BoxGeometry(0.38, 0.22, 0.38),
        new THREE.MeshBasicMaterial({ color: col })
      );
      s3Group.add(sat);
      satellites.push({ mesh: sat, offset: (idx * Math.PI * 2) / 3 });
    });
    world.add(s3Group);
    stageNodes.push(s3Group);

    // ---- STAGE 4: 3D Repaired & Verified Answer Slab ----
    const s4Group = new THREE.Group();
    s4Group.position.set(stageX[3], 0, 0);
    const slabGeo = new THREE.BoxGeometry(1.65, 1.15, 0.22);
    const slabMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.25
    });
    const slabMesh = new THREE.Mesh(slabGeo, slabMat);
    slabMesh.userData = { stageIndex: 3 };
    s4Group.add(slabMesh);
    hitMeshes.push(slabMesh);

    s4Group.add(
      new THREE.LineSegments(
        new THREE.EdgesGeometry(slabGeo),
        new THREE.LineBasicMaterial({ color: 0xa7f3d0 })
      )
    );
    world.add(s4Group);
    stageNodes.push(s4Group);

    // ---- Connecting Pipeline Tubes & Animated Data Packets ----
    const packets = [];
    for (let i = 0; i < 3; i++) {
      const start = new THREE.Vector3(stageX[i] + 0.85, 0, 0);
      const end = new THREE.Vector3(stageX[i + 1] - 0.85, 0, 0);
      const mid = new THREE.Vector3(
        (start.x + end.x) / 2,
        0.55,
        0
      );
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(
        curve.getPoints(32)
      );
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x60a5fa,
        transparent: true,
        opacity: 0.55
      });
      world.add(new THREE.Line(lineGeo, lineMat));

      // Travelling light packet
      const pkt = new THREE.Mesh(
        new THREE.SphereGeometry(0.11, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
      );
      world.add(pkt);
      packets.push({ mesh: pkt, curve, speed: 0.42 + i * 0.08, offset: i * 0.33 });
    }

    // ---- Pointer & Orbit Controls ----
    let isDragging = false;
    let prev = { x: 0, y: 0 };
    let targetRotY = 0;
    let targetRotX = 0.05;
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const onDown = (e) => {
      isDragging = true;
      prev = { x: e.clientX, y: e.clientY };

      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(hitMeshes, false);
      if (hits.length > 0 && onSelectStage) {
        const idx = hits[0].object.userData?.stageIndex;
        if (typeof idx === 'number') onSelectStage(idx);
      }
    };

    const onMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;
      targetRotY += dx * 0.006;
      targetRotX = Math.max(-0.25, Math.min(0.45, targetRotX + dy * 0.005));
      prev = { x: e.clientX, y: e.clientY };
    };

    const onUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);

    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const currentStage = activeStageRef.current;

      // Smoothly pan camera toward selected stage or overview
      const targetCamX =
        currentStage === null ? 0 : stageX[currentStage] * 0.55;
      camera.position.x += (targetCamX - camera.position.x) * 0.06;
      camera.lookAt(targetCamX * 0.65, 0.1, 0);

      world.rotation.y += (targetRotY - world.rotation.y) * 0.08;
      world.rotation.x += (targetRotX - world.rotation.x) * 0.08;

      // Stage animations
      s2Group.rotation.y = t * 0.45;
      octaMesh.rotation.y = -t * 0.7;
      satellites.forEach((s) => {
        const a = t * 1.6 + s.offset;
        s.mesh.position.set(Math.cos(a) * 1.25, Math.sin(a * 1.3) * 0.35, Math.sin(a) * 1.25);
      });

      stageNodes.forEach((node, idx) => {
        const isFocused = currentStage === idx;
        const sc = isFocused ? 1.18 : 1.0;
        node.scale.lerp(new THREE.Vector3(sc, sc, sc), 0.1);
        node.position.y = Math.sin(t * 1.8 + idx) * 0.08 + (isFocused ? 0.2 : 0);
      });

      packets.forEach((p) => {
        const u = (t * p.speed + p.offset) % 1;
        const pos = p.curve.getPointAt(u);
        p.mesh.position.copy(pos);
      });

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full cursor-grab active:cursor-grabbing select-none"
      title="Click any 3D pipeline node or drag to orbit"
    />
  );
};

// ============================================================================
// 6. DATASETS FOR WORKSPACE, CAROUSEL, FEATURED NOTEBOOKS, AND FAQ
// ============================================================================
const INITIAL_DOCS = [
  {
    id: 'Research_Paper.pdf',
    name: 'Research_Paper.pdf',
    pages: 18,
    chunks: 42,
    checked: true
  },
  {
    id: 'Project_Report.pdf',
    name: 'Project_Report.pdf',
    pages: 12,
    chunks: 28,
    checked: true
  },
  {
    id: 'Technical_Document.pdf',
    name: 'Technical_Document.pdf',
    pages: 24,
    chunks: 64,
    checked: true
  }
];

const CLAIMS_DATA = [
  {
    id: 'claim-1',
    number: '1',
    text: 'The system uses semantic retrieval.',
    status: 'SUPPORTED',
    sourceFile: 'Research_Paper.pdf',
    page: 'Page 6',
    section: 'Section 3.1 · Semantic Retrieval Pipeline',
    quote:
      'To capture conceptual similarity beyond lexical overlap, the system uses dense passage embeddings indexed in FAISS for semantic retrieval across segmented PDF pages.',
    note: 'Entailment verified on Page 6. Citation [1] attached.'
  },
  {
    id: 'claim-2',
    number: '2',
    text: 'The system guarantees 100% accuracy.',
    status: 'CONTRADICTED',
    sourceFile: 'Research_Paper.pdf',
    page: 'Page 14',
    section: 'Section 4.2 · System Limitations',
    quote:
      'However, the system does not guarantee 100% accuracy and remains bounded by retrieval recall, dense index coverage, and OCR quality on complex multi-column tables.',
    note: 'Contradicted by Page 14. Automatically repaired using documented bounds [2].'
  },
  {
    id: 'claim-3',
    number: '3',
    text: 'The system supports real-time collaboration.',
    status: 'UNVERIFIABLE',
    sourceFile: 'All 3 Uploaded PDFs',
    page: '54 Pages Searched',
    section: 'FAISS Top-K Similarity < 0.21',
    quote:
      'No passage in Research_Paper.pdf, Project_Report.pdf, or Technical_Document.pdf mentions synchronous multi-user editing or real-time collaboration.',
    note: 'Marked UNVERIFIABLE and withheld so unsupported claims are never presented as facts.'
  }
];

const WAVE_DOCK_ICONS = [
  { icon: FileText, label: 'PDF Parser', offset: 18 },
  { icon: Layers, label: 'Page Chunker', offset: 8 },
  { icon: Database, label: 'PostgreSQL', offset: -2 },
  { icon: Search, label: 'FAISS Index', offset: -10 },
  { icon: Cpu, label: 'Ollama Runtime', offset: -16 },
  { icon: Sparkles, label: 'Qwen LLM', offset: -18 },
  { icon: ShieldCheck, label: 'NLI Verifier', offset: -16 },
  { icon: AlertTriangle, label: 'Hallucination Check', offset: -10 },
  { icon: GitCompare, label: 'Claim Repair', offset: -2 },
  { icon: BookOpen, label: 'Page Citations', offset: 8 },
  { icon: Terminal, label: 'FastAPI Server', offset: 18 }
];

const FEATURED_NOTEBOOKS = [
  {
    id: 'nb-1',
    emoji: '🔬',
    title: 'Transformer Retrieval & NLI Verification Study',
    sourcesCount: '3 sources · 54 pages',
    question: 'What are the main limitations of the proposed system?',
    badge: 'Default Workspace'
  },
  {
    id: 'nb-2',
    emoji: '⚖️',
    title: 'Regulatory Compliance & Audit Policy Review',
    sourcesCount: '14 sources · 118 pages',
    question: 'Which data retention claims are contradicted by Section 4?',
    badge: 'Legal & Policy'
  },
  {
    id: 'nb-3',
    emoji: '🧬',
    title: 'Clinical Trial Protocol & Adverse Event Synthesis',
    sourcesCount: '9 sources · 86 pages',
    question: 'What dosage thresholds are supported by Phase II evidence?',
    badge: 'Biomedical QA'
  },
  {
    id: 'nb-4',
    emoji: '📊',
    title: 'Quarterly Architecture & Systems Benchmark Report',
    sourcesCount: '6 sources · 64 pages',
    question: 'How does FAISS indexing latency scale across page chunks?',
    badge: 'Systems Engineering'
  }
];

const FAQ_ITEMS = [
  {
    q: 'How does Verity AI differ from standard Chat-with-PDF tools?',
    a: 'Standard RAG tools retrieve passages and generate a single fluent paragraph—often mixing supported facts with subtle hallucinations. Verity AI decomposes every generated answer into individual atomic claims, verifies each claim with Natural Language Inference (NLI) against your PDF pages, and repairs contradicted statements.'
  },
  {
    q: 'What is the difference between CONTRADICTED and UNVERIFIABLE claims?',
    a: 'A claim is marked CONTRADICTED when a retrieved passage in your uploaded PDF directly refutes the statement (for example, claiming "100% accuracy" when Page 14 explicitly states the system is bounded by retrieval recall). A claim is marked UNVERIFIABLE when the source documents contain no evidence either supporting or refuting it.'
  },
  {
    q: 'Does Verity AI guarantee 100% accuracy or eliminate all hallucinations?',
    a: 'No. Verity AI is a practical academic and engineering system bounded by PDF OCR quality, retrieval recall, and NLI model classification. Instead of claiming 100% accuracy, it makes every claim transparent and auditable against exact filenames and page numbers.'
  },
  {
    q: 'Can every unsupported or contradicted claim be automatically repaired?',
    a: 'Contradicted claims can be automatically repaired when the retrieved source passage provides the corrective fact. Unverifiable claims—where the uploaded PDFs simply do not mention the topic—cannot be fabricated and are instead flagged or omitted so they are never presented as verified facts.'
  },
  {
    q: 'What technology stack powers Verity AI?',
    a: 'Verity AI is built with Python, FastAPI, PostgreSQL, dense vector Embeddings indexed in FAISS, Natural Language Inference (NLI) verification models, and Qwen running locally through Ollama.'
  }
];

// ============================================================================
// MAIN LANDING PAGE COMPONENT
// ============================================================================
export default function App() {
  const [bannerVisible, setBannerVisible] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);

  // Hero Typewriter State (Video 01:08-01:12)
  const fullHeroText = 'Answers you can trust.\nEvidence you can see.';
  const [typedHero, setTypedHero] = useState(fullHeroText);
  const [isTypingHero, setIsTypingHero] = useState(false);

  // Dark Stage Mode ('workspace' | 'intro3d')
  const [heroStageMode, setHeroStageMode] = useState('workspace');

  // Interactive 3-Pane Workspace State
  const [docs, setDocs] = useState(INITIAL_DOCS);
  const [selectedDoc, setSelectedDoc] = useState('Research_Paper.pdf');
  const [activeClaimId, setActiveClaimId] = useState('claim-2');
  const [answerView, setAnswerView] = useState('repaired'); // 'repaired' | 'original'
  const [activeQuestion, setActiveQuestion] = useState(
    'What are the main limitations of the proposed system?'
  );
  const [isVerifying, setIsVerifying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // How It Works / Architecture Mode ('dual' | 'bezier2d' | 'webgl3d')
  const [archViewMode, setArchViewMode] = useState('dual');
  const [activeArchStage, setActiveArchStage] = useState(2);

  // NotebookLM Feature Carousel Slide (0: Data Tables, 1: Infographics, 2: Claim Repair Diff, 3: Trust Problem)
  const [carouselIdx, setCarouselIdx] = useState(0);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(0);

  const activeClaim =
    CLAIMS_DATA.find((c) => c.id === activeClaimId) || CLAIMS_DATA[1];

  // Trigger Hero Typewriter Replay
  const replayHeroTypewriter = () => {
    if (isTypingHero) return;
    setIsTypingHero(true);
    setTypedHero('');
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setTypedHero(fullHeroText.slice(0, i));
      if (i >= fullHeroText.length) {
        clearInterval(interval);
        setIsTypingHero(false);
      }
    }, 28);
  };

  useEffect(() => {
    replayHeroTypewriter();
  }, []);

  const scrollTo = (id) => {
    setMobileNavOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const triggerVerifyScan = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setAnswerView('repaired');
    }, 550);
  };

  const handleUploadDoc = () => {
    if (isUploading) return;
    setIsUploading(true);
    setTimeout(() => {
      if (!docs.some((d) => d.id === 'Evaluation_Appendix.pdf')) {
        setDocs((prev) => [
          ...prev,
          {
            id: 'Evaluation_Appendix.pdf',
            name: 'Evaluation_Appendix.pdf',
            pages: 9,
            chunks: 21,
            checked: true
          }
        ]);
      }
      setSelectedDoc('Evaluation_Appendix.pdf');
      setIsUploading(false);
    }, 600);
  };

  const StatusPill = ({ status }) => {
    if (status === 'SUPPORTED') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3" />
          SUPPORTED
        </span>
      );
    }
    if (status === 'CONTRADICTED') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <XCircle className="w-3 h-3" />
          CONTRADICTED
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-amber-50 text-amber-700 border border-amber-200">
        <AlertTriangle className="w-3 h-3" />
        UNVERIFIABLE
      </span>
    );
  };

  return (
    <div
      className="min-h-screen bg-white text-[#111215] antialiased selection:bg-[#111215] selection:text-white overflow-x-hidden"
      style={{
        fontFamily:
          "'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        @keyframes rainbowAura {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .notebook-aura {
          background: linear-gradient(120deg, rgba(59,130,246,0.22), rgba(168,85,247,0.22), rgba(236,72,153,0.22), rgba(245,158,11,0.2), rgba(16,185,129,0.22));
          background-size: 200% 200%;
          animation: rainbowAura 9s ease infinite;
        }
      `}</style>

      {/* =====================================================================
          SECTION 1 — STICKY NAVIGATION BAR + ANTIGRAVITY ANNOUNCEMENT BAR
      ===================================================================== */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-[1320px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Left: Verity AI Logo */}
          <a
            href="#top"
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <VerityArchLogo className="w-7 h-7 transition-transform duration-200 group-hover:scale-105" />
            <span className="text-[19px] font-semibold tracking-tight text-[#111215]">
              Verity <span className="font-normal text-slate-500">AI</span>
            </span>
          </a>

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button
              onClick={() => scrollTo('product')}
              className="text-[#111215] border-b-2 border-[#111215] py-5"
            >
              Product
            </button>
            <button
              onClick={() => scrollTo('how-it-works')}
              className="hover:text-[#111215] transition-colors py-5"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollTo('features')}
              className="hover:text-[#111215] transition-colors py-5"
            >
              Features
            </button>
            <button
              onClick={() => scrollTo('technology')}
              className="hover:text-[#111215] transition-colors py-5"
            >
              Technology
            </button>
            <button
              onClick={() => scrollTo('about')}
              className="hover:text-[#111215] transition-colors py-5"
            >
              About
            </button>
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setSignInOpen(true)}
              className="px-4 py-2 rounded-full text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => scrollTo('verity-studio')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#111215] hover:bg-slate-800 text-white text-sm font-medium transition-all shadow-xs"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            aria-label="Toggle Menu"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Antigravity-Style Top Announcement Bar (Video 01:07) */}
        {bannerVisible && (
          <div className="bg-[#F8FAFC] border-t border-slate-200/70 px-4 py-2 text-xs">
            <div className="max-w-[1320px] mx-auto flex items-center justify-between">
              <div className="flex-1 flex items-center justify-center gap-2.5 text-center">
                <span className="px-2 py-0.5 rounded bg-[#111215] text-white font-mono text-[10px] font-semibold tracking-wider">
                  + NEW
                </span>
                <span className="text-slate-700 font-medium">
                  Introducing Claim-Level NLI Verification & Interactive 3D Work Architecture
                </span>
                <button
                  onClick={() => scrollTo('how-it-works')}
                  className="inline-flex items-center gap-1 font-semibold text-[#111215] hover:underline"
                >
                  <span>Explore 3D Pipeline</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <button
                onClick={() => setBannerVisible(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
                aria-label="Dismiss announcement"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Mobile Nav Drawer */}
        {mobileNavOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-6 py-4 space-y-2">
            {[
              { label: 'Product', id: 'product' },
              { label: 'How It Works (2D & 3D)', id: 'how-it-works' },
              { label: 'Features', id: 'features' },
              { label: 'Technology', id: 'technology' },
              { label: 'About & FAQ', id: 'about' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="block w-full text-left py-2 text-sm font-medium text-slate-800"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      <main id="top">
        {/* ===================================================================
            SECTION 2 — ANTIGRAVITY HERO WITH TYPEWRITER + CONFETTI FIELD
            & OBSIDIAN SHOWCASE STAGE CONTAINING THE 3-PANE VERITY WORKSPACE
        =================================================================== */}
        <section id="product" className="relative pt-14 pb-20 overflow-hidden">
        {/* Interactive Confetti / Dash Particle Field (Video 01:13) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-75">
          <AntigravityConfettiCanvas />
        </div>

        <div className="max-w-[1320px] mx-auto px-6 relative z-10">
          {/* Hero Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-mono font-semibold tracking-wider uppercase mb-5 border border-slate-200">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>AI DOCUMENT INTELLIGENCE PLATFORM</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#111215] leading-[1.05] mb-6">
              {typedHero}
              <RainbowCaret heightClass="h-[0.8em]" />
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed mb-8 max-w-2xl mx-auto">
              Ask questions about your documents and get answers backed by real evidence. Verity AI checks every claim, detects unsupported information and repairs answers using your source documents.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
              <button
                onClick={() => scrollTo('verity-studio')}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#111215] hover:bg-slate-800 text-white font-medium text-sm transition-all shadow-md group"
              >
                <span>Explore Verity AI</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={() => scrollTo('how-it-works')}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 font-medium text-sm border border-slate-300 transition-all shadow-xs"
              >
                <span>See How It Works</span>
              </button>
            </div>

            <p className="text-xs text-slate-500 font-mono tracking-wide">
              Document-grounded answers · Claim-level verification · Transparent evidence
            </p>
          </div>

          {/* Hero Workspace Stage Toggle (Notebook 3-Pane vs Antigravity 3D Arch) */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-slate-200/70 p-1 rounded-full inline-flex">
              <button
                onClick={() => setHeroStageMode('workspace')}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  heroStageMode === 'workspace'
                    ? 'bg-white text-[#111215] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                NotebookLM Studio (3-Pane Workspace)
              </button>
              <button
                onClick={() => setHeroStageMode('intro3d')}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  heroStageMode === 'intro3d'
                    ? 'bg-[#111215] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Antigravity 3D Verification Core
              </button>
            </div>
          </div>

          {/* ===================================================================
              NOTEBOOK-AUTHENTIC WORKSPACE MOCKUP (Hero Centerpiece)
          =================================================================== */}
          <div
            id="verity-studio"
            className="rounded-[28px] bg-[#111215] p-3 sm:p-5 shadow-2xl border border-slate-800 relative"
          >
            {/* Top Workspace Header Bar */}
            <div className="flex items-center justify-between pb-4 px-3 border-b border-slate-800 text-slate-400 text-xs font-mono">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                </div>
                <span className="text-slate-300 font-medium ml-2">
                  Verity AI Workspace — Research_Workspace.vrt
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-4">
                <span className="inline-flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  NLI Engine Active
                </span>
                <span>FAISS Index: 134 chunks</span>
              </div>
            </div>

            {/* Toggle View: Workspace or 3D Antigravity Core */}
            {heroStageMode === 'intro3d' ? (
              <div className="w-full h-[520px] relative rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center">
                <AntigravityParticleArch3D />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800 text-white flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold mb-1">
                      Google Antigravity 3D Verification Core
                    </h4>
                    <p className="text-xs text-slate-400">
                      Interactive WebGL particle architecture reflecting real-time NLI claim classification.
                    </p>
                  </div>
                  <button
                    onClick={() => setHeroStageMode('workspace')}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors"
                  >
                    Open 3-Pane Studio
                  </button>
                </div>
              </div>
            ) : (
              /* 3-Pane NotebookLM Studio */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 pt-3">
                {/* LEFT PANE — SOURCES */}
                <div className="lg:col-span-3 rounded-2xl bg-slate-900 p-4 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
                        Sources ({docs.length})
                      </h3>
                      <button
                        onClick={handleUploadDoc}
                        disabled={isUploading}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isUploading ? 'Adding...' : 'Add PDF'}</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {docs.map((doc) => (
                        <div
                          key={doc.id}
                          onClick={() => setSelectedDoc(doc.name)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                            selectedDoc === doc.name
                              ? 'bg-slate-800 border-blue-500/50 text-white'
                              : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800/50'
                          }`}
                        >
                          <FileText className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">
                              {doc.name}
                            </p>
                            <p className="text-[10px] text-slate-500 font-mono">
                              {doc.pages} pages · {doc.chunks} chunks
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800">
                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400">
                      <p className="font-medium text-slate-300 mb-0.5">
                        Active Source Inspection
                      </p>
                      <p className="truncate text-slate-500">
                        Viewing: {selectedDoc}
                      </p>
                    </div>
                  </div>
                </div>

                {/* CENTER PANE — ASK YOUR DOCUMENTS & SYNTHESIS */}
                <div className="lg:col-span-5 rounded-2xl bg-slate-900 p-4 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
                        Ask Your Documents
                      </h3>
                      <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
                        <button
                          onClick={() => setAnswerView('original')}
                          className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                            answerView === 'original'
                              ? 'bg-slate-800 text-white'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          Raw LLM
                        </button>
                        <button
                          onClick={() => setAnswerView('repaired')}
                          className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                            answerView === 'repaired'
                              ? 'bg-emerald-600 text-white'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          Verity Repaired
                        </button>
                      </div>
                    </div>

                    {/* Question Box */}
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 mb-3 text-slate-200 text-xs font-medium">
                      Q: {activeQuestion}
                    </div>

                    {/* Answer Output with Citation Pills */}
                    <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 text-xs leading-relaxed space-y-3">
                      <p>
                        The system uses dense passage embeddings indexed in FAISS for semantic retrieval across segmented PDF pages <button onClick={() => setActiveClaimId('claim-1')} className="px-1 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px] hover:bg-blue-500/30"> [1] </button>.
                      </p>
                      <p>
                        {answerView === 'original' ? (
                          <span className="text-rose-400 bg-rose-500/10 px-1 py-0.5 rounded">
                            The system guarantees 100% accuracy across all multilingual corpora.
                          </span>
                        ) : (
                          <span className="text-emerald-400 bg-emerald-500/10 px-1 py-0.5 rounded">
                            The system remains bounded by retrieval recall and OCR quality rather than guaranteeing absolute accuracy <button onClick={() => setActiveClaimId('claim-2')} className="px-1 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] hover:bg-emerald-500/30"> [2] </button>.
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Prompt Bar */}
                  <div className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-2">
                    <input
                      type="text"
                      value={activeQuestion}
                      onChange={(e) => setActiveQuestion(e.target.value)}
                      placeholder="Ask anything about your uploaded documents..."
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={triggerVerifyScan}
                      disabled={isVerifying}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0"
                    >
                      {isVerifying ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5" />
                      )}
                      <span>{isVerifying ? 'Verifying...' : 'Verify'}</span>
                    </button>
                  </div>
                </div>

                {/* RIGHT PANE — CLAIM VERIFICATION CARDS & PASSAGE INSPECTOR */}
                <div className="lg:col-span-4 rounded-2xl bg-slate-900 p-4 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider mb-3">
                      Claim-Level Verification ({CLAIMS_DATA.length})
                    </h3>

                    <div className="space-y-2 mb-3">
                      {CLAIMS_DATA.map((claim) => (
                        <button
                          key={claim.id}
                          onClick={() => setActiveClaimId(claim.id)}
                          className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                            activeClaimId === claim.id
                              ? 'bg-slate-800 border-slate-600 text-white'
                              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-mono text-[10px] text-slate-300">
                              {claim.number}
                            </span>
                            <span className="text-xs truncate font-medium text-slate-200">
                              {claim.text}
                            </span>
                          </div>
                          <StatusPill status={claim.status} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Evidence Passage Preview Box */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs">
                    <div className="flex items-center justify-between mb-1.5 text-[10px] font-mono text-slate-400">
                      <span className="text-blue-400 font-semibold">
                        {activeClaim.sourceFile} · {activeClaim.page}
                      </span>
                      <span>{activeClaim.status}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 italic mb-2">
                      &ldquo;{activeClaim.quote}&rdquo;
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {activeClaim.note}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      </main>

      {/* ===================================================================
          SECTION 3 — PROBLEM STATEMENT (Exposed 3-Column Swiss Hairline Grid)
      =================================================================== */}
      <section id="problem" className="py-24 bg-[#F7F6F2] border-t border-[#E2DFD7]">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-3 block">
              01 / THE RELIABILITY DEFICIT
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#111215] mb-4">
              AI can generate answers. But can you trust them?
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              AI-generated answers can sound convincing even when some statements are incorrect, unsupported or missing from the source documents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {[
              {
                num: '01',
                title: 'Hallucinated Information',
                desc: 'AI may generate statements that sound authoritative but are completely unsupported by the source documents.',
                icon: AlertTriangle,
                badgeColor: 'text-amber-600 bg-amber-50 border-amber-200'
              },
              {
                num: '02',
                title: 'Hidden Errors',
                desc: 'A mostly correct answer can still contain individual incorrect claims or exaggerated performance guarantees.',
                icon: XCircle,
                badgeColor: 'text-rose-600 bg-rose-50 border-rose-200'
              },
              {
                num: '03',
                title: 'Missing Evidence',
                desc: 'Users often cannot easily verify where an answer came from, lacking exact page and line citations.',
                icon: FileText,
                badgeColor: 'text-blue-600 bg-blue-50 border-blue-200'
              }
            ].map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-8 border border-[#E2DFD7] shadow-xs flex flex-col justify-between transition-all hover:border-slate-400 group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-mono text-xs text-slate-400 font-semibold">
                        {item.num}
                      </span>
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold border ${item.badgeColor}`}>
                        Risk Factor
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-[#111215] mb-3 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Verity Safeguard</span>
                    <IconComp className="w-4 h-4 text-slate-700" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================================================
          SECTION 4 — HOW VERITY AI WORKS (Interactive 3D Pipeline & 2D Steps)
      =================================================================== */}
      <section id="how-it-works" className="py-24 bg-white border-t border-slate-200">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-3 block">
                02 / ARCHITECTURE & PIPELINE
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#111215]">
                From documents to verified answers.
              </h2>
            </div>
            {/* View Mode Switcher */}
            <div className="bg-slate-100 p-1.5 rounded-full inline-flex border border-slate-200">
              <button
                onClick={() => setArchViewMode('dual')}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  archViewMode === 'dual'
                    ? 'bg-[#111215] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Interactive 3D Pipeline
              </button>
              <button
                onClick={() => setArchViewMode('bezier2d')}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  archViewMode === 'bezier2d'
                    ? 'bg-[#111215] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                NotebookLM-Style Flow
              </button>
            </div>
          </div>

          {/* Interactive 3D Work Architecture Diagram */}
          {archViewMode === 'dual' ? (
            <div className="rounded-3xl bg-[#111215] p-4 sm:p-8 text-white mb-12 border border-slate-800 shadow-xl">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between pb-6 mb-6 border-b border-slate-800 gap-4">
                <div>
                  <span className="text-xs font-mono text-blue-400 font-semibold uppercase tracking-wider block mb-1">
                    Interactive 3D Pipeline Inspector
                  </span>
                  <h3 className="text-xl font-bold">
                    Click any stage or drag to orbit the 3D verification engine
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  {ARCHITECTURE_STAGES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setActiveArchStage(s.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                        activeArchStage === s.id
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {s.code}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3D Canvas Container */}
              <div className="w-full h-[400px] sm:h-[460px] rounded-2xl bg-slate-950 border border-slate-800 relative overflow-hidden mb-6">
                <Verity3DArchitectureDiagram
                  activeStage={activeArchStage}
                  onSelectStage={setActiveArchStage}
                />
                <div className="absolute top-4 left-4 pointer-events-none px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300">
                  WebGL 3D Engine · Drag to Orbit
                </div>
              </div>

              {/* Selected Stage Inspector Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
                <div>
                  <span className="text-xs font-mono text-blue-400 font-semibold">
                    {ARCHITECTURE_STAGES[activeArchStage].code}
                  </span>
                  <h4 className="text-lg font-bold text-white mt-1 mb-2">
                    {ARCHITECTURE_STAGES[activeArchStage].name}
                  </h4>
                  <p className="text-xs font-mono text-slate-400">
                    {ARCHITECTURE_STAGES[activeArchStage].tech}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-300 mb-1">
                    Pipeline Mechanics
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {ARCHITECTURE_STAGES[activeArchStage].summary}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px]">
                    <span className="text-slate-500 block font-mono mb-0.5">Input</span>
                    <span className="text-slate-200">{ARCHITECTURE_STAGES[activeArchStage].input}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px]">
                    <span className="text-slate-500 block font-mono mb-0.5">Output</span>
                    <span className="text-emerald-400 font-medium">{ARCHITECTURE_STAGES[activeArchStage].output}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* NotebookLM-Style Horizontal Flow Diagram (Video 00:02) */
            <div className="rounded-3xl bg-[#F7F6F2] p-6 sm:p-10 border border-[#E2DFD7] mb-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                {[
                  {
                    step: '01',
                    title: 'Upload Documents',
                    desc: 'Upload your PDF files and let Verity AI process their content.',
                    icon: Upload
                  },
                  {
                    step: '02',
                    title: 'Ask Questions',
                    desc: 'Ask natural-language questions and retrieve relevant information.',
                    icon: Search
                  },
                  {
                    step: '03',
                    title: 'Verify Every Claim',
                    desc: 'Each answer is broken into individual claims and checked against evidence.',
                    icon: ShieldCheck
                  },
                  {
                    step: '04',
                    title: 'Repair and Refine',
                    desc: 'Incorrect or unsupported claims are targeted for correction.',
                    icon: GitCompare
                  }
                ].map((s, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-6 border border-[#E2DFD7] relative flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-mono text-xs text-blue-600 font-bold bg-blue-50 px-2.5 py-1 rounded-md">
                          STEP {s.step}
                        </span>
                        <s.icon className="w-5 h-5 text-slate-700" />
                      </div>
                      <h3 className="text-lg font-bold text-[#111215] mb-2">
                        {s.title}
                      </h3>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===================================================================
          SECTION 5 — CORE FEATURES (Balanced 6-Cell Swiss Bento Grid)
      =================================================================== */}
      <section id="features" className="py-24 bg-[#F7F6F2] border-t border-[#E2DFD7]">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-3 block">
              03 / CAPABILITIES & ENGINE
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#111215] mb-4">
              Built for answers that stand up to scrutiny.
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Every feature in Verity AI is engineered around document-grounded evidence and transparent claim auditing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {[
              {
                title: 'Document Intelligence',
                desc: 'Upload and process PDF documents while maintaining page-level source information.',
                icon: FileText
              },
              {
                title: 'Evidence-Based Retrieval',
                desc: 'Find relevant document passages using high-precision semantic search.',
                icon: Search
              },
              {
                title: 'Claim-Level Verification',
                desc: 'Check individual statements instead of treating an entire answer as correct or incorrect.',
                icon: ShieldCheck
              },
              {
                title: 'Hallucination Detection',
                desc: 'Identify contradicted and unverifiable claims using evidence from the source.',
                icon: AlertTriangle
              },
              {
                title: 'Targeted Claim Repair',
                desc: 'Correct problematic claims using relevant source information.',
                icon: GitCompare
              },
              {
                title: 'Transparent Citations',
                desc: 'Trace answers back to their original document, section, and page number.',
                icon: BookOpen
              }
            ].map((feat, idx) => {
              const IconComp = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-8 border border-[#E2DFD7] shadow-xs flex flex-col justify-between transition-all hover:border-slate-400 group"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-[#111215] mb-6 group-hover:bg-[#111215] group-hover:text-white transition-colors">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-[#111215] mb-3">
                      {feat.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                  <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Verity Core</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#111215] transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================================================
          SECTION 6 — INTERACTIVE PRODUCT SHOWCASE (Before vs After Claim Repair)
      =================================================================== */}
      <section id="showcase" className="py-24 bg-white border-t border-slate-200">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-3 block">
              04 / INTERACTIVE COMPARISON
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#111215] mb-4">
              See what happens behind every answer.
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Compare a raw AI hallucinated answer against Verity AI&apos;s verified and repaired response.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Left: Original AI Answer */}
            <div className="rounded-3xl bg-[#F7F6F2] p-8 border border-[#E2DFD7] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-rose-100 text-rose-800">
                    Original AI Answer (Unchecked)
                  </span>
                  <XCircle className="w-5 h-5 text-rose-600" />
                </div>
                <div className="space-y-4 text-sm text-slate-700 leading-relaxed font-normal bg-white p-6 rounded-2xl border border-[#E2DFD7]">
                  <p>
                    <span className="bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded font-medium">
                      ✓ The system uses dense passage embeddings indexed in FAISS for semantic retrieval across documents.
                    </span>
                  </p>
                  <p>
                    <span className="bg-rose-100 text-rose-900 px-1.5 py-0.5 rounded font-medium">
                      ✗ The system guarantees 100% accuracy across all queries and multilingual datasets.
                    </span>
                  </p>
                  <p>
                    <span className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-medium">
                      ⚡ The platform supports instant real-time multi-user voice collaboration.
                    </span>
                  </p>
                </div>
              </div>
              <p className="mt-6 text-xs text-slate-500 font-mono">
                Notice the unverified claim and exaggerated accuracy claim presented as facts.
              </p>
            </div>

            {/* Right: Verified & Repaired Answer */}
            <div className="rounded-3xl bg-[#111215] p-8 text-white flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/20 text-emerald-300">
                    Verity AI Repaired & Verified Answer
                  </span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="space-y-4 text-sm text-slate-300 leading-relaxed bg-slate-900 p-6 rounded-2xl border border-slate-800">
                  <p>
                    The system uses dense passage embeddings indexed in FAISS for semantic retrieval <button className="px-1 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px]"> [1] p.6 </button>.
                  </p>
                  <p>
                    <span className="text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      The system remains bounded by retrieval recall and OCR quality rather than guaranteeing 100% accuracy <button className="px-1 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]"> [2] p.14 </button>.
                    </span>
                  </p>
                  <p className="text-slate-500 italic text-xs">
                    [Note: Real-time collaboration claim withheld as unverifiable in source PDFs].
                  </p>
                </div>
              </div>
              <p className="mt-6 text-xs text-slate-400 font-mono">
                Every claim is checked individually. Problematic claims are repaired, and unsupported claims are not presented as verified facts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          SECTION 7 — TECHNOLOGY (Practical Academic Pipeline & Stack)
      =================================================================== */}
      <section id="technology" className="py-24 bg-[#F7F6F2] border-t border-[#E2DFD7]">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-3 block">
              05 / TECH STACK & ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#111215] mb-4">
              A practical AI pipeline, built around evidence.
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Engineered with robust open-source foundations and rigorous NLI verification models.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { name: 'Python', role: 'Core Engine & Logic', icon: Code2 },
              { name: 'FastAPI', role: 'High-Performance API', icon: Server },
              { name: 'PostgreSQL', role: 'Document & Chunk Storage', icon: Database },
              { name: 'Ollama', role: 'Local Model Runtime', icon: Cpu },
              { name: 'Qwen', role: 'LLM Synthesis & Reasoning', icon: Sparkles },
              { name: 'FAISS', role: 'Dense Vector Indexing', icon: Search },
              { name: 'Embeddings', role: 'Semantic Representation', icon: Layers },
              { name: 'Natural Language Inference', role: 'Claim Classification (NLI)', icon: ShieldCheck }
            ].map((tech, idx) => {
              const IconComp = tech.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-[#E2DFD7] flex flex-col justify-between hover:border-slate-400 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs text-slate-400 font-semibold">
                      0{idx + 1}
                    </span>
                    <IconComp className="w-5 h-5 text-slate-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#111215] mb-1">
                      {tech.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">
                      {tech.role}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================================================
          SECTION 8 — FAQ & ACCORDION
      =================================================================== */}
      <section id="about" className="py-24 bg-white border-t border-slate-200">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-3 block">
                06 / FREQUENTLY ASKED QUESTIONS
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111215] mb-4">
                Everything you need to know about Verity AI.
              </h2>
              <p className="text-slate-600 text-base mb-6">
                Have questions about our evidence-grounded approach or academic implementation? Explore our FAQ or reach out to our team.
              </p>
              <button
                onClick={() => scrollTo('verity-studio')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#111215] text-white text-sm font-medium hover:bg-slate-800 transition-colors"
              >
                <span>Try the Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="lg:col-span-7 space-y-4">
              {FAQ_ITEMS.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-[#F7F6F2] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                    className="w-full p-6 text-left font-semibold text-[#111215] flex items-center justify-between gap-4"
                  >
                    <span className="text-base">{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-500 transition-transform ${
                        openFaq === idx ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openFaq === idx && (
                    <div className="px-6 pb-6 text-slate-600 text-sm leading-relaxed border-t border-slate-200/60 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          SECTION 9 — FINAL CALL TO ACTION & FOOTER
      =================================================================== */}
      <section className="py-24 bg-[#111215] text-white relative overflow-hidden">
        <div className="max-w-[1320px] mx-auto px-6 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
              Make every answer accountable to its evidence.
            </h2>
            <p className="text-slate-400 text-lg mb-10">
              Explore a smarter way to work with documents, verify information and build confidence in AI-generated answers.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => scrollTo('verity-studio')}
                className="px-8 py-4 rounded-full bg-white text-[#111215] font-semibold text-sm hover:bg-slate-100 transition-colors shadow-lg"
              >
                Get Started
              </button>
              <button
                onClick={() => scrollTo('technology')}
                className="px-8 py-4 rounded-full bg-slate-900 text-white font-semibold text-sm border border-slate-800 hover:bg-slate-800 transition-colors"
              >
                Explore the Technology
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-16">
        <div className="max-w-[1320px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <VerityArchLogo className="w-6 h-6" />
              <span className="text-lg font-semibold tracking-tight text-[#111215]">
                Verity AI
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Evidence-grounded AI document question-answering platform with claim-level verification and automatic repair.
            </p>
            <p className="text-[11px] text-slate-400 font-mono">
              Built for answers backed by evidence.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-900 mb-4">
              Product
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <button onClick={() => scrollTo('product')} className="hover:text-[#111215]">
                  Overview
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('features')} className="hover:text-[#111215]">
                  Features
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('how-it-works')} className="hover:text-[#111215]">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('showcase')} className="hover:text-[#111215]">
                  Claim Repair
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-900 mb-4">
              Technology
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <button onClick={() => scrollTo('technology')} className="hover:text-[#111215]">
                  Pipeline Stack
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('technology')} className="hover:text-[#111215]">
                  FAISS & Embeddings
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('technology')} className="hover:text-[#111215]">
                  NLI Verification
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('about')} className="hover:text-[#111215]">
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-900 mb-4">
              Legal & Contact
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <a href="#privacy" className="hover:text-[#111215]">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-[#111215]">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#111215]">
                  Contact Research Team
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-[1320px] mx-auto px-6 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Verity AI. All rights reserved.</p>
          <p className="font-mono mt-2 sm:mt-0">
            Designed with NotebookLM & Google Antigravity inspiration.
          </p>
        </div>
      </footer>

      {/* Sign In Modal */}
      {signInOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setSignInOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5 mb-6">
              <VerityArchLogo className="w-7 h-7" />
              <span className="text-xl font-bold text-[#111215]">
                Sign in to Verity AI
              </span>
            </div>
            <p className="text-slate-600 text-xs mb-6">
              Access your document workspaces, saved citations, and NLI verification logs.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-600 mb-1.5">
                  Work Email
                </label>
                <input
                  type="email5"
                  placeholder="name@organization.edu"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#111215]"
                />
              </div>
              <button
                onClick={() => setSignInOpen(false)}
                className="w-full py-3.5 rounded-xl bg-[#111215] text-white font-medium text-sm hover:bg-slate-800 transition-colors"
              >
                Continue with Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}