'use client';
import React from 'react';
import { useModalStore } from '../states';
import { updateProductWithUserEmail } from '@/lib/actions';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const Track = () => {
  const { productID, setProductID, closeModal } = useModalStore();
  const [user] = useAuthState(auth);
  // User is choosing to track item, handle updating items document to include their email address for cron job updates,
  // also add productID to their tracking array to give them option to cancel.
  const handleTrack = async () => {
    const updated = await updateProductWithUserEmail(
      user!.uid,
      user!.email!,
      productID!
    );
    if (updated) {
      closeModal();
    } else {
      // Implement toast to inform it did not work.
    }
  };
  // Remove product id if user chooses to close modal.
  const handleClose = () => {
    setProductID('');
    closeModal();
  };
  return (
    // <section className='w-[600px] text-center'>
    //   <h2 className='text-[25px]'>
    //     Are you sure you want to track this product?
    //   </h2>
    //   <p className='font-thin'>You have # tracks remaining</p>
    //   <div className='my-6 flex justify-center gap-[20px]'>
    //     <button
    //       className='rounded-[5px] bg-my-blue px-8 py-2 text-white'
    //       onClick={handleTrack}
    //     >
    //       Yes
    //     </button>
    //     <button
    //       className='rounded-[5px] border border-red-500 px-8 py-2 text-red-500'
    //       onClick={handleClose}
    //     >
    //       Cancel
    //     </button>
    //   </div>
    // </section>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you sure you want to track this item?</DialogTitle>
        <DialogDescription>You only have # tracks remaining.</DialogDescription>
      </DialogHeader>
      <Button
        className='border bg-my-blue hover:border-my-blue hover:bg-white hover:text-my-blue'
        onClick={handleTrack}
      >
        Yes
      </Button>
      <Button
        className='border border-my-light-gray bg-white text-my-black hover:border-my-blue hover:bg-white'
        onClick={handleClose}
      >
        Cancel
      </Button>
    </DialogContent>
  );
};

export default Track;
