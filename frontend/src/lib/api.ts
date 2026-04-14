const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function api(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || 'API error');
  }

  return res.json();
}

export function apiWithToken(token: string) {
  return (path: string, options: RequestInit = {}) =>
    api(path, {
      ...options,
      headers: { Authorization: `Bearer ${token}`, ...options.headers },
    });
}
