
"use client"
import Header from "@/components/Header";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "sonner";
export default function RootLayout({children,}: {children: React.ReactNode;}){

  const [queryClient] = useState(() => new QueryClient());
  return (
    <html lang="en">
      <body className="bg-app min-h-screen flex flex-col">
          <QueryClientProvider client={queryClient}>
            <Header />
          {children}
           <Toaster position="top-right" richColors />
            </QueryClientProvider>
      </body>
    </html>
  );
}