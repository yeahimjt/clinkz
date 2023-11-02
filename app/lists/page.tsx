'use client';

import React from 'react';
import Nav from '../components/nav';
import Lists from '../components/lists';
import Add_List from '../components/add_list';
import List_Dialog from '../components/list_dialog';
import { Toaster } from '@/components/ui/toaster';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import Unauthorized from '../components/unauthorized';
import Auth_Dialog from '../components/dialog';
import Footer from '../components/footer';

const Page = () => {
  const [user, isLoading] = useAuthState(auth);
  console.log(user);
  return (
    <main className='section-padding-x mx-auto max-w-[1440px]'>
      <Nav />
      {user === null && !isLoading ? <Unauthorized /> : <Lists />}
      <List_Dialog />
      <Auth_Dialog />
      <Toaster />
      <Footer />
    </main>
  );
};

export default Page;
