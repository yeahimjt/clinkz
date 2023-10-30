'use client';

import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSubscriptionStore } from '../states';
import { useRouter } from 'next/navigation';
import { getCheckoutUrl } from '@/lib/stripePayments';
import { app } from '../firebase';
const Subscriptions = () => {
  const router = useRouter();
  const subscription = useSubscriptionStore((state) => state.subscription);
  const [redirecting, setRedirecting] = useState(false);
  const upgradeSubscription = async () => {
    setRedirecting(true);
    const priceId = 'price_1O4hvGLI2RZSgqtdtjs7CLaU';
    const checkoutUrl = await getCheckoutUrl(app, priceId);
    router.push(checkoutUrl);
  };
  return (
    <div className='my-12'>
      <h1 className='text-center text-[28px] font-semibold text-my-black'>
        Unlock <span className='font-bold text-my-blue'>Premium</span> Shopping
        Insights
      </h1>
      <p className='text-center text-my-gray'>
        Supercharge Your Shopping Game with Unlimited Power Tool Access
      </p>
      <div className='mx-auto mt-12 flex w-[90%] gap-[50px]'>
        <div className='flex-[0.5] space-y-2 bg-white px-12  py-8'>
          <h1 className='text-[18px]'>Basic</h1>
          <p className='text-[35px]'>Free</p>
          <p className='text-[14px] text-my-black/90'>
            The Basic Tier is perfect for occasional online shoppers, offering
            essential features for price tracking and organization, enhancing
            your shopping experience.
          </p>
          <div className='flex flex-col gap-[15px] space-y-2 pt-4'>
            <span className='flex gap-[10px]'>
              <CheckCircle2 className='aspect-square w-[25px]' />
              <p>Track up to 5 products at a time.</p>
            </span>
            <span className='flex gap-[10px]'>
              <CheckCircle2 className='aspect-square w-[25px]' />
              <p>
                Receive weekly notifications for price changes on tracked items
              </p>
            </span>
            <span className='flex gap-[10px]'>
              <CheckCircle2 className='aspect-square w-[25px]' />
              <p>Add 5 Amazon product links per month.</p>
            </span>
            <span className='flex gap-[10px]'>
              <CheckCircle2 className='aspect-square w-[25px]' />
              <p>Categorize up to 3 shopping lists.</p>
            </span>
          </div>
        </div>
        <div className='flex-[0.5] space-y-2 rounded-[20px] bg-my-blue/10 px-12  py-8'>
          <h1 className='text-[18px]'>Basic</h1>
          <p className='text-[35px]'>
            5$ <span className='text-[25px]'>/month</span>
          </p>
          <p className='text-[14px] text-my-black/90'>
            The Basic Tier is perfect for occasional online shoppers, offering
            essential features for price tracking and organization, enhancing
            your shopping experience.
          </p>
          <div className='flex flex-col gap-[15px] space-y-2 pt-4'>
            <span className='flex gap-[10px]'>
              <CheckCircle2 className='aspect-square w-[25px]' />
              <p>Track up to 20 products at a time.</p>
            </span>
            <span className='flex gap-[10px]'>
              <CheckCircle2 className='aspect-square w-[25px]' />
              <p>
                Receive weekly notifications for price changes on tracked items
              </p>
            </span>
            <span className='flex gap-[10px]'>
              <CheckCircle2 className='aspect-square w-[25px]' />
              <p>Add 20 Amazon product links per month.</p>
            </span>
            <span className='flex gap-[10px]'>
              <CheckCircle2 className='aspect-square w-[25px]' />
              <p>Categorize an unlimited number of shopping lists.</p>
            </span>
          </div>
          <div className='flex justify-end pt-5'>
            <Button
              className='flex border bg-my-blue hover:border-my-blue hover:bg-white hover:text-black'
              onClick={() => upgradeSubscription()}
            >
              {redirecting
                ? 'Redirecting...'
                : subscription === null
                ? 'Upgrade To Plan'
                : 'Manage Subscription'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;
