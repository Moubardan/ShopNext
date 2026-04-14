'use client';

import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/cartSlice';

interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
}

export default function AddToCartButton({ product }: { product: Product }) {
    const dispatch = useDispatch();

    return (
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
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-indigo-700"
        >
            Add to Cart
        </button>
    );
}
