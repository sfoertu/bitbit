# BITBIT

İkincil rezervasyon pazarı platformu — hibrit Web2/Web3 mimarisi.

## Proje Durumu

**Mevcut Faz:** Faz 4 dar kapsamlı kısmi tamamlandı (statik analiz + admin panel + KVKK)
**Sonraki Faz:** Faz 4 entegrasyon borçlarının kapatılması (gerçek zincir, DB, Redis, ERC-4337)

## Mimari Özet

- Frontend: Next.js 14 (App Router) + TypeScript + TailwindCSS
- Backend: NestJS (Faz 1+)
- Veritabanı: PostgreSQL (Faz 1+)
- Blokzincir: Polygon PoS / L2 (Faz 1+)
- Cüzdan: ERC-4337 Account Abstraction (Faz 1+)
- On/Off-Ramp: Lisanslı fiat-crypto köprü sağlayıcı (Faz 2+)

## Monorepo Layout

```
bitbit/
├── apps/
│   ├── web/                    # Next.js — kullanıcı yüzü ( aktif )
│   ├── admin/                  # Next.js — admin paneli (aktif, Faz 4)
│   └── api-gateway/            # NestJS — API katmanı (placeholder)
├── services/
│   ├── onramp-service/         # NestJS — fiat→USDC (sandbox, aktif)
│   ├── offramp-service/        # NestJS — USDC→fiat (sandbox, aktif)
│   ├── pms-sync-service/       # NestJS — PMS/GDS sync (sandbox, aktif)
│   ├── wallet-service/         # (placeholder, Faz 4+)
│   ├── marketplace-service/    # (placeholder, Faz 4+)
│   └── compliance-service/     # NestJS — KVKK/GDPR (aktif, Faz 4)
├── contracts/                  # Akıllı sözleşmeler (Faz 1 tamamlandı)
├── packages/
│   ├── shared-types/           # Ortak TypeScript tipleri
│   ├── config/                 # Env validasyonu, sabitler
│   ├── database/               # PostgreSQL migration + connection
│   └── ui-kit/                 # (placeholder)
├── infra/
│   └── docker/                 # docker-compose.yml (PG + Redis)
└── docs/
    └── BITBIT_SOP_ve_Uygulama_Plani.md
```

## Commands

```bash
# Frontend
npm install          # Tüm workspace bağımlılıklarını kur
npm run dev          # apps/web localhost:3000'de başlat
npm run dev:web      # Aynı (alias)
npm run build        # apps/web production build
npm run lint         # ESLint

# Smart Contracts (contracts/ altında)
forge build          # Compile
forge test           # Test çalıştır
forge coverage --ir-minimum  # Kapsama raporu
forge test -vvv      # Detaylı trace ile test

# Services (services/ altında)
cd services/onramp-service && npx nest build    # Compile
cd services/onramp-service && npx jest          # Test
cd services/offramp-service && npx nest build   # Compile
cd services/offramp-service && npx jest         # Test
cd services/pms-sync-service && npx nest build  # Compile
cd services/pms-sync-service && npx jest        # Test

# E2E Test (§8.1 Ahmet & Zeynep senaryosu)
cd services/e2e-test && npx jest --runInBand    # Tüm servisler arası uçtan uca test

# Compliance (KVKK/GDPR)
cd services/compliance-service && npx nest build  # Compile
cd services/compliance-service && npx jest        # Test

# Admin Panel
cd apps/admin && npm run build                   # Build
cd apps/admin && npm run dev                     # localhost:3001

# Shared Packages
cd packages/shared-types && npm run build       # Compile
cd packages/config && npm run build             # Compile

# Database
cd infra/docker && docker-compose up -d        # PG + Redis ayağa kaldır
cd packages/database && npm run migrate         # Migration çalıştır

# Test Ortamı
docker-compose -f infra/docker/docker-compose.yml up -d
```

## Git Safety Rules

- Commit/push öncesi kullanıcıya danış
- Ana branşa doğrudan push yapma
- Faz 1+ modüllerinde private key / API key hardcode etme
- Her commit mesajı kısa ve açıklayıcı olsun

## Mimari Prensipler (§3 — Özet)

1. Kullanıcı asla ham blokzincir arayüzü görmez
2. Kişisel veriler asla zincire yazılmaz
3. Atomik takas: para ve hak aynı transaction'da (all-or-nothing)
4. Her akıllı sözleşme pausable olmalı (multi-sig)
5. İdempotency her ödeme adımında zorunlu
6. Gözlemlenebilirlik built-in (trace ID)
7. PMS/GDS senkronizasyonu atomik (saga pattern)

## Kurallar

- Faz 0+ özellik ekleme: yalnızca ilgili fazın kapsamı dahilinde
- Gerçek API anahtarı / private key /_RPC URL kullanma
- SOP dokümanını güncelle: kapsam değişikliği sonrası kullanıcı onayı ile
- Claude Code tek başına "audit onayı" veremez — insan onayı zorunlu

# gstack

Use `/browse` skill (gstack) for all web browsing. Never use `mcp__claude-in-chrome__*` tools.

Available gstack skills: `/office-hours`, `/plan-ceo-review`, `/plan-eng-review`, `/plan-design-review`, `/design-consultation`, `/design-shotgun`, `/design-html`, `/review`, `/ship`, `/land-and-deploy`, `/canary`, `/benchmark`, `/browse`, `/connect-chrome`, `/qa`, `/qa-only`, `/design-review`, `/setup-browser-cookies`, `/setup-deploy`, `/setup-gbrain`, `/retro`, `/investigate`, `/document-release`, `/document-generate`, `/codex`, `/cso`, `/autoplan`, `/plan-devex-review`, `/devex-review`, `/careful`, `/freeze`, `/guard`, `/unfreeze`, `/gstack-upgrade`, `/learn`.
