import { useCallback, useEffect, useState } from 'react';

const primaryRoutes = ['home', 'library', 'discover', 'profile', 'settings'];

const routeFromLocation = () => {
  const route = window.location.hash.slice(1);
  return primaryRoutes.includes(route) ? route : 'home';
};

export function useAppNavigation() {
  const [currentPage, setCurrentPage] = useState(routeFromLocation);

  const navigateTo = useCallback((page) => {
    if (!primaryRoutes.includes(page)) return;
    setCurrentPage(page);
    window.history.pushState({ page }, '', `#${page}`);
  }, []);

  useEffect(() => {
    const handleRouteChange = () => setCurrentPage(routeFromLocation());
    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);

  return { currentPage, setCurrentPage, navigateTo };
}

export default useAppNavigation;
