'use client';
import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { onSnapshot } from 'firebase/firestore';
import { subscriptionRef } from '../converters/Subscription';
import { useSubscriptionStore } from '../states';
const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const [user] = useAuthState(auth);
  const setSubscription = useSubscriptionStore(
    (state) => state.setSubscription
  );
  useEffect(() => {
    if (!user) return;
    return onSnapshot(
      subscriptionRef(user?.uid),
      (snapshot) => {
        if (snapshot.empty) {
          console.log('User has no subscription');
          setSubscription(null);
          return;
        } else {
          console.log('User has subscription');
          setSubscription(snapshot.docs[0].data());
        }
      },
      (error: any) => {
        console.log('Error getting document:', error);
      }
    );
  }, [user]);
  return <div>{children}</div>;
};

export default SubscriptionProvider;
