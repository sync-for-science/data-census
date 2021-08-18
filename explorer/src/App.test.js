import { render, screen } from '@testing-library/react';
import App from './App';

test('renders page', () => {
  render(<App />);
  const header = screen.getByText(/census/i);
  expect(header).toBeInTheDocument();
});
