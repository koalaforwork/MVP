import React from 'react';
import Image from 'next/image';

const Signup = () => {
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
              <p className="text-center text-sm">More form elements will go here.</p>
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
