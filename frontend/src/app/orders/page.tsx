import { auth } from '@/auth';
import { redirect } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Order {
    id: number;
    items: { name: string; price: number; quantity: number }[];
    total: number;
    status: string;
    createdAt: string;
}

export default async function OrdersPage() {
    const session = await auth();
    if (!session) redirect('/login');

    let orders: Order[] = [];

    try {
        const res = await fetch(`${API_URL}/orders`, {
            headers: {
                Authorization: `Bearer ${(session as any).accessToken}`,
            },
            cache: 'no-store',
        });
        if (res.ok) orders = await res.json();
    } catch {
        orders = [];
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">My Orders</h1>

            {orders.length === 0 ? (
                <p className="text-gray-500 text-center py-12">No orders yet.</p>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-lg shadow p-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold">Order #{order.id}</span>
                                <span
                                    className={`px-2 py-1 rounded text-sm ${order.status === 'completed'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                        }`}
                                >
                                    {order.status}
                                </span>
                            </div>

                            <div className="text-sm text-gray-500 mb-2">
                                {new Date(order.createdAt).toLocaleDateString()}
                            </div>

                            <ul className="text-sm space-y-1">
                                {order.items.map((item, i) => (
                                    <li key={i}>
                                        {item.name} x {item.quantity} — ${item.price}
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-2 font-bold text-right">
                                Total: ${order.total}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
