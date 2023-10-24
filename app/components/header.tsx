'use client';

import { handleScrapeAndStore } from '@/lib/actions';
import Image from 'next/image';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { auth } from '@/app/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { redirect } from 'next/navigation';
import { useModalStore } from '../states';

const Header = () => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [searchURL, setSearchURL] = useState<string>('');
  const [hoveringSubmit, setHoveringSubmit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { modalType, isOpen, openModal, closeModal } = useModalStore();

  const [user, loading, error] = useAuthState(auth);

  const checkValidURL = (url: string) => {
    try {
      const parsedURL = new URL(url);
      const hostname = parsedURL.hostname;
      if (
        hostname.includes('amazon.com') ||
        hostname.includes('amazon.') ||
        hostname.endsWith('amazon')
      ) {
        return true;
      }
    } catch (error: any) {
      return false;
    }
    return false;
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValidLink = checkValidURL(searchURL);
    if (!isValidLink) return alert('Please provide a valid Amazon link');
    if (!user) {
      openModal();
    } else {
      try {
        setIsLoading(true);
        const product = await handleScrapeAndStore(searchURL);
        // Add redirect if product is returned, this means that their item is succesfully grabbed and being tracked (take them to newly created item page).
        if (product) {
          redirect(`/product/${product}`);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <header className='flex h-[75vh] flex-col items-center lg:h-fit  lg:flex-row'>
        <section className='flex flex-[0.5] flex-col justify-center gap-[20px]  lg:justify-start'>
          <button className='text-my-blue w-fit'>Get Started -&gt;</button>
          <h1 className='text-my-black text-[41px]'>
            Boost Your Shopping Experience with Clinkz
          </h1>
          <h2 className='text-my-gray'>
            Easily categorize your wishlist, discover the best prices, and share
            curated lists, starting your journey to smarter savings with Clinkz.
          </h2>
          <form
            ref={formRef}
            className='flex gap-[20px]'
            onSubmit={(e) => handleSubmit(e)}
          >
            <input
              id='searchURL'
              value={searchURL}
              className={`border-my-gray w-full rounded-[10px] border px-4 transition-all ${
                searchURL === '' && hoveringSubmit
                  ? 'scale-[1.01]'
                  : 'scale-100'
              }`}
              placeholder='Enter your amazon product link'
              type='text'
              onChange={(e) => setSearchURL(e.target.value)}
            />
            <button
              disabled={searchURL === ''}
              onMouseOver={() =>
                searchURL === '' ? setHoveringSubmit(true) : ''
              }
              onMouseLeave={() =>
                searchURL === '' ? setHoveringSubmit(false) : ''
              }
              className='bg-my-yellow text-my-black disabled:bg-my-gray w-[140px] rounded-[10px] px-4 py-2'
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </section>
        <section className='relative h-[504px] w-full flex-[0.5]'>
          <Image
            className='object-scale-down'
            src='/imgs/header-img.webp'
            fill
            alt='clinkz header image'
          />
        </section>
      </header>
      {/* <Modal isOpen={isOpen} onClose={closeModal}>
        {modalType === 'login' && <Login />}
        {modalType === 'sign-up' && <Sign_Up />}
        {modalType === 'track' && <Track />}
      </Modal> */}
    </>
  );
};

export default Header;
