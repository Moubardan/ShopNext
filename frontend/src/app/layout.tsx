import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import AuthProvider from '@/components/AuthProvider';
import StoreProvider from '@/store/provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'ShopNext — E-Commerce',
    description: 'A modern e-commerce store built with Next.js and NestJS',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <AuthProvider>
                    <StoreProvider>
                        <Header />
                        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
                    </StoreProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
