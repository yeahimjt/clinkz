'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ProductTable } from '../constants';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { updateProductWithoutUserEmail } from '@/lib/actions';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

export const columns: ColumnDef<ProductTable>[] = [
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
      const stopTracking = () => {};
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
            <DropdownMenuItem className='cursor-pointer'>
              Stop Tracking Product
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
