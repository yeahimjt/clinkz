import React from 'react';
import Nav from '../components/nav';
import Subscriptions from '../components/subscriptions';
import Footer from '../components/footer';

const page = () => {
  return (
    <div className='section-padding-x mx-auto max-w-[1440px]'>
      <Nav />
      <Subscriptions />
      <Footer />
    </div>
  );
};

export default page;
