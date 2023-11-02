'use client';

import React, { useEffect } from 'react';
import { useModalStore } from '../states';
const Unauthorized = () => {
  const { openModal, setModalType } = useModalStore();
  useEffect(() => {
    setModalType('auth');
    openModal();
  }, []);
  return (
    <div className='my-12 flex min-h-[70vh] w-full items-start justify-center text-red-500'>
      You must log in to have access to this page.
    </div>
  );
};

export default Unauthorized;
