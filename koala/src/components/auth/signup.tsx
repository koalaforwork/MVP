import React from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const signupFormSchema = z.object({
  email: z.string().email('Invalid email address'),
});


const Signup = () => {
  const form = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: '',
    },
  });

  function onSubmit(values: z.infer<typeof signupFormSchema>) {
    console.log("signup form submitted with" ,values);
    // TODO: Handle signup logic using supabase auth
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
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-6">
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
                  <div className="w-full flex items-center justify-start gap-4 h-6"> {/* Container div */}
                    <span className="text-[#858C95] font-['Inter'] font-normal text-base leading-6 tracking-normal"> {/* Text styles */}
                      Already have an account?
                    </span>
                    {/* Using a simple <a> tag for the link */}
                    <a
                      href="/login" // TODO: Replace with router Link component if using @tanstack/react-router
                      className="text-[#268771] font-['Inter'] font-normal text-base leading-6 tracking-normal rounded-[5px]" // Link styles
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
