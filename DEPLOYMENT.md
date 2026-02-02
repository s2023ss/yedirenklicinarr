# Yedi Renkli Çınar - Deployment Kılavuzu

## Dokploy Deployment

### Gereksinimler
- Dokploy hesabı ve proje
- GitHub repository bağlantısı
- Supabase URL ve Anon Key

### Environment Variables (Dokploy'da ayarlanmalı)
```
VITE_SUPABASE_URL=https://supabase.yedirenklicinar.digitalalem.com
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Deployment Adımları

1. **Dokploy'da Yeni Proje Oluşturma**
   - GitHub repository'yi bağlayın: `https://github.com/s2023ss/yedirenklicinar.git`
   - Branch: `main`

2. **Build Ayarları**
   - Build Provider: Nixpacks (otomatik algılanır)
   - Root Directory: `/` (monorepo kök dizini)
   - nixpacks.toml dosyası otomatik olarak kullanılacaktır

3. **Environment Variables Ekleme**
   - Dokploy dashboard'dan Environment Variables bölümüne gidin
   - Yukarıdaki değişkenleri ekleyin

4. **Deploy**
   - "Deploy" butonuna tıklayın
   - Build loglarını takip edin
   - Deployment tamamlandığında URL'niz aktif olacaktır

### Önemli Notlar

- **Port:** Dokploy otomatik olarak `$PORT` environment variable'ını sağlar
- **Static Files:** Vite build çıktısı `apps/web/dist` klasöründe oluşturulur
- **Server:** Production'da `serve` paketi kullanılarak static dosyalar sunulur
- **Hot Reload:** Production ortamında hot reload yoktur, her değişiklik için yeniden deploy gerekir

### Troubleshooting

**Build Hatası: "No start command could be found"**
- nixpacks.toml dosyasının root dizinde olduğundan emin olun
- Dosya içeriğinin doğru olduğunu kontrol edin

**Environment Variables Çalışmıyor**
- Vite için environment variable'lar `VITE_` prefix'i ile başlamalıdır
- Dokploy'da değişkenleri ekledikten sonra yeniden deploy edin

**404 Hatası (Routing Sorunları)**
- `serve` paketi SPA routing'i otomatik olarak handle eder
- Tüm route'lar index.html'e yönlendirilir

**React Error #525 (Environment Variables Eksik)**
- Bu hata, build sırasında environment variable'ların tanımlanmamış olduğunu gösterir
- `nixpacks.toml` dosyasında `VITE_SUPABASE_URL` ve `VITE_SUPABASE_ANON_KEY` değişkenlerinin olduğundan emin olun
- Dokploy'da environment variables eklediyseniz, **mutlaka redeploy** yapın (değişiklikler otomatik uygulanmaz)
- Browser console'da hatayı görmek için: F12 → Console tab
- Çözüm: Değişiklikleri GitHub'a push edin ve Dokploy'da "Redeploy" yapın

### Manuel Deployment (Alternatif)

Eğer Dokploy kullanmıyorsanız:

```bash
# Build
npm ci
npx turbo run build --filter=web

# Serve (production)
npx serve -s apps/web/dist -l 3000
```

### Güncelleme

Yeni bir deployment için:
1. Değişiklikleri GitHub'a push edin
2. Dokploy otomatik olarak yeni commit'i algılayacak ve deploy edecektir
3. Veya manuel olarak "Redeploy" butonuna tıklayın
