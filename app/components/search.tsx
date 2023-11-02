'use client';
import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

import { Button } from '../../components/ui/button';
import { Input } from '@/components/ui/input';
import { grabAllItems, searchForItems } from '@/lib/actions';
import { Product } from '../constants';
import Product_Card from './product_card';

const SearchPage = () => {
  const [defaultProducts, setDefaultProducts] = useState<Product[] | null>(
    null
  );
  const [products, setProducts] = useState<Product[] | null>(null);
  const [query, setQuery] = useState<string>('');
  const [typingTimeout, setTypingTimeout] = useState<any | null>(null);
  const handleQuery = (value: string) => {
    setQuery(value);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const newTypingTimeout = setTimeout(() => {
      executeSearchQuery(value);
    }, 1000);
    setTypingTimeout(newTypingTimeout);
  };
  const executeSearchQuery = async (query: string) => {
    const results = await searchForItems(query);
    if (!results) return;
    setProducts(results);
  };

  const handleInitialItems = async () => {
    const results = await grabAllItems();
    if (!results) {
      return;
    }
    setDefaultProducts(results);
  };
  useEffect(() => {
    handleInitialItems();
  }, []);
  useEffect(() => {
    if (query === '') {
      setProducts(defaultProducts);
    }
    searchForItems(query);
  }, [query]);
  console.log(defaultProducts);
  return (
    <div className='my-12'>
      <section className='relative flex gap-[20px]'>
        <Input
          className='px-12'
          placeholder='Query results for more specific items'
          value={query}
          onChange={(e) => handleQuery(e.target.value)}
        />
        <Search className='absolute left-3 top-2' />
        {/* <Button>Search</Button> */}
      </section>
      <div className='my-12 flex flex-wrap justify-center gap-[70px]'>
        {products
          ? products.map((product, index) => (
              <Product_Card key={index} product={product} />
            ))
          : defaultProducts?.map((product, index) => (
              <Product_Card key={index} product={product} />
            ))}
      </div>
    </div>
  );
};

export default SearchPage;
