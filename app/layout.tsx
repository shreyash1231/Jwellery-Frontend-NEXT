import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import Providers from "./providers";
import { AuthProvider } from "@/components/context/AuthContext";
import Reels from "@/components/Reels";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-app min-h-screen flex flex-col">
        <Providers>
          <AuthProvider>
          <AnnouncementBar />
          <Header />
          {children}
          <Reels/>
          <Footer />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}