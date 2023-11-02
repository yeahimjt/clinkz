import { Search } from 'lucide-react';
import React from 'react';
import Nav from '../components/nav';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SearchPage from '../components/search';

const Page = () => {
  return (
    <div className='section-padding-x mx-auto max-w-[1440px]'>
      <Nav />
      <SearchPage />
    </div>
  );
};

export default Page;
