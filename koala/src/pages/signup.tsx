import React from "react";
import Image from "next/image";
import { set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "@tanstack/react-router";

const signupFormSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onEmailSubmit(values: z.infer<typeof signupFormSchema>) {
    setLoading(true);
    setError(null);
    setEmailSent(false);

    const redirectUrl = `${window.location.origin}/`;

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
      setError(
        error.message || "An unexpected error occured. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function onGoogleSignup() {
    setLoading(true);
    setError(null);

    const redirectUrl = `${window.location.origin}/`;

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error("Error signing up with Google:", error);
      setError(
        error.message || "An unexpected error occured. Please try again."
      );
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
            <button
              onClick={onGoogleSignup}
              disabled={loading}
              className="w-full h-[46px] bg-white border border-[#E5E5E7] rounded-[5px] px-4 py-3 flex items-center justify-center gap-2 shadow-[0_1px_2px_0_#1018280A]"
            >
              <img
                src="/icons/google-logo.png"
                alt="Google logo"
                className="h-5 w-5"
              />
              <span className="text-[#323539] font-['Inter'] font-semibold text-[15px] leading-[22px] tracking-normal">
                Sign up with Google
              </span>
            </button>
            <div className="w-full h-6 flex items-center justify-center gap-3">
              <div className="w-48 h-px bg-[#EAEBF0]"></div>
              <span className="text-[#717579] text-sm font-['Inter']">or</span>
              <div className="w-48 h-px bg-[#EAEBF0]"></div>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onEmailSubmit)}
                className="w-full flex flex-col gap-6"
              >
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
                {error && (
                  <div className="w-full p-4 rounded-[5px] bg-[#FEF2F2] border border-[#DC2626] text-[#DC2626] font-['Inter'] text-[15px] leading-[22px]">
                    <div className="flex items-start gap-3">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z"
                          fill="#DC2626"
                        />
                      </svg>
                      <div>
                        <p className="font-medium">Error</p>
                        <p className="mt-1 text-[14px] leading-[20px] text-[#7F1D1D]">
                          {error}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {emailSent && (
                  <div className="w-full p-4 rounded-[5px] bg-[#EBF9F6] border border-[#268771] text-[#268771] font-['Inter'] text-[15px] leading-[22px]">
                    <div className="flex items-start gap-3">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z"
                          fill="#268771"
                        />
                      </svg>
                      <div>
                        <p className="font-medium">Magic link sent!</p>
                        <p className="mt-1 text-[14px] leading-[20px] text-[#3D4A3F]">
                          Check your email inbox and click the link to continue.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

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
                  <button
                    type="button"
                    onClick={form.handleSubmit(onEmailSubmit)}
                    className="text-[#268771] font-['Inter'] font-normal text-base leading-6 tracking-normal rounded-[5px] bg-transparent border-none cursor-pointer"
                  >
                    Log In
                  </button>
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
