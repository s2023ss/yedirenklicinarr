# Üretim Öncesi Kontrol Listesi

## 🔒 Güvenlik

- [ ] **RLS Politikalarını Aktifleştir**
  - Dosya: `003_fix_rls_policies.sql`
  - Konum: `.agent/skills/quiz-db/migrations/003_fix_rls_policies.sql`
  - **ÖNEMLİ**: Bu adım atlanırsa tüm kullanıcı verileri herkese açık olur!
  
- [ ] **RLS'in Aktif Olduğunu Doğrula**
  ```sql
  SELECT tablename, rowsecurity 
  FROM pg_tables 
  WHERE schemaname = 'public' AND tablename = 'profiles';
  -- rowsecurity = true olmalı
  ```

- [ ] **RLS Politikalarını Test Et**
  ```sql
  -- Öğrenci olarak giriş yap ve çalıştır:
  SELECT * FROM profiles;
  -- Sadece kendi profilini görmeli
  
  -- Admin olarak giriş yap ve çalıştır:
  SELECT * FROM profiles;
  -- Tüm profilleri görmeli
  ```

## 🌍 Environment Variables

- [ ] Production `.env` dosyasını kontrol et
  - `VITE_SUPABASE_URL` doğru mu?
  - `VITE_SUPABASE_ANON_KEY` doğru mu?
  - **Service Role Key** kullanılmıyor mu? (Güvenlik riski!)

## 🗄️ Veritabanı

- [ ] Tüm migration'lar çalıştırıldı mı?
  - `001_create_profiles_table.sql`
  - `005_add_grade_id.sql` (eğer gerekiyorsa)
  - `003_fix_rls_policies.sql` ⚠️ **ZORUNLU**

- [ ] Backup alındı mı?
  - Supabase Dashboard > Database > Backups

## 🧪 Test

- [ ] Login testi
  - Admin hesabıyla giriş
  - Öğretmen hesabıyla giriş
  - Öğrenci hesabıyla giriş

- [ ] Yetkilendirme testi
  - Öğrenci başka öğrencinin profilini görebiliyor mu? (Görmemeli!)
  - Admin tüm profilleri görebiliyor mu? (Görmeli!)
  - Öğretmen öğrenci listesini görebiliyor mu? (Görmeli!)

## 📊 Performans

- [ ] Index'ler oluşturuldu mu?
  - `idx_profiles_email`
  - `idx_profiles_role`

## 🚀 Deployment

- [ ] Build başarılı mı?
  ```bash
  npm run build
  ```

- [ ] Production URL'leri güncellendi mi?

## ⚠️ KRİTİK HATIRLATMA

**RLS olmadan production'a çıkmayın!** 

Eğer RLS devre dışıysa:
- Herhangi bir kullanıcı tüm veritabanını görebilir
- GDPR/KVKK ihlali riski
- Güvenlik açığı
- Veri sızıntısı riski

---

## 📝 Notlar

- Bu checklist üretim öncesi **mutlaka** kontrol edilmelidir
- Her madde için sorumlu kişi atanmalıdır
- Test sonuçları dokümante edilmelidir
