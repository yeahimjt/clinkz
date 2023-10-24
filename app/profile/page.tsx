import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import Profile from '../components/profile';
import Nav from '../components/nav';
import Profile_Nav from '../components/profile_nav';

const page = () => {
  return (
    <main className='section-padding-x mx-auto h-screen max-w-[1440px]'>
      <Nav />
      <Profile />
    </main>
  );
};

export default page;
