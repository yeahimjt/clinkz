'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useModalStore } from '../states';
import Auth_Tabs from './auth_tabs';
import AuthButtons from './authbuttons';
import Track from './track';
const Auth_Dialog = () => {
  const { modalType, isOpen, closeModal } = useModalStore();
  return (
    <div className='z-50 bg-white'>
      <Dialog open={isOpen} onOpenChange={closeModal}>
        {modalType === 'auth' ? (
          <>
            <Auth_Tabs />
          </>
        ) : (
          ''
        )}
        {modalType === 'track' ? (
          <>
            <Track />
          </>
        ) : (
          ''
        )}
      </Dialog>
    </div>
  );
};

export default Auth_Dialog;
