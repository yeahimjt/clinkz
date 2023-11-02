'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ProductTable } from '../constants';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { app, auth } from '../firebase';
import { redirect } from 'next/navigation';
import { Pencil, LogOut } from 'lucide-react';
import TrackingDataTable from '../profile/data-table';
import { useRouter } from 'next/navigation';
import {
  getUserTracking,
  updateProductWithoutUserEmail,
  updateUser,
} from '@/lib/actions';
import {
  getAuth,
  signOut,
  updateCurrentUser,
  updateProfile,
} from 'firebase/auth';
import { Separator } from '@/components/ui/separator';
import { getCheckoutUrl } from '@/lib/stripePayments';
import Link from 'next/link';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { subscriptionRef } from '../converters/Subscription';
import { useSubscriptionStore } from '../states';
import { toast, useToast } from '@/components/ui/use-toast';

const Profile = () => {
  const [user, loading, error] = useAuthState(auth);
  const [data, setData] = useState<ProductTable[]>([]);
  const [userChecked, setUserChecked] = useState(false);
  const [triggerUpdate, setTriggerUpdate] = useState(false);
  const subscription = useSubscriptionStore((state) => state.subscription);
  const router = useRouter();
  const columns: ColumnDef<ProductTable>[] = [
    {
      header: 'Title',
      accessorKey: 'title',
    },
    {
      header: 'ID',
      accessorKey: 'id',
    },
    {
      header: 'Current Price',
      accessorKey: 'current_price',
    },
    {
      header: 'Rating',
      accessorKey: 'rating',
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const product = row.original;
        const stopTracking = () => {
          updateProductWithoutUserEmail(user!.uid!, user!.email!, product.id);
          setTriggerUpdate(true);
        };
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem className='cursor-pointer'>
                <a href={product.url} target='_blank' rel='noreferrer'>
                  Go to product page
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem
                className='cursor-pointer'
                onClick={stopTracking}
              >
                Stop Tracking Product
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  useEffect(() => {
    if (!loading) {
      setUserChecked(true);
    }
  }, [loading]);

  const upgradeSubscription = async () => {
    const priceId = 'price_1O4hvGLI2RZSgqtdtjs7CLaU';
    const checkoutUrl = await getCheckoutUrl(app, priceId);

    router.push(checkoutUrl);
  };
  async function waitForTrackingData() {
    console.log(user!.uid);
    const returned_data = await getUserTracking(user!.email!);
    setData(returned_data);
  }
  useEffect(() => {
    if (user || triggerUpdate) {
      waitForTrackingData();
      setTriggerUpdate(false);
    }
    if (user === null && !loading) {
      redirect('/');
    }
  }, [user, triggerUpdate]);
  console.log(subscription);
  return (
    <section className=' my-12 w-full  bg-white'>
      <div className='mb-8 flex justify-between'>
        <h1 className='text-[28px] font-bold text-my-black'>Profile</h1>
        <span className='flex gap-[20px]'>
          <Button
            className='flex items-center gap-[10px] text-[18px] text-my-black'
            variant={'outline'}
          >
            Edit
            <Pencil className='aspect-square w-[15px]' />
          </Button>
          <Button
            className='flex items-center gap-[10px] border bg-red-500 text-[18px] text-white hover:border-red-500 hover:bg-white hover:text-my-black'
            onClick={() => {
              toast({
                title: 'Signed Out',
                description: 'You have been successfully signed out',
              });
              signOut(auth);
            }}
          >
            Sign Out
            <LogOut className='aspect-square w-[15px]' />
          </Button>
        </span>
      </div>

      <div className='flex'>
        <span className='flex flex-[0.2] flex-col gap-[20px] text-my-black'>
          <h2>Email</h2>
          <h2>Name</h2>
          <h2>Subscription</h2>
        </span>
        <span className='relative flex flex-[0.8] flex-col gap-[20px] text-my-gray'>
          <h2>{user?.email}</h2>
          <h2>{user?.displayName}</h2>
          <div className='relative'>
            <div className='absolute'>
              <HoverCard>
                <HoverCardTrigger>
                  <p className='cursor-pointer rounded-[5px] bg-my-blue px-8 py-1 text-white'>
                    {!subscription ? 'Basic' : 'Standard'}
                  </p>
                </HoverCardTrigger>
                <HoverCardContent>
                  <Link href='/subscriptions'>Upgrade Subscription</Link>
                </HoverCardContent>
              </HoverCard>
            </div>
          </div>
        </span>
      </div>

      <h1 className='mb-8 mt-32 text-[28px] font-bold text-my-black'>
        Tracked Items Management
      </h1>

      <div className='flex w-full flex-col'>
        {data ? (
          <TrackingDataTable columns={columns} data={data} />
        ) : (
          <>
            <TrackingDataTable columns={columns} data={data} />
            <p className='text-center text-red-500/60'>
              No tracked items found
            </p>
          </>
        )}
      </div>
    </section>
  );
};

export default Profile;
