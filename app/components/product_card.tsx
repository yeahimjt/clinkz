'use client';
import Image from 'next/image';
import React from 'react';
import { Product } from '../constants';

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { useModalStore } from '../states';
import ProductButtons from './productbuttons';
interface ProductProps {
  product: Product;
}
const Product_Card = ({ product }: ProductProps) => {
  const { setModalType, openModal } = useModalStore();
  return (
    <div className=' w-[254px] rounded-[10px] border border-my-light-gray/70 p-2 shadow-md hover:scale-[1.01]'>
      <Link href={`/product/${product.id}`}>
        <div className='h-[148px]'>
          {product.image && (
            <Image
              className='mx-auto'
              src={product.image}
              width={120}
              height={120}
              alt={product.title + ` image`}
            />
          )}
          <h2 className='h-[62px] overflow-hidden overflow-ellipsis py-2 text-[12px] text-my-black'>
            {product.title}
          </h2>
        </div>
        <section className='flex justify-between  pt-[25px]'>
          <div className='flex items-center gap-[5px]'>
            <Image
              src='/icons/star.png'
              width={25}
              height={25}
              alt='rating icon'
            />
            <h3>{product.rating}</h3>
          </div>
          <ProductButtons id={product.id!} url={product.url} />
        </section>
      </Link>
    </div>
  );
};

export default Product_Card;
