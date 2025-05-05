import React from 'react';
import Image from 'next/image';
import { set, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useNavigate } from '@tanstack/react-router';

const signupFormSchema = z.object({
  email: z.string().email('Invalid email address'),
});


const Signup = () => {
const [loading, setLoading] = useState(false);
const [emailSent, setEmailSent] = useState(false);
const [error, setError] = useState<string | null>(null);
const navigate = useNavigate();

  const form = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: '',
    },
  });

  useEffect(() => {
    console.log("useEffect running...");
    const handleAuthCallback = async () => {
      console.log("handleAuthCallback called.");
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      console.log("URL code parameter", code);

      const fragment = window.location.hash.substring(1);

      const paramsFromFragment = new URLSearchParams(fragment);

      const authError = paramsFromFragment.get('error');

      console.log("URL code parameter", code);
      console.log("URL fragment error_description:", authError);

      if (authError) {
        console.error("Authentication error:", authError);
        setError(authError);
        setLoading(false);
        setEmailSent(false);

        console.log("Cleaning up URL parameters and fragment after error.");
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }

      if (code) {
        console.log("code found in URL, attempting to exchange for session...");
        setLoading(true);
        setError(null);
        setEmailSent(false);

        try {
          const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

          console.log("exchange code for session result:", data, sessionError);

          if (sessionError) {
            console.error("Error exchanging code for session:", sessionError);
            throw sessionError;
          }

          const user = data.session?.user;

          if (user) {
            console.log("Authentication succesful. user:", user);

            console.log("Checking if user exists in database with ID:", user.id);
            const existingUser = await db.select()
            .from(users)
            .where(eq(users.userId, user.id))
            .limit(1);

            console.log("Existing user check result:", existingUser);

            if (existingUser.length === 0) {
              console.log("User does not exist in database. Inserting...");
              try {
                const defaultPreferences = {
                  workHours: { start: '09:00', end: '17:00' },
                  focusSessionDuration: 25,
                  breakDuration: 5,
                  notificationPreferences: {
                    email: true,
                    push: false,
                  },
                };

                const defaultEmotionalPatterns = {
                  commonTriggers: [],
                  effectiveTechniques: [],
                  energyPeaktimes: [],
                };

                const defaultWorkStyle = {
                  preferTaskTypes: [],
                  contextSwitchingStyle: [],
                  decisionMakingStyle: [],
                };

                // using email as a placeholder name
                const defaultName = user.email ? user.email.split('@')[0] : 'User';

                console.log("Inserting user into database with values:", {
                  userId: user.id,
                  name: defaultName,
                  preferences: defaultPreferences,
                  emotionalPatterns: defaultEmotionalPatterns,
                  workStyle: defaultWorkStyle,
                });

                // Insert the user into the database
                await db.insert(users).values({
                  userId: user.id,
                  name: defaultName,
                  preferences: defaultPreferences,
                  emotionalPatterns: defaultEmotionalPatterns,
                  workStyle: defaultWorkStyle,
                }).onConflictDoNothing();
              } catch (dbError: any) {
                console.error("Error inserting user into database:", dbError);
                setError(dbError.message || 'sign-in successful, but failed to set up user profile. Please contact support');
              }
            } else {
              console.log('user exists in database');
            }

            navigate({ to: '/' });
          } else {
            console.error("Authentication successful, but user data not found.");
          }
        } catch (authError: any) {
          console.error("Authentication error:", authError);
          setError(authError.message || 'An unexpected error occured. Please try again.');
        } finally {
          setLoading(false);

          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    };

    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (event === 'SIGNED_IN' && currentSession) {
        const user = currentSession.user;
        if (user) {
          try {
            const existingUser = await db.select()
            .from(users)
            .where(eq(users.userId, user.id))
            .limit(1);

            if (existingUser.length === 0) {
              const defaultPreferences = {
                workHours: { start: '09:00', end: '17:00' },
                focusSessionDuration: 25,
                breakDuration: 5,
                notificationPreferences: {
                  email: true,
                  push: false,
                },
              };
              const defaultEmotionalPatterns = {
                commonTriggers: [],
                effectiveTechniques: [],
                energyPeaktimes: [],
              };
              const defaultWorkStyle = {
                preferTaskTypes: [],
                contextSwitchingStyle: [],
                decisionMakingStyle: [],
              };
              const defaultName = user.email ? user.email.split('@')[0] : 'User';

              await db.insert(users).values({
                userId: user.id,
                name: defaultName,
                preferences: defaultPreferences,
                emotionalPatterns: defaultEmotionalPatterns,
                workStyle: defaultWorkStyle,
              })
              .onConflictDoNothing();
              console.log('user inserted into database');
            } else {
              console.log("Auth state SIGNED_IN: user already exists in database");
            }
          } catch (dbError: any) {
            console.log("Error inserting user into database:", dbError);
            setError(dbError.message || 'sign-in successful, but failed to set up user profile. Please contact support');
          }
        }
      }
    });

    handleAuthCallback();

    return () => {
      authListener?.unsubscribe();
    };
  }, [navigate]);

  async function onEmailSubmit(values: z.infer<typeof signupFormSchema>) {
    setLoading(true);
    setError(null);
    setEmailSent(false);

    const redirectUrl = `${window.location.origin}/signup`;

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: values.email,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        throw error;
      }

      setEmailSent(true);
    } catch (error: any) {
      console.error("Error sending magic link:", error);
      setError(error.message || 'An unexpected error occured. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center">
      <div className="w-[375px] md:w-[1440px] h-[850px] md:h-[900px] flex flex-col md:flex-row">
        <div className="w-full md:w-[648px] h-full flex items-center justify-center">
           <div className="w-[343px] md:w-[424px] bg-white p-4 rounded-[5px] md:rounded-[10px] flex flex-col gap-6 md:gap-8">
           <h1 className="text-[28px] md:text-[32px] leading-[40px] md:leading-[44px] tracking-[-0.015em] md:tracking-[-0.01em] text-[#323539] font-bold font-['Inter'] text-center">
                Create your account
              </h1>
              <button className="w-full h-[46px] bg-white border border-[#E5E5E7] rounded-[5px] px-4 py-3 flex items-center justify-center gap-2 shadow-[0_1px_2px_0_#1018280A]">
              <img src="/icons/google-logo.png" alt="Google logo" className="h-5 w-5" />
              <span className="text-[#323539] font-['Inter'] font-semibold text-[15px] leading-[22px] tracking-normal">Sign up with Google</span>
              </button>
              <div className="w-full h-6 flex items-center justify-center gap-3">
                <div className="w-48 h-px bg-[#EAEBF0]"></div>
                <span className="text-[#717579] text-sm font-['Inter']">or</span>
                <div className="w-48 h-px bg-[#EAEBF0]"></div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onEmailSubmit)} className="w-full flex flex-col gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="w-full flex flex-col gap-2">
                        <FormLabel className="w-full h-5 text-[#323539] font-['Inter'] font-medium text-sm leading-5 tracking-[-0.1px]">
                          Email Address*
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Insert your email"
                            className="w-full h-[46px] px-4 py-3 rounded-[5px] border border-[#E5E5E7] text-[#858C95] font-['Inter'] text-[15px] leading-[22px] tracking-normal placeholder:text-[#858C95]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full h-[46px] px-5 py-3 rounded-[5px] bg-[#268771] text-white font-['Inter'] font-medium text-[15px] leading-[22px] tracking-normal shadow-sm"
                  >
                    Sign up
                  </Button>
                  <div className="w-full flex items-center justify-start gap-4 h-6">
                    <span className="text-[#858C95] font-['Inter'] font-normal text-base leading-6 tracking-normal">
                      Already have an account?
                    </span>
                    <a
                      href="/login" // Link to the login page
                      className="text-[#268771] font-['Inter'] font-normal text-base leading-6 tracking-normal rounded-[5px]"
                    >
                      Log in
                    </a>
                  </div>
                </form>
              </Form>
           </div>
        </div>

        <div className="hidden md:flex w-[792px] h-full relative overflow-hidden">
           <Image
             src="/images/Rectangle 3.png"
             alt="Signup page banner"
             fill
             className="object-cover"
             priority
           />
        </div>
      </div>
    </div>
  );
};
export default Signup;
