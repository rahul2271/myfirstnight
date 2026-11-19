'use client';

import { CartProvider, CartDrawerContent } from './CartDrawer';
import { ReactNode } from 'react';

export function CartProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <CartDrawerContent />
      {children}
    </CartProvider>
  );
}