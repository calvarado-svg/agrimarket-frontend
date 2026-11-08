import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth";
import ProductImage from "../ProductImage";
import { useToast } from "../toast";
import { usePageTitle } from "../usePageTitle";

export default function ProductDetail() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const toast = useToast();
  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({ quantity: 1, message: "", contact: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  usePageTitle(product?.name || "Producto");

  useEffect(() => {
    setLoading(true);
    api(`/api/products/${id}`)
      .then(setProduct)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function sendRequest(e) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/requests", {
        method: "POST",
        token,
        body: { productId: Number(id), ...form, quantity: Number(form.quantity) },
      });
      toast.push("Solicitud enviada al productor", "ok");
      window.dispatchEvent(new Event("agrimarket:requests-changed"));
      setForm({ quantity: 1, message: "", contact: "" });
    } catch (err) {
      setError(err.message);
      toast.push(err.message, "error");
    }
  }

  if (loading) return <p className="muted">Cargando producto...</p>;
  if (error && !product) return <p className="error">{error}</p>;
  if (!product) return null;

  return (
    <section className="detail">
      <Link to="/" className="back-link">
        ← Volver al catálogo
      </Link>
      <div className="detail-grid">
        <div className="detail-media">
          <ProductImage product={product} className="large" />
        </div>
        <div>
          <h1>{product.name}</h1>
          <p className="price">
            ${Number(product.price).toLocaleString("es-CO")} / {product.unit}
          </p>
          <div className="meta-row">
            <span className="chip">{product.category}</span>
            <span className="chip">{product.zone}</span>
            <span
              className={`status-badge ${product.availability ? "status-accepted" : "status-rejected"}`}
            >
              {product.availability ? "Disponible" : "No disponible"}
            </span>
          </div>
          <div className="producer-box">
            <p className="muted">Productor</p>
            <strong>{product.producerName}</strong>
          </div>
          <p>{product.description || "Sin descripción."}</p>

          {user?.role === "consumer" && product.availability && (
            <form className="stack card" onSubmit={sendRequest}>
              <h3>Solicitar compra</h3>
              <label>
                Cantidad
                <input
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
                  required
                />
              </label>
              <label>
                Contacto
                <input
                  value={form.contact}
                  onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
                  placeholder="Teléfono o WhatsApp"
                  required
                />
              </label>
              <label>
                Mensaje
                <textarea
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  rows="3"
                />
              </label>
              {error && <p className="error">{error}</p>}
              <button type="submit">Enviar solicitud</button>
            </form>
          )}
          {!user && (
            <p className="muted">
              <Link to="/login" className="linkish">
                Inicia sesión
              </Link>{" "}
              como consumidor para solicitar.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
