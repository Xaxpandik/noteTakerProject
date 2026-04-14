import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({
    subsets: ["latin", "latin-ext"],
    variable: "--font-inter",
});

export default function App(
    {
        Component,
        pageProps: { session, ...pageProps },
    }: AppProps) {
    return (
        <SessionProvider session={session}>
            <div className={`${inter.variable} font-sans`}>
                <Component {...pageProps} />
            </div>
        </SessionProvider>
    );
}