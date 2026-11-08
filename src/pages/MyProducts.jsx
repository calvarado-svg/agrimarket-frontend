import { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../auth";
import EmptyState from "../EmptyState";
import ProductImage from "../ProductImage";
import { IMAGE_PRESETS, resolveProductImage } from "../productImage";
import { useToast } from "../toast";
import { usePageTitle } from "../usePageTitle";

const empty = {
  name: "",
  category: "",
  price: "",
  unit: "kg",
  zone: "",
  imageUrl: "",
  description: "",
  availability: true,
};

export default function MyProducts() {
  usePageTitle("Mis productos");
  const { token } = useAuth();
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    try {
      setItems(await api("/api/me/products", { token }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function update(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const imageUrl =
        form.imageUrl.trim() ||
        resolveProductImage({ name: form.name, category: form.category });
      await api("/api/products", {
        method: "POST",
        token,
        body: { ...form, imageUrl, price: Number(form.price) },
      });
      setForm(empty);
      toast.push("Producto publicado", "ok");
      await load();
    } catch (err) {
      setError(err.message);
      toast.push(err.message, "error");
    }
  }

  return (
    <section className="two-col">
      <form className="card stack" onSubmit={onSubmit}>
        <h1>Publicar producto</h1>
        <label>
          Nombre
          <input name="name" value={form.name} onChange={update} required />
        </label>
        <label>
          Categoría
          <input name="category" value={form.category} onChange={update} required />
        </label>
        <label>
          Precio
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={update}
            required
          />
        </label>
        <label>
          Unidad
          <input name="unit" value={form.unit} onChange={update} required />
        </label>
        <label>
          Zona
          <input name="zone" value={form.zone} onChange={update} required />
        </label>
        <label>
          Imagen sugerida
          <select
            value={form.imageUrl}
            onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
          >
            <option value="">Automática según el nombre</option>
            {IMAGE_PRESETS.map((preset) => (
              <option key={preset.label} value={preset.url}>
                {preset.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          URL de imagen (opcional)
          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={update}
            placeholder="https://..."
          />
        </label>
        {form.name && (
          <div className="detail-media" style={{ minHeight: 160 }}>
            <ProductImage
              product={{
                name: form.name,
                category: form.category,
                imageUrl: form.imageUrl,
              }}
            />
          </div>
        )}
        <label>
          Descripción
          <textarea name="description" value={form.description} onChange={update} rows="3" />
        </label>
        <label className="check">
          <input
            type="checkbox"
            name="availability"
            checked={form.availability}
            onChange={update}
          />
          Disponible
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit">Guardar</button>
      </form>

      <div className="mine-list">
        <h2>Mis publicaciones</h2>
        {loading && <p className="muted">Cargando...</p>}
        {!loading && (
          <div className="stack">
            {items.map((p) => (
              <article key={p.id} className="card">
                <ProductImage product={p} />
                <div>
                  <h3>{p.name}</h3>
                  <p>
                    ${Number(p.price).toLocaleString("es-CO")} / {p.unit} · {p.zone}
                  </p>
                  <span
                    className={`status-badge ${p.availability ? "status-accepted" : "status-rejected"}`}
                  >
                    {p.availability ? "Disponible" : "No disponible"}
                  </span>
                </div>
              </article>
            ))}
            {!items.length && (
              <EmptyState
                title="Todavía no publicas"
                text="Completa el formulario y publica tu primer producto al catálogo."
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
}
