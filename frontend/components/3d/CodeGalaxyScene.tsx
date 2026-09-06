"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export type CodeNode = {
  id: string;
  name: string;
  type: "function" | "class" | "file" | "service" | "api" | "database";
  path: string;
  references: number;
  callers: number;
  position: THREE.Vector3;
  cluster: string;
};

type HoveredNodeInfo = {
  node: CodeNode;
  x: number;
  y: number;
} | null;

export default function CodeGalaxyScene({
  scrollProgress = 0,
  interactive = true,
}: {
  scrollProgress?: number;
  interactive?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<HoveredNodeInfo>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060608, 0.0018);

    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 20, 110);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x060608, 0);
    container.appendChild(renderer.domElement);

    // 2. Generate Realistic Code Graph Nodes
    const clusters = [
      { name: "Auth", center: new THREE.Vector3(-35, 12, -10), color: 0x3b82f6 },
      { name: "Services", center: new THREE.Vector3(0, 5, 0), color: 0x6366f1 },
      { name: "Session", center: new THREE.Vector3(30, 15, -15), color: 0x8b5cf6 },
      { name: "API", center: new THREE.Vector3(0, 30, -25), color: 0x06b6d4 },
      { name: "Database", center: new THREE.Vector3(0, -25, -5), color: 0x10b981 },
      { name: "Billing", center: new THREE.Vector3(40, -10, 10), color: 0xf59e0b },
    ];

    const sampleEntities = [
      { name: "AuthService", type: "service", path: "src/services/auth.ts", refs: 47, callers: 12, cluster: "Auth" },
      { name: "validateToken()", type: "function", path: "src/auth/token.ts", refs: 29, callers: 18, cluster: "Auth" },
      { name: "middleware()", type: "function", path: "src/middleware.ts", refs: 38, callers: 22, cluster: "Auth" },
      { name: "createSession()", type: "function", path: "src/lib/session.ts", refs: 24, callers: 14, cluster: "Session" },
      { name: "SessionStore", type: "class", path: "src/db/session_store.ts", refs: 31, callers: 8, cluster: "Session" },
      { name: "UserService", type: "service", path: "src/services/user.ts", refs: 63, callers: 34, cluster: "Services" },
      { name: "POST /api/login", type: "api", path: "src/routes/auth.ts", refs: 15, callers: 5, cluster: "API" },
      { name: "POST /api/query", type: "api", path: "src/routes/query.ts", refs: 42, callers: 19, cluster: "API" },
      { name: "VectorRepository", type: "class", path: "src/db/vector.ts", refs: 52, callers: 27, cluster: "Database" },
      { name: "PostgresConnection", type: "database", path: "src/db/pool.ts", refs: 88, callers: 45, cluster: "Database" },
      { name: "InvoiceManager", type: "class", path: "src/billing/invoice.ts", refs: 19, callers: 7, cluster: "Billing" },
    ] as const;

    const nodes: CodeNode[] = [];
    const nodePositions: THREE.Vector3[] = [];
    const colors: number[] = [];

    // Add key architectural nodes
    sampleEntities.forEach((entity, i) => {
      const cluster = clusters.find((c) => c.name === entity.cluster) || clusters[0];
      const offset = new THREE.Vector3(
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 14
      );
      const pos = cluster.center.clone().add(offset);
      nodes.push({
        id: `node-${i}`,
        name: entity.name,
        type: entity.type,
        path: entity.path,
        references: entity.refs,
        callers: entity.callers,
        position: pos,
        cluster: entity.cluster,
      });
      nodePositions.push(pos);
      const c = new THREE.Color(cluster.color);
      colors.push(c.r, c.g, c.b);
    });

    // Add satellite code points to represent 2,000 background functions/chunks
    const totalSatellites = 450;
    for (let i = 0; i < totalSatellites; i++) {
      const cluster = clusters[i % clusters.length];
      const radius = 10 + Math.random() * 25;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const pos = new THREE.Vector3(
        cluster.center.x + radius * Math.sin(phi) * Math.cos(theta),
        cluster.center.y + radius * Math.sin(phi) * Math.sin(theta),
        cluster.center.z + radius * Math.cos(phi)
      );

      nodes.push({
        id: `sat-${i}`,
        name: `chunk_${i.toString(16)}()`,
        type: "function",
        path: `src/generated/chunk_${i}.ts`,
        references: Math.floor(Math.random() * 12),
        callers: Math.floor(Math.random() * 8),
        position: pos,
        cluster: cluster.name,
      });
      nodePositions.push(pos);
      const c = new THREE.Color(cluster.color).multiplyScalar(0.4 + Math.random() * 0.4);
      colors.push(c.r, c.g, c.b);
    }

    // 3. Create Points Mesh
    const pointsGeometry = new THREE.BufferGeometry();
    const positionsFloat = new Float32Array(nodePositions.length * 3);
    for (let i = 0; i < nodePositions.length; i++) {
      positionsFloat[i * 3] = nodePositions[i].x;
      positionsFloat[i * 3 + 1] = nodePositions[i].y;
      positionsFloat[i * 3 + 2] = nodePositions[i].z;
    }
    pointsGeometry.setAttribute("position", new THREE.BufferAttribute(positionsFloat, 3));
    pointsGeometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    // Canvas particle texture
    const particleCanvas = document.createElement("canvas");
    particleCanvas.width = 64;
    particleCanvas.height = 64;
    const ctx = particleCanvas.getContext("2d")!;
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255, 255, 255, 1)");
    grad.addColorStop(0.3, "rgba(180, 210, 255, 0.8)");
    grad.addColorStop(1, "rgba(6, 6, 8, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const particleTexture = new THREE.CanvasTexture(particleCanvas);

    const pointsMaterial = new THREE.PointsMaterial({
      size: 2.2,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const pointsMesh = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(pointsMesh);

    // 4. Create Inter-Symbol Connections (Lines)
    const lineIndices: number[] = [];
    // Connect architectural entities
    for (let i = 0; i < sampleEntities.length; i++) {
      for (let j = i + 1; j < sampleEntities.length; j++) {
        const dist = nodePositions[i].distanceTo(nodePositions[j]);
        if (dist < 55) {
          lineIndices.push(i, j);
        }
      }
    }
    // Connect some nearby satellites
    for (let i = 0; i < 200; i++) {
      const a = Math.floor(Math.random() * (sampleEntities.length + 150));
      const b = Math.floor(Math.random() * (sampleEntities.length + 150));
      if (a !== b && nodePositions[a].distanceTo(nodePositions[b]) < 22) {
        lineIndices.push(a, b);
      }
    }

    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(lineIndices.length * 3);
    for (let i = 0; i < lineIndices.length; i++) {
      const idx = lineIndices[i];
      linePositions[i * 3] = nodePositions[idx].x;
      linePositions[i * 3 + 1] = nodePositions[idx].y;
      linePositions[i * 3 + 2] = nodePositions[idx].z;
    }
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(linesMesh);

    // 5. Interaction & Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const raycaster = new THREE.Raycaster();
    raycaster.params.Points = { threshold: 2.8 };
    const mouse = new THREE.Vector2(-1000, -1000);

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      mouseX = (x / rect.width) * 2 - 1;
      mouseY = -(y / rect.height) * 2 + 1;

      mouse.x = mouseX;
      mouse.y = mouseY;

      if (interactive) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(pointsMesh);
        if (intersects.length > 0) {
          const idx = intersects[0].index;
          if (idx !== undefined && idx < sampleEntities.length) {
            setHovered({
              node: nodes[idx],
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            });
            return;
          }
        }
        setHovered(null);
      }
    };

    const onMouseLeave = () => {
      setHovered(null);
      mouse.set(-1000, -1000);
    };

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);

    // 6. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Slow orbital rotation of code galaxy
      pointsMesh.rotation.y = elapsed * 0.04;
      linesMesh.rotation.y = elapsed * 0.04;

      // Mouse Parallax easing
      targetX += (mouseX * 12 - targetX) * 0.05;
      targetY += (mouseY * 8 - targetY) * 0.05;

      camera.position.x = targetX;
      camera.position.y = 20 + targetY;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // 7. Resize handling
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      pointsGeometry.dispose();
      pointsMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      particleTexture.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [interactive]);

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden">
      {/* HUD Tooltip for Hovered Node */}
      {hovered && (
        <div
          className="pointer-events-none absolute z-30 transform -translate-x-1/2 -translate-y-full rounded-md border border-hairline-bright bg-surface-2/95 px-3 py-2 text-xs shadow-2xl backdrop-blur-md transition-all duration-75"
          style={{ left: hovered.x, top: hovered.y - 12 }}
        >
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-blue" />
            <span className="font-mono font-semibold text-white">
              {hovered.node.name}
            </span>
            <span className="rounded bg-surface-3 px-1.5 py-0.2 font-mono text-[10px] uppercase text-zinc-400">
              {hovered.node.type}
            </span>
          </div>
          <div className="mt-1 font-mono text-[11px] text-zinc-400">
            {hovered.node.path}
          </div>
          <div className="mt-1.5 flex gap-3 border-t border-hairline pt-1 font-mono text-[10px] text-zinc-400">
            <span>
              <b className="text-zinc-200">{hovered.node.references}</b> refs
            </span>
            <span>
              <b className="text-zinc-200">{hovered.node.callers}</b> callers
            </span>
            <span className="text-brand-cyan">Cluster: {hovered.node.cluster}</span>
          </div>
        </div>
      )}
    </div>
  );
}
