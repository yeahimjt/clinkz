'use client';
import { grabRecent } from '@/lib/actions/client';
import React, { useEffect, useState } from 'react';
import { Product } from '../constants';
import Product_Card from './product_card';
import path from 'path';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

const Recent_Products = () => {
  const [products, setProducts] = useState<Product[] | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    console.log('its running');
    async function fetchData() {
      try {
        const recentProducts = await grabRecent();

        if (!recentProducts) return;
        setProducts(recentProducts);
      } catch (error) {
        console.log('Error fetching recent data:', error);
      }
    }
    fetchData();
  }, [pathname]);

  return (
    <section className='min-h-[720px]'>
      <h1 className=' text-[25px] text-my-black'>Recently Searched Products</h1>
      <div className='my-4 flex flex-wrap gap-[70px]'>
        {products
          ? products.map((product, index) => (
              <Product_Card key={index} product={product} />
            ))
          : Array.from({ length: 8 }).map((value, index) => (
              <div
                className='border-my-light-gray-70 w-[254px] rounded-[10px] p-2 shadow-md'
                key={index}
              >
                <Skeleton className='mb-2 h-[180px] w-full' />
                <Skeleton className='h-[62px] w-full' />
                <Skeleton className='mt-[25px] h-[65px]' />
              </div>
            ))}
      </div>
    </section>
  );
};

export default Recent_Products;
