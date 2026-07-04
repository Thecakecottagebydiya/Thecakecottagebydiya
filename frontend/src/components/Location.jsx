import { MapPin, Phone, Clock, MessageCircle } from "lucide-react";
import { buildWhatsAppUrl, quickCakeMessage, BUSINESS_ADDRESS, OWNER_PHONE } from "../lib/whatsapp";

export default function Location() {
  const wa = buildWhatsAppUrl(quickCakeMessage("your signature cake"));
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BUSINESS_ADDRESS)}`;

  return (
    <section
      id="visit"
      data-testid="visit-section"
      className="py-20 md:py-28"
      style={{ backgroundColor: "var(--cc-bg)" }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 grid md:grid-cols-2 gap-10 items-center">
        <div className="cc-fade">
          <span className="text-xs md:text-sm tracking-[0.3em] uppercase text-[color:var(--cc-text-soft)]">
            Visit &amp; Contact
          </span>
          <h2 className="mt-3 font-heading text-3xl md:text-5xl text-[color:var(--cc-text)]">
            Come to the cottage.
          </h2>
          <p className="mt-4 text-[color:var(--cc-text-soft)]">
            Order over WhatsApp or drop by the kitchen for a chat about your custom cake.
          </p>

          <div className="mt-8 space-y-5">
            <Info icon={MapPin} title="Address" testid="contact-address">
              {BUSINESS_ADDRESS}
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 underline"
                style={{ color: "var(--cc-brand)" }}
                data-testid="contact-maps-link"
              >
                Open in Maps
              </a>
            </Info>
            <Info icon={Phone} title="Phone / WhatsApp" testid="contact-phone">
              <a href={`tel:+919041615117`} className="underline" style={{ color: "var(--cc-brand)" }}>
                {OWNER_PHONE}
              </a>
            </Info>
            <Info icon={Clock} title="Order Timing" testid="contact-hours">
              Please place your order at least <strong>one day in advance</strong>.
            </Info>
          </div>

          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="visit-whatsapp-btn"
            className="cc-btn-wa mt-8"
          >
            <MessageCircle size={18} /> Chat with Diya
          </a>
        </div>

        <div className="cc-fade cc-fade-2">
          <div className="cc-card overflow-hidden">
            <iframe
              title="The Cake Cottage location"
              data-testid="visit-map"
              className="w-full h-[380px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                "Mavi Colony, Morinda, Punjab 140101"
              )}&output=embed`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Info({ icon: Icon, title, children, testid }) {
  return (
    <div className="flex gap-4" data-testid={testid}>
      <span
        className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: "rgba(211,106,82,0.12)", color: "var(--cc-brand)" }}
      >
        <Icon size={18} />
      </span>
      <div>
        <div className="text-xs uppercase tracking-widest text-[color:var(--cc-text-soft)]">
          {title}
        </div>
        <div className="mt-1 text-[color:var(--cc-text)]">{children}</div>
      </div>
    </div>
  );
}
