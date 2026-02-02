# Yedi Renkli Çınar - Development Roadmap

## 📊 Mevcut Durum (Tamamlanan Özellikler)

### ✅ Altyapı ve Temel Yapı
- [x] Monorepo yapısı (Turborepo)
- [x] Supabase veritabanı şeması
- [x] Authentication sistemi (Supabase Auth)
- [x] RBAC (Role-Based Access Control) - admin, teacher, student
- [x] Environment variables yapılandırması
- [x] Dokploy deployment konfigürasyonu
- [x] GitHub repository entegrasyonu

### ✅ Frontend (Web - Admin/Teacher)
- [x] Admin Layout ve Navigation
- [x] Dashboard (istatistikler)
- [x] Login sayfası
- [x] Academic Structure (Sınıf/Ders/Ünite/Konu/Kazanım yönetimi)
- [x] Course Detail sayfası
- [x] Question Bank (Soru bankası listeleme)
- [x] Question Create (Soru oluşturma)
- [x] Question Edit (Soru düzenleme)
- [x] Question Bulk Upload (Toplu soru yükleme)
- [x] Exam Create (Sınav oluşturma)
- [x] Exams (Sınav listesi)
- [x] Users (Kullanıcı yönetimi)
- [x] Student Exams (Öğrenci sınavları)
- [x] Quiz Solve (Sınav çözme arayüzü)

### ✅ Shared Packages
- [x] UI Kit (Card, Button, Modal vb.)
- [x] Shared API (Supabase client)
- [x] TypeScript tip tanımlamaları

---

## 🚧 Eksik Özellikler ve Geliştirmeler

### 1. Authentication & Authorization

