'use client';

import React, { useEffect } from 'react';
import { auth } from '@/app/firebase';
import Image from 'next/image';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { useModalStore } from '../states';
import { toast, useToast } from '@/components/ui/use-toast';
const AuthButtons = () => {
  const [signInWithGoogle, userGoogle, errorGoogle] = useSignInWithGoogle(auth);
  const { closeModal } = useModalStore();
  const { toast } = useToast();
  useEffect(() => {
    if (userGoogle) {
      toast({
        title: 'Login Successful',
        description: 'You now have neccessary authorization',
      });
      closeModal();
    }
  }, [userGoogle]);
  return (
    <div className='flex justify-center pt-4'>
      <button
        className='rounded-full bg-my-light-gray/50 hover:bg-my-light-gray'
        onClick={() => signInWithGoogle()}
      >
        <Image
          src='/icons/google.png'
          width={45}
          height={45}
          alt='google sign in option'
        />
      </button>
      {errorGoogle && <p className='text-red-500'></p>}
    </div>
  );
};

export default AuthButtons;
