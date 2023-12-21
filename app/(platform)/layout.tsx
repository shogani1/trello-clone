import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import React from "react";
import ModalProvider from "@/components/providers/ModalProvider";
import QueryProvider from "@/components/providers/QueryProdider";
const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvider>
      <ClerkProvider>
        <Toaster />
        <ModalProvider />
        {children}
      </ClerkProvider>
    </QueryProvider>
  );
};

export default layout;
