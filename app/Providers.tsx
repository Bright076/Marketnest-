"use client";

import { ReactNode } from "react";
import { CartProvider } from "./context/CartContext";
import { LoadingProvider } from "./context/LoadingContext";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <LoadingProvider>
      <CartProvider>{children}</CartProvider>
    </LoadingProvider>
  );
}
