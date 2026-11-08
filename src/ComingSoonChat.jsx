export default function ComingSoonChat({ open, onClose, counterpartName, productName }) {
  if (!open) return null;

  return (
    <div className="chat-backdrop" onClick={onClose} role="presentation">
      <div
        className="chat-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="chat-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="chat-header">
          <div>
            <h3 id="chat-title">Chat con {counterpartName}</h3>
            <p className="muted">{productName}</p>
          </div>
          <button type="button" className="secondary chat-close" onClick={onClose}>
            Cerrar
          </button>
        </header>

        <div className="chat-soon-banner">
          <span className="status-badge status-shipped">Próximamente</span>
          <strong>Chat en desarrollo</strong>
          <p className="muted">
            Esta conversación estará disponible en una próxima versión del MVP para
            coordinar entrega y detalles del pedido.
          </p>
        </div>

        <div className="chat-messages" aria-hidden="true">
          <div className="chat-bubble other">
            Hola, ¿podemos coordinar la entrega?
          </div>
          <div className="chat-bubble mine">
            Claro, te confirmo por aquí cuando esté listo.
          </div>
          <div className="chat-bubble system">Vista previa · no disponible aún</div>
        </div>

        <form
          className="chat-compose"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input
            type="text"
            placeholder="Escribe un mensaje..."
            disabled
            aria-disabled="true"
          />
          <button type="submit" disabled>
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
