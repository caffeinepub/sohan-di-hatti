import OrnamentalDivider from "../components/OrnamentalDivider";

const galleryItems = [
  // Shop
  {
    category: "Shop",
    label: "Our Store Front",
    emoji: "🏪",
    color: "hsl(35,60%,78%)",
  },
  {
    category: "Shop",
    label: "The Karahi",
    emoji: "🍳",
    color: "hsl(25,55%,72%)",
  },
  {
    category: "Shop",
    label: "Display Counter",
    emoji: "🏬",
    color: "hsl(42,50%,80%)",
  },
  // Sweets
  {
    category: "Sweets",
    label: "Kaju Katli",
    emoji: "🍬",
    color: "hsl(50,60%,82%)",
  },
  {
    category: "Sweets",
    label: "Motichoor Ladoo",
    emoji: "🟡",
    color: "hsl(40,65%,75%)",
  },
  {
    category: "Sweets",
    label: "Gulab Jamun",
    emoji: "🫐",
    color: "hsl(20,55%,70%)",
  },
  { category: "Sweets", label: "Pinni", emoji: "⚪", color: "hsl(55,40%,85%)" },
  {
    category: "Sweets",
    label: "Barfi Box",
    emoji: "🎁",
    color: "hsl(30,50%,78%)",
  },
  // Events
  {
    category: "Events",
    label: "Diwali Special",
    emoji: "🪔",
    color: "hsl(45,70%,80%)",
  },
  {
    category: "Events",
    label: "Wedding Hamper",
    emoji: "💐",
    color: "hsl(10,50%,75%)",
  },
  {
    category: "Events",
    label: "Holi Festival",
    emoji: "🎨",
    color: "hsl(300,40%,80%)",
  },
  {
    category: "Events",
    label: "Corporate Gifting",
    emoji: "🏢",
    color: "hsl(200,30%,78%)",
  },
];

const groupedByCategory = galleryItems.reduce(
  (acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  },
  {} as Record<string, typeof galleryItems>,
);

export default function GalleryPage() {
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
          Our Gallery
        </h1>
        <p
          style={{ color: "#C9A46A" }}
          className="text-sm tracking-widest uppercase"
        >
          Moments from Sohan Di Hatti
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12" data-ocid="gallery.section">
        <OrnamentalDivider />

        {Object.entries(groupedByCategory).map(([category, items]) => (
          <div key={category} className="mb-14">
            <h2
              className="text-2xl font-bold mb-6 text-center"
              style={{ color: "#A95512" }}
            >
              {category}
            </h2>
            {/* Masonry-style grid using CSS columns */}
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-0">
              {items.map((item, idx) => (
                <div
                  key={item.label}
                  className="break-inside-avoid mb-4 rounded-lg overflow-hidden shadow-card"
                  style={{ border: "1px solid #e0d0b0" }}
                  data-ocid={`gallery.item.${idx + 1}`}
                >
                  <div
                    className="flex items-center justify-center text-6xl"
                    style={{
                      backgroundColor: item.color,
                      height: `${160 + (idx % 3) * 40}px`,
                    }}
                  >
                    {item.emoji}
                  </div>
                  <div
                    className="px-4 py-3"
                    style={{ backgroundColor: "#FAF2E2" }}
                  >
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "#3A2A1E" }}
                    >
                      {item.label}
                    </p>
                    <p className="text-xs" style={{ color: "#7a5a3a" }}>
                      {category}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <OrnamentalDivider />
          </div>
        ))}
      </div>
    </div>
  );
}
