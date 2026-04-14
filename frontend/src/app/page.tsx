import Link from 'next/link';

export default function HomePage() {
    return (
        <div className="text-center py-20">
            <h1 className="text-5xl font-bold mb-4">
                Welcome to <span className="text-indigo-600">ShopNext</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
                Your modern e-commerce store
            </p>
            <Link
                href="/products"
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-indigo-700"
            >
                Browse Products
            </Link>
        </div>
    );
}
