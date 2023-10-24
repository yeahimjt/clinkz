'use client';

import Image from 'next/image';
import React from 'react';
import Track from '@/public/icons/track.svg';
import Redirect from '@/public/icons/redirect.svg';
import Add_List from '@/public/icons/add_list.svg';
import { useModalStore } from '../states';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

interface ButtonProps {
  id: string;
  url: string;
}
const ProductButtons = ({ id, url }: ButtonProps) => {
  const { setModalType, openModal, setProductID, productID } = useModalStore();
  const [user] = useAuthState(auth);
  const handleTrackClick = (e: any) => {
    e.preventDefault();
    setProductID(id);
    setModalType('track');
    openModal();
  };
  const handleAddClick = (e: any) => {
    e.preventDefault();
  };
  console.log(productID);
  return (
    <div className=' z-20 flex items-center gap-[10px]'>
      <button
        className='border-my-gray hover:bg-my-light-gray h-[40px] w-[40px] rounded-[5px] border p-2'
        onClick={
          user
            ? (e) => handleTrackClick(e)
            : (e) => {
                e.preventDefault();
                setModalType('auth');
                openModal();
              }
        }
      >
        <Image
          className='mx-auto'
          src={Track}
          width={30}
          height={30}
          alt='track icon'
        />
      </button>
      <button className='border-my-gray hover:bg-my-light-gray h-[40px] w-[40px] rounded-[5px] border p-2'>
        <Image
          className='mx-auto'
          src={Add_List}
          width={30}
          height={30}
          alt='add to list icon'
        />
      </button>
      <button className='border-my-gray hover:bg-my-light-gray h-[40px] w-[40px] rounded-[5px] border p-2'>
        <Image
          className='mx-auto'
          src={Redirect}
          width={30}
          height={30}
          alt='go to icon'
        />
      </button>
    </div>
  );
};

export default ProductButtons;
