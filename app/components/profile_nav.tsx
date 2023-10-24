'use client';

import { signOut } from 'firebase/auth';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { auth } from '../firebase';
import { redirect } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';

const Profile_Nav = () => {
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (!user) {
      redirect('/');
    }
  }, [user]);
  return (
    <div className='hidden min-w-[280px] border-r  border-[color:#EFEFEF] bg-[color:#EFEFEF] bg-opacity-30 py-6 xl:block'>
      <Link href='/' className='flex justify-center gap-[10px]'>
        <Image src='/icons/logo.svg' width={40} height={40} alt='clinkz logo' />
        <h1 className='text-[25px]'>Clinkz</h1>
      </Link>
      <nav>
        <button
          className='rounded-[10px] bg-red-500 px-4 py-2 text-white'
          onClick={() => signOut(auth)}
        >
          Sign Out
        </button>
      </nav>
    </div>
  );
};

export default Profile_Nav;
