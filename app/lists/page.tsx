import React from 'react';
import Nav from '../components/nav';
import Lists from '../components/lists';
import Add_List from '../components/add_list';
import List_Dialog from '../components/list_dialog';
import { Toaster } from '@/components/ui/toaster';

const page = () => {
  return (
    <main className='section-padding-x mx-auto max-w-[1440px]'>
      <Nav />
      <Lists />
      <List_Dialog />
      <Toaster />
    </main>
  );
};

export default page;
