'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function Header() {
  const { data: session } = useSession();
  const cartCount = useSelector((state: RootState) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0),
  );

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-indigo-600">
          ShopNext
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/products" className="hover:text-indigo-600">
            Products
          </Link>

          <Link href="/cart" className="relative hover:text-indigo-600">
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-4 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {session ? (
            <>
              <Link href="/orders" className="hover:text-indigo-600">
                Orders
              </Link>
              {(session.user as any)?.role === 'admin' && (
                <Link
                  href="/admin/products"
                  className="hover:text-indigo-600 font-medium"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={() => signOut()}
                className="text-sm text-gray-500 hover:text-red-500"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
