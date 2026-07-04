# The Cake Cottage By Diya — PRD

## Original problem statement
> Make website which i can run on google and everyone can see that website, website for my cake business that name The Cake Cottage By Diya in which i have option to select photos of my cakes and public to buy and order and notification must sent on mention number 9041615117

## User choices (from ask_human)
- Admin panel where Diya uploads cake photos herself; will also share photos with dev later
- Order notification: WhatsApp deep-link that opens a pre-filled message to +91 9041615117 (free). Optional email later.
- No online payments — Diya contacts customer to arrange payment
- Address: Lighta wala chownk, near back side of Preet Dhaba, Mavi Colony, Morinda, Punjab 140101
- Bio: 2 yrs independent + 1 yr training. Specialty: customised cakes of any type. 100% eggless, fresh homemade bakery. Order 1 day in advance.

## Personas
1. **Customer (public)** — mobile visitor searching for a homemade eggless cake in Morinda; wants to see cake photos, prices, and order quickly via WhatsApp.
2. **Diya (owner / admin)** — needs a simple admin panel to manage her cake menu (add / edit / delete) and see submitted orders. No technical background.

## Core Requirements (static)
- Public site: hero, gallery, about, order form, location, footer
- Order form composes a WhatsApp deep-link to `+919041615117` AND logs the order to the database
- Admin login (single admin)
- Admin CRUD for cakes (name, description, price, category, image URL, weight, eggless, available)
- Admin view of submitted orders

## Architecture
- Backend: FastAPI + Motor (MongoDB). JWT (PyJWT) + bcrypt admin auth. `/api/*` prefix.
- Frontend: React 19 + React Router 7 + Tailwind + Shadcn/UI components + Sonner toasts + Lucide icons + Merienda/Outfit fonts.
- Env-driven: `MONGO_URL`, `DB_NAME`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` (backend); `REACT_APP_BACKEND_URL` (frontend).

## What's been implemented (2025-12)
- FastAPI backend: `/api/cakes`, `/api/cakes/{id}`, `/api/orders`, `/api/auth/login`, `/api/auth/me`, `/api/admin/cakes` (GET/POST/PATCH/DELETE), `/api/admin/orders`. Admin seeded on startup; 3 default cakes seeded.
- Public site: Hero + Gallery (from DB) + About + Order Form (WhatsApp deep-link, saves order first) + Location (Google Maps embed) + Footer.
- Admin: `/admin/login` + `/admin` dashboard with Cakes and Orders tabs.
- Design system: cream/terracotta palette, Merienda headings, Outfit body, arch-shaped hero image, sage-green eggless badges.

## Backlog / Next
- P1: Direct photo upload from admin panel (currently image URL only) — needs S3/Cloudinary or a `/api/upload` endpoint.
- P1: Optional email notification to Diya when a new order arrives (Resend integration).
- P1: Order status updates (new → contacted → confirmed → delivered) in admin.
- P2: Categories filter on gallery, cake detail page, testimonials, Instagram feed embed.
- P2: SEO: sitemap, Open Graph tags, Google Business Profile linkage so it ranks on Google searches for "cake Morinda".
- P2: PWA install banner for mobile.
