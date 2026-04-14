'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
}

export default function AdminProductsPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [editing, setEditing] = useState<Product | null>(null);
    const [form, setForm] = useState({ name: '', description: '', price: '', image: '' });
    const [loading, setLoading] = useState(false);

    const token = (session as any)?.accessToken;
    const isAdmin = (session?.user as any)?.role === 'admin';

    useEffect(() => {
        if (!isAdmin) return;
        fetchProducts();
    }, [isAdmin]);

    async function fetchProducts() {
        try {
            const res = await fetch(`${API_URL}/products`);
            if (res.ok) setProducts(await res.json());
        } catch { /* empty */ }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const body = {
            name: form.name,
            description: form.description,
            price: parseFloat(form.price),
            image: form.image,
        };

        try {
            const url = editing
                ? `${API_URL}/products/${editing.id}`
                : `${API_URL}/products`;
            const method = editing ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                setForm({ name: '', description: '', price: '', image: '' });
                setEditing(null);
                fetchProducts();
            }
        } catch { /* empty */ }
        setLoading(false);
    }

    async function handleDelete(id: number) {
        if (!confirm('Delete this product?')) return;
        await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
        fetchProducts();
    }

    function startEdit(product: Product) {
        setEditing(product);
        setForm({
            name: product.name,
            description: product.description,
            price: String(product.price),
            image: product.image || '',
        });
    }

    if (!isAdmin) {
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold">Access Denied</h1>
                <p className="text-gray-500 mt-2">Admin access required.</p>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Admin — Products</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 mb-6 space-y-3">
                <h2 className="font-semibold">
                    {editing ? 'Edit Product' : 'Add Product'}
                </h2>

                <div className="grid grid-cols-2 gap-3">
                    <input
                        placeholder="Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="border rounded px-3 py-2"
                        required
                    />
                    <input
                        placeholder="Price"
                        type="number"
                        step="0.01"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        className="border rounded px-3 py-2"
                        required
                    />
                </div>

                <textarea
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    required
                />

                <input
                    placeholder="Image URL"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                />

                <div className="flex gap-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {editing ? 'Update' : 'Create'}
                    </button>
                    {editing && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditing(null);
                                setForm({ name: '', description: '', price: '', image: '' });
                            }}
                            className="border px-4 py-2 rounded hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left p-3">Name</th>
                            <th className="text-left p-3">Price</th>
                            <th className="text-right p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id} className="border-t">
                                <td className="p-3">{product.name}</td>
                                <td className="p-3">${product.price}</td>
                                <td className="p-3 text-right space-x-2">
                                    <button
                                        onClick={() => startEdit(product)}
                                        className="text-indigo-600 hover:underline"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="text-red-600 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
