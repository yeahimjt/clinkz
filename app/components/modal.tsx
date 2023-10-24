'use client';
import React, { ReactNode } from 'react';
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}
const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) {
    return null;
  }
  return (
    <div className='fixed left-0 top-0 z-30 h-screen w-screen bg-black/25'>
      <div className='relative mx-auto flex h-full items-center  justify-center'>
        <div className='relative rounded-[10px] bg-white p-6 shadow-md'>
          <button className='absolute right-4' onClick={onClose}>
            X
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
