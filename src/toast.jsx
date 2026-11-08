import { createContext, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const value = useMemo(
    () => ({
      push(message, type = "ok") {
        const id = Date.now() + Math.random();
        setToasts((list) => [...list, { id, message, type }]);
        window.setTimeout(() => {
          setToasts((list) => list.filter((t) => t.id !== id));
        }, 2800);
      },
    }),
    []
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-stack" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de ToastProvider");
  return ctx;
}
