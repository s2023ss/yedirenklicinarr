# 🔧 Dokploy Deployment Sorun Giderme

## 🐛 Mevcut Sorun: React Error #525

### Durum
- ✅ Local development (`npm run dev`) çalışıyor
- ❌ Dokploy production build'de hata: `Minified React error #525`

### Neden?
React Error #525 genellikle şu nedenlerden olur:
1. **Invalid Hook Call**: Hook'lar yanlış yerde çağrılıyor
2. **Multiple React Instances**: Birden fazla React kopyası yükleniyor
3. **Build Cache**: Eski build dosyaları kullanılıyor

---

## 🚀 Çözüm Adımları

### 1. Dokploy'da Cache Temizleme

**En olası çözüm!** Dokploy eski build'i cache'lemiş olabilir.

1. Dokploy Dashboard'a gidin
2. Projenizi seçin
3. **Settings** veya **Advanced** bölümüne gidin
4. **Clear Build Cache** butonuna tıklayın
5. **Redeploy** yapın

### 2. Environment Variables Kontrolü

Dokploy'da environment variables'ların doğru olduğundan emin olun:

```env
VITE_SUPABASE_URL=https://supabase.yedirenklicinar.digitalalem.com
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3Njk4ODgxNDQsImV4cCI6MTg5MzQ1NjAwMCwicm9sZSI6ImFub24iLCJpc3MiOiJzdXBhYmFzZSJ9.RDyrrTH3Av-5AaG22l6zP02i32xLtpnqOft1NTddB4o
```

### 3. Build Logs Kontrolü

Dokploy build logs'unda şunları kontrol edin:

```bash
# Build başarılı mı?
✓ built in X.XXs

# Environment variables yüklendi mi?
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...

# Serve komutu doğru mu?
npx serve -s apps/web/dist -p 3000
```

### 4. Detaylı Hata Mesajı Alma

**Son commit'te minification'ı kapattık.** Şimdi Dokploy'da redeploy yapın ve browser console'da tam hata mesajını göreceksiniz.

1. Dokploy'da **Redeploy** yapın
2. Site açıldığında browser console'u açın (F12)
3. Tam hata mesajını kopyalayın ve bana gönderin

---

## 📋 Kontrol Listesi

Sırayla şunları deneyin:

- [ ] **1. Cache Temizleme** (En önemli!)
  - Dokploy > Settings > Clear Build Cache
  - Redeploy

- [ ] **2. Environment Variables**
  - Dokploy > Environment > Variables kontrol
  - Her iki değişken de var mı?

- [ ] **3. Build Logs**
  - Dokploy > Deployments > Son deployment > Logs
  - Hata var mı?

- [ ] **4. Browser Console**
  - Site aç > F12 > Console
  - Tam hata mesajını kopyala

- [ ] **5. Network Tab**
  - F12 > Network
  - 404 veya 500 hatası var mı?

---

## 🔍 Detaylı Debug

Eğer yukarıdaki adımlar çalışmazsa:

### A. Local Production Build Test

```bash
# Local'de production build yap
npm run build

# Serve et
npx serve -s apps/web/dist -p 3001

# Browser'da aç
http://localhost:3001
```

Eğer local production build'de de hata varsa, sorun kodda. Eğer yoksa, sorun Dokploy yapılandırmasında.

### B. nixpacks.toml Kontrolü

Dosya içeriği:

```toml
[phases.setup]
nixPkgs = ["nodejs_18", "npm-9_x"]

[phases.install]
cmds = ["npm ci"]

[phases.build]
cmds = ["npx turbo run build --filter=web"]

[start]
cmd = "npx serve -s apps/web/dist -p 3000"

[variables]
VITE_SUPABASE_URL = "https://supabase.yedirenklicinar.digitalalem.com"
VITE_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3Njk4ODgxNDQsImV4cCI6MTg5MzQ1NjAwMCwicm9sZSI6ImFub24iLCJpc3MiOiJzdXBhYmFzZSJ9.RDyrrTH3Av-5AaG22l6zP02i32xLtpnqOft1NTddB4o"
```

### C. Dokploy Build Command Override

Eğer nixpacks.toml çalışmıyorsa, Dokploy'da manuel olarak:

**Build Command**:
```bash
npm ci && npx turbo run build --filter=web
```

**Start Command**:
```bash
npx serve -s apps/web/dist -p 3000
```

---

## 🎯 En Olası Çözüm

**%90 ihtimalle sorun cache!**

1. Dokploy > Settings > **Clear Build Cache**
2. **Redeploy**
3. 5-10 dakika bekle
4. Siteyi aç ve test et

---

## 📝 Sonraki Adımlar

Eğer hala çalışmazsa:

1. **Minify edilmemiş build'den tam hata mesajını al**
2. **Dokploy build logs'unu paylaş**
3. **Browser console'daki tüm hataları paylaş**

Bu bilgilerle sorunu kesin olarak çözebiliriz!

---

**Son Güncelleme**: 2026-02-02 21:00  
**Durum**: Debug mode aktif (minification kapalı)  
**Beklenen Sonuç**: Tam hata mesajı görünecek
