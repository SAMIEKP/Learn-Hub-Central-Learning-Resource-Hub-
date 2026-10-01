import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const primaryRoutes = [
  'home',
  'library',
  'discover',
  'scholastic-hub',
  'scholastic-progress',
  'scholastic-vault',
  'scholastic-contribute',
  'scholastic-review',
  'scholastic-docs',
  'publisher-studio',
  'resource-list',
  'resource',
  'publisher',
  'reader',
  'profile',
  'settings',
];

const routeFromLocation = (pathname) => {
  const route = pathname.replace(/^\//, '').split('/')[0];
  if (primaryRoutes.includes(route)) return route;
  const legacyHash = window.location.hash.slice(1);
  return primaryRoutes.includes(legacyHash) ? legacyHash : 'home';
};

export function useAppNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPage = routeFromLocation(location.pathname);

  const navigateTo = useCallback((page) => {
    if (!primaryRoutes.includes(page)) return;
    navigate(page === 'home' ? '/' : `/${page}`);
  }, [navigate]);

  return { currentPage, setCurrentPage: navigateTo, navigateTo };
}

export default useAppNavigation;
