# 🚀 Dokploy Deployment Rehberi

## 📋 Ön Hazırlık

### ✅ Tamamlananlar
- [x] Kod GitHub'a yüklendi
- [x] `nixpacks.toml` yapılandırıldı
- [x] `.gitignore` düzenlendi (`.env` dosyası commit edilmedi)
- [x] Authentication sistemi çalışıyor
- [x] Supabase bağlantısı test edildi

### ⚠️ Önemli Notlar
- Debug log'lar şu anda aktif (üretim öncesi temizlenecek)
- RLS şu anda devre dışı (üretim öncesi aktif edilecek)

---

## 🔧 Dokploy Kurulum Adımları

### 1. Dokploy Dashboard'a Giriş

1. Dokploy dashboard'unuza giriş yapın
2. **New Project** veya mevcut projeyi seçin

### 2. GitHub Repository Bağlantısı

1. **Source** bölümünde:
   - **Provider**: GitHub
   - **Repository**: `s2023ss/yedirenklicinarr`
   - **Branch**: `main`

2. **Build Settings**:
   - **Build Provider**: Nixpacks (otomatik algılanmalı)
   - **Build Path**: `/` (root)

### 3. Environment Variables (ÖNEMLİ!)

Dokploy'da **Environment Variables** bölümüne şu değişkenleri ekleyin:

```env
VITE_SUPABASE_URL=https://supabase.yedirenklicinar.digitalalem.com
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3Njk4ODgxNDQsImV4cCI6MTg5MzQ1NjAwMCwicm9sZSI6ImFub24iLCJpc3MiOiJzdXBhYmFzZSJ9.RDyrrTH3Av-5AaG22l6zP02i32xLtpnqOft1NTddB4o
```

> **Not**: Bu değişkenler `nixpacks.toml` dosyasında da var, ancak Dokploy'da da tanımlamak daha güvenlidir.

### 4. Port Yapılandırması

- **Port**: `3000` (nixpacks.toml'da tanımlı)
- **Protocol**: HTTP

### 5. Domain Ayarları

1. **Custom Domain** ekleyin (örn: `yedirenklicinar.digitalalem.com`)
2. SSL sertifikası otomatik oluşturulacak

### 6. Deploy!

1. **Deploy** butonuna tıklayın
2. Build loglarını takip edin

---

## 📊 Build Süreci

Dokploy şu adımları otomatik olarak gerçekleştirecek:

```bash
# 1. Dependencies yükleme
npm ci

# 2. Build
npx turbo run build --filter=web

# 3. Serve
npx serve -s apps/web/dist -p 3000
```

### Beklenen Build Süresi
- İlk build: ~5-10 dakika
- Sonraki build'ler: ~3-5 dakika (cache sayesinde)

---

## 🧪 Deployment Sonrası Test

### 1. Sağlık Kontrolü

Deployment tamamlandıktan sonra:

```bash
# Site erişilebilir mi?
curl -I https://your-domain.com

# Beklenen: HTTP 200 OK
```

### 2. Login Testi

1. Tarayıcıda `/login` sayfasına gidin
2. Test kullanıcısıyla giriş yapın:
   - Email: `admin@yedirenklicinar.com`
   - Password: `Password123!`
3. Admin paneline yönlendirildiğinizi doğrulayın

### 3. Console Kontrolü

Browser console'da şu mesajları görmeli siniz:
```
Supabase Config: {url: '...', hasKey: true, ...}
Supabase client created successfully
=== FETCH PROFILE START ===
Profile fetched successfully: {...}
```

---

## 🐛 Sorun Giderme

### Build Başarısız Olursa

#### Hata: "npm ci failed"
**Çözüm**: `package-lock.json` dosyasının commit edildiğinden emin olun

```bash
git add package-lock.json
git commit -m "chore: Add package-lock.json"
git push
```

#### Hata: "Build command not found"
**Çözüm**: `nixpacks.toml` dosyasını kontrol edin

```bash
# Dosyanın varlığını kontrol edin
ls -la nixpacks.toml

# İçeriğini kontrol edin
cat nixpacks.toml
```

#### Hata: "serve: command not found"
**Çözüm**: `serve` paketi dependencies'e eklenmiş mi?

```bash
npm install --save-dev serve
git add package.json package-lock.json
git commit -m "chore: Add serve package"
git push
```

### Runtime Hataları

#### Beyaz Sayfa (Blank Page)
**Olası Nedenler**:
1. Environment variables yüklenmemiş
2. Build dosyaları doğru serve edilmiyor
3. Routing sorunu

**Çözüm**:
1. Dokploy logs'u kontrol edin
2. Browser console'u kontrol edin
3. Network tab'ı kontrol edin (404 hatası var mı?)

#### Login Çalışmıyor
**Olası Nedenler**:
1. Supabase URL yanlış
2. CORS sorunu
3. RLS politikaları

**Çözüm**:
1. Environment variables'ı doğrulayın
2. Supabase Dashboard > Settings > API'yi kontrol edin
3. RLS'in devre dışı olduğundan emin olun (geliştirme için)

---

## 📝 Deployment Checklist

### Deployment Öncesi
- [x] Kod GitHub'a push edildi
- [x] `.env` dosyası `.gitignore`'da
- [x] `nixpacks.toml` yapılandırıldı
- [ ] Supabase bağlantısı doğrulandı
- [ ] Test kullanıcıları oluşturuldu

### Deployment Sırasında
- [ ] GitHub repository bağlandı
- [ ] Environment variables eklendi
- [ ] Port ayarlandı (3000)
- [ ] Domain yapılandırıldı
- [ ] SSL sertifikası oluşturuldu

### Deployment Sonrası
- [ ] Site erişilebilir
- [ ] Login çalışıyor
- [ ] Admin paneli açılıyor
- [ ] Console'da hata yok
- [ ] Network istekleri başarılı

---

## 🔄 Güncelleme (Re-deploy)

Kod değişikliklerinden sonra:

```bash
# 1. Değişiklikleri commit edin
git add .
git commit -m "feat: Yeni özellik eklendi"
git push

# 2. Dokploy otomatik olarak yeniden deploy edecek
# (Webhook ayarlandıysa)
```

Manuel re-deploy için:
1. Dokploy dashboard'a gidin
2. Projeyi seçin
3. **Redeploy** butonuna tıklayın

---

## 🎯 Sonraki Adımlar

Deployment başarılı olduktan sonra:

1. **Monitoring Kurulumu**
   - Uptime monitoring
   - Error tracking (Sentry, etc.)
   - Analytics

2. **Performans Optimizasyonu**
   - CDN kurulumu
   - Image optimization
   - Code splitting

3. **Güvenlik**
   - RLS politikalarını aktif edin
   - Rate limiting
   - CORS yapılandırması

4. **Backup**
   - Database backup stratejisi
   - Code backup (GitHub zaten var)

---

## 📞 Destek

Sorun yaşarsanız:
1. Dokploy logs'u kontrol edin
2. Browser console'u kontrol edin
3. GitHub Issues'a bakın
4. Dokploy documentation'ı inceleyin

---

**Son Güncelleme**: 2026-02-02  
**Versiyon**: 1.0.0  
**Durum**: ✅ Deployment için hazır
