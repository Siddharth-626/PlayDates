import { ThemeProvider } from "@/context/ThemeContext"; // ✅ Corrected name
import { AuthProvider } from "@/context/authContext";
import { ProfileProvider } from "@/context/profileContext";
import { CourtProvider } from "@/context/courtContext";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { PlaymateProvider } from "@/context/playmatesContext";
import { MatchProvider } from "@/context/matchContext";
import { ChatDisplayDataProvider } from "@/context/chatDisplayDataContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChatDisplayDataProvider>
    <ThemeProvider>
      <AuthProvider>
        <ProfileProvider>
          <CourtProvider>
            <PlaymateProvider>
              <MatchProvider>
                <Component {...pageProps} />
                <Toaster position="top-center" reverseOrder={false} />
              </MatchProvider>
            </PlaymateProvider>
          </CourtProvider>
        </ProfileProvider>
      </AuthProvider>
    </ThemeProvider>
    </ChatDisplayDataProvider>

  );
}
