import { useEffect, useRef, useState } from 'react';
import './DevWorld.css';

export default function DevWorld({ onBackToPortal, onSwitchToMedia }) {
  const [typedText, setTypedText] = useState('');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef(null);

  // Typing effect
  useEffect(() => {
    const phrases = [
      'Building scalable systems.',
      'Architecting the future.',
      'Writing code that endures.',
      'Turning ideas into reality.'
    ];

    let pIndex = 0;
    let cIndex = 0;
    let isDeleting = false;
    let timer;

    const tick = () => {
      const currentPhrase = phrases[pIndex];

      if (!isDeleting) {
        cIndex++;
        setTypedText(currentPhrase.slice(0, cIndex));
        if (cIndex === currentPhrase.length) {
          isDeleting = true;
          timer = setTimeout(tick, 2000);
          return;
        }
      } else {
        cIndex--;
        setTypedText(currentPhrase.slice(0, cIndex));
        if (cIndex === 0) {
          isDeleting = false;
          pIndex = (pIndex + 1) % phrases.length;
          timer = setTimeout(tick, 400);
          return;
        }
      }

      timer = setTimeout(tick, isDeleting ? 35 : 75);
    };

    tick();
    return () => clearTimeout(timer);
  }, []);

  // Optimized Constellation Network Canvas (Zero-lag)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    let W = 0, H = 0;
    let particles = [];

    const resize = () => {
      if (!canvas) return;
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      // Dynamic count capped for smooth 60-120 FPS
      const count = Math.min(65, Math.floor((W * H) / 22000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          size: Math.random() * 1.5 + 0.5,
          alpha: Math.random() * 0.5 + 0.15,
          color: Math.random() < 0.6 ? '0,255,245' : Math.random() < 0.5 ? '255,0,110' : '184,0,255'
        });
      }
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    const maxDistSq = 100 * 100; // avoid Math.sqrt for ultra-smooth rendering

    const render = () => {
      ctx.clearRect(0, 0, W, H);

      const len = particles.length;
      for (let i = 0; i < len; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = W;
        else if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        else if (p.y > H) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
        ctx.fill();

        // Connect near particles
        for (let j = i + 1; j < len; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const alpha = 0.07 * (1 - distSq / maxDistSq);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0,255,245,${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('subashgopi2006@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const projects = [
    {
      num: '01',
      tag: '// FULL STACK · SAAS',
      title: 'GREENSTACK AI',
      desc: 'Intelligent sustainability platform that analyzes codebases to evaluate environmental impact including estimated CO₂ emissions, runtime energy draw, and CPU cycle optimization.',
      tech: ['RUST', 'CLICKHOUSE', 'REACT', 'KAFKA'],
      link: 'https://github.com/Subash-G-S/GreenStack'
    },
    {
      num: '02',
      tag: '// BACKEND · ARCHITECTURE',
      title: 'AHAAR AMRITA',
      desc: 'Peer-to-peer campus canteen delivery network where students seamlessly switch between buyers and runners, enabling real-time decentralized order fulfillment.',
      tech: ['NODE.JS', 'REDIS', 'JWT', 'NGINX'],
      link: 'https://github.com/Subash-G-S/Ahaar_amrita'
    },
    {
      num: '03',
      tag: '// ML & FINANCIAL ANALYTICS',
      title: 'FINTRACK',
      desc: 'Responsive expense intelligence application with real-time financial updates, offline PWA synchronization, intuitive data categorization, and cross-platform dashboard.',
      tech: ['PYTHON', 'PYTORCH', 'FASTAPI', 'REACT'],
      link: 'https://github.com/Subash-G-S/Fintrack-Expense_Tracker'
    },
    {
      num: '04',
      tag: '// AI SYSTEMS · RAG',
      title: 'SMART NOTES APP',
      desc: 'Knowledge document Q&A engine enabling high-speed semantic search across PDFs and text using OpenAI embeddings, chunking pipelines, and Pinecone vector indexing.',
      tech: ['K8S', 'TERRAFORM', 'GO', 'AWS'],
      link: 'https://github.com/Subash-G-S/smart-notes-app'
    },
    {
      num: '05',
      tag: '// FRONTEND · WEBGL',
      title: 'TEAM MEDIA',
      desc: 'Interactive 3D data visualization suite. Renders 100K+ complex topological data points in real time at 60fps utilizing custom WebGL shaders and smooth orbital camera controls.',
      tech: ['THREE.JS', 'WEBGL', 'GLSL', 'D3'],
      link: 'https://github.com/Subash-G-S/teammedia'
    },
    {
      num: '06',
      tag: '// WEB PLATFORM',
      title: 'GEMANA',
      desc: 'Freelancer review and qualitative feedback analysis platform empowering developers and designers to benchmark performance, track client satisfaction, and refine workflows.',
      tech: ['REACT', 'EXPRESS.JS', 'SUPABASE', 'TAILWIND'],
      link: 'https://github.com/Subash-G-S'
    }
  ];

  const scrollToSection = (e, id) => {
    if (e && e.preventDefault) e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const navOffset = 75;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - navOffset,
        behavior: 'smooth'
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="dev-world-container">
      {/* Background Cyber Grid & Scanline */}
      <div className="dev-scanlines" />
      <div className="dev-grid-bg" />
      <canvas ref={canvasRef} className="dev-particles-canvas" />

      {/* Cyberpunk Navigation */}
      <nav className="dev-nav">
        <div className="dev-nav-brand interactive" onClick={scrollToTop}>
          SUBASH<span>.</span>G.S <span className="dev-nav-sub">// DEV</span>
        </div>

        <div className="dev-nav-links">
          <a href="#about" className="interactive" onClick={(e) => scrollToSection(e, 'about')}>ABOUT</a>
          <a href="#projects" className="interactive" onClick={(e) => scrollToSection(e, 'projects')}>PROJECTS</a>
          <a href="#skills" className="interactive" onClick={(e) => scrollToSection(e, 'skills')}>SKILLS</a>
          <a href="#contact" className="interactive" onClick={(e) => scrollToSection(e, 'contact')}>CONTACT</a>
        </div>

        <div className="dev-nav-actions">
          <div className="dev-status">
            <span className="dev-status-pulse" />
            AVAILABLE FOR HIRE
          </div>
          <button className="dev-world-switch-btn interactive" onClick={onSwitchToMedia} title="Switch to Cinema World">
            <span>CINEMA WORLD</span> 🎬
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section id="hero" className="dev-hero">
        <div className="dev-hero-bg-text" aria-hidden="true">
          SUBASH
        </div>
        <div className="dev-hero-content">
          <div className="dev-hero-tag">// FULL STACK ENGINEER — EST. 2024</div>
          <h1 className="dev-hero-title">
            <span className="dev-hero-glitch" data-text="SUBASH G S">SUBASH G S</span>
            <span className="dev-hero-role-title">SYSTEM ARCHITECT</span>
          </h1>

          <div className="dev-hero-typed">
            <span className="typed-text">{typedText}</span>
            <span className="typed-cursor">_</span>
          </div>

          <p className="dev-hero-desc">
            Building systems that live at the edge of what's possible. I architect digital realities from raw code — fast, secure, scalable, and relentlessly refined.
          </p>

          <div className="dev-hero-ctas">
            <a href="#projects" className="dev-btn dev-btn-primary interactive">
              VIEW PROJECTS →
            </a>
            <a href="#contact" className="dev-btn dev-btn-secondary interactive">
              INITIALIZE CONTACT
            </a>
            <button className="dev-btn dev-btn-portal interactive" onClick={onBackToPortal}>
              SWITCH WORLDS ⇄
            </button>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="dev-section">
        <div className="dev-section-header">
          <span className="dev-section-tag">// 01 — ABOUT THE OPERATOR</span>
          <h2 className="dev-section-title">SYSTEM PROFILE</h2>
          <div className="dev-section-line" />
        </div>

        <div className="dev-about-grid">
          <div className="dev-about-visual">
            <div className="dev-about-frame">
              <div className="corner corner-tl" />
              <div className="corner corner-tr" />
              <div className="corner corner-bl" />
              <div className="corner corner-br" />
              <div className="dev-avatar-ring">
                <div className="dev-avatar-inner">GS</div>
              </div>
            </div>
          </div>

          <div className="dev-about-text">
            <h3>WHO AM I?</h3>
            <p>
              A Full Stack Engineer obsessed with the intersection of performance, systems reliability, and modern aesthetics. I build APIs that scale seamlessly, craft UIs that feel alive, and design resilient cloud architectures.
            </p>
            <p>
              I've built end-to-end applications spanning distributed systems, AI embeddings, and WebGL rendering. My stack runs deep — from clean frontend components to containerized backend microservices.
            </p>

            <div className="dev-skills-pills">
              {['REACT', 'NODE.JS', 'PYTHON', 'REST API', 'AWS', 'POSTGRES', 'DOCKER', 'K8S', 'GRAPHQL', 'REDIS', 'NEXT.JS', 'TENSORFLOW'].map((s) => (
                <span key={s} className="dev-skill-pill interactive">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section id="projects" className="dev-section">
        <div className="dev-section-header">
          <span className="dev-section-tag">// 02 — DEPLOYED SYSTEMS</span>
          <h2 className="dev-section-title">PROJECT DATABASE</h2>
          <div className="dev-section-line" />
        </div>

        <div className="dev-projects-grid">
          {projects.map((proj) => (
            <div key={proj.num} className="dev-project-card interactive">
              <div className="dev-project-num">{proj.num}</div>
              <div className="dev-project-tag">{proj.tag}</div>
              <h3 className="dev-project-title">{proj.title}</h3>
              <p className="dev-project-desc">{proj.desc}</p>
              <div className="dev-project-tech">
                {proj.tech.map((t) => (
                  <span key={t} className="dev-tech-tag">
                    {t}
                  </span>
                ))}
              </div>
              <a
                href={proj.link}
                target="_blank"
                rel="noreferrer"
                className="dev-project-link interactive"
              >
                ACCESS REPO →
              </a>
              <div className="dev-card-glow" />
            </div>
          ))}
        </div>
      </section>

      {/* CAPABILITY MATRIX (SKILLS) */}
      <section id="skills" className="dev-section">
        <div className="dev-section-header">
          <span className="dev-section-tag">// 03 — CAPABILITY MATRIX</span>
          <h2 className="dev-section-title">SKILL LEVELS</h2>
          <div className="dev-section-line" />
        </div>

        <div className="dev-skills-container">
          <div className="dev-skill-category">
            <h3 className="dev-cat-title">// FRONTEND SYSTEMS</h3>
            {[
              { name: 'REACT / NEXT.JS', pct: 95 },
              { name: 'TYPESCRIPT / ES6+', pct: 88 },
              { name: 'WEBGL / THREE.JS', pct: 78 },
              { name: 'CSS / GPU ANIMATIONS', pct: 92 }
            ].map((skill) => (
              <div key={skill.name} className="dev-skill-bar-item">
                <div className="dev-bar-header">
                  <span className="dev-bar-name">{skill.name}</span>
                  <span className="dev-bar-pct">{skill.pct}%</span>
                </div>
                <div className="dev-bar-track">
                  <div className="dev-bar-fill" style={{ width: `${skill.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="dev-skill-category">
            <h3 className="dev-cat-title">// BACKEND SYSTEMS</h3>
            {[
              { name: 'NODE.JS / EXPRESS', pct: 90 },
              { name: 'PYTHON / FASTAPI', pct: 85 },
              { name: 'POSTGRESQL / SUPABASE', pct: 88 },
              { name: 'REDIS / CACHING & REST APIs', pct: 82 }
            ].map((skill) => (
              <div key={skill.name} className="dev-skill-bar-item">
                <div className="dev-bar-header">
                  <span className="dev-bar-name">{skill.name}</span>
                  <span className="dev-bar-pct">{skill.pct}%</span>
                </div>
                <div className="dev-bar-track">
                  <div className="dev-bar-fill dev-bar-fill-pink" style={{ width: `${skill.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="dev-section">
        <div className="dev-section-header">
          <span className="dev-section-tag">// 04 — ESTABLISH CONNECTION</span>
          <h2 className="dev-section-title">TRANSMISSION TERMINAL</h2>
          <div className="dev-section-line" />
        </div>

        <div className="dev-contact-box">
          <div className="corner corner-tl" />
          <div className="corner corner-tr" />
          <div className="corner corner-bl" />
          <div className="corner corner-br" />

          <p className="dev-contact-prompt">
            Ready to build something extraordinary? Whether it's an ambitious startup, a complex distributed system, or high-performance engineering — let's connect.
          </p>

          <div className="dev-email-display interactive" onClick={handleCopyEmail} title="Click to copy email">
            <span>subashgopi2006@gmail.com</span>
            <span className="dev-copy-hint">{copied ? '✓ COPIED!' : '📋 COPY'}</span>
          </div>

          <div className="dev-contact-actions">
            <a href="mailto:subashgopi2006@gmail.com" className="dev-btn dev-btn-primary interactive">
              SEND TRANSMISSION →
            </a>
          </div>

          <div className="dev-contact-links">
            <a href="https://github.com/Subash-G-S" target="_blank" rel="noreferrer" className="dev-social-link interactive">
              ⬡ GITHUB
            </a>
            <a href="https://www.linkedin.com/in/subash-g-s-bb214532b/" target="_blank" rel="noreferrer" className="dev-social-link interactive">
              ⬡ LINKEDIN
            </a>
            <a href="https://www.instagram.com/subash.photography._/?hl=en" target="_blank" rel="noreferrer" className="dev-social-link interactive">
              ⬡ INSTAGRAM
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="dev-footer">
        <p>SUBASH © 2026 — BUILT FOR PERFORMANCE &amp; ZERO LAG — ALL SYSTEMS NOMINAL</p>
        <button className="dev-footer-back interactive" onClick={onBackToPortal}>
          BACK TO PORTAL ↑
        </button>
      </footer>
    </div>
  );
}
