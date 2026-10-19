import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './MediaWorld.css';

export default function MediaWorld({ onBackToPortal, onSwitchToDev }) {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoQuality, setVideoQuality] = useState('hd'); // 'hd' (10mb.mp4) on load for fast page render | '4k' on demand
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [bgAudioPlaying, setBgAudioPlaying] = useState(false);

  const videoRef = useRef(null);
  const bgAudioRef = useRef(null);
  const isNearVideoRef = useRef(false);

  // Background Audio Autoplay when MediaWorld opens
  useEffect(() => {
    const audio = new Audio('/audio.MP3');
    audio.loop = true;
    audio.volume = 1.0;
    bgAudioRef.current = audio;

    const startAudio = () => {
      if (!isNearVideoRef.current && audio.paused) {
        audio.play().then(() => setBgAudioPlaying(true)).catch(() => {});
      }
    };

    // Try autoplay immediately (will work if user clicked from Portal)
    startAudio();

    // In case browser policy blocked autoplay on direct load, play on first user interaction
    const onUserGesture = () => {
      startAudio();
      window.removeEventListener('click', onUserGesture);
      window.removeEventListener('scroll', onUserGesture);
      window.removeEventListener('touchstart', onUserGesture);
      window.removeEventListener('keydown', onUserGesture);
    };

    window.addEventListener('click', onUserGesture);
    window.addEventListener('scroll', onUserGesture);
    window.addEventListener('touchstart', onUserGesture);
    window.addEventListener('keydown', onUserGesture);

    return () => {
      window.removeEventListener('click', onUserGesture);
      window.removeEventListener('scroll', onUserGesture);
      window.removeEventListener('touchstart', onUserGesture);
      window.removeEventListener('keydown', onUserGesture);
      audio.pause();
      audio.src = '';
    };
  }, []);

  // IntersectionObserver: When user scrolls near video, stop music and unmute video
  useEffect(() => {
    const target = videoRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isNear = entry.isIntersecting;
          isNearVideoRef.current = isNear;

          if (isNear) {
            // 1. Stop background music
            if (bgAudioRef.current && !bgAudioRef.current.paused) {
              bgAudioRef.current.pause();
              setBgAudioPlaying(false);
            }
            // 2. Unmute video sound and ensure it is playing
            if (videoRef.current) {
              videoRef.current.muted = false;
              videoRef.current.volume = 1.0;
              setIsMuted(false);
              if (videoRef.current.paused) {
                videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
              }
            }
          } else {
            // 1. Mute video again when scrolling away
            if (videoRef.current && !videoRef.current.muted) {
              videoRef.current.muted = true;
              setIsMuted(true);
            }
            // 2. Resume background music
            if (bgAudioRef.current && bgAudioRef.current.paused) {
              bgAudioRef.current.play().then(() => setBgAudioPlaying(true)).catch(() => {});
            }
          }
        });
      },
      {
        threshold: 0.25,
        rootMargin: '60px 0px 60px 0px'
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  // Lock body scroll and enable ESC key to close lightbox
  useEffect(() => {
    if (selectedPhoto) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setSelectedPhoto(null);
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [selectedPhoto]);

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
      videoRef.current.volume = 1.0;
      setIsMuted(nextMuted);

      // If user explicitly unmuted the video, pause the background audio
      if (!nextMuted) {
        if (bgAudioRef.current && !bgAudioRef.current.paused) {
          bgAudioRef.current.pause();
          setBgAudioPlaying(false);
        }
      } else {
        // If user muted the video and is not near the video, resume background audio
        if (bgAudioRef.current && bgAudioRef.current.paused && !isNearVideoRef.current) {
          bgAudioRef.current.play().then(() => setBgAudioPlaying(true)).catch(() => {});
        }
      }
    }
  };

  const toggleBgAudio = () => {
    if (!bgAudioRef.current) return;
    if (bgAudioRef.current.paused) {
      if (videoRef.current && !videoRef.current.muted) {
        videoRef.current.muted = true;
        setIsMuted(true);
      }
      bgAudioRef.current.play().then(() => setBgAudioPlaying(true)).catch(() => {});
    } else {
      bgAudioRef.current.pause();
      setBgAudioPlaying(false);
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

  const handleVideoClick = (e) => {
    if (e.target.closest('.media-video-controls') || e.target.closest('.media-center-play-disc')) return;
    togglePlay();
  };

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
    <div className="media-world-container">
      {/* Editorial Navigation */}
      <nav className="media-nav">
        <div className="media-brand interactive" onClick={scrollToTop}>
          Sub<em>ash</em>
          <span className="media-brand-tag">CINEMA &amp; STILLS</span>
        </div>

        <div className="media-nav-right">
          <ul className="media-nav-links">
            <li>
              <a href="#about" className="interactive" onClick={(e) => scrollToSection(e, 'about')}>
                About
              </a>
            </li>
            <li>
              <a href="#services" className="interactive" onClick={(e) => scrollToSection(e, 'services')}>
                Services
              </a>
            </li>
            <li>
              <a href="#work" className="interactive" onClick={(e) => scrollToSection(e, 'work')}>
                Work
              </a>
            </li>
            <li>
              <a href="#contact" className="interactive" onClick={(e) => scrollToSection(e, 'contact')}>
                Contact
              </a>
            </li>
          </ul>

          <button
            className={`media-ambient-sound-btn interactive ${bgAudioPlaying ? 'is-playing' : ''}`}
            onClick={toggleBgAudio}
            title={bgAudioPlaying ? 'Mute Background Music' : 'Play Background Music'}
            aria-label="Toggle background music"
          >
            <span className="ambient-bars" aria-hidden="true">
              <span className="bar bar-1" />
              <span className="bar bar-2" />
              <span className="bar bar-3" />
            </span>
            <span className="ambient-label">{bgAudioPlaying ? 'AUDIO ON' : 'AUDIO OFF'}</span>
          </button>
        </div>
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
            <a
              href="#work"
              className="media-btn media-btn-primary interactive"
              onClick={(e) => scrollToSection(e, 'work')}
            >
              View Portfolio
            </a>
            <a
              href="#contact"
              className="media-btn media-btn-outline interactive"
              onClick={(e) => scrollToSection(e, 'contact')}
            >
              Get In Touch
            </a>
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
          <div
            className="media-cinema-visual"
            onClick={handleVideoClick}
          >
            <video
              ref={videoRef}
              className="media-cinema-video"
              src={videoQuality === '4k' ? '/videos/40mb.mp4' : '/videos/10mb.mp4'}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />

            {/* Cinematic Overlay Layer with Auto-Fade */}
            <div className="media-cinema-overlay">
              {/* Top Bar */}
              <div className="media-cinema-top-bar">
                <div className="media-cinema-badge">
                  <span className="cinema-live-dot" />
                  <span>CINEMATIC PREVIEW</span>
                </div>

                <div className="media-video-controls" onClick={(e) => e.stopPropagation()}>
                  {/* Quality Switcher */}
                  <div className="media-quality-group">
                    <button
                      className={`media-quality-btn interactive ${videoQuality === '4k' ? 'active' : ''}`}
                      onClick={() => handleQualityChange('4k')}
                      title="Switch to 4K Ultra HD"
                    >
                      4K
                    </button>
                    <button
                      className={`media-quality-btn interactive ${videoQuality === 'hd' ? 'active' : ''}`}
                      onClick={() => handleQualityChange('hd')}
                      title="Switch to Standard HD"
                    >
                      HD
                    </button>
                  </div>

                  {/* Play / Pause Button */}
                  <button
                    className="media-video-btn interactive"
                    onClick={togglePlay}
                    title={isPlaying ? 'Pause Film' : 'Play Film'}
                  >
                    {isPlaying ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="5" y="4" width="4" height="16" rx="1" />
                        <rect x="15" y="4" width="4" height="16" rx="1" />
                      </svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="6 4 20 12 6 20 6 4" />
                      </svg>
                    )}
                    <span className="media-btn-text">{isPlaying ? 'PAUSE' : 'PLAY'}</span>
                  </button>

                  {/* Mute / Audio Button */}
                  <button
                    className="media-video-btn interactive"
                    onClick={toggleSound}
                    title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                  >
                    {isMuted ? (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                        <line x1="23" y1="9" x2="17" y2="15" />
                        <line x1="17" y1="9" x2="23" y2="15" />
                      </svg>
                    ) : (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                      </svg>
                    )}
                    <span className="media-btn-text">{isMuted ? 'MUTED' : 'AUDIO'}</span>
                  </button>

                  {/* Theater Fullscreen Button */}
                  <button
                    className="media-video-btn interactive"
                    onClick={toggleFullscreen}
                    title="Fullscreen Theater Mode"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                    </svg>
                    <span className="media-btn-text">THEATER</span>
                  </button>
                </div>
              </div>

              {/* Center Play Indicator when paused */}
              {!isPlaying && (
                <div className="media-cinema-center-indicator">
                  <div className="media-center-play-disc interactive" onClick={togglePlay}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="8 5 19 12 8 19 8 5" />
                    </svg>
                  </div>
                </div>
              )}

              {/* Bottom Metadata Bar */}
              <div className="media-cinema-bottom-bar">
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
          <a
            href="#work"
            className="media-btn media-btn-outline interactive"
            onClick={(e) => scrollToSection(e, 'work')}
          >
            See My Work
          </a>
          <button className="media-btn media-btn-outline interactive" onClick={scrollToTop}>
            Back To Top ↑
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

      {/* LIGHTBOX MODAL (Rendered directly to document.body for true viewport centering) */}
      {selectedPhoto &&
        createPortal(
          <div className="media-lightbox" onClick={() => setSelectedPhoto(null)}>
            <button
              className="media-lightbox-close interactive"
              onClick={() => setSelectedPhoto(null)}
              aria-label="Close preview"
            >
              ✕
            </button>
            <div className="media-lightbox-content" onClick={(e) => e.stopPropagation()}>
              <img src={selectedPhoto.src} alt={selectedPhoto.title} className="media-lightbox-img" />
              <div className="media-lightbox-caption">
                <h3>{selectedPhoto.title}</h3>
                <p>{selectedPhoto.sub}</p>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
