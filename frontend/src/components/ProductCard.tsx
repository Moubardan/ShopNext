'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/cartSlice';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
}

export default function ProductCard({ product }: { product: Product }) {
    const dispatch = useDispatch();

    return (
        <div className="bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden">
            <Link href={`/products/${product.id}`}>
                <div className="relative h-48 bg-gray-100">
                    {product.image && (
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 25vw"
                        />
                    )}
                </div>
            </Link>

            <div className="p-4">
                <Link href={`/products/${product.id}`}>
                    <h3 className="font-semibold hover:text-indigo-600">{product.name}</h3>
                </Link>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {product.description}
                </p>
                <div className="mt-3 flex items-center justify-between">
                    <span className="text-lg font-bold">${product.price}</span>
                    <button
                        onClick={() =>
                            dispatch(
                                addToCart({
                                    productId: product.id,
                                    name: product.name,
                                    price: product.price,
                                    image: product.image,
                                }),
                            )
                        }
                        className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}
