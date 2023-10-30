'use client';

import { getProduct } from '@/lib/actions';
import React, { useEffect, useState } from 'react';
import { Product } from '../constants';
import Image from 'next/image';
import Current from '@/public/icons/current.svg';
import Best from '@/public/icons/fire.svg';
import Highest from '@/public/icons/highest.svg';
import Track from '@/public/icons/track.svg';
import Redirect from '@/public/icons/redirect.svg';
import Add_List from '@/public/icons/add_list.svg';
import { AlignVerticalSpaceAround, Flame, TrendingUp } from 'lucide-react';
import { ThumbsUp } from 'lucide-react';
import { ArrowDown } from 'lucide-react';
interface ProductProps {
  id: string;
}
const Product = ({ id }: ProductProps) => {
  const [product, setProduct] = useState<Product | null>(null);
  useEffect(() => {
    async function handleDataGrab() {
      let returned = await getProduct(id);
      if (!returned) return;

      setProduct(returned);
    }
    handleDataGrab();
  }, []);
  return (
    <section className='my-12 flex h-[429px] flex-col gap-[20px]  p-4  md:flex-row'>
      <div className='relative flex-[0.5]'>
        {product?.image && (
          <Image src={product?.image} width={568} height={385} alt='' />
        )}
      </div>
      <div className='flex-[0.5]'>
        <div className='flex h-full flex-col'>
          <div className='flex-[0.3]'>
            <h1 className='font-bold'>{product?.title}</h1>
            <div className='my-2  flex gap-[10px]'>
              <div className='flex items-center gap-[5px]'>
                <Image
                  src='/icons/star.png'
                  width={25}
                  height={25}
                  alt='rating icon'
                />
                <h3>{product?.rating}</h3>
              </div>
              <h2>{product?.rating_count} reviews</h2>
            </div>
            <div className=' z-20 flex items-center gap-[10px]'>
              <button className='h-[40px] w-[40px] rounded-[5px] border border-my-gray p-2'>
                <Image
                  className='mx-auto'
                  src={Track}
                  width={30}
                  height={30}
                  alt='track icon'
                />
              </button>
              <button className='h-[40px] w-[40px] rounded-[5px] border border-my-gray p-2'>
                <Image
                  className='mx-auto'
                  src={Redirect}
                  width={30}
                  height={30}
                  alt='go to icon'
                />
              </button>
              <button className='h-[40px] w-[40px] rounded-[5px] border border-my-gray p-2'>
                <Image
                  className='mx-auto'
                  src={Add_List}
                  width={30}
                  height={30}
                  alt='add to list icon'
                />
              </button>
            </div>
          </div>
          <div className='flex flex-[0.7] items-end justify-end'>
            <div className='grid flex-[1]  grid-cols-2 items-end justify-end gap-[10px]'>
              <div className='flex items-center justify-center gap-[5px] border border-my-gray/10 bg-my-blue/10 '>
                <Flame className='h-[40px] w-[40px]' />${product?.lowest_price}
              </div>
              <div className='flex items-center justify-center gap-[5px] border border-my-gray/10 bg-my-blue/10 '>
                <ArrowDown className='h-[40px] w-[40px]' />$
                {product?.current_price}
              </div>
              <div className='flex items-center justify-center gap-[5px] border border-my-gray/10 bg-my-blue/10 '>
                <TrendingUp className='h-[40px] w-[40px] ' />$
                {product?.highest_price}
              </div>
              <div className='flex items-center justify-center gap-[5px] border border-my-gray/10 bg-my-blue/10 '>
                <AlignVerticalSpaceAround className='h-[40px] w-[40px]' />$
                {product?.average_price}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Product;
