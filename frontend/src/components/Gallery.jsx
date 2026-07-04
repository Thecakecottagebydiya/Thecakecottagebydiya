import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { buildWhatsAppUrl, quickCakeMessage } from "../lib/whatsapp";
import { MessageCircle, Leaf } from "lucide-react";

export default function Gallery({ onOrder }) {
  const [cakes, setCakes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ok = true;
    api
      .get("/cakes")
      .then((r) => ok && setCakes(r.data))
      .catch(() => ok && setCakes([]))
      .finally(() => ok && setLoading(false));
    return () => {
      ok = false;
    };
  }, []);

  return (
    <section
      id="gallery"
      data-testid="gallery-section"
      className="py-20 md:py-28"
      style={{ backgroundColor: "var(--cc-bg-2)" }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
          <div className="cc-fade">
            <span className="text-xs md:text-sm tracking-[0.3em] uppercase text-[color:var(--cc-text-soft)]">
              The Menu
            </span>
            <h2 className="mt-3 font-heading text-3xl md:text-5xl text-[color:var(--cc-text)] max-w-xl">
              Signature cakes from Diya's kitchen
            </h2>
          </div>
          <p className="text-[color:var(--cc-text-soft)] max-w-md">
            Every cake here is fully customisable. Choose a design, tell us your flavour,
            weight and the celebration — we'll bake the rest.
          </p>
        </div>

        {loading ? (
          <div data-testid="gallery-loading" className="text-center py-16 text-[color:var(--cc-text-soft)]">
            Loading cakes…
          </div>
        ) : cakes.length === 0 ? (
          <div
            data-testid="gallery-empty"
            className="cc-card p-10 text-center text-[color:var(--cc-text-soft)]"
          >
            New cakes coming soon. Message Diya on WhatsApp for a custom order.
          </div>
        ) : (
          <div
            data-testid="gallery-grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
          >
            {cakes.map((c, i) => (
              <CakeCard key={c.id} cake={c} delay={i} onOrder={onOrder} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function CakeCard({ cake, delay = 0, onOrder }) {
  const wa = buildWhatsAppUrl(quickCakeMessage(cake.name));
  return (
    <article
      data-testid={`cake-card-${cake.id}`}
      className="cc-card overflow-hidden group cc-fade"
      style={{ animationDelay: `${0.05 + delay * 0.08}s` }}
    >
      <div className="aspect-[4/5] overflow-hidden">
        <img
          src={cake.image_url}
          alt={cake.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          data-testid={`cake-image-${cake.id}`}
        />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs uppercase tracking-widest text-[color:var(--cc-text-soft)]">
            {cake.category}
          </span>
          {cake.is_eggless && (
            <span className="cc-badge-sage">
              <Leaf size={12} /> Eggless
            </span>
          )}
        </div>
        <h3
          data-testid={`cake-name-${cake.id}`}
          className="font-heading text-xl md:text-2xl mt-2 text-[color:var(--cc-text)]"
        >
          {cake.name}
        </h3>
        <p className="mt-2 text-sm text-[color:var(--cc-text-soft)] line-clamp-2">
          {cake.description}
        </p>
        <div className="mt-5 flex items-center justify-between">
          <div>
            <div className="text-xs text-[color:var(--cc-text-soft)]">from</div>
            <div
              data-testid={`cake-price-${cake.id}`}
              className="font-heading text-xl text-[color:var(--cc-text)]"
            >
              ₹{Math.round(cake.price)}
              <span className="text-xs font-normal text-[color:var(--cc-text-soft)]">
                {" "}
                / {cake.weight_kg} kg
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOrder && onOrder(cake)}
              data-testid={`cake-order-form-btn-${cake.id}`}
              className="cc-btn-ghost text-sm px-4 py-2"
            >
              Details
            </button>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={`cake-whatsapp-btn-${cake.id}`}
              className="cc-btn-wa text-sm px-4 py-2"
            >
              <MessageCircle size={14} /> Order
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
