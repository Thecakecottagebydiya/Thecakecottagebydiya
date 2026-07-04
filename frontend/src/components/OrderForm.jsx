import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { api } from "../lib/api";
import { buildWhatsAppUrl, orderMessage } from "../lib/whatsapp";
import { toast } from "sonner";
import { MessageCircle } from "lucide-react";

const FLAVORS = ["Chocolate Truffle", "Vanilla", "Butterscotch", "Red Velvet", "Pineapple", "Strawberry", "Black Forest", "Custom (mention below)"];

const OrderForm = forwardRef(function OrderForm(props, ref) {
  const [cakes, setCakes] = useState([]);
  const [form, setForm] = useState({
    customer_name: "",
    phone: "",
    cake_id: "",
    cake_name: "",
    weight_kg: "0.5",
    flavor: "",
    quantity: "1",
    delivery_date: "",
    message_on_cake: "",
    address: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get("/cakes").then((r) => setCakes(r.data)).catch(() => {});
  }, []);

  useImperativeHandle(ref, () => ({
    prefillWithCake(cake) {
      setForm((f) => ({
        ...f,
        cake_id: cake.id,
        cake_name: cake.name,
        weight_kg: String(cake.weight_kg || "0.5"),
      }));
      const el = document.getElementById("order");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    },
  }));

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onCakeSelect = (e) => {
    const id = e.target.value;
    const cake = cakes.find((c) => c.id === id);
    setForm((f) => ({
      ...f,
      cake_id: id,
      cake_name: cake ? cake.name : "",
      weight_kg: cake ? String(cake.weight_kg) : f.weight_kg,
    }));
  };

  const validate = () => {
    if (!form.customer_name.trim()) return "Please share your name.";
    if (!/^\+?\d[\d\s\-]{7,}$/.test(form.phone.trim())) return "Please enter a valid phone number.";
    if (!form.cake_name.trim()) return "Please choose or write a cake.";
    if (!form.delivery_date) return "Please pick a delivery date.";
    return null;
  };

  const submit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }
    setSubmitting(true);
    const payload = {
      ...form,
      weight_kg: parseFloat(form.weight_kg) || 0.5,
      quantity: parseInt(form.quantity) || 1,
    };
    try {
      await api.post("/orders", payload);
    } catch (_) {
      // Non-blocking: continue to WhatsApp even if server logging fails.
    }
    const url = buildWhatsAppUrl(orderMessage(payload));
    toast.success("Opening WhatsApp with your order…");
    window.open(url, "_blank", "noopener,noreferrer");
    setSubmitting(false);
  };

  return (
    <section
      id="order"
      data-testid="order-section"
      className="py-20 md:py-28"
      style={{ backgroundColor: "var(--cc-bg-2)" }}
    >
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto cc-fade">
          <span className="text-xs md:text-sm tracking-[0.3em] uppercase text-[color:var(--cc-text-soft)]">
            Place your order
          </span>
          <h2 className="mt-3 font-heading text-3xl md:text-5xl text-[color:var(--cc-text)]">
            Tell Diya about your celebration
          </h2>
          <p className="mt-4 text-[color:var(--cc-text-soft)]">
            Fill this in and we'll open WhatsApp with your details pre-typed —
            just hit send to confirm with Diya on <strong>+91 9041615117</strong>.
          </p>
        </div>

        <form
          onSubmit={submit}
          data-testid="order-form"
          className="cc-card mt-10 p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-5 cc-fade cc-fade-2"
        >
          <Field label="Your Name *" testid="order-input-name">
            <input required value={form.customer_name} onChange={set("customer_name")} className={inputCls} placeholder="e.g. Simran Kaur" data-testid="order-input-name" />
          </Field>
          <Field label="Phone / WhatsApp *" testid="order-input-phone">
            <input required value={form.phone} onChange={set("phone")} className={inputCls} placeholder="+91 98xxxxxxxx" data-testid="order-input-phone" />
          </Field>

          <Field label="Choose Cake *" testid="order-select-cake">
            <select value={form.cake_id} onChange={onCakeSelect} className={inputCls} data-testid="order-select-cake">
              <option value="">— Custom / not listed —</option>
              {cakes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — ₹{Math.round(c.price)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Cake name (if custom)" testid="order-input-cake-name">
            <input value={form.cake_name} onChange={set("cake_name")} className={inputCls} placeholder="Describe your cake idea" data-testid="order-input-cake-name" />
          </Field>

          <Field label="Flavor" testid="order-select-flavor">
            <select value={form.flavor} onChange={set("flavor")} className={inputCls} data-testid="order-select-flavor">
              <option value="">Choose a flavor</option>
              {FLAVORS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-5">
            <Field label="Weight (kg)" testid="order-input-weight">
              <input type="number" step="0.25" min="0.25" value={form.weight_kg} onChange={set("weight_kg")} className={inputCls} data-testid="order-input-weight" />
            </Field>
            <Field label="Quantity" testid="order-input-quantity">
              <input type="number" min="1" value={form.quantity} onChange={set("quantity")} className={inputCls} data-testid="order-input-quantity" />
            </Field>
          </div>

          <Field label="Delivery Date *" testid="order-input-date">
            <input required type="date" value={form.delivery_date} onChange={set("delivery_date")} className={inputCls} data-testid="order-input-date" />
          </Field>
          <Field label="Message on Cake" testid="order-input-message">
            <input value={form.message_on_cake} onChange={set("message_on_cake")} className={inputCls} placeholder="e.g. Happy Birthday Aarav" data-testid="order-input-message" />
          </Field>

          <div className="md:col-span-2">
            <Field label="Delivery Address" testid="order-input-address">
              <textarea rows={2} value={form.address} onChange={set("address")} className={inputCls} placeholder="House no, colony, city, pincode" data-testid="order-input-address" />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Notes for Diya" testid="order-input-notes">
              <textarea rows={2} value={form.notes} onChange={set("notes")} className={inputCls} placeholder="Anything else we should know?" data-testid="order-input-notes" />
            </Field>
          </div>

          <div className="md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-2">
            <p className="text-xs text-[color:var(--cc-text-soft)]">
              Please book at least <strong>1 day in advance</strong>. Payment is arranged directly with Diya.
            </p>
            <button
              type="submit"
              disabled={submitting}
              data-testid="order-submit-btn"
              className="cc-btn-wa"
            >
              <MessageCircle size={18} />
              {submitting ? "Preparing…" : "Send Order via WhatsApp"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
});

const inputCls =
  "w-full rounded-xl border border-[#E5DCD3] bg-white px-4 py-3 text-[color:var(--cc-text)] placeholder:text-[#a89a8f] focus:outline-none focus:ring-2 focus:ring-[#D36A52]/40 focus:border-[#D36A52] transition";

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-widest text-[color:var(--cc-text-soft)] mb-2">
        {label}
      </span>
      {children}
    </label>
  );
}

export default OrderForm;
