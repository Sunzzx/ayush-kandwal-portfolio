// Real Deep Space Void Canvas (Pure Monochrome Astrophotography)
// Zero artificial blue tint. Pure #000000 obsidian void, microscopic starlight.

(function() {
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
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initStars();
  }

  function initStars() {
    stars = [];
    const count = Math.floor((width * height) / 3600);
    for (let i = 0; i < count; i++) {
      const mag = Math.random();
      const radius = mag > 0.985 ? 1.2 : (mag > 0.9 ? 0.8 : (mag > 0.7 ? 0.5 : 0.35));
      const opacity = mag > 0.9 ? 0.6 + Math.random() * 0.4 : 0.15 + Math.random() * 0.35;

      stars.push({
        baseX: Math.random() * width,
        baseY: Math.random() * height,
        radius: radius,
        baseOpacity: opacity,
        twinkleSpeed: 0.004 + Math.random() * 0.012,
        twinklePhase: Math.random() * Math.PI * 2,
        layer: 0.8 + Math.random() * 1.8,
        hasCross: mag > 0.988 // Only rare brightest stars have subtle cross diffraction
      });
    }
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    mouse.targetX = (e.clientX - width / 2) * 0.015;
    mouse.targetY = (e.clientY - height / 2) * 0.015;
  });

  function draw() {
    // Pure absolute pitch black void
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // Subtle monochrome deep field vignette
    const grad = ctx.createRadialGradient(width * 0.5, height * 0.4, 100, width * 0.5, height * 0.5, width * 0.8);
    grad.addColorStop(0, 'rgba(12, 12, 14, 0.4)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    mouse.x += (mouse.targetX - mouse.x) * 0.04;
    mouse.y += (mouse.targetY - mouse.y) * 0.04;

    const time = Date.now();

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const curX = s.baseX + mouse.x * s.layer;
      const curY = s.baseY + mouse.y * s.layer;

      const currentOpacity = s.baseOpacity + Math.sin(time * s.twinkleSpeed + s.twinklePhase) * 0.15;
      const alpha = Math.max(0.1, Math.min(1, currentOpacity));

      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(curX, curY, s.radius, 0, Math.PI * 2);
      ctx.fill();

      // Delicate 4-point cross diffraction spike on rare bright stars
      if (s.hasCross && alpha > 0.6) {
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.4})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(curX - 6, curY);
        ctx.lineTo(curX + 6, curY);
        ctx.moveTo(curX, curY - 6);
        ctx.lineTo(curX, curY + 6);
        ctx.stroke();
      }
    }

    requestAnimationFrame(draw);
  }

  resize();
  draw();
})();
