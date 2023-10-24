import Image from 'next/image';
import Nav from './components/nav';
import Header from './components/header';
import Auth_Modal from './components/modal';
import Recent_Products from './components/recent_products';
import Auth_Dialog from './components/dialog';

export default function Home() {
  return (
    <main className='section-padding-x mx-auto max-w-[1440px]'>
      <Nav />
      <Header />
      <Recent_Products />
      <Auth_Dialog />
    </main>
  );
}
