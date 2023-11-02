'use client';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { ChevronRight, Plus, ThumbsUp } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getLists, getListsItems } from '@/lib/actions';
import { useModalStore } from '../states';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
type singleItem = {
  id: string;
  current_price: string;
  highest_price: string;
  average_price: string;
  best_price: string;
  name: string;
  totalPrice?: number;
};
type NestedItemArray = singleItem[];

type singleTotal = {
  total: number;
};
type NestedTotalArray = singleTotal[];

const Lists = () => {
  const [lists, setLists] = useState<
    | { items: string[]; name: string; owner: string; id: string }[]
    | null
    | undefined
  >(null);
  function roundToTwoDecimalPlaces(number: number) {
    return '$' + Math.round(number * 100) / 100;
  }

  const [parsedItems, setParsedItems] = useState<NestedItemArray[]>([]);
  const [user] = useAuthState(auth);
  const { isOpen, openModal, setModalType, refresh, setRefresh, setProductID } =
    useModalStore();
  const [total, setTotal] = useState<(number | null)[]>([]);
  useEffect(() => {
    async function handleListGrab() {
      if (!user && !refresh) return;
      const lists = await getLists(user!.email!);
      if (lists === null) return;
      setLists(lists);
      setRefresh(false);
    }

    handleListGrab();
  }, [user, refresh]);
  useEffect(() => {
    if (lists && lists.length > 0) {
      console.log('running');
      console.log(parsedItems);
      processAndStoreData();
    }
  }, [lists]);
  const processAndStoreData = async () => {
    setParsedItems([]); // Clear the array before populating

    for (const item of lists!) {
      const { items } = item;
      if (Array.isArray(items)) {
        const returned = await getListsItems(items);
        if (returned) {
          const totalPrice = returned.reduce(
            (total, item) => total + item.current_price,
            0
          );
          setTotal((prevTotal) => [...prevTotal, totalPrice]);
          setParsedItems((prevParsedItems) => [...prevParsedItems, returned]);
        } else {
          setTotal((prevTotal) => [...prevTotal, null]);
          setParsedItems((prevParsedItems) => [...prevParsedItems, []]);
        }
      }
    }

    // setProcessedData(processedResults);
  };

  console.log(parsedItems);
  const handleModalOpen = () => {
    setModalType('new_list');
    openModal();
  };
  if (lists === null) {
    return <p className='min-h-[70vh]'>Loading...</p>;
  }
  if (lists && lists.length === 0) {
    return <p>No lists found.</p>;
  }
  const handleAddItem = (productID: string) => {
    setProductID(productID);
    setModalType('add_item_inner');
    openModal();
  };
  return (
    <div className='my-12 min-h-screen'>
      <div className='mb-8 flex justify-between'>
        <h1 className='text-[28px] font-bold text-my-black'>My Lists</h1>
        <span className='flex gap-[20px]'>
          <Button
            className='flex items-center gap-[10px] border bg-my-blue text-[18px] text-white  hover:bg-white hover:text-black'
            onClick={() => handleModalOpen()}
          >
            New List
            <Plus className='aspect-square w-[15px]' />
          </Button>
        </span>
      </div>
      <div className='flex flex-wrap gap-[20px] lg:grid lg:grid-cols-2'>
        {lists ? (
          lists.map((list, index) => (
            <div
              key={index}
              className='rounded-[20px] border border-my-light-gray/70 bg-white px-[23px] py-[33px] text-black  shadow-md  hover:bg-white'
            >
              <div className='flex w-full justify-between gap-[20px] '>
                <h2>{list.name}</h2>
                <div className='flex gap-[20px]'>
                  <p>{list.items.length}</p>
                </div>
              </div>
              <Separator className='my-4' />
              <div className='flex flex-col gap-[20px] py-[22px]'>
                {parsedItems.length > 0
                  ? parsedItems[index]?.map((item) => (
                      <Link
                        href={`/product/${item.id}`}
                        key={item.id}
                        className='flex cursor-pointer justify-between rounded-[15px] border border-[color:#EFEFEF] px-[24px] py-[16px] hover:border-my-blue'
                      >
                        <div className='flex-[0.7] overflow-hidden whitespace-nowrap'>
                          {item.name}
                        </div>
                        <div
                          className={`flex gap-[10px] ${
                            Number(item.current_price) ===
                              Number(item.highest_price) ||
                            Number(item.current_price) >
                              Number(item.average_price)
                              ? 'text-red-800'
                              : 'text-green-800'
                          }`}
                        >
                          ${item.current_price}
                          <ChevronRight className='text-[color:#E1DFDF]' />
                        </div>
                      </Link>
                    ))
                  : Array.from({ length: list.items.length }).map(
                      (value, index) => (
                        <div
                          key={index}
                          className='flex cursor-pointer justify-between gap-[20px] rounded-[15px] border border-[color:#EFEFEF] px-[24px] py-[16px] hover:border-my-blue'
                        >
                          <Skeleton className='h-[24px] flex-[0.7] overflow-hidden whitespace-nowrap' />
                          <Skeleton className='h-[24px] flex-[0.3] overflow-hidden whitespace-nowrap' />
                        </div>
                      )
                    )}
                {/* <Button
                  variant={'outline'}
                  className='w-fit border-my-blue hover:bg-my-blue hover:text-white'
                  onClick={() => handleAddItem(list.id)}
                >
                  Add Item
                </Button> */}
                {list.items.length > 0 && (
                  <div>
                    <h1>Total</h1>
                    <p className='text-[25px]'>
                      {total[index]
                        ? roundToTwoDecimalPlaces(total[index]!)
                        : 'N/A'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No lists found.</p>
        )}
      </div>
    </div>
  );
};

export default Lists;
