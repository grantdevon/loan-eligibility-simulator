import { render } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  test('renders main', () => {
    render(<App />);
  });
});