# Yedi Renkli Çınar - Akıllı Test ve Takip Platformu

Bu proje, öğrenciler için kişiselleştirilmiş bir test deneyimi sunan, öğretmen ve adminler için derinlemesine raporlama yetenekleri sağlayan bir platformdur.

## Proje Yapısı (Monorepo)

- `apps/web`: React (Vite) tabanlı Admin ve Öğretmen paneli.
- `apps/mobile`: React Native (Expo) tabanlı Öğrenci uygulaması.
- `packages/database`: Supabase şemaları, migration'lar ve tip tanımlamaları.
- `packages/shared-api`: Web ve Mobil arasında paylaşılan iş mantığı.
- `packages/ui-kit`: Paylaşılan UI bileşenleri (Atomic Design).
- `ai`: LangGraph tabanlı yapay zeka servisleri.

## Teknolojiler

- **Frontend**: React, React Native (Expo), TypeScript, Tailwind CSS.
- **Backend/DB**: Supabase (PostgreSQL, Realtime, Auth, Storage).
- **AI**: LangGraph, Gemini.
- **Modülerlik**: Turborepo.
- **Deployment**: Dokploy (Web).

## Kurulum

```bash
npm install
npm run dev
```
