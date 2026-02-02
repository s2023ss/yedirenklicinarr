# 📦 Monorepo Geliştirme Kuralları ve Öğrenilenler

Bu döküman, projenin monorepo yapısında karşılaşılan kritik sorunları ve bunları önleme yöntemlerini içerir.

## ⚠️ React Versiyon Çakışması (Error #525)

### Sorun
Eğer bir paylaşılan paket (örn: `packages/ui-kit`) `react` kütüphanesini doğrudan `dependencies` altında tanımlarsa, ana uygulama (`apps/web`) ile birlikte iki farklı React kopyası yüklenir. Bu durum "Invalid Hook Call" veya "Error #525" hatalarına yol açar.

### Kesin Çözüm (Altın Kural)
**Paylaşılan paketlerde (singleton olması gereken) kütüphaneler ASLA `dependencies` içine yazılmamalıdır.**

1. **`peerDependencies` Kullanın**:
   Paketin `package.json` dosyasında React'i şu şekilde tanımlayın:
   ```json
   "peerDependencies": {
     "react": "^18.0.0 || ^19.0.0",
     "react-dom": "^18.0.0 || ^19.0.0"
   }
   ```

2. **`devDependencies` Kullanın**:
   Geliştirme ve tip desteği için aynı paketleri `devDependencies` altına da ekleyin:
   ```json
   "devDependencies": {
     "react": "^19.0.0",
     "react-dom": "^19.0.0",
     "@types/react": "^19.0.0"
   }
   ```

3. **Ana Uygulama Sorumluluğu**:
   Bağımlılıkların asıl versiyonunu her zaman `apps/web` (veya ilgili ana uygulama) belirler. Uygulama her zaman tek bir React instance'ına sahip olmalıdır.

## 🚀 Yeni Bir Paket Eklerken Kontrol Listesi

- [ ] `react` ve `react-dom` `peerDependencies` içinde mi?
- [ ] Versiyon aralığı ana uygulama ile uyumlu mu?
- [ ] `npm install` sonrası `node_modules` klasöründe birden fazla `react` klasörü var mı? (Kontrol komutu: `npm ls react`)
- [ ] Production build (`npm run build`) yerelde test edildi mi?

## 🛠️ Sorun Giderme (Local Production Test)
Hata Dokploy'da çıkmadan önce yerelde şu komutla mutlaka test edilmelidir:
```bash
npm run build && npx serve -s apps/web/dist -p 3001
```

---
**Son Güncelleme**: 2026-02-02  
**Not**: Bu kural ihlal edilirse uygulama production ortamında beyaz ekran verebilir.
