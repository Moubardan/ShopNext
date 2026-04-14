import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';

// Load cart from localStorage
function loadState() {
  if (typeof window === 'undefined') return undefined;
  try {
    const data = localStorage.getItem('shopnext-cart');
    return data ? { cart: JSON.parse(data) } : undefined;
  } catch {
    return undefined;
  }
}

export const makeStore = () => {
  const store = configureStore({
    reducer: { cart: cartReducer },
    preloadedState: loadState(),
  });

  // Persist cart to localStorage on every change
  store.subscribe(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'shopnext-cart',
        JSON.stringify(store.getState().cart),
      );
    }
  });

  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
