'use client';
import Link from 'next/link';
import React from 'react';
import Logo from '@/public/icons/logo.svg';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';

const Footer = () => {
  return (
    <footer className='mb-8 mt-64 flex flex-col gap-[100px] rounded-[20px] bg-my-blue px-[61px] py-[37px] text-white'>
      <div className='flex flex-col justify-between gap-[20px] lg:flex-row'>
        <div>
          <h1 className='text-[25px]'>Sign up to our newsletter</h1>
          <p>Stay up to date with the latest news, and announcements</p>
        </div>
        <form
          //   ref={formRef}
          className='flex gap-[20px]'
          //   onSubmit={(e) => handleSubmit(e)}
        >
          <input
            id='searchURL'
            // value={searchURL}
            className={`// searchURL === '' && hoveringSubmit 
            ?   'scale-[1.01]' : 'scale-100' w-full rounded-[10px] border border-my-gray px-4 transition-all
            `}
            placeholder='Enter your email'
            type='text'
            // onChange={(e) => setSearchURL(e.target.value)}
          />
          <button
            // disabled={searchURL === ''}
            // onMouseOver={() =>
            //   searchURL === '' ? setHoveringSubmit(true) : ''
            // }
            // onMouseLeave={() =>
            //   searchURL === '' ? setHoveringSubmit(false) : ''
            // }
            className='w-[140px] rounded-[10px] bg-my-yellow px-4 py-2 text-my-black disabled:bg-my-gray'
          >
            {false ? 'Searching...' : 'Subscribe'}
          </button>
        </form>
      </div>
      <div className='flex flex-col gap-[40px] sm:flex-row'>
        <div className='flex flex-[0.5] flex-col gap-[40px] md:flex-[0.3]'>
          <Link href='/' className='flex gap-[10px]'>
            <Image src={Logo} width={30} height={30} alt='clinkz logo' />
            <h1 className='text-[23px]'>Clinkz</h1>
          </Link>
          <p>
            Easily categorize your wishlist, discover the best prices, and share
            curated lists, starting your journey to smarter savings with Clinkz.
          </p>
        </div>
        <div className='flex flex-[0.5] flex-col gap-[40px] md:flex-[0.7] md:flex-row'>
          <div className='flex flex-col gap-[10px]'>
            <h1 className='text-[25px]'>Quick Links</h1>
            <p>Privacy</p>
            <p>Terms of Service</p>
            <p>FAQs</p>
          </div>
          <div className='flex flex-col gap-[10px]'>
            <h1 className='text-[25px]'>Navigation</h1>
            <p>Home</p>
            <p>Subscritions</p>
            <p>Lists</p>
            <p>Profile</p>
          </div>
          <div className='flex flex-col gap-[10px]'>
            <h1 className='text-[25px]'>Contact</h1>
            <p>yeahimjt@gmail.com</p>
          </div>
        </div>
      </div>
      <div>
        <Separator />
        <div className='mt-4 flex justify-between'>
          <p>2023 &c; Clinkz</p>
          <p>Designed & Developed By Jonathan Trevino</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
