import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, formatApiError } from "../lib/api";
import { toast } from "sonner";
import Header from "../components/Header";
import { Plus, Edit3, Trash2, LogOut, Package, ShoppingBag } from "lucide-react";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "Signature",
  image_url: "",
  weight_kg: "0.5",
  is_eggless: true,
  is_available: true,
};

export default function AdminPage() {
  const nav = useNavigate();
  const [tab, setTab] = useState("cakes");
  const [cakes, setCakes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const email = localStorage.getItem("cc_admin_email");

  useEffect(() => {
    const t = localStorage.getItem("cc_admin_token");
    if (!t) {
      nav("/admin/login");
      return;
    }
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = async () => {
    setLoading(true);
    try {
      const [c, o] = await Promise.all([
        api.get("/admin/cakes"),
        api.get("/admin/orders"),
      ]);
      setCakes(c.data);
      setOrders(o.data);
    } catch (e) {
      if (e.response?.status === 401) {
        localStorage.removeItem("cc_admin_token");
        nav("/admin/login");
        return;
      }
      toast.error(formatApiError(e.response?.data?.detail) || e.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("cc_admin_token");
    localStorage.removeItem("cc_admin_email");
    nav("/admin/login");
  };

  const startEdit = (cake) => {
    setEditingId(cake.id);
    setForm({
      name: cake.name,
      description: cake.description || "",
      price: String(cake.price),
      category: cake.category,
      image_url: cake.image_url,
      weight_kg: String(cake.weight_kg),
      is_eggless: cake.is_eggless,
      is_available: cake.is_available,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      price: parseFloat(form.price) || 0,
      weight_kg: parseFloat(form.weight_kg) || 0.5,
    };
    try {
      if (editingId) {
        await api.patch(`/admin/cakes/${editingId}`, payload);
        toast.success("Cake updated");
      } else {
        await api.post("/admin/cakes", payload);
        toast.success("Cake added");
      }
      cancelEdit();
      await refresh();
    } catch (e) {
      toast.error(formatApiError(e.response?.data?.detail) || e.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (cake) => {
    if (!window.confirm(`Delete "${cake.name}"?`)) return;
    try {
      await api.delete(`/admin/cakes/${cake.id}`);
      toast.success("Cake deleted");
      await refresh();
    } catch (e) {
      toast.error(formatApiError(e.response?.data?.detail) || e.message);
    }
  };

  const set = (k) => (e) =>
    setForm((f) => ({
      ...f,
      [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  return (
    <div data-testid="admin-page">
      <Header />
      <main
        className="min-h-screen py-12 px-6 md:px-12"
        style={{ backgroundColor: "var(--cc-bg-2)" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-heading text-3xl md:text-4xl text-[color:var(--cc-text)]">
                Diya's Dashboard
              </h1>
              <p className="text-sm text-[color:var(--cc-text-soft)] mt-1">
                Signed in as <strong>{email}</strong>
              </p>
            </div>
            <button
              onClick={logout}
              data-testid="admin-logout-btn"
              className="cc-btn-ghost text-sm"
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>

          <div className="mt-8 flex gap-2 cc-card p-1 inline-flex" role="tablist">
            <TabBtn active={tab === "cakes"} onClick={() => setTab("cakes")} testid="tab-cakes">
              <Package size={14} /> Cakes ({cakes.length})
            </TabBtn>
            <TabBtn active={tab === "orders"} onClick={() => setTab("orders")} testid="tab-orders">
              <ShoppingBag size={14} /> Orders ({orders.length})
            </TabBtn>
          </div>

          {tab === "cakes" && (
            <>
              <form
                onSubmit={save}
                data-testid="cake-form"
                className="cc-card mt-8 p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <h2 className="md:col-span-2 font-heading text-xl text-[color:var(--cc-text)]">
                  {editingId ? "Edit Cake" : "Add a new cake"}
                </h2>
                <TInput label="Name *" value={form.name} onChange={set("name")} testid="cake-input-name" required />
                <TInput label="Category" value={form.category} onChange={set("category")} testid="cake-input-category" />
                <TInput label="Price (₹) *" type="number" step="1" min="0" value={form.price} onChange={set("price")} testid="cake-input-price" required />
                <TInput label="Weight (kg)" type="number" step="0.25" min="0.25" value={form.weight_kg} onChange={set("weight_kg")} testid="cake-input-weight" />
                <div className="md:col-span-2">
                  <TInput label="Image URL *" value={form.image_url} onChange={set("image_url")} testid="cake-input-image-url" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-widest text-[color:var(--cc-text-soft)] mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={set("description")}
                    data-testid="cake-input-description"
                    className="w-full rounded-xl border border-[#E5DCD3] bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D36A52]/40 focus:border-[#D36A52]"
                  />
                </div>
                <div className="flex items-center gap-6 md:col-span-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={form.is_eggless} onChange={set("is_eggless")} data-testid="cake-input-eggless" />
                    100% Eggless
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={form.is_available} onChange={set("is_available")} data-testid="cake-input-available" />
                    Available on menu
                  </label>
                </div>
                <div className="md:col-span-2 flex gap-3 justify-end">
                  {editingId && (
                    <button type="button" onClick={cancelEdit} className="cc-btn-ghost" data-testid="cake-cancel-btn">
                      Cancel
                    </button>
                  )}
                  <button type="submit" disabled={saving} className="cc-btn-primary" data-testid="cake-save-btn">
                    <Plus size={16} /> {editingId ? "Save changes" : "Add cake"}
                  </button>
                </div>
              </form>

              <div className="mt-8">
                <h2 className="font-heading text-xl text-[color:var(--cc-text)] mb-4">All Cakes</h2>
                {loading ? (
                  <div className="text-[color:var(--cc-text-soft)]">Loading…</div>
                ) : cakes.length === 0 ? (
                  <div className="cc-card p-8 text-center text-[color:var(--cc-text-soft)]">
                    No cakes yet. Add your first one above.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="admin-cakes-grid">
                    {cakes.map((c) => (
                      <div key={c.id} className="cc-card overflow-hidden" data-testid={`admin-cake-${c.id}`}>
                        <div className="aspect-video overflow-hidden">
                          <img src={c.image_url} alt={c.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-5">
                          <div className="flex items-center justify-between">
                            <div className="font-heading text-lg">{c.name}</div>
                            <div className="text-sm font-semibold" style={{ color: "var(--cc-brand)" }}>
                              ₹{Math.round(c.price)}
                            </div>
                          </div>
                          <div className="text-xs text-[color:var(--cc-text-soft)] mt-1">
                            {c.category} · {c.weight_kg}kg · {c.is_available ? "Live" : "Hidden"}
                          </div>
                          <div className="mt-4 flex gap-2">
                            <button onClick={() => startEdit(c)} data-testid={`edit-cake-${c.id}`} className="cc-btn-ghost text-sm px-4 py-2">
                              <Edit3 size={14} /> Edit
                            </button>
                            <button onClick={() => remove(c)} data-testid={`delete-cake-${c.id}`} className="cc-btn-ghost text-sm px-4 py-2" style={{ color: "var(--destructive)" }}>
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {tab === "orders" && (
            <div className="mt-8">
              {loading ? (
                <div className="text-[color:var(--cc-text-soft)]">Loading…</div>
              ) : orders.length === 0 ? (
                <div className="cc-card p-8 text-center text-[color:var(--cc-text-soft)]">
                  No orders yet. When customers submit the order form, they'll appear here.
                </div>
              ) : (
                <div className="cc-card overflow-hidden" data-testid="admin-orders-table">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead style={{ backgroundColor: "var(--cc-bg-2)" }}>
                        <tr>
                          <Th>When</Th>
                          <Th>Customer</Th>
                          <Th>Phone</Th>
                          <Th>Cake</Th>
                          <Th>Details</Th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((o) => (
                          <tr key={o.id} className="border-t border-[#E5DCD3] align-top" data-testid={`admin-order-${o.id}`}>
                            <Td>{new Date(o.created_at).toLocaleString()}</Td>
                            <Td>{o.customer_name}</Td>
                            <Td>{o.phone}</Td>
                            <Td>{o.cake_name || "-"}</Td>
                            <Td>
                              <div className="text-xs text-[color:var(--cc-text-soft)] space-y-0.5">
                                <div>{o.weight_kg ? `${o.weight_kg}kg` : ""} {o.flavor}</div>
                                <div>{o.delivery_date}</div>
                                <div className="truncate max-w-[220px]">{o.message_on_cake}</div>
                              </div>
                            </Td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function TabBtn({ active, onClick, children, testid }) {
  return (
    <button
      onClick={onClick}
      data-testid={testid}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
        active ? "text-white" : "text-[color:var(--cc-text)]"
      }`}
      style={active ? { backgroundColor: "var(--cc-brand)" } : {}}
    >
      {children}
    </button>
  );
}

function TInput({ label, testid, ...rest }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-widest text-[color:var(--cc-text-soft)] mb-2">
        {label}
      </span>
      <input
        data-testid={testid}
        {...rest}
        className="w-full rounded-xl border border-[#E5DCD3] bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D36A52]/40 focus:border-[#D36A52]"
      />
    </label>
  );
}

function Th({ children }) {
  return <th className="text-left px-5 py-3 text-xs uppercase tracking-widest text-[color:var(--cc-text-soft)]">{children}</th>;
}
function Td({ children }) {
  return <td className="px-5 py-3">{children}</td>;
}
