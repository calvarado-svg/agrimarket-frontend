import { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../auth";
import ComingSoonChat from "../ComingSoonChat";
import EmptyState from "../EmptyState";
import { useToast } from "../toast";
import { usePageTitle } from "../usePageTitle";

const labels = {
  pending: "Pendiente",
  pending_delivery: "Pendiente entrega",
  shipped: "Pedido enviado",
  delivered: "Entregado",
  rejected: "Rechazada",
  accepted: "Pendiente entrega",
};

const toastByStatus = {
  pending_delivery: "Solicitud aceptada · pendiente de entrega",
  rejected: "Solicitud rechazada",
  shipped: "Pedido marcado como enviado",
  delivered: "Entrega confirmada",
};

export default function Requests() {
  usePageTitle("Solicitudes");
  const { user, token } = useAuth();
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [chatRequest, setChatRequest] = useState(null);

  async function load() {
    setLoading(true);
    try {
      setItems(await api("/api/me/requests", { token }));
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function setStatus(id, status) {
    setError("");
    try {
      await api(`/api/requests/${id}/status`, {
        method: "PATCH",
        token,
        body: { status },
      });
      toast.push(toastByStatus[status] || "Estado actualizado", "ok");
      window.dispatchEvent(new Event("agrimarket:requests-changed"));
      await load();
    } catch (err) {
      setError(err.message);
      toast.push(err.message, "error");
    }
  }

  return (
    <section>
      <h1>Solicitudes</h1>
      <p className="muted">
        {user.role === "producer"
          ? "Acepta pedidos, marca el envío y sigue la entrega."
          : "Sigue tu pedido y confirma cuando lo recibas."}
      </p>
      {error && <p className="error">{error}</p>}
      {loading && <p className="muted">Cargando solicitudes...</p>}

      {!loading && items.length > 0 && (
        <div className="stack">
          {items.map((r) => {
            const status = r.status === "accepted" ? "pending_delivery" : r.status;
            return (
              <article key={r.id} className="card request-card">
                <div className="request-head">
                  <h3>{r.productName}</h3>
                  <span className={`status-badge status-${status}`}>
                    {labels[status] || status}
                  </span>
                </div>
                <p>Cantidad: {r.quantity}</p>
                <p className="muted">
                  {user.role === "producer"
                    ? `De: ${r.consumerName} · Contacto: ${r.contact}`
                    : `Productor: ${r.producerName || `#${r.producerId}`}`}
                </p>
                {r.message && <p>{r.message}</p>}

                <div className="row request-actions">
                  {user.role === "producer" && status === "pending" && (
                    <>
                      <button
                        type="button"
                        onClick={() => setStatus(r.id, "pending_delivery")}
                      >
                        Aceptar
                      </button>
                      <button
                        type="button"
                        className="secondary"
                        onClick={() => setStatus(r.id, "rejected")}
                      >
                        Rechazar
                      </button>
                    </>
                  )}

                  {user.role === "producer" && status === "pending_delivery" && (
                    <button type="button" onClick={() => setStatus(r.id, "shipped")}>
                      Marcar pedido enviado
                    </button>
                  )}

                  {user.role === "consumer" &&
                    (status === "pending_delivery" || status === "shipped") && (
                      <button type="button" onClick={() => setStatus(r.id, "delivered")}>
                        Confirmar producto entregado
                      </button>
                    )}

                  {status !== "rejected" && (
                    <button
                      type="button"
                      className="secondary chat-trigger"
                      onClick={() => setChatRequest(r)}
                    >
                      Chat
                      <span className="soon-pill">Pronto</span>
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <ComingSoonChat
        open={Boolean(chatRequest)}
        onClose={() => setChatRequest(null)}
        counterpartName={
          user.role === "producer"
            ? chatRequest?.consumerName
            : chatRequest?.producerName || "productor"
        }
        productName={chatRequest?.productName || ""}
      />

      {!loading && !items.length && (
        <EmptyState
          title="Sin solicitudes todavía"
          text={
            user.role === "producer"
              ? "Cuando un consumidor pida tus productos, las verás aquí."
              : "Explora el catálogo y envía tu primera solicitud de compra."
          }
          actionTo="/"
          actionLabel="Ir al catálogo"
        />
      )}
    </section>
  );
}
