import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend";
import OrnamentalDivider from "../components/OrnamentalDivider";
import { useCart } from "../context/CartContext";
import { useActor } from "../hooks/useActor";

const specialities = [
  {
    icon: "🍬",
    title: "Mithai",
    desc: "Traditional Indian sweets made with pure desi ghee – Barfi, Ladoo, Halwa and more.",
  },
  {
    icon: "🧆",
    title: "Namkeen",
    desc: "Crispy, spiced savoury snacks – Mathri, Moong Dal, Chakli and Amritsari favourites.",
  },
  {
    icon: "🪔",
    title: "Seasonal",
    desc: "Festival specials – Gujiya for Holi, Kheer for Diwali, and winter Pinni.",
  },
  {
    icon: "🎁",
    title: "Gift Boxes",
    desc: "Beautifully curated hampers for weddings, festivals and corporate gifting.",
  },
];

export default function HomePage() {
  const { actor } = useActor();
  const { addItem } = useCart();
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!actor) return;
    async function load() {
      if (!actor) return;
      try {
        await actor.seedProducts();
        const products = await actor.listBestSellers();
        setBestSellers(products);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [actor]);

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
      {/* Hero */}
      <section
        className="relative flex flex-col items-center justify-center text-center px-4 py-28"
        style={{
          background:
            "linear-gradient(135deg, #1a0f08 0%, #3A2A1E 60%, #5a3520 100%)",
          minHeight: "520px",
        }}
        data-ocid="hero.section"
      >
        <p
          className="text-sm tracking-widest uppercase mb-4"
          style={{ color: "#C9A46A" }}
        >
          Heritage Since 1930 · Hall Bazaar, Amritsar
        </p>
        <h1
          className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
          style={{ fontFamily: "'Playfair Display', serif", color: "#FAF2E2" }}
        >
          Taste the Tradition
          <br />
          <span style={{ color: "#C9A46A" }}>of Amritsar</span>
        </h1>
        <p className="max-w-xl text-base mb-8" style={{ color: "#d4c4a8" }}>
          Over 90 years of crafting authentic mithai and namkeen with the finest
          ingredients and age-old recipes passed through generations.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/menu"
            className="px-8 py-3 rounded font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#A95512" }}
            data-ocid="hero.primary_button"
          >
            Shop Online Now
          </Link>
          <Link
            to="/order"
            className="px-8 py-3 rounded font-semibold border-2 transition-colors hover:bg-white/10"
            style={{ borderColor: "#C9A46A", color: "#C9A46A" }}
            data-ocid="hero.secondary_button"
          >
            Order Online
          </Link>
        </div>
      </section>

      {/* Ornamental Divider */}
      <div className="max-w-4xl mx-auto px-4">
        <OrnamentalDivider />
      </div>

      {/* Our Specialities */}
      <section
        className="max-w-6xl mx-auto px-4 pb-16"
        data-ocid="specialities.section"
      >
        <h2
          className="text-3xl font-bold text-center mb-2"
          style={{ color: "#3A2A1E" }}
        >
          Our Specialities
        </h2>
        <p className="text-center mb-10 text-sm" style={{ color: "#7a5a3a" }}>
          Handcrafted delights from the heart of Amritsar
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {specialities.map((s) => (
            <div
              key={s.title}
              className="rounded-lg p-6 text-center shadow-card flex flex-col items-center gap-3"
              style={{
                backgroundColor: "#FAF2E2",
                border: "1px solid #C9A46A",
              }}
            >
              <span className="text-4xl">{s.icon}</span>
              <h3 className="text-lg font-bold" style={{ color: "#A95512" }}>
                {s.title}
              </h3>
              <p className="text-sm" style={{ color: "#5a3a22" }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Festival Banner */}
      <section
        className="py-5 px-4 text-center"
        style={{ backgroundColor: "#C9A46A" }}
        data-ocid="festival.section"
      >
        <p
          className="text-lg md:text-xl font-semibold"
          style={{ fontFamily: "'Playfair Display', serif", color: "#3A2A1E" }}
        >
          🪔 Celebrate Festivals with Authentic Amritsari Sweets! Order now and
          get free delivery on orders above ₹500.
        </p>
      </section>

      {/* Our Legacy */}
      <section
        className="max-w-4xl mx-auto px-4 py-16 text-center"
        data-ocid="legacy.section"
      >
        <h2 className="text-3xl font-bold mb-4" style={{ color: "#3A2A1E" }}>
          Our Legacy Since 1930
        </h2>
        <OrnamentalDivider />
        <p
          className="text-base leading-relaxed mb-4"
          style={{ color: "#5a3a22" }}
        >
          Sohan Di Hatti was founded in 1930 by Lala Sohan Lal in the heart of
          Hall Bazaar, Amritsar. What started as a small sweet shop has grown
          into one of Punjab&apos;s most beloved sweet destinations, yet our
          recipes and our commitment to purity have never changed.
        </p>
        <p className="text-base leading-relaxed" style={{ color: "#5a3a22" }}>
          Every piece of mithai is made fresh daily using pure desi ghee,
          farm-sourced milk, and premium nuts — exactly as it was ninety years
          ago. Three generations, one unbreakable promise:{" "}
          <em style={{ color: "#A95512" }}>taste that takes you home.</em>
        </p>
        <Link
          to="/about"
          className="inline-block mt-8 px-6 py-2 rounded border-2 font-semibold text-sm transition-colors"
          style={{ borderColor: "#A95512", color: "#A95512" }}
          data-ocid="legacy.link"
        >
          Read Our Story
        </Link>
      </section>

      {/* Best Sellers */}
      <section
        className="py-16 px-4"
        style={{ backgroundColor: "#FAF2E2" }}
        data-ocid="bestsellers.section"
      >
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-3xl font-bold text-center mb-2"
            style={{ color: "#3A2A1E" }}
          >
            Best Sellers
          </h2>
          <p className="text-center text-sm mb-10" style={{ color: "#7a5a3a" }}>
            Our most loved sweets — ordered again and again
          </p>

          {loading ? (
            <div
              className="flex justify-center py-12"
              data-ocid="bestsellers.loading_state"
            >
              <div
                className="w-10 h-10 border-4 rounded-full animate-spin"
                style={{ borderColor: "#C9A46A", borderTopColor: "#A95512" }}
              />
            </div>
          ) : bestSellers.length === 0 ? (
            <p
              className="text-center"
              style={{ color: "#7a5a3a" }}
              data-ocid="bestsellers.empty_state"
            >
              No products found.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {bestSellers.map((product, idx) => (
                <div
                  key={product.id.toString()}
                  className="relative rounded-lg overflow-hidden shadow-card"
                  style={{
                    backgroundColor: "#FAF2E2",
                    border: "1px solid #e0d0b0",
                  }}
                  data-ocid={`bestsellers.item.${idx + 1}`}
                >
                  {/* Best Seller Badge */}
                  <div
                    className="absolute top-3 left-3 z-10 text-white text-xs font-bold px-2 py-1 rounded"
                    style={{ backgroundColor: "#A95512" }}
                  >
                    #{idx + 1} Best Seller
                  </div>
                  {/* Product Image Placeholder */}
                  <div
                    className="w-full h-44 flex items-center justify-center text-4xl"
                    style={{
                      backgroundColor: `hsl(${30 + idx * 15}, 60%, 85%)`,
                    }}
                  >
                    🍬
                  </div>
                  <div className="p-4">
                    <h3
                      className="font-bold text-base mb-1"
                      style={{ color: "#3A2A1E" }}
                    >
                      {product.name}
                    </h3>
                    <p
                      className="text-xs mb-2 line-clamp-2"
                      style={{ color: "#7a5a3a" }}
                    >
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span
                        className="font-bold text-lg"
                        style={{ color: "#A95512" }}
                      >
                        ₹{(Number(product.price) / 100).toFixed(0)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold text-white transition-opacity hover:opacity-90"
                        style={{ backgroundColor: "#A95512" }}
                        data-ocid={`bestsellers.primary_button.${idx + 1}`}
                      >
                        <ShoppingCart className="w-3 h-3" />
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              to="/menu"
              className="px-8 py-3 rounded font-semibold text-white transition-opacity hover:opacity-90 inline-block"
              style={{ backgroundColor: "#A95512" }}
              data-ocid="bestsellers.secondary_button"
            >
              View Full Menu
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
