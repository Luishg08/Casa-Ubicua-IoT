# Despliegue en Cloudflare (gratis)

El juego es un Worker de Cloudflare (Nitro + TanStack Start).  
La URL esperada: `https://casa-ubicua-iot.luis-hg0807.workers.dev/`

## Configuración en Workers & Pages → Settings → Build

| Campo | Valor |
| --- | --- |
| **Build command** | `npm run build` |
| **Deploy command** | `npm run deploy:cf` |
| **Root directory** | `/` (vacío) |
| **Build output directory** | *(déjalo vacío; el deploy lo hace Wrangler)* |

> No uses `echo ...` como deploy: eso deja el Worker en “Hello world”.

## Variables de entorno del build (opcional)

- `NODE_VERSION` = `22`
