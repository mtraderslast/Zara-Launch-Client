import { Hind_Siliguri, Inter } from "next/font/google";
import "./globals.css";

// Bangla font
const hindSiliguri = Hind_Siliguri({
    subsets: ["bengali"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-hind-siliguri",
    display: "swap",
});

// Dnglish font
const inter = Inter({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-inter",
    display: "swap",
});

export const metadata = {
    title: "Zara Launch",
    description: "Women's Fashion Houaw",
};

export default function RootLayout({ children }) {
    return (
        <html
            lang="bn"
            className={`${hindSiliguri.variable} ${inter.variable} h-full antialiased`}
        >
            <body className="min-h-full dark:bg-black font-sans">
                {children}
            </body>
        </html>
    );
}