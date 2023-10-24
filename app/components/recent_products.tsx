'use client';
import { grabRecent } from '@/lib/actions';
import React, { useEffect, useState } from 'react';
import { Product } from '../constants';
import Product_Card from './product_card';
import path from 'path';
import { usePathname } from 'next/navigation';

const Recent_Products = () => {
  const [products, setProducts] = useState<Product[] | null>(null);
  const pathname = usePathname();

  useEffect(() => {
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
  console.log(products);
  return (
    <section>
      <h1 className='text-my-black text-[25px]'>Recently Searched Products</h1>
      <div className='my-4 flex gap-[40px]'>
        {products?.map((product, index) => (
          <Product_Card key={index} product={product} />
        ))}
      </div>
    </section>
  );
};

export default Recent_Products;
