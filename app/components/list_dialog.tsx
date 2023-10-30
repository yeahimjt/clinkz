'use client';
import React, { useState } from 'react';
import { useModalStore, useSubscriptionStore } from '../states';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { getListCount } from '@/lib/actions/client';
import { createNewList } from '@/lib/actions';
const List_Dialog = () => {
  const { modalType, isOpen, closeModal } = useModalStore();
  const [newName, setNewName] = useState<string>('');
  const [user] = useAuthState(auth);
  const subscription = useSubscriptionStore((state) => state.subscription);

  const handleAddList = async () => {
    if (!user) return;
    const userListCount = await getListCount(user.email!);

    // People with upgraded subscription have unlimited list access, others have a limit of 5.
    console.log('here', userListCount);
    if (subscription ? false : !(userListCount < 3)) {
      toast({
        title: 'Limit Reached',
        description:
          'Upgrade your subscription to get access to unlimited lists.',
      });
      closeModal();
      return;
    } else {
      const returned = await createNewList(newName, user.email!);
      if (returned) {
        toast({
          title: 'Amazon product added to list',
          description: 'Go to list to view details',
        });
        setNewName('');
        closeModal();
      } else {
        toast({
          title: 'New list creation failed',
          description:
            'Your new list and amazon product was not successfully created. Try again',
        });
      }
    }
  };
  const handleNewName = (productId: string) => {
    setNewName(productId);
  };
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new list</DialogTitle>
            <DialogDescription>
              store as many items under this list to view when the best time to
              purchase is
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newName}
            placeholder='Enter a name for new list'
            onChange={(e) => handleNewName(e.target.value)}
          />
          <Button
            className='border bg-my-blue hover:border-my-blue hover:bg-white hover:text-my-blue'
            onClick={handleAddList}
          >
            Add
          </Button>
          <Button
            className='border border-my-light-gray bg-white text-my-black hover:border-my-blue hover:bg-white'
            onClick={() => closeModal()}
          >
            Cancel
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default List_Dialog;
