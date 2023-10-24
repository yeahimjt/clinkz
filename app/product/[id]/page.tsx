'use client';

import Nav from '@/app/components/nav';
import Product from '@/app/components/product';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function Page() {
  const pathname = usePathname();
  const id = pathname.split('/')[2];
  return (
    <main className='section-padding-x mx-auto max-w-[1440px]'>
      <Nav />
      <Product id={id} />
    </main>
  );
}
