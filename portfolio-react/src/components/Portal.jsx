import { useEffect, useRef, useState } from 'react';
import './Portal.css';

export default function Portal({ onSelectWorld }) {
  const [hoveredPanel, setHoveredPanel] = useState(null); // 'dev' | 'cin' | null
  const [activeMobileTap, setActiveMobileTap] = useState(null);

  const cvsDevRef = useRef(null);
  const cvsCinRef = useRef(null);

  // Dev Canvas Animation (Code tokens)
  useEffect(() => {
    const canvas = cvsDevRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const words = ['01', '{}', '()', '=>', 'const', 'let', 'async', 'fn', 'import', 'class', 'return', 'if', 'for', 'null', 'true', '</>'];
    let W = 0, H = 0;

    const resize = () => {
      if (!canvas) return;
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    class Token {
      constructor(randomY = false) {
        this.reset(randomY);
      }
      reset(randomY = false) {
        this.x = Math.random() * W;
        this.y = randomY ? Math.random() * H : -20;
        this.vy = 0.25 + Math.random() * 0.45;
        this.vx = (Math.random() - 0.5) * 0.15;
        this.op = 0;
        this.maxOp = 0.08 + Math.random() * 0.15;
        this.text = words[Math.floor(Math.random() * words.length)];
        this.size = 10 + Math.floor(Math.random() * 5);
        this.life = 0;
        this.maxLife = 220 + Math.random() * 300;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life++;

        if (this.life < 35) {
          this.op += this.maxOp / 35;
        } else if (this.life > this.maxLife - 50) {
          this.op -= this.maxOp / 50;
        }

        if (this.life > this.maxLife || this.y > H + 25) {
          this.reset();
        }
      }
      draw() {
        ctx.globalAlpha = Math.max(0, this.op);
        ctx.fillStyle = '#5effa0';
        ctx.font = `300 ${this.size}px "DM Mono", monospace`;
        ctx.fillText(this.text, this.x, this.y);
      }
    }

    const tokens = Array.from({ length: 22 }, () => new Token(true));

    const render = () => {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < tokens.length; i++) {
        tokens[i].update();
        tokens[i].draw();
      }
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Cinema Canvas Animation (Warm Bokeh & Dust)
  useEffect(() => {
    const canvas = cvsCinRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    let W = 0, H = 0;
    const resize = () => {
      if (!canvas) return;
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    class Orb {
      constructor(randomY = false) {
        this.reset(randomY);
      }
      reset(randomY = false) {
        this.x = Math.random() * W;
        this.y = randomY ? Math.random() * H : H + 60;
        this.rad = 20 + Math.random() * 70;
        this.vy = -(0.1 + Math.random() * 0.16);
        this.vx = (Math.random() - 0.5) * 0.08;
        this.op = 0;
        this.maxOp = 0.04 + Math.random() * 0.07;
        this.hue = 30 + Math.random() * 18;
        this.life = 0;
        this.maxLife = 400 + Math.random() * 500;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life++;
        if (this.life < 60) this.op += this.maxOp / 60;
        else if (this.life > this.maxLife - 80) this.op -= this.maxOp / 80;
        if (this.life > this.maxLife || this.y < -this.rad - 40) this.reset();
      }
      draw() {
        ctx.globalAlpha = Math.max(0, this.op);
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.rad);
        grad.addColorStop(0, `hsl(${this.hue}, 80%, 70%)`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.rad, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    class Dust {
      constructor(randomY = false) {
        this.reset(randomY);
      }
      reset(randomY = false) {
        this.x = Math.random() * W;
        this.y = randomY ? Math.random() * H : H + 5;
        this.rad = 0.8 + Math.random() * 1.5;
        this.vy = -(0.08 + Math.random() * 0.18);
        this.vx = (Math.random() - 0.5) * 0.06;
        this.op = 0;
        this.maxOp = 0.12 + Math.random() * 0.25;
        this.life = 0;
        this.maxLife = 260 + Math.random() * 380;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life++;
        if (this.life < 40) this.op += this.maxOp / 40;
        else if (this.life > this.maxLife - 50) this.op -= this.maxOp / 50;
        if (this.life > this.maxLife || this.y < -5) this.reset();
      }
      draw() {
        ctx.globalAlpha = Math.max(0, this.op);
        ctx.fillStyle = '#f5c97a';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.rad, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const orbs = Array.from({ length: 8 }, () => new Orb(true));
    const dusts = Array.from({ length: 30 }, () => new Dust(true));

    const render = () => {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < orbs.length; i++) {
        orbs[i].update();
        orbs[i].draw();
      }
      for (let i = 0; i < dusts.length; i++) {
        dusts[i].update();
        dusts[i].draw();
      }
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  const handleMobileTap = (panel) => {
    if (window.innerWidth > 768) return;
    setActiveMobileTap(prev => prev === panel ? null : panel);
  };

  const getStageClass = () => {
    let classes = ['stage'];
    if (hoveredPanel === 'dev') classes.push('hover-dev');
    if (hoveredPanel === 'cin') classes.push('hover-cin');
    if (activeMobileTap === 'dev') classes.push('tap-dev');
    if (activeMobileTap === 'cin') classes.push('tap-cin');
    return classes.join(' ');
  };

  return (
    <div className="portal-wrapper">
      <div className="veil" />

      <div className={getStageClass()}>
        {/* DEV PANEL (Left) */}
        <section
          className="panel panel-dev"
          onMouseEnter={() => setHoveredPanel('dev')}
          onMouseLeave={() => setHoveredPanel(null)}
          onClick={() => handleMobileTap('dev')}
          aria-label="Software Development Portfolio Portal"
        >
          <canvas ref={cvsDevRef} className="panel-canvas" />
          <div className="spotlight" />
          <div className="scan" />

          <div className="content">
            <span className="role-tag">Software Development</span>
            <h1 className="big-name">
              Sub<em>ash</em>
            </h1>
            <p className="descriptor">Full-Stack · Systems · Problem Solver</p>
            <button
              className="enter-btn interactive"
              onClick={(e) => {
                e.stopPropagation();
                onSelectWorld('dev');
              }}
            >
              Enter <span className="arrow">→</span>
            </button>
          </div>

          <div className="float-tag">{'{ build · create · ship }'}</div>
        </section>

        {/* CENTER SPLIT DIVIDER */}
        <div className="divider" aria-hidden="true">
          <div className="div-line" />
          <div className="div-badge">
            <div className="div-letter">S</div>
            <div className="div-sub">choose your world</div>
          </div>
          <div className="div-line" />
        </div>

        {/* CINEMA PANEL (Right) */}
        <section
          className="panel panel-cin"
          onMouseEnter={() => setHoveredPanel('cin')}
          onMouseLeave={() => setHoveredPanel(null)}
          onClick={() => handleMobileTap('cin')}
          aria-label="Cinema & Photography Portfolio Portal"
        >
          <canvas ref={cvsCinRef} className="panel-canvas" />
          <div className="spotlight" />
          <div className="scan" />

          <div className="content">
            <span className="role-tag">Cinema &amp; Photography</span>
            <h2 className="big-name">
              Sub<em>ash</em>
            </h2>
            <p className="descriptor">Frames · Light · Storytelling</p>
            <button
              className="enter-btn interactive"
              onClick={(e) => {
                e.stopPropagation();
                onSelectWorld('media');
              }}
            >
              Enter <span className="arrow">→</span>
            </button>
          </div>

          <div className="float-tag">[ frame · expose · tell ]</div>
        </section>
      </div>
    </div>
  );
}
