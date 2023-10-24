'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Logo from '@/public/icons/logo.svg';
import Search from '@/public/icons/search.svg';
import List from '@/public/icons/list.svg';
import User from '@/public/icons/user.svg';
import Image from 'next/image';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useModalStore } from '../states';

const Nav = () => {
  const [user, loading, error] = useAuthState(auth);

  // Retrieve auth modal from zustand states (destructure them)
  const { setModalType, openModal } = useModalStore();

  return (
    <nav className='flex items-center justify-between py-[33px]'>
      <Link href='/' className='flex gap-[20px]'>
        <Image src={Logo} width={60} height={60} alt='clinkz logo' />
        <h1 className='text-[41px]'>Clinkz</h1>
      </Link>
      <section className='flex items-center gap-[65px]'>
        <button>
          <Image src={Search} width={25} height={25} alt='search icon' />
        </button>
        <Link href='/lists'>
          <Image src={List} width={41} height={25} alt='list icon' />
        </Link>
        {user ? (
          <Link href={'/profile'} className='group relative'>
            <Image src={User} width={40} height={25} alt='user icon' />
          </Link>
        ) : (
          <button
            className='group relative'
            onClick={() => {
              setModalType('auth');
              openModal();
            }}
          >
            <Image src={User} width={40} height={25} alt='user icon' />
          </button>
        )}
      </section>
    </nav>
  );
};

export default Nav;
