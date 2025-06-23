import { AuthProvider } from "@/context/authContext";
import { ThemeProvder } from "@/context/ThemeContext";
import "../styles/globals.css"
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvder>
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
    </ThemeProvder>
  );
}
