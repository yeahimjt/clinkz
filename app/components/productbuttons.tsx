'use client';

import Image from 'next/image';
import React from 'react';
import Track from '@/public/icons/track.svg';
import Redirect from '@/public/icons/redirect.svg';
import Add_List from '@/public/icons/add_list.svg';
import { useModalStore } from '../states';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { Mailbox, Blocks } from 'lucide-react';
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
    setProductID(id);
    setModalType('add_list');
    openModal();
  };
  return (
    <div className=' z-20 flex items-center gap-[10px]'>
      <button
        className='rounded-[5px] border  p-1 hover:border-my-blue'
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
        <Mailbox className='h-[30px] w-[30px]' />
      </button>
      <button
        className='rounded-[5px] border p-1 hover:border-my-blue'
        onClick={
          user
            ? (e) => handleAddClick(e)
            : (e) => {
                e.preventDefault();
                setModalType('auth');
                openModal();
              }
        }
      >
        <Blocks className='h-[30px] w-[30px]' />
      </button>
    </div>
  );
};

export default ProductButtons;
