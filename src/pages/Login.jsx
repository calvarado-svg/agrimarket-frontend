import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth";
import { useToast } from "../toast";
import { usePageTitle } from "../usePageTitle";

export default function Login() {
  usePageTitle("Entrar");
  const { user, login, register } = useAuth();
  const toast = useToast();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "consumer",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  function update(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login({ email: form.email, password: form.password });
        toast.push("Sesión iniciada", "ok");
      } else {
        await register(form);
        toast.push("Cuenta creada", "ok");
      }
    } catch (err) {
      setError(err.message);
      toast.push(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card narrow">
      <p className="brand" style={{ marginBottom: "0.35rem" }}>
        AgriMarket
      </p>
      <h1>{mode === "login" ? "Entrar" : "Crear cuenta"}</h1>
      <p className="muted">Productores publican oferta. Consumidores solicitan compra.</p>
      <form onSubmit={onSubmit} className="stack">
        {mode === "register" && (
          <>
            <label>
              Nombre
              <input name="name" value={form.name} onChange={update} required />
            </label>
            <label>
              Rol
              <select name="role" value={form.role} onChange={update}>
                <option value="consumer">Consumidor</option>
                <option value="producer">Productor</option>
              </select>
            </label>
          </>
        )}
        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={update}
            required
          />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={update}
            required
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button disabled={loading}>{loading ? "Espera..." : "Continuar"}</button>
      </form>
      <button
        type="button"
        className="linkish"
        onClick={() => setMode(mode === "login" ? "register" : "login")}
      >
        {mode === "login" ? "¿No tienes cuenta? Regístrate" : "Ya tengo cuenta"}
      </button>
    </section>
  );
}
