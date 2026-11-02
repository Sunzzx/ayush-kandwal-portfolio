// Authentic Deep Space Astronomical Canvas
// Real astrophotography aesthetic: subtle starfield, deep void, real magnitude falloff

(function() {
  const canvas = document.createElement('canvas');
  canvas.id = 'astronomical-canvas';
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
    const count = Math.floor((width * height) / 3200); // realistic star density
    for (let i = 0; i < count; i++) {
      const mag = Math.random();
      // Most stars are tiny and faint, very few are bright
      const radius = mag > 0.98 ? 1.4 : (mag > 0.9 ? 1.0 : (mag > 0.7 ? 0.7 : 0.45));
      const opacity = mag > 0.9 ? 0.7 + Math.random() * 0.3 : 0.2 + Math.random() * 0.4;
      
      // Subtle natural spectral tint: blue-white, pure white, soft gold
      const tint = Math.random();
      const color = tint > 0.7 ? 'rgba(215, 230, 255, ' : (tint > 0.5 ? 'rgba(255, 245, 225, ' : 'rgba(255, 255, 255, ');

      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseX: Math.random() * width,
        baseY: Math.random() * height,
        radius: radius,
        color: color,
        baseOpacity: opacity,
        twinkleSpeed: 0.005 + Math.random() * 0.015,
        twinklePhase: Math.random() * Math.PI * 2,
        layer: 1 + Math.random() * 3, // depth layer for parallax
        hasSpikes: mag > 0.985 // Only the brightest stars have subtle telescope diffraction spikes
      });
    }
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    mouse.targetX = (e.clientX - width / 2) * 0.02;
    mouse.targetY = (e.clientY - height / 2) * 0.02;
  });

  function draw() {
    // Pitch black void
    ctx.fillStyle = '#030306';
    ctx.fillRect(0, 0, width, height);

    // Subtle cosmic dust / deep field nebula gradient
    const grad1 = ctx.createRadialGradient(width * 0.7, height * 0.3, 50, width * 0.7, height * 0.3, width * 0.6);
    grad1.addColorStop(0, 'rgba(15, 20, 38, 0.25)');
    grad1.addColorStop(1, 'rgba(3, 3, 6, 0)');
    ctx.fillStyle = grad1;
    ctx.fillRect(0, 0, width, height);

    const grad2 = ctx.createRadialGradient(width * 0.2, height * 0.8, 40, width * 0.2, height * 0.8, width * 0.5);
    grad2.addColorStop(0, 'rgba(25, 15, 35, 0.18)');
    grad2.addColorStop(1, 'rgba(3, 3, 6, 0)');
    ctx.fillStyle = grad2;
    ctx.fillRect(0, 0, width, height);

    // Smooth mouse parallax
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    const time = Date.now();

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const curX = s.baseX + mouse.x * s.layer;
      const curY = s.baseY + mouse.y * s.layer;

      // Twinkle calculation
      const currentOpacity = s.baseOpacity + Math.sin(time * s.twinkleSpeed + s.twinklePhase) * 0.15;
      const alpha = Math.max(0.1, Math.min(1, currentOpacity));

      ctx.fillStyle = s.color + alpha + ')';
      ctx.beginPath();
      ctx.arc(curX, curY, s.radius, 0, Math.PI * 2);
      ctx.fill();

      // Subtle 4-point telescope cross diffraction spikes on brightest stars
      if (s.hasSpikes && alpha > 0.7) {
        ctx.strokeStyle = 'rgba(240, 245, 255, ' + (alpha * 0.35) + ')';
        ctx.lineWidth = 0.5;
        
        ctx.beginPath();
        // Horizontal spike
        ctx.moveTo(curX - 7, curY);
        ctx.lineTo(curX + 7, curY);
        // Vertical spike
        ctx.moveTo(curX, curY - 7);
        ctx.lineTo(curX, curY + 7);
        ctx.stroke();
      }
    }

    requestAnimationFrame(draw);
  }

  resize();
  draw();
})();
