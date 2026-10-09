import { fireEvent, render, screen, within } from '@testing-library/react';
import App from './App';
import { useAppStore } from './store/useAppStore';

beforeEach(() => {
  window.localStorage.clear();
  window.history.replaceState({}, '', '#home');
  useAppStore.getState().login({ id: 'test-user', name: 'Test User', email: 'test@example.com', role: 'Student', school: 'Test School' });
});

test('renders learn hub brand title', () => {
  render(<App />);
  const brandElement = screen.getByRole('heading', { name: /home/i });
  expect(brandElement).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /learn hub/i })).toBeInTheDocument();
});

test('shows the discover filters as icon-only buttons', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('link', { name: /discover/i }));

  const discoverNav = screen.getByRole('navigation', { name: /primary navigation/i });

  expect(within(discoverNav).getByRole('link', { name: /home/i })).toBeInTheDocument();
  expect(within(discoverNav).getByRole('link', { name: /videos/i })).toBeInTheDocument();
  expect(within(discoverNav).getByRole('link', { name: /followed accounts/i })).toBeInTheDocument();
  expect(within(discoverNav).queryByRole('link', { name: /friends/i })).not.toBeInTheDocument();
  expect(within(discoverNav).queryByRole('link', { name: /groups/i })).not.toBeInTheDocument();
  expect(within(discoverNav).queryByRole('link', { name: /library/i })).not.toBeInTheDocument();
  expect(document.querySelectorAll('svg').length).toBeGreaterThan(0);
});

test('persists profile edits for the next app session', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('link', { name: /profile/i }));
  fireEvent.click(screen.getByRole('button', { name: /edit profile/i }));

  const dialog = screen.getByRole('dialog', { name: /edit profile/i });
  const nameInput = within(dialog).getByLabelText(/full name/i);
  fireEvent.change(nameInput, { target: { value: 'Grace Banda' } });
  fireEvent.click(within(dialog).getByRole('button', { name: /save changes/i }));

  expect(JSON.parse(window.localStorage.getItem('learnhub-profile-details')).name).toBe('Grace Banda');
});

test('navigates to Scholastic Hub with library-style header and functional tabs', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('link', { name: /scholastic hub/i }));

  // Header matches Library style
  expect(screen.getByRole('heading', { name: /scholastic hub/i, level: 1 })).toBeInTheDocument();

  // Teacher contribution is removed
  expect(screen.queryByRole('button', { name: /teacher contribution/i })).not.toBeInTheDocument();

  // Functional tabs exist inside segmented navigation
  const scholasticNav = screen.getByRole('navigation', { name: /scholastic hub views/i });
  expect(within(scholasticNav).getByRole('button', { name: /resource repository/i })).toBeInTheDocument();
  expect(within(scholasticNav).getByRole('button', { name: /learning progress/i })).toBeInTheDocument();
  expect(within(scholasticNav).getByRole('button', { name: /offline vault/i })).toBeInTheDocument();
  expect(within(scholasticNav).getByRole('button', { name: /review queue/i })).toBeInTheDocument();
  expect(within(scholasticNav).getByRole('button', { name: /system guide/i })).toBeInTheDocument();

  // Switching tab to Offline Vault works
  fireEvent.click(within(scholasticNav).getByRole('button', { name: /offline vault/i }));
  expect(screen.getByRole('heading', { name: /offline vault manager/i })).toBeInTheDocument();
});

test('header matches library style across settings, post resource, and reading views', () => {
  render(<App />);

  // 1. Settings page header
  fireEvent.click(screen.getByRole('link', { name: /settings/i }));
  const settingsHeader = document.querySelector('header.library-header.settings-page-header');
  expect(settingsHeader).toBeInTheDocument();
  expect(within(settingsHeader).getByRole('heading', { name: /settings/i, level: 1 })).toBeInTheDocument();

  // 2. Post resource page header
  fireEvent.click(screen.getByRole('button', { name: /post a book/i }));
  const postHeader = document.querySelector('header.library-header.resource-detail-header');
  expect(postHeader).toBeInTheDocument();
  expect(within(postHeader).getByRole('heading', { name: /post a resource/i, level: 1 })).toBeInTheDocument();

  // 3. Library page header
  fireEvent.click(screen.getByRole('link', { name: /library/i }));
  const libraryHeader = document.querySelector('header.library-header');
  expect(libraryHeader).toBeInTheDocument();
  expect(within(libraryHeader).getByRole('heading', { name: /library/i, level: 1 })).toBeInTheDocument();
});
