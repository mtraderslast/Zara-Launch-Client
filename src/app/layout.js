import { Hind_Siliguri, Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// Hind Siliguri-র রেগুলার ওয়েটে "১" দেখতে প্রায় "৯" এর মতো লাগে, তাই শুধু বাংলা অঙ্কগুলো (০-৯) এই ফন্টে দেখানো হয়
const bnDigits = localFont({
    src: "../fonts/NotoSansBengali-Variable.woff2",
    weight: "400 700",
    variable: "--font-bn-digits",
    display: "swap",
    adjustFontFallback: false,
    declarations: [{ prop: "unicode-range", value: "U+09E6-09EF" }],
});

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
            className={`${bnDigits.variable} ${hindSiliguri.variable} ${inter.variable} h-full antialiased`}
        >
            <body className="min-h-full dark:bg-black font-sans">
                {children}
            </body>
        </html>
    );
}