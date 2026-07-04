import { Link } from "react-router-dom";
import { Cake, MessageCircle } from "lucide-react";
import { buildWhatsAppUrl, quickCakeMessage, OWNER_PHONE, BUSINESS_ADDRESS } from "../lib/whatsapp";

export default function Footer() {
  const wa = buildWhatsAppUrl(quickCakeMessage("your signature cake"));
  return (
    <footer
      data-testid="site-footer"
      className="border-t border-[#E5DCD3] pt-14 pb-8"
      style={{ backgroundColor: "var(--cc-bg-2)" }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 grid md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-2.5">
            <span
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "var(--cc-brand)" }}
            >
              <Cake size={18} className="text-white" />
            </span>
            <div>
              <div className="font-heading text-lg">The Cake Cottage</div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-[color:var(--cc-text-soft)]">
                By Diya
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-[color:var(--cc-text-soft)] max-w-xs">
            Homemade, 100% eggless, custom celebration cakes — baked fresh in Morinda, Punjab.
          </p>
        </div>

        <div>
          <div className="text-xs uppercase tracking-widest text-[color:var(--cc-text-soft)]">
            Explore
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href="#gallery" className="hover:text-[color:var(--cc-brand)]">Our Cakes</a></li>
            <li><a href="#about" className="hover:text-[color:var(--cc-brand)]">About Diya</a></li>
            <li><a href="#order" className="hover:text-[color:var(--cc-brand)]">Place an Order</a></li>
            <li><a href="#visit" className="hover:text-[color:var(--cc-brand)]">Visit</a></li>
            <li><Link to="/admin" data-testid="footer-admin-link" className="hover:text-[color:var(--cc-brand)]">Admin</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-xs uppercase tracking-widest text-[color:var(--cc-text-soft)]">
            Contact
          </div>
          <div className="mt-4 text-sm text-[color:var(--cc-text-soft)] leading-relaxed">
            {BUSINESS_ADDRESS}
          </div>
          <div className="mt-2 text-sm">
            <a href={`tel:+919041615117`} className="underline" style={{ color: "var(--cc-brand)" }} data-testid="footer-phone">
              {OWNER_PHONE}
            </a>
          </div>
          <a href={wa} target="_blank" rel="noopener noreferrer" data-testid="footer-whatsapp-btn" className="cc-btn-wa mt-5 text-sm px-5 py-2.5">
            <MessageCircle size={16} /> WhatsApp Us
          </a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 mt-10 text-xs text-[color:var(--cc-text-soft)] flex flex-wrap items-center justify-between gap-3">
        <span>© {new Date().getFullYear()} The Cake Cottage By Diya. All rights reserved.</span>
        <span>Made with love in Morinda, Punjab.</span>
      </div>
    </footer>
  );
}
