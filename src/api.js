const API_URL = import.meta.env.VITE_AGRIMARKET_API_URL;

if (!API_URL) {
  throw new Error("Falta VITE_AGRIMARKET_API_URL en el archivo .env");
}

export async function api(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Error de red");
  return data;
}
