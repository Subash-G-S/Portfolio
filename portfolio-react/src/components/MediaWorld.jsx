import { useState, useRef } from 'react';
import './MediaWorld.css';

export default function MediaWorld({ onBackToPortal, onSwitchToDev }) {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoQuality, setVideoQuality] = useState('4k'); // '4k' (40mb.mp4) | 'hd' (10mb.mp4)
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const videoRef = useRef(null);

  const testimonials = [
    {
      quote: "Subash doesn't just present his frames, he curates the stories crafted in his mind.",
      author: '— Jothsna Kishore, Model'
    },
    {
      quote: "His command of light, composition, and timing made our brand film feel like an authentic cinematic experience.",
      author: '— Creative Director, Studio Pulse'
    },
    {
      quote: "Subash captured emotions in our wedding film that we didn't even realize were happening. An absolute master of his craft.",
      author: '— Priya & Arjun, Wedding Film'
    }
  ];

  const photos = [
    {
      id: 1,
      src: '/images/pic2.jpg',
      title: 'Portrait & Fashion',
      sub: 'Human stories, editorial beauty',
      category: 'PORTRAIT',
      collageClass: 'collage-item-1',
      deco: (
        <svg width="200" height="300" viewBox="0 0 200 300">
          <ellipse cx="100" cy="150" rx="80" ry="120" stroke="#b8966e" strokeWidth="0.6" fill="none" />
          <line x1="100" y1="10" x2="100" y2="290" stroke="#b8966e" strokeWidth="0.4" />
        </svg>
      )
    },
    {
      id: 2,
      src: '/images/pic6.jpg',
      title: 'Events & Energy',
      sub: 'Presence of pure vibe',
      category: 'EVENTS',
      collageClass: 'collage-item-2',
      deco: (
        <svg width="120" height="100" viewBox="0 0 120 100">
          <rect x="10" y="10" width="100" height="80" stroke="#b8966e" strokeWidth="0.6" fill="none" />
          <rect x="30" y="25" width="60" height="50" stroke="#b8966e" strokeWidth="0.4" fill="none" />
        </svg>
      )
    },
    {
      id: 3,
      src: '/images/pic3.jpg',
      title: 'Landscape & Horizon',
      sub: 'Earth, light, stillness',
      category: 'LANDSCAPE',
      collageClass: 'collage-item-3',
      deco: (
        <svg width="120" height="100" viewBox="0 0 120 100">
          <path d="M10 80 Q60 10 110 80" stroke="#b8966e" strokeWidth="0.6" fill="none" />
          <path d="M10 60 Q60 20 110 60" stroke="#b8966e" strokeWidth="0.3" fill="none" />
        </svg>
      )
    },
    {
      id: 4,
      src: '/images/pic4.jpg',
      title: 'Street & Candid',
      sub: 'Candid urban pulse',
      category: 'STREET',
      collageClass: 'collage-item-4',
      deco: (
        <svg width="120" height="100" viewBox="0 0 120 100">
          <circle cx="60" cy="50" r="40" stroke="#b8966e" strokeWidth="0.6" fill="none" />
          <circle cx="60" cy="50" r="20" stroke="#b8966e" strokeWidth="0.4" fill="none" />
        </svg>
      )
    },
    {
      id: 5,
      src: '/images/prana.jpg',
      title: 'Editorial Portfolio',
      sub: 'Lighting, mood, expression',
      category: 'PORTRAIT',
      collageClass: 'collage-item-5',
      deco: (
        <svg width="200" height="300" viewBox="0 0 200 300">
          <ellipse cx="100" cy="150" rx="80" ry="120" stroke="#b8966e" strokeWidth="0.6" fill="none" />
          <line x1="100" y1="10" x2="100" y2="290" stroke="#b8966e" strokeWidth="0.4" />
        </svg>
      )
    },
    {
      id: 6,
      src: '/images/pic5.jpg',
      title: 'Architecture & Form',
      sub: 'Space, geometry, shadow',
      category: 'ARCHITECTURE',
      collageClass: 'collage-item-6',
      deco: (
        <svg width="120" height="100" viewBox="0 0 120 100">
          <line x1="10" y1="10" x2="110" y2="90" stroke="#b8966e" strokeWidth="0.6" />
          <line x1="110" y1="10" x2="10" y2="90" stroke="#b8966e" strokeWidth="0.6" />
        </svg>
      )
    },
    {
      id: 7,
      src: '/images/pic1.jpg',
      title: 'Cinematic Still',
      sub: 'Atmosphere & tension',
      category: 'PORTRAIT',
      collageClass: 'collage-item-7',
      deco: (
        <svg width="120" height="100" viewBox="0 0 120 100">
          <polygon points="60,10 110,90 10,90" stroke="#b8966e" strokeWidth="0.6" fill="none" />
        </svg>
      )
    },
    {
      id: 8,
      src: '/images/jo.jpg',
      title: 'Studio Portraiture',
      sub: 'Controlled deliberate light',
      category: 'PORTRAIT',
      collageClass: 'collage-item-8',
      deco: (
        <svg width="120" height="100" viewBox="0 0 120 100">
          <rect x="20" y="20" width="80" height="60" rx="4" stroke="#b8966e" strokeWidth="0.6" fill="none" />
        </svg>
      )
    }
  ];

  const filteredPhotos = activeCategory === 'ALL'
    ? photos
    : photos.filter(p => p.category === activeCategory);

  const toggleSound = () => {
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleQualityChange = (quality) => {
    if (videoRef.current && quality !== videoQuality) {
      const currentTime = videoRef.current.currentTime;
      const wasPlaying = !videoRef.current.paused;
      setVideoQuality(quality);
      videoRef.current.src = quality === '4k' ? '/videos/40mb.mp4' : '/videos/10mb.mp4';
      videoRef.current.currentTime = currentTime;
      if (wasPlaying) {
        videoRef.current.play().catch(() => {});
      }
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      } else {
        if (videoRef.current.requestFullscreen) {
          videoRef.current.requestFullscreen().catch(() => {});
        } else if (videoRef.current.webkitRequestFullscreen) {
          videoRef.current.webkitRequestFullscreen();
        }
      }
    }
  };

  return (
    <div className="media-world-container">
      {/* Editorial Navigation */}
      <nav className="media-nav">
        <div className="media-brand interactive" onClick={onBackToPortal}>
          Sub<em>ash</em>
          <span className="media-brand-tag">CINEMA &amp; STILLS</span>
        </div>

        <ul className="media-nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#work">Work</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      {/* HERO SECTION */}
      <section className="media-hero">
        <div className="media-hero-left">
          <p className="media-hero-eyebrow">Visual Artist &amp; Creative Director</p>
          <h1 className="media-hero-name">
            Sub<em>ash</em>
          </h1>
          <p className="media-hero-subtitle">
            Photographer &nbsp;·&nbsp; Cinematographer<br />
            Designer &nbsp;·&nbsp; Video Editor
          </p>
          <div className="media-hero-ctas">
            <a href="#work" className="media-btn media-btn-primary interactive">
              View Portfolio
            </a>
            <button className="media-btn media-btn-outline interactive" onClick={onBackToPortal}>
              Switch Worlds ⇄
            </button>
          </div>
        </div>

      </section>

      {/* MARQUEE RIBBON */}
      <div className="media-marquee" aria-hidden="true">
        <div className="media-marquee-track">
          {[1, 2].map(repeat => (
            <div key={repeat} className="media-marquee-item">
              <span>Portrait Photography</span><div className="media-marquee-dot" />
              <span>Wedding Films</span><div className="media-marquee-dot" />
              <span>Brand Identity</span><div className="media-marquee-dot" />
              <span>Motion Design</span><div className="media-marquee-dot" />
              <span>Aerial Cinematography</span><div className="media-marquee-dot" />
              <span>Documentary</span><div className="media-marquee-dot" />
              <span>Commercial Films</span><div className="media-marquee-dot" />
              <span>Editorial Design</span><div className="media-marquee-dot" />
            </div>
          ))}
        </div>
      </div>

      {/* ABOUT SECTION */}
      <section className="media-about" id="about">
        <div className="media-about-photo-wrapper">
          <div className="media-about-photo">
            <img
              src="/subash_png.png"
              alt="Subash portrait"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        <div className="media-about-text-content">
          <span className="media-section-label">About Me</span>
          <h2 className="media-about-heading">
            Where light meets<br /><em>intention</em>
          </h2>
          <p className="media-about-desc">
            I am a multidisciplinary visual artist based in Coimbatore, India. Blending the precision of photography, the narrative power of cinema, and the craft of design into work that moves people.
          </p>
          <p className="media-about-desc">
            Every frame is a deliberate decision. Every edit is a breath. I create visual stories that don't just look beautiful — they leave a lasting emotional resonance.
          </p>

          <div className="media-about-stats">
            <div>
              <div className="media-stat-number">4+</div>
              <div className="media-stat-label">Years of craft</div>
            </div>
            <div>
              <div className="media-stat-number">50+</div>
              <div className="media-stat-label">Projects done</div>
            </div>
            <div>
              <div className="media-stat-number">40+</div>
              <div className="media-stat-label">Happy clients</div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="media-services" id="services">
        <div className="media-services-header">
          <div>
            <span className="media-section-label" style={{ color: 'var(--cin-gold)' }}>What I Do</span>
            <h2 className="media-services-heading">Creative<br /><em>disciplines</em></h2>
          </div>
          <span className="media-services-count">04 specialisations</span>
        </div>

        <div className="media-services-grid">
          {/* 01 Photography */}
          <div className="media-service-card interactive">
            <span className="media-service-num">01</span>
            <div className="media-service-icon">
              <svg viewBox="0 0 44 44">
                <circle cx="22" cy="24" r="9" />
                <path d="M4 16h4l3-4h22l3 4h4v22H4V16z" />
                <circle cx="22" cy="24" r="5" />
              </svg>
            </div>
            <h3 className="media-service-title">Photography</h3>
            <p className="media-service-desc">
              Portraits, landscapes, weddings, fashion, street, product — every genre approached with a fresh eye and deliberate light.
            </p>
            <div className="media-service-tags">
              <span className="media-tag">Portrait</span>
              <span className="media-tag">Wedding</span>
              <span className="media-tag">Fashion</span>
              <span className="media-tag">Product</span>
            </div>
          </div>

          {/* 02 Cinematography */}
          <div className="media-service-card interactive">
            <span className="media-service-num">02</span>
            <div className="media-service-icon">
              <svg viewBox="0 0 44 44">
                <rect x="2" y="10" width="30" height="24" rx="2" />
                <path d="M32 18l10-6v20l-10-6V18z" />
              </svg>
            </div>
            <h3 className="media-service-title">Cinematography</h3>
            <p className="media-service-desc">
              Narrative films, documentaries, brand films, wedding reels — cinematography that shapes how stories breathe on screen.
            </p>
            <div className="media-service-tags">
              <span className="media-tag">Brand Films</span>
              <span className="media-tag">Documentary</span>
              <span className="media-tag">Wedding</span>
            </div>
          </div>

          {/* 03 Design */}
          <div className="media-service-card interactive">
            <span className="media-service-num">03</span>
            <div className="media-service-icon">
              <svg viewBox="0 0 44 44">
                <rect x="4" y="4" width="36" height="36" rx="1" />
                <path d="M4 16h36M16 4v36" />
                <circle cx="28" cy="28" r="5" />
              </svg>
            </div>
            <h3 className="media-service-title">Design</h3>
            <p className="media-service-desc">
              Brand identity, editorial layouts, poster design, social media — visual systems built with intention and aesthetic clarity.
            </p>
            <div className="media-service-tags">
              <span className="media-tag">Branding</span>
              <span className="media-tag">Editorial</span>
              <span className="media-tag">Social</span>
            </div>
          </div>

          {/* 04 Video Editing */}
          <div className="media-service-card interactive">
            <span className="media-service-num">04</span>
            <div className="media-service-icon">
              <svg viewBox="0 0 44 44">
                <rect x="2" y="8" width="40" height="28" rx="2" />
                <path d="M14 16l16 6-16 6V16z" />
                <line x1="2" y1="38" x2="42" y2="38" />
              </svg>
            </div>
            <h3 className="media-service-title">Video Editing</h3>
            <p className="media-service-desc">
              Color grading, motion graphics, sound design, montage — sculpting raw footage into an evocative cinematic experience.
            </p>
            <div className="media-service-tags">
              <span className="media-tag">Color Grade</span>
              <span className="media-tag">Motion GFX</span>
              <span className="media-tag">Reels</span>
            </div>
          </div>
        </div>
      </section>

      {/* PHOTOGRAPHY WORK GALLERY */}
      <section className="media-work" id="work">
        <div className="media-work-header">
          <div>
            <span className="media-section-label">The Craft</span>
            <h2 className="media-work-heading">Genres of<br /><em>visual art</em></h2>
          </div>
          <p className="media-work-sub">
            Photography is not one thing. It is a hundred disciplines, each demanding its own language, pacing, and patience.
          </p>
        </div>

        {/* Category Filters */}
        <div className="media-filters">
          {['ALL', 'PORTRAIT', 'EVENTS', 'LANDSCAPE', 'STREET', 'ARCHITECTURE'].map(cat => (
            <button
              key={cat}
              className={`media-filter-btn interactive ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dynamic Collage Grid */}
        <div className={`media-photo-collage ${activeCategory !== 'ALL' ? 'is-filtered' : ''}`}>
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className={`media-collage-card ${activeCategory === 'ALL' ? photo.collageClass : 'filtered-card'} interactive`}
              onClick={() => setSelectedPhoto(photo)}
            >
              <img
                src={photo.src}
                alt={photo.title}
                className="media-collage-img"
                loading="lazy"
                decoding="async"
              />
              <div className="media-collage-deco">{photo.deco}</div>
              <div className="media-collage-overlay" />
              <div className="media-collage-badge">
                <span className="media-badge-icon">⤢</span>
              </div>
              <div className="media-collage-content">
                <div className="media-collage-genre">{photo.title}</div>
                <div className="media-collage-genre-sub">{photo.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CINEMATOGRAPHY SECTION */}
      <section className="media-cinema" id="cinema">
        <div className="media-cinema-header">
          <span className="media-section-label">Motion &amp; Film</span>
          <div className="media-cinema-header-flex">
            <h2 className="media-cinema-heading">The art of<br /><em>moving frames</em></h2>
            <p className="media-cinema-desc">
              Cinematography is photography in time. Every second is a composition, every cut a heartbeat. I craft visual narratives that pull viewers into worlds they can't look away from.
            </p>
          </div>
        </div>

        {/* Featured Film Card with Custom Controls */}
        <div className="media-cinema-featured">
          <div className="media-cinema-visual">
            <video
              ref={videoRef}
              className="media-cinema-video"
              src={videoQuality === '4k' ? '/videos/40mb.mp4' : '/videos/10mb.mp4'}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />

            {/* Video Controls Overlay */}
            <div className="media-video-controls">
              {/* Quality Switcher */}
              <div className="media-quality-group">
                <button
                  className={`media-quality-btn interactive ${videoQuality === '4k' ? 'active' : ''}`}
                  onClick={() => handleQualityChange('4k')}
                  title="Switch to 4K / 1080p Ultra HD Master"
                >
                  1080p
                </button>
                <button
                  className={`media-quality-btn interactive ${videoQuality === 'hd' ? 'active' : ''}`}
                  onClick={() => handleQualityChange('hd')}
                  title="Switch to Standard HD"
                >
                  HD
                </button>
              </div>

              <button
                className="media-video-btn interactive"
                onClick={togglePlay}
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? '⏸ PAUSE' : '▶ PLAY'}
              </button>
              <button
                className="media-video-btn interactive"
                onClick={toggleSound}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? '🔇 MUTED' : '🔊 AUDIO ON'}
              </button>
              <button
                className="media-video-btn interactive"
                onClick={toggleFullscreen}
                title="Fullscreen Theater Mode"
              >
                ⛶ THEATER
              </button>
            </div>

            {/* Film Perforations Border Graphics */}
            <div className="media-film-perforations">
              <div className="sprocket-row left">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="sprocket-hole" />
                ))}
              </div>
              <div className="sprocket-row right">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="sprocket-hole" />
                ))}
              </div>
            </div>

            <div className="media-cinema-featured-label">
              <span className="media-featured-tag">Featured Film</span>
              <h3 className="media-featured-title">Tulasi</h3>
              <p className="media-featured-sub">Storytelling · 2026</p>
            </div>

            <div className="media-aspect-ratio">
              2.39 : 1 ANAMORPHIC · {videoQuality === '4k' ? '4K / 1080p MASTER' : '720p HD'}
            </div>
          </div>
        </div>

        {/* 4 Cinema Genre Cards */}
        <div className="media-cinema-genres">
          <div className="media-cgc-card interactive">
            <div className="media-cgc-top">
              <span className="media-cgc-num">01</span>
            </div>
            <h3 className="media-cgc-title">Wedding Films</h3>
            <p className="media-cgc-desc">
              Cinematic wedding storytelling — from intimate vows to grand receptions, captured in timeless editorial style.
            </p>
            <div className="media-cgc-specs">
              <span>4K · RAW</span>
              <span>Color Graded</span>
              <span>Dolby Audio</span>
            </div>
          </div>

          <div className="media-cgc-card interactive">
            <div className="media-cgc-top">
              <span className="media-cgc-num">02</span>
            </div>
            <h3 className="media-cgc-title">Brand Films</h3>
            <p className="media-cgc-desc">
              Commercial narratives that don't feel like ads. Stories that evoke emotion and genuine human connection.
            </p>
            <div className="media-cgc-specs">
              <span>Script to Screen</span>
              <span>Motion GFX</span>
              <span>Broadcast Ready</span>
            </div>
          </div>

          <div className="media-cgc-card interactive">
            <div className="media-cgc-top">
              <span className="media-cgc-num">03</span>
            </div>
            <h3 className="media-cgc-title">Documentary</h3>
            <p className="media-cgc-desc">
              Real people, real stories. Embedding directly into the subject's world and letting truthful moments lead the way.
            </p>
            <div className="media-cgc-specs">
              <span>Long-form</span>
              <span>Interviews</span>
              <span>Observational</span>
            </div>
          </div>

          <div className="media-cgc-card interactive">
            <div className="media-cgc-top">
              <span className="media-cgc-num">04</span>
            </div>
            <h3 className="media-cgc-title">Music Videos</h3>
            <p className="media-cgc-desc">
              Visual extensions of sound — concept-driven music videos that give audio tracks the iconic visuals they deserve.
            </p>
            <div className="media-cgc-specs">
              <span>Concept Dev</span>
              <span>VFX</span>
              <span>Color Story</span>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS SECTION */}
      <section className="media-process">
        <h2 className="media-process-heading">How the <em>work happens</em></h2>
        <div className="media-process-steps">
          <div className="media-process-step">
            <div className="media-step-num">01</div>
            <h3 className="media-step-title">Discovery</h3>
            <p className="media-step-desc">
              We talk. I listen. Understanding your vision, your audience, and the emotion you want to leave behind.
            </p>
          </div>
          <div className="media-process-step">
            <div className="media-step-num">02</div>
            <h3 className="media-step-title">Concept</h3>
            <p className="media-step-desc">
              Moodboards, references, shot lists — the blueprint that turns vague ideas into precise creative direction.
            </p>
          </div>
          <div className="media-process-step">
            <div className="media-step-num">03</div>
            <h3 className="media-step-title">Creation</h3>
            <p className="media-step-desc">
              The shoot, the frame, the cut. Where planning dissolves and instinct takes over to capture something real.
            </p>
          </div>
          <div className="media-process-step">
            <div className="media-step-num">04</div>
            <h3 className="media-step-title">Delivery</h3>
            <p className="media-step-desc">
              Refined, graded, and delivered on time. Work you can be proud of, ready for the world to see.
            </p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SLIDER */}
      <section className="media-testimonial">
        <div className="media-testimonial-quote-icon">“</div>
        <p className="media-testimonial-text">
          {testimonials[activeTestimonial].quote}
        </p>
        <div className="media-testimonial-author">
          {testimonials[activeTestimonial].author}
        </div>
        <div className="media-testimonial-dots">
          {testimonials.map((_, i) => (
            <button
              key={i}
              className={`media-t-dot interactive ${activeTestimonial === i ? 'active' : ''}`}
              onClick={() => setActiveTestimonial(i)}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="media-cta" id="contact">
        <span className="media-cta-label">Let's Create Together</span>
        <h2 className="media-cta-heading">
          Have a project<br />in <em>mind?</em>
        </h2>
        <div className="media-cta-buttons">
          <a href="mailto:subashgopi2006@gmail.com" className="media-btn media-btn-primary interactive">
            Get In Touch
          </a>
          <a href="#work" className="media-btn media-btn-outline interactive">
            See My Work
          </a>
          <button className="media-btn media-btn-outline interactive" onClick={onBackToPortal}>
            Back To Portal
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="media-footer">
        <div className="media-footer-logo">Subash</div>
        <div className="media-footer-copy">© 2026 Subash. All rights reserved.</div>
        <div className="media-footer-socials">
          <a href="https://www.instagram.com/subash.photography._/" target="_blank" rel="noreferrer" className="interactive">Instagram</a>
          <a href="https://youtube.com/@subashphotography0224" target="_blank" rel="noreferrer" className="interactive">YouTube</a>
          <a href="https://www.linkedin.com/in/subash-g-s-bb214532b/" target="_blank" rel="noreferrer" className="interactive">LinkedIn</a>
          <a href="https://github.com/Subash-G-S" target="_blank" rel="noreferrer" className="interactive">GitHub</a>
        </div>
      </footer>

      {/* LIGHTBOX MODAL */}
      {selectedPhoto && (
        <div className="media-lightbox" onClick={() => setSelectedPhoto(null)}>
          <div className="media-lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="media-lightbox-close interactive" onClick={() => setSelectedPhoto(null)}>
              ✕
            </button>
            <img src={selectedPhoto.src} alt={selectedPhoto.title} className="media-lightbox-img" />
            <div className="media-lightbox-caption">
              <h3>{selectedPhoto.title}</h3>
              <p>{selectedPhoto.sub}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
