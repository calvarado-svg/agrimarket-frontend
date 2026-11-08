import { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { api } from "./api";
import { useAuth } from "./auth";
import Catalog from "./pages/Catalog";
import Login from "./pages/Login";
import MyProducts from "./pages/MyProducts";
import ProductDetail from "./pages/ProductDetail";
import Requests from "./pages/Requests";
import { ToastProvider } from "./toast";

const roleLabel = {
  producer: "Productor",
  consumer: "Consumidor",
};

function Shell({ children }) {
  const { user, token, logout } = useAuth();
  const location = useLocation();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (!user || !token) {
      setPendingCount(0);
      return undefined;
    }

    let cancelled = false;

    async function refreshPending() {
      try {
        const items = await api("/api/me/requests", { token });
        if (!cancelled) {
          const count =
            user.role === "producer"
              ? items.filter((r) => r.status === "pending").length
              : items.filter((r) =>
                  ["pending_delivery", "shipped", "accepted"].includes(r.status)
                ).length;
          setPendingCount(count);
        }
      } catch {
        if (!cancelled) setPendingCount(0);
      }
    }

    refreshPending();
    const timer = window.setInterval(refreshPending, 12000);
    window.addEventListener("focus", refreshPending);
    window.addEventListener("agrimarket:requests-changed", refreshPending);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
      window.removeEventListener("focus", refreshPending);
      window.removeEventListener("agrimarket:requests-changed", refreshPending);
    };
  }, [user, token, location.pathname]);

  const badgeLabel = pendingCount > 9 ? "9+" : String(pendingCount);

  return (
    <div className="app">
      <header className="topbar">
        <Link to="/" className="brand">
          AgriMarket
        </Link>
        <nav>
          <Link to="/">Catálogo</Link>
          {user?.role === "producer" && <Link to="/mis-productos">Mis productos</Link>}
          {user && (
            <Link to="/solicitudes" className="nav-with-badge">
              Solicitudes
              {pendingCount > 0 && (
                <span className="notif-badge" aria-label={`${pendingCount} pendientes`}>
                  {badgeLabel}
                </span>
              )}
            </Link>
          )}
          {!user && <Link to="/login">Entrar</Link>}
          {user && (
            <>
              <span className={`role-badge role-${user.role}`}>
                {roleLabel[user.role]}
              </span>
              <button type="button" className="linkish" onClick={logout}>
                Salir · {user.name.split(" ")[0]}
              </button>
            </>
          )}
        </nav>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <strong>AgriMarket</strong>
        <span>MVP académico · Conecta productores locales con consumidores</span>
      </footer>
    </div>
  );
}

function Private({ roles, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <ToastProvider>
      <Shell>
        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route path="/login" element={<Login />} />
          <Route path="/productos/:id" element={<ProductDetail />} />
          <Route
            path="/mis-productos"
            element={
              <Private roles={["producer"]}>
                <MyProducts />
              </Private>
            }
          />
          <Route
            path="/solicitudes"
            element={
              <Private>
                <Requests />
              </Private>
            }
          />
        </Routes>
      </Shell>
    </ToastProvider>
  );
}