#### 1.1 Auth Guard (Yüksek Öncelik)
- [x] Protected routes (giriş yapmamış kullanıcıları `/login`'e yönlendir)
- [x] Role-based route protection (öğrenci admin sayfalarına erişemesin)
- [x] Session management (otomatik logout, token refresh)
- [x] "Beni hatırla" özelliği

#### 1.2 RLS Policies (Kritik)
- [x] Profiles tablosu RLS politikaları
- [x] Questions (ve Tests) tablosu RLS
- [x] Submissions tablosu RLS
- [x] Academic structure RLS (herkes okuyabilir, sadece admin/teacher yazabilir)

---

### 2. Raporlama ve Analitik (PRD'deki Ana Özellik)

#### 2.1 Admin Raporları
- [ ] Kurum geneli başarı ortalaması (Ders/Konu bazlı)
- [ ] Soru analitiği sayfası
  - [ ] Hangi soru kaç kez çözüldü
  - [ ] Yanlış yapılma oranı
  - [ ] Hatalı soru tespiti
- [ ] Öğrenci performans grafikleri
- [ ] Sınıf karşılaştırma raporları

#### 2.2 Öğretmen Raporları
- [ ] Sınıf ortalaması vs genel ortalama karşılaştırması
- [ ] Öğrenci bazlı "Konu Eksik Analizi"
- [ ] Bireysel öğrenci detay raporu
- [ ] Sınav sonuçları özet sayfası

#### 2.3 Öğrenci Raporları
- [ ] "Hangi konularda iyiyim?" analizi
- [ ] "Hangi konulara çalışmalıyım?" önerileri
- [ ] Haftalık soru çözüm hedefi ve ilerleme çubuğu
- [ ] Kişisel performans grafikleri

---

### 3. Gamification (Motivasyon Sistemi)

#### 3.1 Leaderboard
- [ ] Sınıf leaderboard sayfası
- [ ] Realtime güncellemeler (Supabase Realtime)
- [ ] Gizlilik: Sadece puan ve sıralama görünsün
- [ ] Filtreler: Haftalık, aylık, tüm zamanlar

#### 3.2 Rozet Sistemi
- [ ] Achievement tanımlama arayüzü (Admin)
- [ ] Rozet kazanma kuralları motoru
- [ ] Öğrenci rozet koleksiyonu sayfası
- [ ] Rozet örnekleri:
  - [ ] "Konu Şampiyonu" (bir konuda %90+ başarı)
  - [ ] "Sabah Kuşu" (sabah 6-8 arası test çözenler)
  - [ ] "Maraton Koşucusu" (50+ soru çözenler)
  - [ ] "Mükemmeliyetçi" (3 test üst üste 100 puan)

---

### 4. Test ve Sınav Sistemi İyileştirmeleri

#### 4.1 Test Çözme Deneyimi
- [ ] "Sonra dön" özelliği (soruları işaretle, sonra geri gel)
- [ ] Soru navigasyonu (soru numaralarına tıklayarak atla)
- [ ] Optik form benzeri işaretleme UI
- [ ] Süre bitince otomatik gönderim
- [ ] Çözüm sırasında otomatik kaydetme (draft)

#### 4.2 Test Sonuçları
- [ ] Detaylı çözüm gösterimi (doğru/yanlış cevaplar)
- [ ] Soru bazlı açıklamalar
- [ ] Yanlış soruları tekrar çözme özelliği
- [ ] PDF olarak sonuç indirme

---

### 5. Mobil Uygulama (React Native - Expo)

#### 5.1 Temel Özellikler
- [ ] Mobil app kurulumu (Expo)
- [ ] Login ekranı
- [ ] Ana sayfa (Dashboard)
- [ ] Test listesi
- [ ] Test çözme ekranı
- [ ] Sonuçlar sayfası
- [ ] Profil sayfası

#### 5.2 Mobil-Spesifik Özellikler
- [ ] Push notifications
  - [ ] "Sınav vaktin geldi"
  - [ ] "Birisi seni leaderboard'da geçti"
  - [ ] "Yeni rozet kazandın"
- [ ] Çevrimdışı mod (testleri indir, offline çöz)
- [ ] Kamera entegrasyonu (profil fotoğrafı)

---

### 6. AI Katmanı (LangGraph + Gemini)

#### 6.1 Öğrenci İçin AI
- [ ] Kişiselleştirilmiş test önerisi
  - [ ] Geçmiş performansa göre "bir sonraki en iyi test"
  - [ ] Zayıf olunan konulara odaklı soru setleri
- [ ] Konu açıklamaları (AI-generated summaries)
- [ ] Soru çözüm ipuçları

#### 6.2 Admin/Öğretmen İçin AI
- [ ] Doğal dilde rapor özetleme
  - [ ] "Bu hafta 10-A sınıfının matematik başarısı %15 düştü"
  - [ ] "En çok yanlış yapılan 5 konu"
- [ ] Otomatik soru kategorilendirme
- [ ] Soru kalitesi analizi

---

### 7. Admin Panel İyileştirmeleri

#### 7.1 Modül Yönetimi (PRD Gereksinimi)
- [ ] Öğretmen yetki yönetimi arayüzü
- [ ] Hangi öğretmen hangi modüle erişebilir?
  - [ ] Soru Bankası Düzenleme
  - [ ] Manuel Puan Girişi
  - [ ] Toplu Veri İçe Aktarma
  - [ ] Rapor İndirme
- [ ] Yetki değişikliklerinin realtime yansıması

#### 7.2 Toplu İşlemler
- [ ] Excel/CSV ile öğrenci listesi içe aktarma
- [ ] Excel/CSV ile soru bankası içe aktarma
- [ ] Toplu sınav oluşturma
- [ ] Raporları PDF/CSV olarak dışa aktarma

---

### 8. UI/UX İyileştirmeleri

#### 8.1 Genel
- [x] Loading states (skeleton screens)
- [x] Error handling ve kullanıcı dostu hata mesajları
- [x] Toast notifications
- [x] Success/Error feedback in forms
- [ ] Responsive design iyileştirmeleri

#### 8.2 Accessibility
- [ ] Keyboard navigation
- [ ] Screen reader desteği
- [ ] Yüksek kontrast modu
- [ ] Font boyutu ayarları

---

### 9. Performance ve Optimizasyon

- [ ] React Query cache stratejileri
- [ ] Lazy loading (code splitting)
- [ ] Image optimization
- [ ] Database query optimizasyonu (indexes)
- [ ] Supabase Edge Functions (ağır işlemler için)

---

### 10. Testing ve Kalite

- [ ] Unit tests (Jest)
- [ ] Integration tests
- [ ] E2E tests (Playwright)
- [ ] RLS policy testleri
- [ ] Performance testing

---

## 🎯 Önerilen Geliştirme Sırası (Sprint Planı)

### Sprint 1: Güvenlik ve Temel İyileştirmeler (1-2 hafta)
1. Auth Guard ve Protected Routes
2. RLS Policies (tüm tablolar)
3. Error handling ve loading states
4. Toast notifications

### Sprint 2: Raporlama Sistemi (2-3 hafta)
1. Admin raporları (soru analitiği)
2. Öğretmen raporları (sınıf analizi)
3. Öğrenci raporları (kişisel gelişim)
4. Grafik ve chart'lar (Recharts veya Chart.js)

### Sprint 3: Test Deneyimi İyileştirmeleri (1-2 hafta)
1. "Sonra dön" özelliği
2. Soru navigasyonu
3. Otomatik kaydetme
4. Detaylı sonuç gösterimi

### Sprint 4: Gamification (1-2 hafta)
1. Leaderboard (Realtime)
2. Rozet sistemi
3. Achievement engine
4. Rozet koleksiyonu UI

### Sprint 5: Mobil Uygulama (3-4 hafta)
1. Expo kurulumu ve temel yapı
2. Temel sayfalar (Login, Dashboard, Test List)
3. Test çözme ekranı
4. Push notifications
5. Çevrimdışı mod

### Sprint 6: AI Entegrasyonu (2-3 hafta)
1. LangGraph setup
2. Kişiselleştirilmiş test önerileri
3. Doğal dilde rapor özetleme
4. Konu açıklamaları

### Sprint 7: Admin Panel ve Toplu İşlemler (1-2 hafta)
1. Modül yönetimi
2. Excel/CSV import/export
3. Toplu işlem arayüzleri

### Sprint 8: Polish ve Optimizasyon (1 hafta)
1. UI/UX iyileştirmeleri
2. Performance optimizasyonu
3. Accessibility
4. Bug fixes

---

## 📝 Notlar

- **Deployment**: Her sprint sonunda Dokploy'a deploy edilmeli
- **Testing**: Her özellik için test yazılmalı
- **Documentation**: Yeni özellikler README'ye eklenmeli
- **User Feedback**: Her sprint sonunda kullanıcı geri bildirimi alınmalı

---

**Hangi sprint'ten başlamak istersiniz?**
