import { create } from 'zustand';
import { Subscription } from '../constants';

interface ModalStore {
  modalType: string;
  productID: string | null;
  setProductID: (value: string | null) => void;
  setModalType: (value: string) => void;
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  modalType: '',
  productID: null,
  setProductID: (value: string | null) => set({ productID: value }),
  setModalType: (value: string) => set({ modalType: value }),
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));

interface SubscriptionState {
  subscription: Subscription | null | undefined;
  setSubscription: (subscription: Subscription | null) => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  subscription: undefined,
  setSubscription: (subscription: Subscription | null) => set({ subscription }),
}));
