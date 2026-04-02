import { Clock, MapPin, Phone } from "lucide-react";
import OrnamentalDivider from "../components/OrnamentalDivider";

const timeline = [
  {
    year: "1930",
    title: "Founded",
    desc: "Lala Sohan Lal opens a small sweet shop in Hall Bazaar, Amritsar, with a handful of recipes and boundless passion.",
  },
  {
    year: "1960",
    title: "Expanded",
    desc: "Growing demand leads to a larger shop. Sohan Di Hatti becomes a household name in Amritsar for pure desi ghee sweets.",
  },
  {
    year: "1990",
    title: "Second Generation",
    desc: "Lala's sons take over, introducing new seasonal offerings while preserving every original recipe.",
  },
  {
    year: "2020",
    title: "Online Presence",
    desc: "Third generation brings Sohan Di Hatti online, making Amritsar's favourite sweets available across India.",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Header */}
      <section
        className="py-20 px-4 text-center"
        style={{
          background: "linear-gradient(135deg, #1a0f08 0%, #3A2A1E 100%)",
        }}
      >
        <h1
          className="text-4xl md:text-5xl font-bold mb-4"
          style={{ fontFamily: "'Playfair Display', serif", color: "#FAF2E2" }}
        >
          Our Story
        </h1>
        <p
          style={{ color: "#C9A46A" }}
          className="text-sm tracking-widest uppercase"
        >
          A Heritage of Sweetness Since 1930
        </p>
      </section>

      {/* Brand Story */}
      <section
        className="max-w-4xl mx-auto px-4 py-16"
        data-ocid="about.section"
      >
        <OrnamentalDivider />
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div
            className="rounded-lg h-64 flex items-center justify-center text-7xl shadow-card"
            style={{ backgroundColor: "#FAF2E2", border: "1px solid #C9A46A" }}
          >
            🏪
          </div>
          <div>
            <h2
              className="text-2xl font-bold mb-4"
              style={{ color: "#A95512" }}
            >
              The Heart of Amritsar&apos;s Sweetness
            </h2>
            <p
              className="text-sm leading-relaxed mb-4"
              style={{ color: "#5a3a22" }}
            >
              Sohan Di Hatti is more than a sweet shop — it&apos;s a living
              tradition. Located in the iconic Hall Bazaar, steps away from the
              Golden Temple, our shop has been a place of joy and indulgence for
              generations of Amritsaris and pilgrims alike.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "#5a3a22" }}>
              Our master halwais train for years before touching the karahi.
              Every ingredient is sourced fresh — from pure A2 cow ghee from
              Punjab farms to the finest cashews and saffron from Kashmir. No
              preservatives. No shortcuts. Just honest sweetness.
            </p>
          </div>
        </div>
        <OrnamentalDivider />
      </section>

      {/* Timeline */}
      <section
        className="py-16 px-4"
        style={{ backgroundColor: "#FAF2E2" }}
        data-ocid="timeline.section"
      >
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-3xl font-bold text-center mb-12"
            style={{ color: "#3A2A1E" }}
          >
            Our Journey Through Time
          </h2>
          <div className="relative">
            <div
              className="absolute left-1/2 top-0 bottom-0 w-0.5 hidden md:block"
              style={{
                backgroundColor: "#C9A46A",
                transform: "translateX(-50%)",
              }}
            />
            <div className="space-y-10">
              {timeline.map((item, i) => (
                <div
                  key={item.year}
                  className={`flex flex-col md:flex-row gap-6 items-start md:items-center ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                  data-ocid={`timeline.item.${i + 1}`}
                >
                  <div
                    className={`flex-1 ${
                      i % 2 === 0 ? "md:text-right" : "md:text-left"
                    }`}
                  >
                    <div
                      className="inline-block rounded-lg p-5 shadow-card"
                      style={{
                        backgroundColor: "#F4E9D2",
                        border: "1px solid #C9A46A",
                      }}
                    >
                      <h3
                        className="font-bold text-lg mb-1"
                        style={{ color: "#A95512" }}
                      >
                        {item.title}
                      </h3>
                      <p className="text-sm" style={{ color: "#5a3a22" }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                  <div
                    className="shrink-0 w-14 h-14 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-card"
                    style={{ backgroundColor: "#A95512" }}
                  >
                    {item.year}
                  </div>
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Visit Us */}
      <section
        className="max-w-4xl mx-auto px-4 py-16 text-center"
        data-ocid="visit.section"
      >
        <h2 className="text-3xl font-bold mb-8" style={{ color: "#3A2A1E" }}>
          Visit Us
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          <div
            className="rounded-lg p-6 shadow-card"
            style={{ backgroundColor: "#FAF2E2", border: "1px solid #C9A46A" }}
          >
            <MapPin
              className="w-8 h-8 mx-auto mb-3"
              style={{ color: "#A95512" }}
            />
            <h4 className="font-bold mb-2" style={{ color: "#3A2A1E" }}>
              Address
            </h4>
            <p className="text-sm" style={{ color: "#5a3a22" }}>
              Hall Bazaar, Near Golden Temple, Amritsar, Punjab 143001
            </p>
          </div>
          <div
            className="rounded-lg p-6 shadow-card"
            style={{ backgroundColor: "#FAF2E2", border: "1px solid #C9A46A" }}
          >
            <Phone
              className="w-8 h-8 mx-auto mb-3"
              style={{ color: "#A95512" }}
            />
            <h4 className="font-bold mb-2" style={{ color: "#3A2A1E" }}>
              Phone
            </h4>
            <p className="text-sm" style={{ color: "#5a3a22" }}>
              +91 98765 43210
            </p>
          </div>
          <div
            className="rounded-lg p-6 shadow-card"
            style={{ backgroundColor: "#FAF2E2", border: "1px solid #C9A46A" }}
          >
            <Clock
              className="w-8 h-8 mx-auto mb-3"
              style={{ color: "#A95512" }}
            />
            <h4 className="font-bold mb-2" style={{ color: "#3A2A1E" }}>
              Hours
            </h4>
            <p className="text-sm" style={{ color: "#5a3a22" }}>
              Monday – Sunday
              <br />
              8:00 AM – 10:00 PM
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
