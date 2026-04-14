import ProductCard from '@/components/ProductCard';
import { api } from '@/lib/api';

export const revalidate = 60; // ISR: revalidate every 60 seconds

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
}

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: { search?: string };
}) {
    const query = searchParams.search ? `?search=${searchParams.search}` : '';
    let products: Product[] = [];

    try {
        products = await api(`/products${query}`);
    } catch {
        products = [];
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Products</h1>
                <form className="flex gap-2">
                    <input
                        name="search"
                        placeholder="Search products..."
                        defaultValue={searchParams.search}
                        className="border rounded px-3 py-2"
                    />
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                        Search
                    </button>
                </form>
            </div>

            {products.length === 0 ? (
                <p className="text-gray-500 text-center py-12">No products found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}
