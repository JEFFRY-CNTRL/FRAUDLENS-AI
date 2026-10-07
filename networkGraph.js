/**
 * FraudLens AI - Interactive Force-Directed Network Graph Engine
 * High-DPI Canvas & SVG renderer with physics, zoom, pan, filters, and entity inspection
 */

window.FraudLensNetworkGraph = (function () {
  let canvas = null;
  let ctx = null;
  let nodes = [];
  let links = [];
  let animFrameId = null;

  // Viewport transforms
  let scale = 1.0;
  let panX = 0;
  let panY = 0;
  let isDragging = false;
  let dragNode = null;
  let lastMouseX = 0;
  let lastMouseY = 0;
  let hoveredNode = null;
  let selectedNode = null;
  let filterType = "ALL"; // ALL, FR-07, ACCOUNTS, DEVICES, DESTINATIONS
  let onNodeSelectCallback = null;

  // Visual type styling
  const typeColors = {
    Account: { bg: "#0284c7", border: "#38bdf8", icon: "👤" },
    Device: { bg: "#7c3aed", border: "#a78bfa", icon: "📱" },
    Merchant: { bg: "#059669", border: "#34d399", icon: "🏬" },
    Destination: { bg: "#dc2626", border: "#f87171", icon: "🏦" },
    Location: { bg: "#db2777", border: "#f472b6", icon: "📍" },
    Transaction: { bg: "#d97706", border: "#fbbf24", icon: "⚡" }
  };

  const riskColors = {
    Critical: "#ef4444",
    High: "#f97316",
    Medium: "#eab308",
    Safe: "#10b981"
  };

  function init(canvasElement, onSelectCallback) {
    canvas = canvasElement;
    ctx = canvas.getContext("2d");
    onNodeSelectCallback = onSelectCallback;

    setupData();
    setupCanvasResolution();
    attachEventListeners();
    centerGraph();
    startPhysicsLoop();
  }

  function setupCanvasResolution() {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
  }

  function setupData() {
    const rawData = window.FraudLensData.networkData;
    const width = canvas ? canvas.getBoundingClientRect().width : 900;
    const height = canvas ? canvas.getBoundingClientRect().height : 600;

    // Deep clone nodes and assign initial positions with cluster biasing
    nodes = rawData.nodes.map((n, i) => {
      let initX = width / 2 + (Math.random() - 0.5) * 450;
      let initY = height / 2 + (Math.random() - 0.5) * 350;

      // Group Ring FR-07 closer together
      if (n.ring === "FR-07") {
        initX = width / 2 - 80 + (Math.random() - 0.5) * 300;
        initY = height / 2 - 30 + (Math.random() - 0.5) * 260;
        if (n.type === "Destination") {
          initX = width / 2 - 20;
          initY = height / 2 + 110;
        }
      } else if (n.id.includes("8831") || n.id.includes("DEV-21") || n.id.includes("FoodHub")) {
        // Safe cluster on right
        initX = width / 2 + 320 + (Math.random() - 0.5) * 140;
        initY = height / 2 - 120 + (Math.random() - 0.5) * 140;
      } else if (n.id.includes("9014") || n.id.includes("CORP")) {
        // Enterprise cluster on bottom right
        initX = width / 2 + 280 + (Math.random() - 0.5) * 140;
        initY = height / 2 + 140 + (Math.random() - 0.5) * 140;
      }

      return {
        ...n,
        x: initX,
        y: initY,
        vx: 0,
        vy: 0,
        radius: n.type === "Destination" ? 22 : (n.risk === "Critical" ? 18 : 15),
        fixed: false
      };
    });

    // Resolve node links
    links = rawData.links.map(l => {
      const sourceNode = nodes.find(n => n.id === l.source);
      const targetNode = nodes.find(n => n.id === l.target);
      return {
        ...l,
        sourceNode,
        targetNode
      };
    }).filter(l => l.sourceNode && l.targetNode);
  }

  function attachEventListeners() {
    if (!canvas) return;

    window.addEventListener("resize", () => {
      setupCanvasResolution();
    });

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });

    // Touch support for mobile/tablets
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
  }

  function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
    const mouseX = (clientX - rect.left - panX) / scale;
    const mouseY = (clientY - rect.top - panY) / scale;
    return { mouseX, mouseY, clientX, clientY };
  }

  function findNodeUnder(x, y) {
    const activeNodes = getFilteredNodes();
    for (let i = activeNodes.length - 1; i >= 0; i--) {
      const n = activeNodes[i];
      const dx = n.x - x;
      const dy = n.y - y;
      if (Math.sqrt(dx * dx + dy * dy) <= n.radius + 6) {
        return n;
      }
    }
    return null;
  }

  function onMouseDown(e) {
    const { mouseX, mouseY, clientX, clientY } = getMousePos(e);
    const hitNode = findNodeUnder(mouseX, mouseY);

    if (hitNode) {
      dragNode = hitNode;
      dragNode.fixed = true;
      selectNode(hitNode);
    } else {
      isDragging = true;
      lastMouseX = clientX;
      lastMouseY = clientY;
    }
  }

  function onMouseMove(e) {
    const { mouseX, mouseY, clientX, clientY } = getMousePos(e);

    if (dragNode) {
      dragNode.x = mouseX;
      dragNode.y = mouseY;
      dragNode.vx = 0;
      dragNode.vy = 0;
    } else if (isDragging) {
      panX += clientX - lastMouseX;
      panY += clientY - lastMouseY;
      lastMouseX = clientX;
      lastMouseY = clientY;
    } else {
      hoveredNode = findNodeUnder(mouseX, mouseY);
      if (canvas) {
        canvas.style.cursor = hoveredNode ? "pointer" : "grab";
      }
    }
  }

  function onMouseUp() {
    if (dragNode) {
      dragNode.fixed = false;
      dragNode = null;
    }
    isDragging = false;
  }

  function onTouchStart(e) {
    e.preventDefault();
    if (e.touches.length === 1) {
      onMouseDown(e);
    }
  }

  function onTouchMove(e) {
    e.preventDefault();
    if (e.touches.length === 1) {
      onMouseMove(e);
    }
  }

  function onTouchEnd() {
    onMouseUp();
  }

  function onWheel(e) {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const newScale = Math.min(2.8, Math.max(0.4, scale * zoomFactor));

    // Zoom toward cursor position
    panX = mouseX - (mouseX - panX) * (newScale / scale);
    panY = mouseY - (mouseY - panY) * (newScale / scale);
    scale = newScale;
  }

  function selectNode(node) {
    selectedNode = node;
    if (onNodeSelectCallback && node) {
      // Gather connected nodes and links for evidence
      const connectedLinks = links.filter(l => l.sourceNode.id === node.id || l.targetNode.id === node.id);
      const connectedEntities = connectedLinks.map(l => {
        const partner = l.sourceNode.id === node.id ? l.targetNode : l.sourceNode;
        return {
          id: partner.id,
          label: partner.label,
          type: partner.type,
          risk: partner.risk,
          score: partner.score,
          linkType: l.type
        };
      });

      onNodeSelectCallback({
        node: node,
        connectionsCount: connectedEntities.length,
        connections: connectedEntities
      });
    }
  }

  function getFilteredNodes() {
    if (filterType === "ALL") return nodes;
    if (filterType === "FR-07") return nodes.filter(n => n.ring === "FR-07");
    if (filterType === "ACCOUNTS") return nodes.filter(n => n.type === "Account");
    if (filterType === "DEVICES") return nodes.filter(n => n.type === "Device");
    if (filterType === "DESTINATIONS") return nodes.filter(n => n.type === "Destination");
    return nodes;
  }

  function getFilteredLinks() {
    const activeNodes = new Set(getFilteredNodes().map(n => n.id));
    return links.filter(l => activeNodes.has(l.sourceNode.id) && activeNodes.has(l.targetNode.id));
  }

  function setFilter(type) {
    filterType = type;
  }

  function centerGraph() {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    scale = 1.0;
    panX = 0;
    panY = 0;
  }

  function focusRingCluster() {
    filterType = "FR-07";
    const ringNodes = nodes.filter(n => n.ring === "FR-07");
    if (ringNodes.length === 0) return;

    let avgX = ringNodes.reduce((acc, n) => acc + n.x, 0) / ringNodes.length;
    let avgY = ringNodes.reduce((acc, n) => acc + n.y, 0) / ringNodes.length;

    const rect = canvas.getBoundingClientRect();
    scale = 1.25;
    panX = rect.width / 2 - avgX * scale;
    panY = rect.height / 2 - avgY * scale;

    const coreNode = nodes.find(n => n.id === "ACC-2041") || ringNodes[0];
    selectNode(coreNode);
  }

  function focusNodeById(id) {
    const n = nodes.find(node => node.id.toLowerCase() === id.toLowerCase() || node.label.toLowerCase().includes(id.toLowerCase()));
    if (n) {
      const rect = canvas.getBoundingClientRect();
      scale = 1.35;
      panX = rect.width / 2 - n.x * scale;
      panY = rect.height / 2 - n.y * scale;
      selectNode(n);
      return true;
    }
    return false;
  }

  // Lightweight force simulation step
  function updatePhysics() {
    const activeNodes = getFilteredNodes();
    const activeLinks = getFilteredLinks();

    // 1. Repulsion between all active nodes
    for (let i = 0; i < activeNodes.length; i++) {
      for (let j = i + 1; j < activeNodes.length; j++) {
        const a = activeNodes[i];
        const b = activeNodes[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;

        if (dist < 260) {
          const force = (260 - dist) / dist * 0.42;
          if (!a.fixed) {
            a.vx -= dx * force * 0.05;
            a.vy -= dy * force * 0.05;
          }
          if (!b.fixed) {
            b.vx += dx * force * 0.05;
            b.vy += dy * force * 0.05;
          }
        }
      }
    }

    // 2. Spring attraction along links
    for (let l of activeLinks) {
      const a = l.sourceNode;
      const b = l.targetNode;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const desiredDist = l.type === "SHARED_DEVICE" ? 75 : (l.type === "MULE_EXTRACTION" ? 110 : 90);
      const delta = (dist - desiredDist) * 0.025;

      if (!a.fixed) {
        a.vx += dx * delta * 0.05;
        a.vy += dy * delta * 0.05;
      }
      if (!b.fixed) {
        b.vx -= dx * delta * 0.05;
        b.vy -= dy * delta * 0.05;
      }
    }

    // 3. Subtle center gravity
    const rect = canvas ? canvas.getBoundingClientRect() : { width: 900, height: 600 };
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    for (let n of activeNodes) {
      if (!n.fixed) {
        n.vx += (cx - n.x) * 0.0006;
        n.vy += (cy - n.y) * 0.0006;

        n.x += n.vx;
        n.y += n.vy;

        // Damping
        n.vx *= 0.88;
        n.vy *= 0.88;
      }
    }
  }

  function render() {
    if (!ctx || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    ctx.save();
    ctx.translate(panX, panY);
    ctx.scale(scale, scale);

    const activeNodes = getFilteredNodes();
    const activeLinks = getFilteredLinks();
    const activeNodeIds = new Set(activeNodes.map(n => n.id));

    // Determine highlighted connections if a node is hovered or selected
    const activeFocusNode = hoveredNode || selectedNode;
    let focusedNeighborIds = new Set();
    if (activeFocusNode) {
      focusedNeighborIds.add(activeFocusNode.id);
      activeLinks.forEach(l => {
        if (l.sourceNode.id === activeFocusNode.id) focusedNeighborIds.add(l.targetNode.id);
        if (l.targetNode.id === activeFocusNode.id) focusedNeighborIds.add(l.sourceNode.id);
      });
    }

    // 1. Draw Links
    for (let l of activeLinks) {
      const isHighlighted = activeFocusNode && (l.sourceNode.id === activeFocusNode.id || l.targetNode.id === activeFocusNode.id);
      const isMuleLink = l.type === "MULE_EXTRACTION" || l.type === "DIRECT_MULE_TRANSFER";

      ctx.beginPath();
      ctx.moveTo(l.sourceNode.x, l.sourceNode.y);
      ctx.lineTo(l.targetNode.x, l.targetNode.y);

      if (isHighlighted) {
        ctx.strokeStyle = isMuleLink ? "#ef4444" : "#38bdf8";
        ctx.lineWidth = 2.8;
      } else if (isMuleLink) {
        ctx.strokeStyle = "rgba(239, 68, 68, 0.45)";
        ctx.lineWidth = 2.0;
      } else if (l.type === "SHARED_DEVICE") {
        ctx.strokeStyle = "rgba(167, 139, 250, 0.35)";
        ctx.lineWidth = 1.6;
      } else {
        ctx.strokeStyle = "rgba(56, 189, 248, 0.18)";
        ctx.lineWidth = 1.2;
      }

      ctx.stroke();

      // Flow direction arrow for money transfers
      if (isMuleLink || l.type === "FUND_TRANSFER") {
        const mx = (l.sourceNode.x + l.targetNode.x) / 2;
        const my = (l.sourceNode.y + l.targetNode.y) / 2;
        ctx.save();
        ctx.fillStyle = isMuleLink ? "#ef4444" : "#38bdf8";
        ctx.beginPath();
        ctx.arc(mx, my, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // 2. Draw Nodes
    for (let n of activeNodes) {
      const isFocus = activeFocusNode && n.id === activeFocusNode.id;
      const isNeighbor = focusedNeighborIds.has(n.id);
      const isDimmed = activeFocusNode && !isNeighbor;

      ctx.save();
      if (isDimmed) {
        ctx.globalAlpha = 0.3;
      }

      const riskColor = riskColors[n.risk] || "#38bdf8";
      const typeStyle = typeColors[n.type] || typeColors.Account;

      // Glow effect for Critical and Selected nodes
      if (n.risk === "Critical" || isFocus) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius + (isFocus ? 10 : 6), 0, Math.PI * 2);
        ctx.fillStyle = isFocus ? "rgba(56, 189, 248, 0.25)" : "rgba(239, 68, 68, 0.2)";
        ctx.fill();
      }

      // Main Node Shape
      if (n.type === "Destination") {
        // Diamond for Mule / Destination
        const r = n.radius + 3;
        ctx.beginPath();
        ctx.moveTo(n.x, n.y - r);
        ctx.lineTo(n.x + r, n.y);
        ctx.lineTo(n.x, n.y + r);
        ctx.lineTo(n.x - r, n.y);
        ctx.closePath();
        ctx.fillStyle = "#991b1b";
        ctx.fill();
        ctx.lineWidth = isFocus ? 3.5 : 2;
        ctx.strokeStyle = "#f87171";
        ctx.stroke();
      } else if (n.type === "Device") {
        // Rounded Square for Devices
        const size = n.radius * 1.8;
        ctx.beginPath();
        ctx.roundRect(n.x - size / 2, n.y - size / 2, size, size, 5);
        ctx.fillStyle = "#4c1d95";
        ctx.fill();
        ctx.lineWidth = isFocus ? 3 : 1.8;
        ctx.strokeStyle = n.risk === "Critical" ? "#ef4444" : "#a78bfa";
        ctx.stroke();
      } else {
        // Circle for Accounts and others
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = n.risk === "Critical" ? "#7f1d1d" : (n.risk === "Safe" ? "#064e3b" : "#1e293b");
        ctx.fill();
        ctx.lineWidth = isFocus ? 3.5 : (n.risk === "Critical" ? 2.5 : 1.8);
        ctx.strokeStyle = riskColor;
        ctx.stroke();
      }

      // Risk score mini badge on top
      if (n.score >= 80) {
        ctx.beginPath();
        ctx.arc(n.x + n.radius * 0.7, n.y - n.radius * 0.7, 7, 0, Math.PI * 2);
        ctx.fillStyle = "#ef4444";
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 8px system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("!", n.x + n.radius * 0.7, n.y - n.radius * 0.7);
      }

      // Label below node
      ctx.fillStyle = isFocus ? "#38bdf8" : (n.risk === "Critical" ? "#fca5a5" : "#e2e8f0");
      ctx.font = (isFocus ? "bold 11px" : "10px") + " system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(n.label, n.x, n.y + n.radius + 5);

      ctx.restore();
    }

    ctx.restore();
  }

  function startPhysicsLoop() {
    function loop() {
      updatePhysics();
      render();
      animFrameId = requestAnimationFrame(loop);
    }
    loop();
  }

  function stop() {
    if (animFrameId) cancelAnimationFrame(animFrameId);
  }

  return {
    init,
    setFilter,
    centerGraph,
    focusRingCluster,
    focusNodeById,
    selectNode,
    stop,
    getSelectedNode: () => selectedNode
  };
})();
