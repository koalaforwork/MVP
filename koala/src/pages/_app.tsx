import { useEffect, useState } from 'react';
import { RouterProvider } from '@tanstack/react-router';
import { router } from '../router';
import  '../styles/globals.css';

export default function App() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <RouterProvider router={router} />;
}