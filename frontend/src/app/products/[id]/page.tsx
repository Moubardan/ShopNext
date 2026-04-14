import Image from 'next/image';
import { api } from '@/lib/api';
import AddToCartButton from './AddToCartButton';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
}

export const revalidate = 60;

export default async function ProductDetailPage({
    params,
}: {
    params: { id: string };
}) {
    let product: Product;

    try {
        product = await api(`/products/${params.id}`);
    } catch {
        return <p className="text-center py-12 text-gray-500">Product not found.</p>;
    }

    return (
        <div className="grid md:grid-cols-2 gap-8">
            <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
                {product.image && (
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="50vw"
                    />
                )}
            </div>

            <div>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <p className="text-2xl text-indigo-600 font-bold mb-4">
                    ${product.price}
                </p>
                <p className="text-gray-600 mb-6">{product.description}</p>
                <AddToCartButton product={product} />
            </div>
        </div>
    );
}
