import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export interface CartItem {
  productId: bigint;
  productName: string;
  quantity: number;
  price: bigint;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: bigint) => void;
  updateQty: (productId: bigint, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: bigint;
}

const CartContext = createContext<CartContextType | null>(null);

function serializeCart(items: CartItem[]): string {
  return JSON.stringify(
    items.map((i) => ({
      ...i,
      productId: i.productId.toString(),
      price: i.price.toString(),
    })),
  );
}

function deserializeCart(json: string): CartItem[] {
  try {
    const arr = JSON.parse(json);
    return arr.map(
      (i: {
        productId: string;
        productName: string;
        quantity: number;
        price: string;
      }) => ({
        ...i,
        productId: BigInt(i.productId),
        price: BigInt(i.price),
      }),
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem("sdh_cart");
    return stored ? deserializeCart(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("sdh_cart", serializeCart(items));
  }, [items]);

  const addItem = (newItem: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === newItem.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === newItem.productId
            ? { ...i, quantity: i.quantity + newItem.quantity }
            : i,
        );
      }
      return [...prev, newItem];
    });
  };

  const removeItem = (productId: bigint) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const updateQty = (productId: bigint, qty: number) => {
    if (qty <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, quantity: qty } : i,
      ),
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = items.reduce(
    (sum, i) => sum + i.price * BigInt(i.quantity),
    0n,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        totalItems,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
