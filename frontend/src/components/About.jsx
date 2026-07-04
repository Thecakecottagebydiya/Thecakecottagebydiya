import { Leaf, Cake, Clock, HeartHandshake } from "lucide-react";

const ABOUT_IMG =
  "https://images.unsplash.com/photo-1587241321921-91a834d6d191?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwxfHxiYWtlcnklMjBvd25lciUyMGxpZmVzdHlsZXxlbnwwfHx8fDE3ODMxMzMxNDZ8MA&ixlib=rb-4.1.0&q=85";

const points = [
  { icon: Leaf, title: "100% Eggless", desc: "Every cake is fully eggless — safe for all celebrations." },
  { icon: Cake, title: "Custom Designs", desc: "From tier cakes to characters — Diya bakes to your idea." },
  { icon: Clock, title: "Order 1 Day Ahead", desc: "Freshly baked to order. Please book at least a day in advance." },
  { icon: HeartHandshake, title: "3 Years Experience", desc: "2 years running the cottage + 1 year of professional training." },
];

export default function About() {
  return (
    <section
      id="about"
      data-testid="about-section"
      className="py-20 md:py-28"
      style={{ backgroundColor: "var(--cc-bg)" }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 grid md:grid-cols-2 gap-12 md:gap-20 items-center">
        <div className="cc-fade">
          <div className="cc-arch-img aspect-[4/5] max-w-md shadow-xl">
            <img
              src={ABOUT_IMG}
              alt="Diya at work in the cottage kitchen"
              className="w-full h-full object-cover"
              data-testid="about-image"
            />
          </div>
        </div>
        <div className="cc-fade cc-fade-2">
          <span className="text-xs md:text-sm tracking-[0.3em] uppercase text-[color:var(--cc-text-soft)]">
            About Diya
          </span>
          <h2 className="mt-3 font-heading text-3xl md:text-5xl text-[color:var(--cc-text)]">
            A small cottage kitchen with big flavours.
          </h2>
          <p className="mt-6 text-[color:var(--cc-text-soft)] leading-relaxed">
            Hi, I'm Diya. What began as baking for family birthdays grew into
            <em> The Cake Cottage</em> — a tiny home-run bakery in Morinda that
            specialises in fully eggless custom cakes. Every order is baked fresh
            the day it's delivered, no shortcuts, no compromises.
          </p>
          <p className="mt-4 text-[color:var(--cc-text-soft)] leading-relaxed">
            Whether it's your child's first birthday, an anniversary or a themed
            surprise — bring me your idea and I'll bake it.
          </p>

          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            {points.map((p, i) => (
              <div
                key={p.title}
                className="cc-card p-5 flex gap-4 items-start cc-fade"
                style={{ animationDelay: `${0.15 + i * 0.08}s` }}
                data-testid={`about-point-${i}`}
              >
                <span
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "rgba(155,171,160,0.22)", color: "#3f5a4a" }}
                >
                  <p.icon size={18} />
                </span>
                <div>
                  <div className="font-heading text-lg text-[color:var(--cc-text)]">
                    {p.title}
                  </div>
                  <div className="text-sm text-[color:var(--cc-text-soft)] mt-1">
                    {p.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
