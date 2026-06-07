"use client";
// features/store/components/CheckoutButton.tsx
interface CheckoutButtonProps {
  productId: string;
  price: number;
  currency: string;
  disabled?: boolean;
}

export function CheckoutButton({ productId: _, price: _p, currency: _c, disabled: _d }: CheckoutButtonProps) {
  return <div />;
}
