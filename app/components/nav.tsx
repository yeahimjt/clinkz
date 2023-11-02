'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Logo from '@/public/icons/logo.svg';
import Image from 'next/image';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useModalStore } from '../states';
import { Search, List, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
const Nav = () => {
  const [user, loading, error] = useAuthState(auth);

  // Retrieve auth modal from zustand states (destructure them)
  const { setModalType, openModal } = useModalStore();
  const handleLoginModal = () => {
    setModalType('auth');
    openModal();
  };
  return (
    <nav className='flex items-center justify-between py-[33px]'>
      <div className='flex items-center gap-[40px]'>
        <Link href='/' className='flex gap-[20px]'>
          <Image
            src={'/icons/logo.png'}
            width={60}
            height={60}
            alt='clinkz logo'
          />
          <h1 className='text-[41px] text-my-black'>Clinkz</h1>
        </Link>
        {/* <Link className='font-semibold text-my-black' href='/features'>
          Features
        </Link> */}
        <Link className='font-semibold text-my-black' href='/subscriptions'>
          Subscriptions
        </Link>
      </div>
      <section className='flex items-center gap-[65px]'>
        <Link href='/search'>
          <Search className='h-[25px] w-[25px]' />
        </Link>
        <Link href='/lists'>
          <List className='h-[25px] w-[25px]' />
        </Link>
        {user ? (
          <Link href={'/profile'} className='group relative'>
            <Button className='w-[100px] border bg-my-blue hover:border-my-blue hover:bg-white hover:text-black'>
              <User className='h-[25px] w-[25px]' />
            </Button>
          </Link>
        ) : (
          <Button
            className='w-[100px] border bg-my-blue hover:border-my-blue hover:bg-white hover:text-black'
            onClick={() => handleLoginModal()}
          >
            <p>Login</p>
          </Button>
        )}
      </section>
    </nav>
  );
};

export default Nav;
