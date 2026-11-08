import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth";
import EmptyState from "../EmptyState";
import ProductImage from "../ProductImage";
import SkeletonGrid from "../SkeletonGrid";
import { usePageTitle } from "../usePageTitle";

export default function Catalog() {
  usePageTitle("Catálogo");
  const { user } = useAuth();
  const [filters, setFilters] = useState({ category: "", zone: "", q: "" });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setError("");
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.category) params.set("category", filters.category);
    if (filters.zone) params.set("zone", filters.zone);
    if (filters.q) params.set("q", filters.q);
    const query = params.toString() ? `?${params}` : "";
    try {
      setItems(await api(`/api/products${query}`));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <section>
      <div className="hero">
        <h1>AgriMarket</h1>
        <p>Productos frescos de productores locales. Busca, elige y solicita compra directa.</p>
      </div>

      <form
        className="filters"
        onSubmit={(e) => {
          e.preventDefault();
          load();
        }}
      >
        <input
          placeholder="Buscar producto"
          value={filters.q}
          onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
        />
        <input
          placeholder="Categoría"
          value={filters.category}
          onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
        />
        <input
          placeholder="Zona / municipio"
          value={filters.zone}
          onChange={(e) => setFilters((f) => ({ ...f, zone: e.target.value }))}
        />
        <button type="submit">Filtrar</button>
      </form>

      {error && <p className="error">{error}</p>}
      {loading && <SkeletonGrid />}

      {!loading && !error && items.length > 0 && (
        <div className="grid">
          {items.map((p, index) => (
            <Link
              key={p.id}
              to={`/productos/${p.id}`}
              className="product"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <ProductImage product={p} />
              <div className="product-body">
                <h3>{p.name}</h3>
                <p className="price-line">
                  ${Number(p.price).toLocaleString("es-CO")} / {p.unit}
                </p>
                <p className="muted">
                  {p.category} · {p.zone}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && !error && !items.length && (
        <EmptyState
          title="Aún no hay productos"
          text="Cuando un productor publique oferta, aparecerá aquí."
          actionTo={user?.role === "producer" ? "/mis-productos" : "/login"}
          actionLabel={
            user?.role === "producer" ? "Publicar producto" : "Entrar para publicar"
          }
        />
      )}
    </section>
  );
}
