import { AuthProvider } from "@/context/authContext";
import { ThemeProvder } from "@/context/ThemeContext";
import "../styles/globals.css"
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { ProfileProvider } from "@/context/profileContext";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvder>
    <AuthProvider>
      <ProfileProvider>
      <Component {...pageProps} />
        <Toaster position="top-center" reverseOrder={false} />
        </ProfileProvider>
    </AuthProvider>
    </ThemeProvder>
  );
}
