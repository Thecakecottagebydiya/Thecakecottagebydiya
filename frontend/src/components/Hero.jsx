import { buildWhatsAppUrl, quickCakeMessage } from "../lib/whatsapp";
import { Sparkles, MessageCircle } from "lucide-react";

const HERO_IMG =
  "https://images.unsplash.com/photo-1693059740560-21151639561f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MTN8MHwxfHNlYXJjaHwyfHxlbGVnYW50JTIwYmlydGhkYXklMjBjYWtlfGVufDB8fHx8MTc4MzEzMzE0Nnww&ixlib=rb-4.1.0&q=85";

export default function Hero() {
  const waUrl = buildWhatsAppUrl(quickCakeMessage("your signature cake"));

  const scrollTo = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      data-testid="hero-section"
      className="relative overflow-hidden cc-grain"
      style={{ backgroundColor: "var(--cc-bg)" }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 pt-14 md:pt-20 pb-20 md:pb-28 grid md:grid-cols-2 gap-12 md:gap-20 items-center">
        <div className="cc-fade cc-fade-1">
          <span
            data-testid="hero-eyebrow"
            className="text-xs md:text-sm tracking-[0.3em] uppercase text-[color:var(--cc-text-soft)]"
          >
            Morinda &middot; Punjab &middot; Homemade
          </span>

          <h1 className="mt-5 font-heading text-[2.8rem] leading-[1.05] md:text-6xl lg:text-7xl text-[color:var(--cc-text)]">
            Cakes baked with <span style={{ color: "var(--cc-brand)" }}>love</span>,
            <br className="hidden md:block" /> shared with joy.
          </h1>

          <p className="mt-6 text-base md:text-lg text-[color:var(--cc-text-soft)] max-w-lg leading-relaxed">
            Fresh, 100% eggless, hand-crafted celebration cakes from Diya's home kitchen.
            Custom designs, real ingredients, one-day-ahead orders.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="hero-whatsapp-btn"
              className="cc-btn-wa"
            >
              <MessageCircle size={18} /> Order on WhatsApp
            </a>
            <a
              href="#gallery"
              onClick={scrollTo("gallery")}
              data-testid="hero-view-cakes-btn"
              className="cc-btn-ghost"
            >
              View our cakes
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span data-testid="hero-badge-eggless" className="cc-badge-sage">
              <Sparkles size={12} /> 100% Eggless
            </span>
            <span className="cc-badge-sage">Freshly baked daily</span>
            <span className="cc-badge-sage">Custom designs</span>
          </div>
        </div>

        <div className="relative cc-fade cc-fade-3">
          <div className="cc-arch-img aspect-[3/4] w-full max-w-md ml-auto shadow-2xl">
            <img
              src={HERO_IMG}
              alt="Signature celebration cake"
              className="w-full h-full object-cover"
              data-testid="hero-image"
            />
          </div>
          <div
            className="hidden md:block absolute -left-8 bottom-8 cc-card p-4 w-56"
            data-testid="hero-floating-note"
          >
            <div className="text-xs uppercase tracking-widest text-[color:var(--cc-text-soft)]">
              Diya's promise
            </div>
            <div className="mt-1 font-heading text-lg text-[color:var(--cc-text)]">
              Fresh. Eggless. Homemade.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
