import { useState, useEffect } from 'react';
import Portal from './components/Portal';
import DevWorld from './components/DevWorld';
import MediaWorld from './components/MediaWorld';
import CustomCursor from './components/CustomCursor';
import './App.css';

export default function App() {
  // Hash-based routing: '#/' -> portal, '#/dev' -> dev, '#/media' -> media
  const getInitialWorld = () => {
    const hash = window.location.hash.toLowerCase();
    if (hash === '#/dev' || hash === '#dev') return 'dev';
    if (hash === '#/media' || hash === '#media') return 'media';
    return 'portal';
  };

  const [currentWorld, setCurrentWorld] = useState(getInitialWorld);

  // Sync hash on change
  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#/dev' || hash === '#dev') setCurrentWorld('dev');
      else if (hash === '#/media' || hash === '#media') setCurrentWorld('media');
      else setCurrentWorld('portal');
    };

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
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
