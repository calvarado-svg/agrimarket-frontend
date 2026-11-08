# AgriMarket Frontend

Interfaz web del MVP de AgriMarket.

## Requisitos

- Node.js 18+ (o Bun)
- Backend corriendo (`agrimarket-backend`)

## Configuración

```bash
cp .env.example .env
npm install
npm run dev
```

La variable `VITE_AGRIMARKET_API_URL` debe apuntar al backend (por defecto `http://localhost:4000`).
