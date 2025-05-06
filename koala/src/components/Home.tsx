import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate } from '@tanstack/react-router';
import Navbar from './shared/Navbar';

const Home = () => {
  const [userDbStatus, setUserDbStatus] = useState<'checking' | 'created' | 'exists' | 'error' | null>(null);
  const [userDbError, setUserDbError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [session, setSession] = useState<any>(null);
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

      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (currentSession) {
        sessionStorage.setItem('user', JSON.stringify(currentSession.user));
        setSession(currentSession);
        setUserDbStatus('checking');
        setUserDbError(null);

        try {
          const response = await fetch('/api/user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: currentSession.user.id, email: currentSession.user.email }),
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
    <div className="min-h-screen bg-background">

      <Navbar username={session?.user?.user_metadata?.name || "User"} />
      
    </div>
  );

};export default Home
