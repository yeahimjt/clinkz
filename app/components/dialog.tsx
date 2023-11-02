'use client';

import React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { useModalStore } from '../states';
import Auth_Tabs from './auth_tabs';

import Track from './track';
import Add_List from './add_list';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
const Auth_Dialog = () => {
  const { modalType, isOpen, closeModal } = useModalStore();
  const [user, isLoading] = useAuthState(auth);
  return (
    <div className='z-50 bg-white'>
      <Dialog open={isOpen} onOpenChange={closeModal}>
        {modalType === 'auth' && !user && !isLoading ? (
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
        {modalType === 'add_list' ? (
          <>
            <Add_List />
          </>
        ) : (
          ''
        )}
      </Dialog>
    </div>
  );
};

export default Auth_Dialog;
