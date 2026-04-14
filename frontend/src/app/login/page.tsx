'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        setLoading(false);

        if (result?.error) {
            setError('Invalid email or password');
        } else {
            router.push('/products');
            router.refresh();
        }
    }

    return (
        <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6">Sign In</h1>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
                >
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>

            <div className="mt-4">
                <button
                    onClick={() => signIn('google', { callbackUrl: '/products' })}
                    className="w-full border border-gray-300 py-2 rounded hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                    Sign in with Google
                </button>
            </div>

            <p className="text-center mt-4 text-sm text-gray-600">
                No account?{' '}
                <Link href="/register" className="text-indigo-600 hover:underline">
                    Register
                </Link>
            </p>
        </div>
    );
}
