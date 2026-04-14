'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { removeFromCart, updateQuantity } from '@/store/cartSlice';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
    const items = useSelector((state: RootState) => state.cart.items);
    const dispatch = useDispatch();

    const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );

    if (items.length === 0) {
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
                <Link
                    href="/products"
                    className="text-indigo-600 hover:underline"
                >
                    Browse products
                </Link>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

            <div className="space-y-4">
                {items.map((item) => (
                    <div
                        key={item.productId}
                        className="bg-white rounded-lg shadow p-4 flex items-center gap-4"
                    >
                        <div className="relative w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                            {item.image && (
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                    sizes="80px"
                                />
                            )}
                        </div>

                        <div className="flex-1">
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-indigo-600 font-bold">${item.price}</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() =>
                                    dispatch(
                                        updateQuantity({
                                            productId: item.productId,
                                            quantity: item.quantity - 1,
                                        }),
                                    )
                                }
                                className="border rounded w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                            >
                                -
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                                onClick={() =>
                                    dispatch(
                                        updateQuantity({
                                            productId: item.productId,
                                            quantity: item.quantity + 1,
                                        }),
                                    )
                                }
                                className="border rounded w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                            >
                                +
                            </button>
                        </div>

                        <p className="font-bold w-20 text-right">
                            ${(item.price * item.quantity).toFixed(2)}
                        </p>

                        <button
                            onClick={() => dispatch(removeFromCart(item.productId))}
                            className="text-red-500 hover:text-red-700"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-6 bg-white rounded-lg shadow p-4 flex items-center justify-between">
                <span className="text-xl font-bold">Total: ${total.toFixed(2)}</span>
                <Link
                    href="/checkout"
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
                >
                    Proceed to Checkout
                </Link>
            </div>
        </div>
    );
}
