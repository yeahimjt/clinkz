'use client';
import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import React, { EventHandler, useEffect, useState } from 'react';
import { useModalStore, useSubscriptionStore } from '../states';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { Input } from '@/components/ui/input';
import { createNewList, getLists, updateList } from '@/lib/actions';
import { toast } from '@/components/ui/use-toast';
import { getListCount } from '@/lib/actions/client';

const Add_List = () => {
  const { productID, setProductID, closeModal, modalType, isOpen } =
    useModalStore();
  const [newName, setNewName] = useState<string>('');
  const [optionSelected, setOptionSelected] = useState<string>('');
  const subscription = useSubscriptionStore((state) => state.subscription);
  const [lists, setLists] = useState<
    | { items: string[]; name: string; owner: string; id?: string }[]
    | null
    | undefined
  >(null);

  const [user] = useAuthState(auth);
  useEffect(() => {
    async function handleListGrab() {
      if (!user) return;
      const lists = await getLists(user.email!);
      if (lists === null) return;
      setLists(lists);
    }
    if (isOpen && modalType === 'add_list') {
      handleListGrab();
    }
  }, [isOpen]);
  const handleAddList = async () => {
    if (!user || !productID) return;
    const userListCount = await getListCount(user.email!);

    // People with upgraded subscription have unlimited list access, others have a limit of
    if (subscription ? false : newName !== '' && userListCount < 5) {
      toast({
        title: 'Limit Reached',
        description:
          'Upgrade your subscription to get access to unlimited lists.',
      });
      return;
    }
    const returned =
      optionSelected === ''
        ? await createNewList(newName, user.email!, [productID])
        : await updateList(optionSelected, productID);
    if (returned) {
      toast({
        title: 'Amazon product added to list',
        description: 'Go to list to view details',
      });
      setNewName('');
      setOptionSelected('');
      closeModal();
    } else {
      toast({
        title: 'New list creation failed',
        description:
          'Your new list and amazon product was not successfully created. Try again',
      });
    }
  };
  const handleClose = () => {
    setProductID('');
    closeModal();
  };
  const handleSelectedOption = (productId: string) => {
    setNewName('');
    setOptionSelected(productId);
  };
  const handleNewName = (productId: string) => {
    setOptionSelected('');
    setNewName(productId);
  };
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          Select which list you would like to add this item to.
        </DialogTitle>
        <DialogDescription>Only one option can be selected.</DialogDescription>
      </DialogHeader>
      <div className='flex flex-wrap gap-[20px]'>
        {lists?.map((list, index) => (
          <Button
            key={index}
            className={`w-fit rounded-[5px] border border-my-light-gray/70 bg-white px-[11px] py-[16px] text-[10px] text-black shadow-md hover:border-my-blue hover:bg-white ${
              optionSelected === list.id
                ? 'hover:border-my-white border border-my-blue hover:border-0'
                : ''
            }`}
            onClick={(e) => handleSelectedOption(list.id ? list.id : '')}
          >
            <h2>{list.name}</h2>
          </Button>
        ))}
      </div>

      <DialogHeader>
        <DialogTitle>or</DialogTitle>
        <DialogDescription>create a new list for this item</DialogDescription>
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
        onClick={handleClose}
      >
        Cancel
      </Button>
    </DialogContent>
  );
};

export default Add_List;
