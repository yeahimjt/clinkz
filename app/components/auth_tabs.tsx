import React, { FormEvent, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useCreateUserWithEmailAndPassword,
  useSignInWithEmailAndPassword,
} from 'react-firebase-hooks/auth';
import { auth, firestore } from '../firebase';
import { useModalStore } from '../states';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { FIREBASE_ERRORS } from '../constants';
import { DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import AuthButtons from './authbuttons';

const Auth_Tabs = () => {
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    password: string;
  }>({ name: '', email: '', password: '' });

  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  const { setModalType, closeModal } = useModalStore();

  // Submit attempt to sign up with credentials
  const handleSubmit = async (e: FormEvent<HTMLElement>) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(formData.email, formData.password);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    // User will be logged in with email and password, update local user profile and firestore database profile
    if (user) {
      // Update locally
      updateProfile(user.user, {
        displayName: formData.name,
      });

      // Update to firestore database
      const userDoc = doc(firestore, 'users', user.user.uid);

      const dataToUpdate = {
        displayName: formData.name,
        email: user.user.email,
        uid: user.user.uid,
        refreshToken: user.user.refreshToken,
        emailVerified: user.user.emailVerified,
      };

      const uploadUser = setDoc(userDoc, dataToUpdate, { merge: true });

      // If no errors raised, close modal for seamless UI experience to continue on actions that initiated log-in/sign-in request
      closeModal();
    }
  }, [user]);

  const [signInWithEmailAndPassword, userLogin, loadingLogin, errorLogin] =
    useSignInWithEmailAndPassword(auth);

  // Retrieve general modal from zustand states (destructure them)

  // Submit attempt to log in with credentials
  const handleLogin = (e: FormEvent<HTMLElement>) => {
    e.preventDefault();
    signInWithEmailAndPassword(formData.email, formData.password);
  };

  useEffect(() => {
    // User will be logged in, close modal for seamless UI experience.
    console.log(userLogin);
    if (userLogin) {
      closeModal();
    }
  }, [userLogin]);

  console.log(error?.code);
  return (
    <DialogContent>
      <DialogHeader className='mx-auto my-2'>
        <Tabs defaultValue='account' className=' w-[400px]'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='account'>Log In</TabsTrigger>
            <TabsTrigger value='password'>Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value='account'>
            <Card className=' border-0 shadow-none'>
              <CardHeader>
                <CardTitle>Log In</CardTitle>
              </CardHeader>
              <CardContent className='space-y-2'>
                <div className='space-y-1'>
                  <Label htmlFor='email_address'>Email Address</Label>
                  <Input
                    id='email_address'
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.currentTarget.value })
                    }
                  />
                </div>
                <div className='space-y-1'>
                  <Label htmlFor='password'>Password</Label>
                  <Input
                    id='password'
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password: e.currentTarget.value,
                      })
                    }
                  />
                  {errorLogin && (
                    <p className='text-center text-red-500'>
                      {FIREBASE_ERRORS[errorLogin.code]}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleLogin}>Login</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value='password'>
            <Card className='border-0 shadow-none'>
              <CardHeader>
                <CardTitle>Sign Up</CardTitle>
              </CardHeader>
              <CardContent className='space-y-2'>
                <div className='space-y-1'>
                  <Label htmlFor='full_name'>Full Name</Label>
                  <Input
                    id='full_name'
                    value={formData.name}
                    type='text'
                    required
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.currentTarget.value })
                    }
                  />
                </div>
                <div className='space-y-1'>
                  <Label htmlFor='email_address'>Email Address</Label>
                  <Input
                    id='email_address'
                    value={formData.email}
                    type='email'
                    required
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.currentTarget.value })
                    }
                  />
                </div>
                <div className='space-y-1'>
                  <Label htmlFor='password'>Password</Label>
                  <Input
                    id='password'
                    value={formData.password}
                    type='password'
                    required
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password: e.currentTarget.value,
                      })
                    }
                  />
                  {error && (
                    <p className='text-center text-red-500'>
                      {FIREBASE_ERRORS[error.code]}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSubmit}>Sign Up</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        <Separator />
        <AuthButtons />
      </DialogHeader>
    </DialogContent>
  );
};

export default Auth_Tabs;
