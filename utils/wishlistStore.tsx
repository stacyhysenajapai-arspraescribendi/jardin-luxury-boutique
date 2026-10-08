/** Wishlist saved on-device with AsyncStorage. */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'jardin.wishlist.v1';

interface WishlistValue {
  ids: string[];
  ready: boolean;
  has: (id: string) => boolean;
  toggle: (id: string) => boolean; // returns new saved state
  remove: (id: string) => void;
  clear: () => void;
}

const WishlistContext = createContext<WishlistValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) setIds(parsed.filter((x) => typeof x === 'string'));
        }
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  const persist = useCallback((next: string[]) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
    return next;
  }, []);

  const toggle = useCallback(
    (id: string) => {
      const saved = !ids.includes(id);
      setIds((prev) => persist(saved ? [id, ...prev.filter((x) => x !== id)] : prev.filter((x) => x !== id)));
      return saved;
    },
    [ids, persist],
  );

  const remove = useCallback((id: string) => setIds((prev) => persist(prev.filter((x) => x !== id))), [persist]);
  const clear = useCallback(() => setIds(persist([])), [persist]);

  const value = useMemo<WishlistValue>(
    () => ({ ids, ready, has: (id) => ids.includes(id), toggle, remove, clear }),
    [ids, ready, toggle, remove, clear],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside <WishlistProvider>');
  return ctx;
}
