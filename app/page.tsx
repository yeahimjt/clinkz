import Nav from './components/nav';
import Header from './components/header';
import Recent_Products from './components/recent_products';
import Auth_Dialog from './components/dialog';
import { Toaster } from '@/components/ui/toaster';
import Footer from './components/footer';

export default function Home() {
  return (
    <main className='section-padding-x mx-auto max-w-[1440px]'>
      <Nav />
      <Header />
      <Recent_Products />
      <Footer />
      <Auth_Dialog />
      <Toaster />
    </main>
  );
}
