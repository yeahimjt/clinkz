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
import { checkMonthlyLinks, getListCount } from '@/lib/actions/client';
import { createNewList, handleScrapeAndStore, updateList } from '@/lib/actions';
const List_Dialog = () => {
  const { modalType, isOpen, closeModal, setRefresh, productID } =
    useModalStore();
  const [newName, setNewName] = useState<string>('');
  const [amazonLink, setAmazonLink] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [user] = useAuthState(auth);
  const subscription = useSubscriptionStore((state) => state.subscription);

  const checkValidURL = (url: string) => {
    try {
      const parsedURL = new URL(url);
      const hostname = parsedURL.hostname;
      if (
        hostname.includes('amazon.com') ||
        hostname.includes('amazon.') ||
        hostname.endsWith('amazon')
      ) {
        return true;
      }
    } catch (error: any) {
      return false;
    }
    return false;
  };
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
        setRefresh(true);
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
  const handleAddItem = async () => {
    console.log('in here');
    const isValidLink = checkValidURL(amazonLink);
    if (!isValidLink) {
      toast({
        title: 'Invalid Link',
        description: 'Please provide a valid Amazon link.',
      });
      return;
    }
    if (!user) {
      return;
    } else {
      const monthlyLinks = await checkMonthlyLinks(user.uid);
      const monthlyLimit = subscription ? 20 : 5;
      if (!(monthlyLinks < monthlyLimit)) {
        toast({
          title: 'Limit Reached',
          description: `You have reached your limit of ${monthlyLimit} monthly amazon product links.`,
        });
        return;
      }
      try {
        setIsLoading(true);
        const product = await handleScrapeAndStore(amazonLink, user.uid);
        // Add redirect if product is returned, this means that their item is succesfully grabbed and being tracked (take them to newly created item page).
        setRefresh(true);
        if (product) {
          updateList(productID!, product);
          closeModal();
          toast({
            title: 'Action succeeded',
            description: 'Your amazon product has been added to your list.',
          });
        } else {
          closeModal();
          toast({
            title: 'Action failed',
            description:
              'Unsuccessful attempt storing your amazon product. Please try again later',
          });
        }
      } catch (error) {
        console.log('it failed all the way on top');
      } finally {
        setIsLoading(false);
      }
    }
  };
  const handleNewName = (productId: string) => {
    setNewName(productId);
  };
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={closeModal}>
        {modalType === 'new_list' && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new list</DialogTitle>
              <DialogDescription>
                store as many items under this list to view when the best time
                to purchase is
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
        )}
        {modalType === 'add_item_inner' && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add item to this list</DialogTitle>
              <DialogDescription>
                You can remove item from list at any time
              </DialogDescription>
            </DialogHeader>
            <Input
              value={amazonLink}
              placeholder='Enter a amazon product link'
              onChange={(e) => setAmazonLink(e.target.value)}
            />
            <Button
              className='border bg-my-blue hover:border-my-blue hover:bg-white hover:text-my-blue'
              disabled={isLoading}
              onClick={handleAddItem}
            >
              {isLoading ? 'Adding...' : 'Add'}
            </Button>
            <Button
              className='border border-my-light-gray bg-white text-my-black hover:border-my-blue hover:bg-white'
              onClick={() => closeModal()}
            >
              Cancel
            </Button>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default List_Dialog;
