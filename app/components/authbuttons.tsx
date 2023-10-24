'use client';

import React, { useEffect } from 'react';
import { auth } from '@/app/firebase';
import Image from 'next/image';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { useModalStore } from '../states';
const AuthButtons = () => {
  const [signInWithGoogle, userGoogle, loadingGoogle, errorGoogle] =
    useSignInWithGoogle(auth);
  const { closeModal } = useModalStore();
  useEffect(() => {
    if (userGoogle) {
      closeModal();
    }
  }, [userGoogle]);
  return (
    <div className='flex justify-center pt-4'>
      <button
        className='bg-my-light-gray/50 hover:bg-my-light-gray rounded-full'
        onClick={() => signInWithGoogle()}
      >
        <Image
          src='/icons/google.png'
          width={45}
          height={45}
          alt='google sign in option'
        />
      </button>
      {errorGoogle && <p className='text-red-500'>{errorGoogle.message}</p>}
    </div>
  );
};

export default AuthButtons;
