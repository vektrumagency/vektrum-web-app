# CLAUDE.md — Vektrum Web App (Vektrum)

Site de marketing da Vektrum + ferramentas cliente do Order2Party, num único Next.js deployado na Vercel.

- **`vektrum.agency`** — landing page bilingue (PT-PT / EN) da agência
- **`order2party.vektrum.agency`** — portal de upload de Excel e UI de revisão de categorias WooCommerce

> Este é o repo activo da Vektrum. `vektrum-web` é o fork original de `dbaltaza/vektrum-web`.

## Como correr

```bash
npm install
```

`.env.local` necessário:
```
ADMIN_PANEL_PASSWORD=
ORDER2PARTY_PORTAL_PIN=
ORDER2PARTY_ORCHESTRATOR_URL=
ORDER2PARTY_ORCHESTRATOR_SECRET=
BLOB_READ_WRITE_TOKEN=
ORDER2PARTY_MAX_FILE_MB=4
ORDER2PARTY_ORCHESTRATOR_TIMEOUT_MS=25000
```

```bash
npm run dev     # http://localhost:3000
npm run build   # next build --webpack
npm run start
```

## Ficheiros-chave

| Ficheiro | Papel |
|---|---|
| `lib/site-config.ts` | Todo o conteúdo do site (EN + PT-PT), tipado via `SiteConfig` |
| `lib/runtime-config.ts` | Singleton em memória; admin pode editar conteúdo sem redeploy |
| `app/page.tsx` | Landing page (force-dynamic, lê config + locale em cada request) |
| `app/api/admin/config/route.ts` | GET/PUT config em runtime (cookie-protected) |
| `app/api/order2party/upload/route.ts` | Valida PIN + tamanho, faz proxy do Excel para o orchestrator |
| `app/api/order2party/categories/review/route.ts` | CRUD de decisões no Vercel Blob |
| `app/order2party/categories/review-client.tsx` | UI de revisão de categorias (componente grande) |
| `next.config.ts` | Rewrite: `order2party.vektrum.agency/*` → `/order2party/*` |

## Arquitetura

**Config em memória sem base de dados.**
`lib/runtime-config.ts` é um singleton inicializado a partir de `lib/site-config.ts`. Edições pelo admin persistem até ao próximo restart/cold start. Intencional — simplicidade acima de persistência.

**Todo o conteúdo em `lib/site-config.ts`.**
Não há i18n library. Locale resolvido via `?lang=en`; default `pt-PT`. Cada secção tem conteúdo para ambos os locales.

**Order2Party como produto separado no mesmo deploy.**
O rewrite de subdomínio em `next.config.ts` faz com que `order2party.vektrum.agency` sirva `/order2party` — um deploy, dois domínios.

**Persistência de revisão de categorias.**
Decisões guardadas como JSON no Vercel Blob (`order2party/category-review-v1.json`) com fallback em localStorage no cliente.

## Código morto / issues conhecidos

- `lib/content.ts` — exports estáticos não importados. Pode ser eliminado.
- A rota `/order2party/categories` não tem autenticação — ver TODO em `page.tsx` e `categories/review/route.ts`.
