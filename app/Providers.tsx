"use client";

import { ReactNode } from "react";
import { CartProvider } from "./context/CartContext";
import { LoadingProvider } from "./context/LoadingContext";
import { ToastProvider } from "./context/ToastContext";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <LoadingProvider>
        <CartProvider>{children}</CartProvider>
      </LoadingProvider>
    </ToastProvider>
  );
}
