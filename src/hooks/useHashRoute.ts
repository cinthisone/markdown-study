import { useState, useEffect } from 'react';

export function useHashRoute() {
  const [hash, setHash] = useState(decodeURIComponent(window.location.hash.slice(1)));

  useEffect(() => {
    const handleHashChange = () => {
      setHash(decodeURIComponent(window.location.hash.slice(1)));
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return hash;
} 