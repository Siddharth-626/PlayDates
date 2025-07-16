import { ThemeProvider } from "@/context/ThemeContext"; // ✅ Corrected name
import { AuthProvider } from "@/context/authContext";
import { ProfileProvider } from "@/context/profileContext";
import { CourtProvider } from "@/context/courtContext";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProfileProvider>
          <CourtProvider>
            <Component {...pageProps} />
            <Toaster position="top-center" reverseOrder={false} />
          </CourtProvider>
        </ProfileProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
