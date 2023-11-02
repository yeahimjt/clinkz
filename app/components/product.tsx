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
import {
  AlignVerticalSpaceAround,
  Flame,
  FlipVertical2,
  Tag,
  TrendingUp,
} from 'lucide-react';
import { ThumbsUp } from 'lucide-react';
import { ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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
    <>
      <section className='my-12 flex h-fit flex-col gap-[20px]  p-4  md:flex-row'>
        <div className='relative flex-[0.5]'>
          {product?.image && (
            <Image
              className='object-scale-down'
              src={product?.image}
              width={568}
              height={385}
              alt=''
            />
          )}
        </div>
        <div className='flex-[0.5]'>
          <div className='flex h-full flex-col'>
            <div className='flex-[0.3]'>
              <h1 className='text-[25px] font-bold'>{product?.title}</h1>
              <div className='flex justify-between'>
                <div className='my-2  flex items-end gap-[20px]'>
                  <div className='flex items-center gap-[5px]'>
                    <Image
                      src='/icons/star.png'
                      width={40}
                      height={40}
                      alt='rating icon'
                    />
                    <h3 className='text-[25px]'>{product?.rating}</h3>
                  </div>
                  <h2 className='text-[18px] font-light'>
                    {product?.rating_count} reviews
                  </h2>
                </div>
                <div className='flex items-center justify-end gap-[10px]'>
                  <ThumbsUp className='h-[25px] w-[25px]' />
                  <h2 className='font-extralight'>
                    <span className='font-bold text-green-400'>
                      {product?.recommend}
                    </span>{' '}
                    people recommend this product
                  </h2>
                </div>
              </div>
              <h1 className='my-2 text-gray-800 underline'>Visit Product</h1>
            </div>
            <Separator className='my-12' />
            <div className='flex h-full flex-[0.7] items-end justify-end'>
              <div className='grid flex-[1]  grid-cols-2 items-end justify-end gap-[10px] text-[20px]'>
                <div className='flex items-center justify-center gap-[15px] border border-my-gray/10 bg-my-blue/10 p-2 '>
                  <Flame className='h-[40px] w-[40px] text-orange-500' />$
                  {product?.lowest_price}
                </div>
                <div className='flex items-center justify-center gap-[15px] border border-my-gray/10 bg-my-blue/10 p-2 '>
                  <Tag className='h-[40px] w-[40px] text-green-500' />$
                  {product?.current_price}
                </div>
                <div className='flex items-center justify-center gap-[15px] border border-my-gray/10 bg-my-blue/10 p-2 '>
                  <TrendingUp className='h-[40px] w-[40px] text-red-500' />$
                  {product?.highest_price}
                </div>
                <div className='flex items-center justify-center gap-[15px] border border-my-gray/10 bg-my-blue/10 p-2 '>
                  <FlipVertical2 className='h-[40px] w-[40px] text-my-blue' />$
                  {product?.average_price}
                </div>
              </div>
            </div>
            <Separator className='my-12' />
            <div className='mt-6 flex gap-[20px]'>
              <Button className=' flex-[0.8] border bg-my-blue hover:border-my-blue hover:bg-white hover:text-black'>
                Track Product
              </Button>
              <Button className='flex-[0.2] border border-my-blue bg-white text-black hover:bg-my-blue hover:text-white'>
                Add To List
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* <h1 className='text-[20px] font-medium'>Product Description</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus
        ad ut, recusandae nihil cum harum quidem nobis ullam quis rem quisquam,
        incidunt doloribus voluptatem aperiam labore nemo nisi quos quasi.
      </p> */}
    </>
  );
};

export default Product;
