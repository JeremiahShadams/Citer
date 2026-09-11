"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

export type CodeNode = {
  id: string;
  name: string;
  type: "function" | "class" | "file" | "service" | "api" | "database";
  path: string;
  references: number;
  callers: number;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  cluster: string;
  color: number;
  size: number;
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
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [srAnnouncement, setSrAnnouncement] = useState<string>("");
  const [fpsReadout, setFpsReadout] = useState<number>(60);
  const [performanceTier, setPerformanceTier] = useState<"high" | "medium" | "eco">("high");

  const activeNodesRef = useRef<CodeNode[]>([]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const nodes = activeNodesRef.current;
    if (!nodes || nodes.length === 0) return;

    let newIndex = focusedIndex;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      newIndex = (focusedIndex + 1) % nodes.length;
      e.preventDefault();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      newIndex = (focusedIndex - 1 + nodes.length) % nodes.length;
      e.preventDefault();
    } else {
      return;
    }

    setFocusedIndex(newIndex);
    const target = nodes[newIndex];
    setSrAnnouncement(
      `Focused AST entity: ${target.name} (${target.type}) in ${target.path}. ${target.references} references, ${target.callers} callers.`
    );
  }, [focusedIndex]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer & Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x08090a, 0.0016);

    const camera = new THREE.PerspectiveCamera(
      52,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 22, 115);

    // Lagos Hardware Optimization: Initial DPR bounded to max 1.5 to protect mid-tier GPUs
    let currentDpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(currentDpr);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x08090a, 0);
    container.appendChild(renderer.domElement);

    // 2. Architectural Clusters & AST Node Generation
    const clusters = [
      { name: "Auth", center: new THREE.Vector3(-36, 12, -8), color: 0x5e6ad2 },
      { name: "Services", center: new THREE.Vector3(0, 6, 0), color: 0x7170ff },
      { name: "Session", center: new THREE.Vector3(32, 14, -14), color: 0x8b5cf6 },
      { name: "API", center: new THREE.Vector3(0, 32, -22), color: 0x06b6d4 },
      { name: "Database", center: new THREE.Vector3(0, -26, -6), color: 0x10b981 },
      { name: "Billing", center: new THREE.Vector3(38, -12, 8), color: 0xf59e0b },
    ];

    const keyEntities = [
      { name: "AuthService", type: "service", path: "src/services/auth.ts", refs: 47, callers: 12, cluster: "Auth", size: 3.2 },
      { name: "validateToken()", type: "function", path: "src/auth/token.ts", refs: 29, callers: 18, cluster: "Auth", size: 2.2 },
      { name: "middleware()", type: "function", path: "src/middleware.ts", refs: 38, callers: 22, cluster: "Auth", size: 2.6 },
      { name: "createSession()", type: "function", path: "src/lib/session.ts", refs: 24, callers: 14, cluster: "Session", size: 2.0 },
      { name: "SessionStore", type: "class", path: "src/db/session_store.ts", refs: 31, callers: 8, cluster: "Session", size: 2.5 },
      { name: "UserService", type: "service", path: "src/services/user.ts", refs: 63, callers: 34, cluster: "Services", size: 3.4 },
      { name: "POST /api/login", type: "api", path: "src/routes/auth.ts", refs: 15, callers: 5, cluster: "API", size: 2.2 },
      { name: "POST /api/query", type: "api", path: "src/routes/query.ts", refs: 42, callers: 19, cluster: "API", size: 2.4 },
      { name: "VectorRepository", type: "class", path: "src/db/vector.ts", refs: 52, callers: 27, cluster: "Database", size: 3.0 },
      { name: "PostgresPool", type: "database", path: "src/db/pool.ts", refs: 88, callers: 45, cluster: "Database", size: 3.8 },
      { name: "BillingManager", type: "class", path: "src/billing/invoice.ts", refs: 19, callers: 7, cluster: "Billing", size: 2.3 },
      { name: "HNSWIndex", type: "class", path: "src/db/hnsw.ts", refs: 36, callers: 16, cluster: "Database", size: 2.8 },
    ] as const;

    const nodes: CodeNode[] = [];
    const nodePositions: THREE.Vector3[] = [];

    // Instantiate Key Architectural Nodes
    keyEntities.forEach((entity, i) => {
      const cluster = clusters.find((c) => c.name === entity.cluster) || clusters[0];
      const offset = new THREE.Vector3(
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 14
      );
      const pos = cluster.center.clone().add(offset);
      const nodeObj: CodeNode = {
        id: `node-${i}`,
        name: entity.name,
        type: entity.type,
        path: entity.path,
        references: entity.refs,
        callers: entity.callers,
        position: pos,
        velocity: new THREE.Vector3(0, 0, 0),
        cluster: entity.cluster,
        color: cluster.color,
        size: entity.size,
      };
      nodes.push(nodeObj);
      nodePositions.push(pos);
    });

    // Generate 550 Background Satellite AST Chunks
    const satelliteCount = 550;
    const colorsArr: number[] = [];
    nodes.forEach((n) => {
      const c = new THREE.Color(n.color);
      colorsArr.push(c.r, c.g, c.b);
    });

    for (let i = 0; i < satelliteCount; i++) {
      const cluster = clusters[i % clusters.length];
      const radius = 8 + Math.random() * 26;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const pos = new THREE.Vector3(
        cluster.center.x + radius * Math.sin(phi) * Math.cos(theta),
        cluster.center.y + radius * Math.sin(phi) * Math.sin(theta),
        cluster.center.z + radius * Math.cos(phi)
      );

      const satNode: CodeNode = {
        id: `sat-${i}`,
        name: `symbol_${i.toString(16)}()`,
        type: "function",
        path: `src/chunks/ast_${i}.ts`,
        references: Math.floor(Math.random() * 12),
        callers: Math.floor(Math.random() * 8),
        position: pos,
        velocity: new THREE.Vector3(0, 0, 0),
        cluster: cluster.name,
        color: cluster.color,
        size: 1.2,
      };
      nodes.push(satNode);
      nodePositions.push(pos);

      const c = new THREE.Color(cluster.color).multiplyScalar(0.45 + Math.random() * 0.4);
      colorsArr.push(c.r, c.g, c.b);
    }

    activeNodesRef.current = nodes;

    // 3. GPU Instanced Mesh for High-Priority Nodes
    const sphereGeometry = new THREE.SphereGeometry(1, 16, 16);
    const instancedMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.92,
    });
    const instancedMesh = new THREE.InstancedMesh(
      sphereGeometry,
      instancedMaterial,
      keyEntities.length
    );

    const dummy = new THREE.Object3D();
    for (let i = 0; i < keyEntities.length; i++) {
      dummy.position.copy(nodes[i].position);
      dummy.scale.setScalar(nodes[i].size * 0.65);
      dummy.updateMatrix();
      instancedMesh.setMatrixAt(i, dummy.matrix);
      instancedMesh.setColorAt(i, new THREE.Color(nodes[i].color));
    }
    instancedMesh.instanceMatrix.needsUpdate = true;
    if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;
    scene.add(instancedMesh);

    // 4. Points Cloud for Dense Satellite Chunks
    const pointsGeometry = new THREE.BufferGeometry();
    const positionsFloat = new Float32Array(nodePositions.length * 3);
    for (let i = 0; i < nodePositions.length; i++) {
      positionsFloat[i * 3] = nodePositions[i].x;
      positionsFloat[i * 3 + 1] = nodePositions[i].y;
      positionsFloat[i * 3 + 2] = nodePositions[i].z;
    }
    pointsGeometry.setAttribute("position", new THREE.BufferAttribute(positionsFloat, 3));
    pointsGeometry.setAttribute("color", new THREE.Float32BufferAttribute(colorsArr, 3));

    // Particle texture
    const pCanvas = document.createElement("canvas");
    pCanvas.width = 64;
    pCanvas.height = 64;
    const pCtx = pCanvas.getContext("2d")!;
    const pGrad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    pGrad.addColorStop(0, "rgba(255, 255, 255, 1)");
    pGrad.addColorStop(0.25, "rgba(113, 112, 255, 0.85)");
    pGrad.addColorStop(0.7, "rgba(94, 106, 210, 0.3)");
    pGrad.addColorStop(1, "rgba(8, 9, 10, 0)");
    pCtx.fillStyle = pGrad;
    pCtx.fillRect(0, 0, 64, 64);
    const particleTexture = new THREE.CanvasTexture(pCanvas);

    const pointsMaterial = new THREE.PointsMaterial({
      size: 2.2,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const pointsMesh = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(pointsMesh);

    // 5. Custom WebGL Line Shader: Animated Dashed Dependency Trails
    type Edge = { source: number; target: number; length: number };
    const edges: Edge[] = [];

    // Connect architectural entities
    for (let i = 0; i < keyEntities.length; i++) {
      for (let j = i + 1; j < keyEntities.length; j++) {
        const dist = nodePositions[i].distanceTo(nodePositions[j]);
        if (dist < 58) {
          edges.push({ source: i, target: j, length: dist });
        }
      }
    }
    // Connect nearby satellites
    for (let i = 0; i < 240; i++) {
      const a = Math.floor(Math.random() * (keyEntities.length + 180));
      const b = Math.floor(Math.random() * (keyEntities.length + 180));
      if (a !== b) {
        const d = nodePositions[a].distanceTo(nodePositions[b]);
        if (d < 24) edges.push({ source: a, target: b, length: d });
      }
    }

    const linePositions = new Float32Array(edges.length * 2 * 3);
    const lineDistances = new Float32Array(edges.length * 2);

    for (let i = 0; i < edges.length; i++) {
      const e = edges[i];
      const p1 = nodePositions[e.source];
      const p2 = nodePositions[e.target];

      linePositions[i * 6 + 0] = p1.x;
      linePositions[i * 6 + 1] = p1.y;
      linePositions[i * 6 + 2] = p1.z;

      linePositions[i * 6 + 3] = p2.x;
      linePositions[i * 6 + 4] = p2.y;
      linePositions[i * 6 + 5] = p2.z;

      lineDistances[i * 2 + 0] = 0.0;
      lineDistances[i * 2 + 1] = e.length;
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute("a_distance", new THREE.BufferAttribute(lineDistances, 1));

    const lineShaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        u_time: { value: 0.0 },
        u_color_base: { value: new THREE.Color(0x191a1b) },
        u_color_pulse: { value: new THREE.Color(0x7170ff) },
      },
      vertexShader: `
        attribute float a_distance;
        varying float v_distance;
        void main() {
          v_distance = a_distance;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float u_time;
        uniform vec3 u_color_base;
        uniform vec3 u_color_pulse;
        varying float v_distance;
        void main() {
          // Flowing execution pulse cycle
          float cycle = 45.0;
          float pulse = mod(v_distance - u_time * 24.0, cycle);
          float intensity = smoothstep(36.0, 43.0, pulse) * smoothstep(45.0, 43.0, pulse);
          vec3 finalColor = mix(u_color_base, u_color_pulse, intensity * 0.9);
          float alpha = mix(0.12, 0.95, intensity);
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const linesMesh = new THREE.LineSegments(lineGeometry, lineShaderMaterial);
    scene.add(linesMesh);

    // 6. Physics Simulation: 3D Force-Directed Relaxation Loop
    let alpha = 1.0;
    const alphaDecay = 0.015;
    const alphaMin = 0.001;
    const velocityDecay = 0.88;

    const stepPhysics = () => {
      if (alpha <= alphaMin) return false;

      // Center gravity
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.velocity.x -= n.position.x * 0.0006 * alpha;
        n.velocity.y -= n.position.y * 0.0006 * alpha;
        n.velocity.z -= n.position.z * 0.0006 * alpha;
      }

      // Spring link attraction for key edges
      for (let i = 0; i < edges.length; i++) {
        const e = edges[i];
        if (e.source >= keyEntities.length || e.target >= keyEntities.length) continue;
        const n1 = nodes[e.source];
        const n2 = nodes[e.target];

        const dx = n2.position.x - n1.position.x;
        const dy = n2.position.y - n1.position.y;
        const dz = n2.position.z - n1.position.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
        const targetLen = 22.0;
        const force = (dist - targetLen) * 0.012 * alpha;

        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        const fz = (dz / dist) * force;

        n1.velocity.x += fx;
        n1.velocity.y += fy;
        n1.velocity.z += fz;
        n2.velocity.x -= fx;
        n2.velocity.y -= fy;
        n2.velocity.z -= fz;
      }

      // Integrate position & apply velocity decay
      for (let i = 0; i < keyEntities.length; i++) {
        const n = nodes[i];
        n.velocity.multiplyScalar(velocityDecay);
        n.position.add(n.velocity);

        dummy.position.copy(n.position);
        dummy.scale.setScalar(n.size * 0.65);
        dummy.updateMatrix();
        instancedMesh.setMatrixAt(i, dummy.matrix);
      }
      instancedMesh.instanceMatrix.needsUpdate = true;

      alpha *= 1.0 - alphaDecay;
      return true;
    };

    // 7. Interaction, Raycasting & Telemetry
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let motionTimeout: NodeJS.Timeout | null = null;

    const raycaster = new THREE.Raycaster();
    raycaster.params.Points = { threshold: 3.2 };
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
        const intersects = raycaster.intersectObject(instancedMesh);
        if (intersects.length > 0 && intersects[0].instanceId !== undefined) {
          const idx = intersects[0].instanceId;
          if (idx < keyEntities.length) {
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

    // 8. Dynamic Performance Monitor (Lagos Profile) & Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();
    let frameCount = 0;
    let lastTime = performance.now();
    let isDegraded = false;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Lagos Hardware Optimization: Dynamic FPS calculation
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (now - lastTime));
        setFpsReadout(fps);
        frameCount = 0;
        lastTime = now;

        // Auto-Degradation trigger for mid-tier GPUs
        if (fps < 50 && !isDegraded) {
          isDegraded = true;
          currentDpr = 1.0;
          renderer.setPixelRatio(1.0);
          setPerformanceTier("eco");
        } else if (fps >= 58 && isDegraded) {
          isDegraded = false;
          currentDpr = Math.min(window.devicePixelRatio || 1, 1.5);
          renderer.setPixelRatio(currentDpr);
          setPerformanceTier("high");
        }
      }

      const elapsed = clock.getElapsedTime();

      // Step physics relaxation if not cooled
      stepPhysics();

      // Update shader pulse time
      lineShaderMaterial.uniforms.u_time.value = elapsed;

      // Slow orbital rotation
      instancedMesh.rotation.y = elapsed * 0.035;
      pointsMesh.rotation.y = elapsed * 0.035;
      linesMesh.rotation.y = elapsed * 0.035;

      // Mouse parallax easing
      targetX += (mouseX * 14 - targetX) * 0.05;
      targetY += (mouseY * 9 - targetY) * 0.05;

      // Bind scroll telemetry progression to camera altitude
      const scrollOffset = scrollProgress * 45;
      camera.position.x = targetX;
      camera.position.y = 22 + targetY - scrollOffset * 0.3;
      camera.position.z = 115 - scrollOffset;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handling & Strict GPU Garbage Collection
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
      if (motionTimeout) clearTimeout(motionTimeout);
      cancelAnimationFrame(animationFrameId);

      // Strict GPU Disposals (Prevents thermal throttling & memory leaks)
      renderer.dispose();
      sphereGeometry.dispose();
      instancedMaterial.dispose();
      pointsGeometry.dispose();
      pointsMaterial.dispose();
      lineGeometry.dispose();
      lineShaderMaterial.dispose();
      particleTexture.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [interactive, scrollProgress]);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-label="Interactive 3D Codebase Knowledge Graph. Use arrow keys to navigate entities."
      onKeyDown={handleKeyDown}
      className="relative h-full w-full overflow-hidden focus:outline-none focus:ring-1 focus:ring-brand-hover/40"
    >
      {/* Hidden ARIA Live Region for Screen Readers */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {srAnnouncement}
      </div>

      {/* Hardware Performance Telemetry Indicator (Lagos Profile) */}
      <div className="pointer-events-none absolute bottom-3 right-4 z-20 flex items-center gap-2 rounded-full border border-hairline bg-surface-1/70 px-2.5 py-1 font-mono text-[10px] text-zinc-400 backdrop-blur-md">
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            performanceTier === "high"
              ? "bg-emerald-400"
              : performanceTier === "medium"
              ? "bg-amber-400"
              : "bg-brand-primary"
          }`}
        />
        <span className="tabular-nums">{fpsReadout} FPS</span>
        <span className="text-zinc-600">&middot;</span>
        <span className="uppercase text-[9px] tracking-wider text-zinc-500">
          GPU {performanceTier}
        </span>
      </div>

      {/* HUD Tooltip for Hovered Node */}
      {hovered && (
        <div
          className="pointer-events-none absolute z-30 transform -translate-x-1/2 -translate-y-full rounded-md border border-hairline-bright bg-surface-2/95 px-3 py-2 text-xs shadow-2xl backdrop-blur-md transition-all duration-75"
          style={{ left: hovered.x, top: hovered.y - 12 }}
        >
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-primary animate-pulse" />
            <span className="font-mono font-semibold text-white">
              {hovered.node.name}
            </span>
            <span className="rounded bg-surface-3 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-brand-hover">
              {hovered.node.type}
            </span>
          </div>
          <div className="mt-1 font-mono text-[11px] text-zinc-400">
            {hovered.node.path}
          </div>
          <div className="mt-1.5 flex gap-3 border-t border-hairline pt-1 font-mono text-[10px] text-zinc-400">
            <span>
              <b className="text-zinc-200 tabular-nums">{hovered.node.references}</b> refs
            </span>
            <span>
              <b className="text-zinc-200 tabular-nums">{hovered.node.callers}</b> callers
            </span>
            <span className="text-brand-accent">Cluster: {hovered.node.cluster}</span>
          </div>
        </div>
      )}
    </div>
  );
}
