"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CartDrawer } from "./cart-drawer";
import { FavoritesDrawer } from "./favorites-drawer";

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  image?: string;
  size: string;
  qty: number;
};

export type FavItem = {
  id: string;
  slug: string;
  name: string;
  image?: string;
  categoryName?: string;
};

type CartCtx = {
  items: CartItem[];
  count: number;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (id: string, size: string, qty: number) => void;
  remove: (id: string, size: string) => void;
  clear: () => void;
};

type FavCtx = {
  items: FavItem[];
  count: number;
  has: (id: string) => boolean;
  toggle: (item: FavItem) => boolean; // returns new state
  remove: (id: string) => void;
};

type UICtx = {
  cartOpen: boolean;
  favOpen: boolean;
  openCart: () => void;
  openFav: () => void;
  closeAll: () => void;
};

const CartContext = createContext<CartCtx | null>(null);
const FavContext = createContext<FavCtx | null>(null);
const UIContext = createContext<UICtx | null>(null);

const CART_KEY = "formaza11.cart";
const FAV_KEY = "formaza11.favorites";

function load<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

export function StoreProvider({
  whatsappNumber,
  children,
}: {
  whatsappNumber: string;
  children: ReactNode;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favs, setFavs] = useState<FavItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [favOpen, setFavOpen] = useState(false);

  useEffect(() => {
    setCart(load<CartItem>(CART_KEY));
    setFavs(load<FavItem>(FAV_KEY));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(FAV_KEY, JSON.stringify(favs));
  }, [favs, hydrated]);

  const cartCtx = useMemo<CartCtx>(
    () => ({
      items: cart,
      count: cart.reduce((s, i) => s + i.qty, 0),
      add: (item, qty = 1) =>
        setCart((prev) => {
          const idx = prev.findIndex(
            (p) => p.id === item.id && p.size === item.size
          );
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = { ...next[idx], qty: next[idx].qty + qty };
            return next;
          }
          return [...prev, { ...item, qty }];
        }),
      setQty: (id, size, qty) =>
        setCart((prev) =>
          prev
            .map((p) =>
              p.id === id && p.size === size
                ? { ...p, qty: Math.max(1, qty) }
                : p
            )
            .filter((p) => p.qty > 0)
        ),
      remove: (id, size) =>
        setCart((prev) => prev.filter((p) => !(p.id === id && p.size === size))),
      clear: () => setCart([]),
    }),
    [cart]
  );

  const favCtx = useMemo<FavCtx>(
    () => ({
      items: favs,
      count: favs.length,
      has: (id) => favs.some((f) => f.id === id),
      toggle: (item) => {
        let added = false;
        setFavs((prev) => {
          if (prev.some((f) => f.id === item.id)) {
            return prev.filter((f) => f.id !== item.id);
          }
          added = true;
          return [item, ...prev];
        });
        return added;
      },
      remove: (id) => setFavs((prev) => prev.filter((f) => f.id !== id)),
    }),
    [favs]
  );

  const uiCtx = useMemo<UICtx>(
    () => ({
      cartOpen,
      favOpen,
      openCart: () => {
        setFavOpen(false);
        setCartOpen(true);
      },
      openFav: () => {
        setCartOpen(false);
        setFavOpen(true);
      },
      closeAll: () => {
        setCartOpen(false);
        setFavOpen(false);
      },
    }),
    [cartOpen, favOpen]
  );

  return (
    <CartContext.Provider value={cartCtx}>
      <FavContext.Provider value={favCtx}>
        <UIContext.Provider value={uiCtx}>
          {children}
          <CartDrawer whatsappNumber={whatsappNumber} />
          <FavoritesDrawer />
        </UIContext.Provider>
      </FavContext.Provider>
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within StoreProvider");
  return ctx;
}
export function useFavorites() {
  const ctx = useContext(FavContext);
  if (!ctx) throw new Error("useFavorites must be used within StoreProvider");
  return ctx;
}
export function useStoreUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useStoreUI must be used within StoreProvider");
  return ctx;
}

/** Build the aggregated WhatsApp order message for the whole cart. */
export function buildCartWhatsAppUrl(
  whatsappNumber: string,
  items: CartItem[],
  origin: string
): string {
  const number = (whatsappNumber || "").replace(/[^0-9]/g, "");
  const lines = items.map(
    (it, i) =>
      `${i + 1}. ${it.name} — Ölçü: ${it.size}, Say: ${it.qty}\n   ${origin}/forma/${it.slug}`
  );
  const total = items.reduce((s, i) => s + i.qty, 0);
  const message = `Salam! Formaza11 saytından sifariş etmək istəyirəm:\n\n${lines.join(
    "\n\n"
  )}\n\nCəmi: ${total} ədəd. Qiymət və çatdırılma barədə məlumat verə bilərsiniz?`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
