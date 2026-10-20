import { useState, useEffect } from 'react';
import Portal from './components/Portal';
import DevWorld from './components/DevWorld';
import MediaWorld from './components/MediaWorld';
import CustomCursor from './components/CustomCursor';
import './App.css';

export default function App() {
  // Hash-based or pathname routing: '#/' -> portal, '#/dev' or '/dev' -> dev, '#/media' or '/media' -> media
  const getInitialWorld = () => {
    const hash = window.location.hash.toLowerCase();
    const pathname = window.location.pathname.toLowerCase();
    if (hash === '#/dev' || hash === '#dev' || pathname === '/dev' || pathname.startsWith('/dev/')) return 'dev';
    if (hash === '#/media' || hash === '#media' || pathname === '/media' || pathname.startsWith('/media/')) return 'media';
    return 'portal';
  };

  const [currentWorld, setCurrentWorld] = useState(getInitialWorld);

  // Sync hash and popstate on change
  useEffect(() => {
    const onLocationChange = () => {
      const hash = window.location.hash.toLowerCase();
      const pathname = window.location.pathname.toLowerCase();
      if (hash.startsWith('#/dev') || hash === '#dev' || pathname.startsWith('/dev')) {
        setCurrentWorld('dev');
      } else if (hash.startsWith('#/media') || hash === '#media' || pathname.startsWith('/media')) {
        setCurrentWorld('media');
      } else if (hash === '#/' || hash === '#portal' || hash === '' || pathname === '/') {
        setCurrentWorld('portal');
      }
      // Note: If hash is a section anchor (#about, #services, #work, #contact, etc.),
      // preserve current world and do not switch!
    };

    window.addEventListener('hashchange', onLocationChange);
    window.addEventListener('popstate', onLocationChange);
    return () => {
      window.removeEventListener('hashchange', onLocationChange);
      window.removeEventListener('popstate', onLocationChange);
    };
  }, []);

  // Update hash when user changes world
  const switchWorld = (world) => {
    setCurrentWorld(world);
    if (world === 'dev') window.location.hash = '#/dev';
    else if (world === 'media') window.location.hash = '#/media';
    else window.location.hash = '#/';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`app-root world-${currentWorld}`}>
      {/* GPU Smooth Custom Cursor */}
      <CustomCursor mode={currentWorld} />

      {/* Main View Transition */}
      <main className="world-view-container">
        {currentWorld === 'portal' && (
          <Portal onSelectWorld={(world) => switchWorld(world)} />
        )}
        {currentWorld === 'dev' && (
          <DevWorld
            onBackToPortal={() => switchWorld('portal')}
            onSwitchToMedia={() => switchWorld('media')}
          />
        )}
        {currentWorld === 'media' && (
          <MediaWorld
            onBackToPortal={() => switchWorld('portal')}
            onSwitchToDev={() => switchWorld('dev')}
          />
        )}
      </main>
    </div>
  );
}
