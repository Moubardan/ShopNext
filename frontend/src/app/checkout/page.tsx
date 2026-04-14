'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { RootState } from '@/store/store';
import { clearCart } from '@/store/cartSlice';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function CheckoutPage() {
    const { data: session } = useSession();
    const items = useSelector((state: RootState) => state.cart.items);
    const dispatch = useDispatch();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );

    if (!session) {
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold mb-4">Please sign in to checkout</h1>
                <Link href="/login" className="text-indigo-600 hover:underline">
                    Sign In
                </Link>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
                <Link href="/products" className="text-indigo-600 hover:underline">
                    Browse products
                </Link>
            </div>
        );
    }

    async function handleCheckout() {
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${(session as any)?.accessToken}`,
                },
                body: JSON.stringify({
                    items: items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                    })),
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Checkout failed');
            }

            dispatch(clearCart());
            router.push('/orders');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{error}</div>
            )}

            <div className="bg-white rounded-lg shadow p-4 space-y-3">
                {items.map((item) => (
                    <div key={item.productId} className="flex justify-between">
                        <span>
                            {item.name} x {item.quantity}
                        </span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                ))}
                <hr />
                <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>

            <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
                {loading ? 'Placing order...' : 'Place Order'}
            </button>
        </div>
    );
}
