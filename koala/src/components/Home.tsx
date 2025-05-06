import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate } from '@tanstack/react-router';

const Home = () => {
  const [userDbStatus, setUserDbStatus] = useState<'checking' | 'created' | 'exists' | 'error' | null>(null);
  const [userDbError, setUserDbError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {

    const handleAuthRedirect = async () => {
      const hash = window.location.hash;

      if (hash && hash.includes('access_token')) {

        await new Promise(resolve => setTimeout(resolve, 500));
      }

      setAuthChecked(true);
    }; 

    handleAuthRedirect();

    
    const checkAndCreateUserInDb = async () => {

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        sessionStorage.setItem('user', JSON.stringify(session.user));

        setUserDbStatus('checking');
        setUserDbError(null);

        try {
          const response = await fetch('/api/user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: session.user.id, email: session.user.email }),
          });

          const data = await response.json();

          if (!response.ok) {
            setUserDbError(data.message || 'Failed to connect to the database');
            setUserDbStatus('error');
          } else {
            if (data.message.includes('created')) {
              setUserDbStatus('created');
            } else {
              setUserDbStatus('exists');
            }
          } 
        } catch (apiError: any) {
          setUserDbError(apiError.message || 'Failed to connect to the database');
          setUserDbStatus('error');
        }
      } else {
        setUserDbStatus(null);
        navigate({ to: '/signup' });
      }
    };

    checkAndCreateUserInDb();
  }, [])
  return (
    <div>
      <h1>Hello World</h1>
      <p>If you see this, your routing is working perfectly!</p>

      {/* Display status of user DB creation/check */}
      {userDbStatus === 'checking' && <p>Setting up your profile...</p>}
      {userDbStatus === 'created' && <p>Your profile has been created!</p>}
      {userDbStatus === 'exists' && <p>Welcome back! Your profile exists.</p>}
      {userDbStatus === 'error' && <p className="text-red-500">Error setting up profile: {userDbError}</p>}
      {/* If userDbStatus is null, it means no logged-in user was found */}
    </div>
  )
}

export default Home
