import { Link } from "@tanstack/react-router";
import { CheckCircle, Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { OrderStatus } from "../backend";
import OrnamentalDivider from "../components/OrnamentalDivider";
import { useCart } from "../context/CartContext";
import { useActor } from "../hooks/useActor";

export default function OrderPage() {
  const { actor } = useActor();
  const { items, removeItem, updateQty, clearCart, totalAmount } = useCart();
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState<bigint | null>(null);

  const handlePlaceOrder = async () => {
    if (!actor) {
      toast.error("Connecting to backend, please try again.");
      return;
    }
    if (!form.name || !form.phone || !form.address) {
      toast.error("Please fill all fields.");
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    setPlacing(true);
    try {
      const id = await actor.placeOrder({
        id: 0n,
        customerName: form.name,
        phone: form.phone,
        address: form.address,
        items: items.map((i) => ({
          productId: i.productId,
          productName: i.productName,
          quantity: BigInt(i.quantity),
          price: i.price,
        })),
        totalAmount: totalAmount,
        status: OrderStatus.pending,
        createdAt: BigInt(Date.now()) * 1_000_000n,
      });
      setOrderId(id);
      clearCart();
      setForm({ name: "", phone: "", address: "" });
    } catch (e) {
      console.error(e);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (orderId !== null) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        data-ocid="order.success_state"
      >
        <div
          className="max-w-md w-full text-center rounded-xl p-10 shadow-card"
          style={{ backgroundColor: "#FAF2E2", border: "1px solid #C9A46A" }}
        >
          <CheckCircle
            className="w-16 h-16 mx-auto mb-4"
            style={{ color: "#A95512" }}
          />
          <h2
            className="text-2xl font-bold mb-2"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "#3A2A1E",
            }}
          >
            Order Placed!
          </h2>
          <p className="text-sm mb-4" style={{ color: "#5a3a22" }}>
            Thank you for ordering from Sohan Di Hatti. Your order ID is{" "}
            <strong style={{ color: "#A95512" }}>#{orderId.toString()}</strong>.
            We&apos;ll contact you on WhatsApp to confirm.
          </p>
          <a
            href={`https://wa.me/919876543210?text=Hi!%20My%20order%20ID%20is%20%23${orderId.toString()}`}
            target="_blank"
            rel="noreferrer"
            className="inline-block px-6 py-2 rounded font-semibold text-white mb-4"
            style={{ backgroundColor: "#25D366" }}
          >
            Confirm on WhatsApp
          </a>
          <br />
          <Link
            to="/menu"
            className="text-sm font-semibold"
            style={{ color: "#A95512" }}
            data-ocid="order.link"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section
        className="py-16 px-4 text-center"
        style={{
          background: "linear-gradient(135deg, #1a0f08 0%, #3A2A1E 100%)",
        }}
      >
        <h1
          className="text-4xl font-bold"
          style={{ fontFamily: "'Playfair Display', serif", color: "#FAF2E2" }}
        >
          Your Order
        </h1>
        <p
          style={{ color: "#C9A46A" }}
          className="text-sm tracking-widest uppercase mt-2"
        >
          Cart &amp; Checkout
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <OrnamentalDivider />
        {items.length === 0 ? (
          <div className="text-center py-16" data-ocid="order.empty_state">
            <p className="text-lg mb-6" style={{ color: "#7a5a3a" }}>
              Your cart is empty.
            </p>
            <Link
              to="/menu"
              className="px-8 py-3 rounded font-semibold text-white"
              style={{ backgroundColor: "#A95512" }}
              data-ocid="order.link"
            >
              Browse Our Menu
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Cart Items */}
            <div data-ocid="order.section">
              <h2
                className="text-xl font-bold mb-6"
                style={{ color: "#3A2A1E" }}
              >
                Cart Items
              </h2>
              <div className="space-y-4">
                {items.map((item, idx) => (
                  <div
                    key={item.productId.toString()}
                    className="flex items-center gap-4 p-4 rounded-lg shadow-card"
                    style={{
                      backgroundColor: "#FAF2E2",
                      border: "1px solid #e0d0b0",
                    }}
                    data-ocid={`order.item.${idx + 1}`}
                  >
                    <div
                      className="w-14 h-14 rounded flex items-center justify-center text-2xl shrink-0"
                      style={{ backgroundColor: "#e8d8b0" }}
                    >
                      🍬
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-semibold text-sm truncate"
                        style={{ color: "#3A2A1E" }}
                      >
                        {item.productName}
                      </p>
                      <p className="text-xs" style={{ color: "#7a5a3a" }}>
                        ₹{(Number(item.price) / 100).toFixed(0)} ×{" "}
                        {item.quantity} = ₹
                        {((Number(item.price) / 100) * item.quantity).toFixed(
                          0,
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          updateQty(item.productId, item.quantity - 1)
                        }
                        className="w-7 h-7 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "#e0d0b0" }}
                        data-ocid={`order.secondary_button.${idx + 1}`}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-bold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQty(item.productId, item.quantity + 1)
                        }
                        className="w-7 h-7 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "#e0d0b0" }}
                        data-ocid={`order.secondary_button.${idx + 1}`}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="p-1.5 rounded"
                      style={{ color: "#A95512" }}
                      data-ocid={`order.delete_button.${idx + 1}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Form */}
            <div data-ocid="order.panel">
              <h2
                className="text-xl font-bold mb-6"
                style={{ color: "#3A2A1E" }}
              >
                Delivery Details
              </h2>
              <div
                className="rounded-lg p-6 shadow-card space-y-4"
                style={{
                  backgroundColor: "#FAF2E2",
                  border: "1px solid #e0d0b0",
                }}
              >
                <div>
                  <label
                    htmlFor="order-name"
                    className="block text-sm font-semibold mb-1"
                    style={{ color: "#3A2A1E" }}
                  >
                    Full Name
                  </label>
                  <input
                    id="order-name"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="Your full name"
                    className="w-full px-3 py-2 rounded border text-sm outline-none focus:ring-2"
                    style={{
                      borderColor: "#C9A46A",
                      backgroundColor: "#F4E9D2",
                    }}
                    data-ocid="order.input"
                  />
                </div>
                <div>
                  <label
                    htmlFor="order-phone"
                    className="block text-sm font-semibold mb-1"
                    style={{ color: "#3A2A1E" }}
                  >
                    Phone Number
                  </label>
                  <input
                    id="order-phone"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full px-3 py-2 rounded border text-sm outline-none focus:ring-2"
                    style={{
                      borderColor: "#C9A46A",
                      backgroundColor: "#F4E9D2",
                    }}
                    data-ocid="order.input"
                  />
                </div>
                <div>
                  <label
                    htmlFor="order-address"
                    className="block text-sm font-semibold mb-1"
                    style={{ color: "#3A2A1E" }}
                  >
                    Delivery Address
                  </label>
                  <textarea
                    id="order-address"
                    value={form.address}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, address: e.target.value }))
                    }
                    placeholder="Full delivery address"
                    rows={3}
                    className="w-full px-3 py-2 rounded border text-sm outline-none focus:ring-2 resize-none"
                    style={{
                      borderColor: "#C9A46A",
                      backgroundColor: "#F4E9D2",
                    }}
                    data-ocid="order.textarea"
                  />
                </div>

                {/* Summary */}
                <div
                  className="border-t pt-4 space-y-2"
                  style={{ borderColor: "#C9A46A" }}
                >
                  {items.map((item) => (
                    <div
                      key={item.productId.toString()}
                      className="flex justify-between text-sm"
                    >
                      <span style={{ color: "#5a3a22" }}>
                        {item.productName} × {item.quantity}
                      </span>
                      <span style={{ color: "#3A2A1E" }}>
                        ₹
                        {((Number(item.price) / 100) * item.quantity).toFixed(
                          0,
                        )}
                      </span>
                    </div>
                  ))}
                  <div
                    className="flex justify-between font-bold text-base border-t pt-2"
                    style={{ borderColor: "#C9A46A" }}
                  >
                    <span style={{ color: "#3A2A1E" }}>Total</span>
                    <span style={{ color: "#A95512" }}>
                      ₹{(Number(totalAmount) / 100).toFixed(0)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={placing}
                  className="w-full py-3 rounded font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                  style={{ backgroundColor: "#A95512" }}
                  data-ocid="order.submit_button"
                >
                  {placing ? "Placing Order..." : "Place Order"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
