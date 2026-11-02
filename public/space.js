// DEEP SPACE SYSTEMS OBSERVATORY — ADVANCED CELESTIAL BACKDROP ENGINE (v4.0)
// High-fidelity deep space canvas with realistic spectral starfield, spiral galaxy,
// volumetric interstellar nebulae, and occasional meteor streaks.
// Designed for astronomical accuracy, zero layout shift, and 60 FPS performance.

(function() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.id = 'space-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.zIndex = '-1';
  canvas.style.pointerEvents = 'none';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let width, height;
  let stars = [];
  let meteors = [];
  let nebulae = [];
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let isTabActive = true;
  let prefersReducedMotion = false;

  // Check reduced motion preference
  if (window.matchMedia) {
    prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // Handle visibility to save battery / GPU
  document.addEventListener('visibilitychange', () => {
    isTabActive = !document.hidden;
  });

  // Astronomical Spectral Color Classes (O, B, A, F, G, K, M)
  const SPECTRAL_COLORS = [
    { color: '225, 235, 255', weight: 0.10 }, // O/B: Hot Blue-White
    { color: '245, 248, 255', weight: 0.50 }, // A/F: Pure White
    { color: '255, 248, 220', weight: 0.25 }, // G: Yellow-White (Solar)
    { color: '255, 220, 180', weight: 0.10 }, // K: Orange
    { color: '255, 180, 160', weight: 0.05 }  // M: Red Dwarf
  ];

  function getSpectralColor() {
    const r = Math.random();
    let acc = 0;
    for (let i = 0; i < SPECTRAL_COLORS.length; i++) {
      acc += SPECTRAL_COLORS[i].weight;
      if (r <= acc) return SPECTRAL_COLORS[i].color;
    }
    return '255, 255, 255';
  }

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initNebulae();
    initStars();
  }

  // Initialize Layered Interstellar Nebulae Clouds
  function initNebulae() {
    nebulae = [
      {
        x: width * 0.82,
        y: height * 0.25,
        radius: Math.max(width, height) * 0.38,
        colorStart: 'rgba(38, 20, 56, 0.22)',   // Emission Nebula: Deep Amethyst / Ionized Gas
        colorMid: 'rgba(16, 24, 48, 0.12)',     // Reflection: Deep Cobalt
        colorEnd: 'rgba(0, 0, 0, 0)',
        rotation: 0.35,
        parallax: 0.008
      },
      {
        x: width * 0.15,
        y: height * 0.78,
        radius: Math.max(width, height) * 0.42,
        colorStart: 'rgba(12, 32, 44, 0.18)',   // Dark Reflection Dust Cloud
        colorMid: 'rgba(20, 18, 36, 0.10)',
        colorEnd: 'rgba(0, 0, 0, 0)',
        rotation: -0.2,
        parallax: 0.012
      },
      {
        x: width * 0.55,
        y: height * 0.50,
        radius: Math.max(width, height) * 0.28,
        colorStart: 'rgba(28, 16, 32, 0.14)',   // Core Galactic Bulge Haze
        colorMid: 'rgba(10, 14, 24, 0.06)',
        colorEnd: 'rgba(0, 0, 0, 0)',
        rotation: 0.8,
        parallax: 0.005
      }
    ];
  }

  // Multi-tier Starfield Generation with Parallax & Dense Milky-Way Strip
  function initStars() {
    stars = [];
    // Density calculation: ~1 star per 2800px on desktop
    const count = Math.min(1400, Math.floor((width * height) / 2800));

    for (let i = 0; i < count; i++) {
      const mag = Math.random();
      // Radius distribution following stellar luminosity function
      const radius = mag > 0.99 ? 1.4 : (mag > 0.95 ? 1.0 : (mag > 0.8 ? 0.65 : 0.4));
      const baseOpacity = mag > 0.95 ? 0.65 + Math.random() * 0.35 : 0.15 + Math.random() * 0.4;
      const rgb = getSpectralColor();

      // Density bias toward a subtle diagonal galactic plane
      let x = Math.random() * width;
      let y = Math.random() * height;
      if (Math.random() < 0.35) {
        // Bias toward diagonal galactic dust band (y = 0.6*x + noise)
        y = (x * (height / width) * 0.8) + (Math.random() - 0.5) * (height * 0.45);
        if (y < 0) y += height;
        if (y > height) y -= height;
      }

      stars.push({
        baseX: x,
        baseY: y,
        radius: radius,
        baseOpacity: baseOpacity,
        rgb: rgb,
        twinkleSpeed: 0.003 + Math.random() * 0.008,
        twinklePhase: Math.random() * Math.PI * 2,
        layer: 0.5 + Math.random() * 1.8, // Depth parallax layer
        hasDiffraction: mag > 0.985       // Prominent stars have delicate diffraction spikes
      });
    }
  }

  // Distant Spiral Galaxy Pre-Render Offscreen Canvas
  let galaxyCanvas = null;
  function renderOffscreenGalaxy() {
    const size = 320;
    galaxyCanvas = document.createElement('canvas');
    galaxyCanvas.width = size;
    galaxyCanvas.height = size;
    const gctx = galaxyCanvas.getContext('2d');
    const cx = size / 2;
    const cy = size / 2;

    // Glowing core bulge
    const coreGrad = gctx.createRadialGradient(cx, cy, 0, cx, cy, 35);
    coreGrad.addColorStop(0, 'rgba(255, 255, 245, 0.85)');
    coreGrad.addColorStop(0.2, 'rgba(255, 240, 210, 0.5)');
    coreGrad.addColorStop(0.6, 'rgba(200, 180, 220, 0.15)');
    coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    gctx.fillStyle = coreGrad;
    gctx.beginPath();
    gctx.arc(cx, cy, 35, 0, Math.PI * 2);
    gctx.fill();

    // 2-Arm Logarithmic Spiral Particles
    const arms = 2;
    const particles = 1600;
    for (let i = 0; i < particles; i++) {
      const arm = i % arms;
      const angleOffset = (arm * Math.PI * 2) / arms;
      const dist = Math.pow(Math.random(), 1.4) * 110 + 6;
      const angle = angleOffset + dist * 0.055 + (Math.random() - 0.5) * 0.45;

      const px = cx + Math.cos(angle) * dist * 1.3;
      const py = cy + Math.sin(angle) * dist * 0.65; // Tilted aspect
      const pAlpha = (1 - dist / 120) * (0.2 + Math.random() * 0.6);
      const pRad = Math.random() > 0.9 ? 1.0 : 0.5;

      gctx.fillStyle = dist < 45
        ? `rgba(255, 240, 215, ${pAlpha * 0.7})`
        : `rgba(180, 210, 255, ${pAlpha * 0.5})`;
      gctx.beginPath();
      gctx.arc(px, py, pRad, 0, Math.PI * 2);
      gctx.fill();
    }
  }

  // Shooting Star / Meteor Trigger
  function maybeSpawnMeteor() {
    if (prefersReducedMotion) return;
    if (meteors.length < 2 && Math.random() < 0.004) {
      const startX = Math.random() * (width * 0.8) + (width * 0.1);
      const startY = Math.random() * (height * 0.35);
      const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.3; // ~45 deg descent
      const speed = 14 + Math.random() * 12;
      const length = 70 + Math.random() * 90;

      meteors.push({
        x: startX,
        y: startY,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        length: length,
        life: 0,
        maxLife: 24 + Math.random() * 18,
        color: Math.random() > 0.4 ? '255, 255, 255' : '180, 230, 255'
      });
    }
  }

  // Mouse Parallax Damping
  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    mouse.targetX = (e.clientX - width / 2) * 0.012;
    mouse.targetY = (e.clientY - height / 2) * 0.012;
  });

  // Main Render Loop
  function draw() {
    if (!isTabActive) {
      setTimeout(() => requestAnimationFrame(draw), 200);
      return;
    }

    // Pure pitch void: #000000
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // Smooth mouse interpolation
    mouse.x += (mouse.targetX - mouse.x) * 0.04;
    mouse.y += (mouse.targetY - mouse.y) * 0.04;

    const time = Date.now();

    // 1. Draw Volumetric Interstellar Nebulae Dust
    for (let i = 0; i < nebulae.length; i++) {
      const neb = nebulae[i];
      const nx = neb.x + mouse.x * neb.parallax * width;
      const ny = neb.y + mouse.y * neb.parallax * height;

      ctx.save();
      ctx.translate(nx, ny);
      ctx.rotate(neb.rotation);
      ctx.scale(1.4, 0.75); // Elliptical cosmic dispersion

      const grad = ctx.createRadialGradient(0, 0, neb.radius * 0.05, 0, 0, neb.radius);
      grad.addColorStop(0, neb.colorStart);
      grad.addColorStop(0.5, neb.colorMid);
      grad.addColorStop(1, neb.colorEnd);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, neb.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 2. Draw Distant Spiral Galaxy
    if (galaxyCanvas) {
      const gx = width * 0.75 + mouse.x * 0.8;
      const gy = height * 0.22 + mouse.y * 0.8;
      ctx.save();
      ctx.globalAlpha = 0.45;
      ctx.drawImage(galaxyCanvas, gx - 160, gy - 160);
      ctx.restore();
    }

    // 3. Draw Multi-Layer Spectral Starfield
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const curX = s.baseX + mouse.x * s.layer;
      const curY = s.baseY + mouse.y * s.layer;

      // Wrap boundary safely to avoid cutoffs
      let drawX = (curX % width + width) % width;
      let drawY = (curY % height + height) % height;

      const currentOpacity = s.baseOpacity + Math.sin(time * s.twinkleSpeed + s.twinklePhase) * 0.12;
      const alpha = Math.max(0.1, Math.min(1, currentOpacity));

      ctx.fillStyle = `rgba(${s.rgb}, ${alpha})`;
      ctx.beginPath();
      ctx.arc(drawX, drawY, s.radius, 0, Math.PI * 2);
      ctx.fill();

      // Delicate 4-point cross diffraction spike on prominent high-magnitude stars
      if (s.hasDiffraction && alpha > 0.6) {
        ctx.strokeStyle = `rgba(${s.rgb}, ${alpha * 0.35})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(drawX - 7, drawY);
        ctx.lineTo(drawX + 7, drawY);
        ctx.moveTo(drawX, drawY - 7);
        ctx.lineTo(drawX, drawY + 7);
        ctx.stroke();
      }
    }

    // 4. Draw Shooting Stars / Meteors
    maybeSpawnMeteor();
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      m.x += m.dx;
      m.y += m.dy;
      m.life++;

      const progress = m.life / m.maxLife;
      const alpha = Math.sin(progress * Math.PI) * 0.85;

      const tailX = m.x - (m.dx / Math.hypot(m.dx, m.dy)) * m.length;
      const tailY = m.y - (m.dy / Math.hypot(m.dx, m.dy)) * m.length;

      const mGrad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
      mGrad.addColorStop(0, `rgba(${m.color}, 0)`);
      mGrad.addColorStop(1, `rgba(${m.color}, ${alpha})`);

      ctx.strokeStyle = mGrad;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(m.x, m.y);
      ctx.stroke();

      if (m.life >= m.maxLife) {
        meteors.splice(i, 1);
      }
    }

    requestAnimationFrame(draw);
  }

  resize();
  renderOffscreenGalaxy();
  draw();
})();
