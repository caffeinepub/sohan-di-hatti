import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend";
import OrnamentalDivider from "../components/OrnamentalDivider";
import { useCart } from "../context/CartContext";
import { useActor } from "../hooks/useActor";

const categories = ["All", "Mithai", "Namkeen", "Seasonal"];

const categoryEmoji: Record<string, string> = {
  Mithai: "🍮",
  Namkeen: "🫘",
  Seasonal: "🌾",
  default: "🎁",
};

const productEmoji: Record<string, string> = {
  Pinni: "🫓",
  "Sohan Halwa": "🍯",
  "Besan Burfi": "🟨",
  "Gulab Jamun": "🟤",
  "Kaju Katli": "🔷",
  Mohanthal: "🧡",
  Patisa: "🌬️",
  "Soan Papdi": "🌬️",
  Jalebi: "🌀",
  "Amritsari Papad": "🥙",
  Mathri: "🍪",
  "Moong Dal Namkeen": "🟢",
  "Punjabi Mix Namkeen": "🥣",
  "Shakkar Para": "🍬",
  Gajak: "🍫",
  Rewri: "⚪",
  "Diwali Mithai Box": "🎁",
  "Gajar Halwa": "🥕",
};

function getProductEmoji(product: Product): string {
  // Try exact match first
  if (productEmoji[product.name]) return productEmoji[product.name];
  // Try partial match
  for (const key of Object.keys(productEmoji)) {
    if (product.name.includes(key) || key.includes(product.name)) {
      return productEmoji[key];
    }
  }
  return categoryEmoji[product.category] ?? categoryEmoji.default;
}

export default function MenuPage() {
  const { actor } = useActor();
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    if (!actor) return;
    async function load() {
      if (!actor) return;
      try {
        let items = await actor.listProducts();
        if (items.length === 0) {
          await actor.seedProducts();
          items = await actor.listProducts();
        }
        setProducts(items);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [actor]);

  const filtered =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      productName: product.name,
      quantity: 1,
      price: product.price,
    });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div>
      {/* Header */}
      <section
        className="py-16 px-4 text-center"
        style={{
          background: "linear-gradient(135deg, #1a0f08 0%, #3A2A1E 100%)",
        }}
      >
        <h1
          className="text-4xl font-bold mb-2"
          style={{ fontFamily: "'Playfair Display', serif", color: "#FAF2E2" }}
        >
          Our Menu
        </h1>
        <p
          style={{ color: "#C9A46A" }}
          className="text-sm tracking-widest uppercase"
        >
          Mithai · Namkeen · Seasonal Delights
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <OrnamentalDivider />

        {/* Category Tabs */}
        <div
          className="flex flex-wrap gap-3 justify-center mb-10"
          data-ocid="menu.tab"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className="px-6 py-2 rounded-full text-sm font-semibold transition-all"
              style={{
                backgroundColor: activeCategory === cat ? "#A95512" : "#FAF2E2",
                color: activeCategory === cat ? "#FAF2E2" : "#3A2A1E",
                border: "1px solid #C9A46A",
              }}
              data-ocid="menu.tab"
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div
            className="flex justify-center py-16"
            data-ocid="menu.loading_state"
          >
            <div
              className="w-10 h-10 border-4 rounded-full animate-spin"
              style={{ borderColor: "#C9A46A", borderTopColor: "#A95512" }}
            />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16" data-ocid="menu.empty_state">
            <p style={{ color: "#7a5a3a" }}>No products in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product, idx) => (
              <div
                key={product.id.toString()}
                className="relative rounded-lg overflow-hidden shadow-card"
                style={{
                  backgroundColor: "#FAF2E2",
                  border: "1px solid #e0d0b0",
                }}
                data-ocid={`menu.item.${idx + 1}`}
              >
                {product.isBestSeller && (
                  <div
                    className="absolute top-3 left-3 z-10 text-white text-xs font-bold px-2 py-1 rounded"
                    style={{ backgroundColor: "#A95512" }}
                  >
                    ⭐ Best Seller
                  </div>
                )}
                {!product.isAvailable && (
                  <div
                    className="absolute top-3 right-3 z-10 text-white text-xs font-bold px-2 py-1 rounded"
                    style={{ backgroundColor: "#888" }}
                  >
                    Out of Stock
                  </div>
                )}
                <div
                  className="w-full h-44 flex items-center justify-center text-5xl"
                  style={{ backgroundColor: `hsl(${25 + idx * 12}, 55%, 83%)` }}
                >
                  {getProductEmoji(product)}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3
                      className="font-bold text-base"
                      style={{ color: "#3A2A1E" }}
                    >
                      {product.name}
                    </h3>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full shrink-0"
                      style={{ backgroundColor: "#e8d8b0", color: "#5a3a22" }}
                    >
                      {product.category}
                    </span>
                  </div>
                  <p
                    className="text-xs mb-3 line-clamp-2"
                    style={{ color: "#7a5a3a" }}
                  >
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span
                      className="font-bold text-lg"
                      style={{ color: "#A95512" }}
                    >
                      ₹{(Number(product.price) / 100).toFixed(0)} / kg
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.isAvailable}
                      className="flex items-center gap-1 px-4 py-1.5 rounded text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: "#A95512" }}
                      data-ocid={`menu.primary_button.${idx + 1}`}
                    >
                      <ShoppingCart className="w-3 h-3" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
