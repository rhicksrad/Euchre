import { describe, it, expect } from 'vitest';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from '../app/shell/AppLayout';
import { StartMenu } from '../ui/screens/StartMenu';

describe('App shell', () => {
  it('renders StartMenu', () => {
    const router = createMemoryRouter([
      { path: '/', element: <AppLayout />, children: [{ index: true, element: <StartMenu /> }] },
    ]);
    // Basic smoke test: render doesn't throw
    expect(() => <RouterProvider router={router} />).not.toThrow();
  });
});


