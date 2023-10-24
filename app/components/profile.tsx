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
import { auth } from '../firebase';
import { redirect } from 'next/navigation';

import TrackingDataTable from '../profile/data-table';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Profile = () => {
  const [user, loading, error] = useAuthState(auth);
  const [data, setData] = useState<ProductTable[]>();
  const [triggerUpdate, setTriggerUpdate] = useState(false);
  const [profileData, setProfileData] = useState<{
    displayName: string;
    email: string;
  }>({
    displayName: user?.displayName || '',
    email: user?.email || '',
  });
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

  async function waitForTrackingData() {
    const returned_data = await getUserTracking(user!.uid);
    setData(returned_data);
  }
  const handleUpdateUser = async () => {
    const succeed = await updateUser(
      user!.uid,
      profileData.displayName,
      profileData.email
    );
    if (succeed) {
      updateProfile(user!, {
        displayName: profileData.displayName,
      });
    } else {
    }
  };
  useEffect(() => {
    if (user || triggerUpdate) {
      waitForTrackingData();
      setTriggerUpdate(false);
    }
    if (!user) {
      redirect('/');
    }
  }, [user, triggerUpdate]);
  return (
    <section className=' my-12 w-full  bg-white'>
      <h1 className='text-[25px] text-my-black'>Account</h1>

      <Tabs defaultValue='account' className=''>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='account'>Profile</TabsTrigger>
          <TabsTrigger value='subscription'>Subscriptions</TabsTrigger>
          <TabsTrigger value='payment'>Payment Details</TabsTrigger>
        </TabsList>
        <TabsContent value='account'>
          <Card className=' border-0 shadow-none'>
            <CardHeader>
              <CardTitle className='text-[16px] font-normal uppercase text-my-black'>
                Account Details
              </CardTitle>
            </CardHeader>
            <CardContent className='grid grid-cols-1 space-y-4 sm:grid-cols-2 sm:space-y-0 md:grid-cols-3'>
              <div className='space-y-1'>
                <Label htmlFor='full_name'>Full Name</Label>
                <p>{user?.displayName}</p>
              </div>
              <div className='space-y-1'>
                <Label htmlFor='email'>Email Address</Label>
                <p>{user?.email}</p>
              </div>
              <div className='space-y-1'>
                <Label htmlFor='email'>Subscription</Label>
                <p className='w-fit rounded-[5px] bg-my-blue px-8 py-1 text-[12px] text-white'>
                  Basic
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='subscription'>
          <Card className=' border-0 shadow-none'>
            <CardHeader>
              <CardTitle>Log In</CardTitle>
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='space-y-1'>
                <Label htmlFor='full_name'>Full Name</Label>
                <p>{user?.displayName}</p>
              </div>
              <div className='space-y-1'>
                <Label htmlFor='email'>Email Address</Label>
                <Input
                  id='email'
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData((profileData) => ({
                      ...profileData,
                      email: e.currentTarget.value,
                    }))
                  }
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Update Profile</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value='payment'>
          <Card className=' border-0 shadow-none'>
            <CardHeader>
              <CardTitle>Log In</CardTitle>
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='space-y-1'>
                <Label htmlFor='full_name'>Full Name</Label>
                <Input
                  id='full_name'
                  value={profileData.displayName}
                  onChange={(e) =>
                    setProfileData((profileData) => ({
                      ...profileData,
                      displayName: e.currentTarget.value,
                    }))
                  }
                />
              </div>
              <div className='space-y-1'>
                <Label htmlFor='email'>Email Address</Label>
                <Input
                  id='email'
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData((profileData) => ({
                      ...profileData,
                      email: e.currentTarget.value,
                    }))
                  }
                  //@ts-ignore
                  placeholder={user ? user.email : undefined}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Update </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      <div className='p-12'>
        {data && <TrackingDataTable columns={columns} data={data} />}
      </div>
    </section>
  );
};

export default Profile;
