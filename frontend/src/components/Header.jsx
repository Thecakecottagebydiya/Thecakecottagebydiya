import { Link, useLocation } from "react-router-dom";
import { Cake } from "lucide-react";

export default function Header() {
  const { pathname } = useLocation();
  const onAdmin = pathname.startsWith("/admin");

  const scrollTo = (id) => (e) => {
    if (onAdmin) return;
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      data-testid="site-header"
      className="sticky top-0 z-50 backdrop-blur-xl bg-[#FAF8F5]/80 border-b border-[#E5DCD3]"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
        <Link to="/" data-testid="brand-link" className="flex items-center gap-2.5 group">
          <span
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "var(--cc-brand)" }}
          >
            <Cake size={18} className="text-white" />
          </span>
          <div className="leading-tight">
            <div className="font-heading text-lg md:text-xl text-[color:var(--cc-text)]">
              The Cake Cottage
            </div>
            <div className="text-[10px] tracking-[0.25em] uppercase text-[color:var(--cc-text-soft)]">
              By Diya
            </div>
          </div>
        </Link>

        {!onAdmin && (
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <a href="#gallery" onClick={scrollTo("gallery")} data-testid="nav-gallery" className="hover:text-[color:var(--cc-brand)] transition-colors">
              Our Cakes
            </a>
            <a href="#about" onClick={scrollTo("about")} data-testid="nav-about" className="hover:text-[color:var(--cc-brand)] transition-colors">
              About
            </a>
            <a href="#order" onClick={scrollTo("order")} data-testid="nav-order" className="hover:text-[color:var(--cc-brand)] transition-colors">
              Order
            </a>
            <a href="#visit" onClick={scrollTo("visit")} data-testid="nav-visit" className="hover:text-[color:var(--cc-brand)] transition-colors">
              Visit
            </a>
          </nav>
        )}

        {onAdmin ? (
          <Link to="/" data-testid="header-back-home" className="cc-btn-ghost">
            View Site
          </Link>
        ) : (
          <a
            href="#order"
            onClick={scrollTo("order")}
            data-testid="header-order-btn"
            className="cc-btn-primary text-sm px-5 py-2.5"
          >
            Order a Cake
          </a>
        )}
      </div>
    </header>
  );
}
