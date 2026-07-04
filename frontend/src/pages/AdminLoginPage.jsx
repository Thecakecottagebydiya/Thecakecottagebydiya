import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api, formatApiError } from "../lib/api";
import { toast } from "sonner";
import Header from "../components/Header";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("cc_admin_token", data.token);
      localStorage.setItem("cc_admin_email", data.email);
      toast.success("Welcome back, Diya!");
      nav("/admin");
    } catch (e) {
      const msg = formatApiError(e.response?.data?.detail) || e.message;
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="admin-login-page">
      <Header />
      <main
        className="min-h-[80vh] flex items-center justify-center px-6 py-16"
        style={{ backgroundColor: "var(--cc-bg-2)" }}
      >
        <div className="cc-card w-full max-w-md p-8 md:p-10">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mb-5"
            style={{ backgroundColor: "rgba(211,106,82,0.14)", color: "var(--cc-brand)" }}
          >
            <Lock size={20} />
          </div>
          <h1 className="font-heading text-3xl text-[color:var(--cc-text)]">Admin Sign In</h1>
          <p className="mt-2 text-sm text-[color:var(--cc-text-soft)]">
            For Diya only. Manage cakes and view orders.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4" data-testid="admin-login-form">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[color:var(--cc-text-soft)] mb-2">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                data-testid="login-email-input"
                className="w-full rounded-xl border border-[#E5DCD3] bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D36A52]/40 focus:border-[#D36A52]"
                placeholder="diya@thecakecottage.in"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[color:var(--cc-text-soft)] mb-2">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
                data-testid="login-password-input"
                className="w-full rounded-xl border border-[#E5DCD3] bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D36A52]/40 focus:border-[#D36A52]"
                placeholder="••••••••"
              />
            </div>

            {err && (
              <div data-testid="login-error" className="text-sm text-[color:var(--destructive)]">
                {err}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              data-testid="login-submit-btn"
              className="cc-btn-primary w-full"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <Link
            to="/"
            className="block text-center text-xs mt-6 text-[color:var(--cc-text-soft)] hover:text-[color:var(--cc-brand)]"
          >
            ← Back to site
          </Link>
        </div>
      </main>
    </div>
  );
}
