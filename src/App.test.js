import { fireEvent, render, screen, within } from '@testing-library/react';
import App from './App';

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
