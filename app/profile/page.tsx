'use client';

import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import Profile from '../components/profile';
import Nav from '../components/nav';
import Profile_Nav from '../components/profile_nav';
import Unauthorized from '../components/unauthorized';
import Auth_Dialog from '../components/dialog';
import { redirect } from 'next/navigation';

const Page = () => {
  const [user, isLoading] = useAuthState(auth);
  return (
    <main className='section-padding-x mx-auto h-screen max-w-[1440px]'>
      <Nav />
      {user === null && !isLoading ? redirect('/') : <Profile />}
      <Auth_Dialog />
    </main>
  );
};

export default Page;
