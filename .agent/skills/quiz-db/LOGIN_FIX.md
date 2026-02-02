# 🚨 Login Sorunu Hızlı Çözüm

## Sorun
Login başarılı oluyor (`SIGNED_IN`) ancak profil bilgileri çekilemiyor. Bu, Row Level Security (RLS) politikalarının doğru çalışmamasından kaynaklanıyor.

## ✅ Hızlı Çözüm (Geliştirme için)

Supabase Dashboard > SQL Editor'de aşağıdaki komutu çalıştırın:

```sql
-- RLS'i geçici olarak devre dışı bırak (sadece geliştirme için!)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
```

Bu komut çalıştırıldıktan sonra login çalışacaktır.

## 🔒 Üretim için Doğru Çözüm

Eğer RLS'i aktif tutmak istiyorsanız (önerilir), şu dosyayı çalıştırın:

**Dosya**: [003_fix_rls_policies.sql](file:///c:/Users/Uyar/Desktop/antigravity/yedirenklicinar/.agent/skills/quiz-db/migrations/003_fix_rls_policies.sql)

Bu dosya:
- Mevcut RLS politikalarını kaldırır
- Daha basit ve çalışan politikalar ekler
- Kullanıcıların kendi profillerini okuyabilmesini sağlar
- Admin ve öğretmenlerin tüm profilleri görebilmesini sağlar

## 📋 Tüm Migration'ları Sırayla Çalıştırma

Eğer sıfırdan kurulum yapıyorsanız:

1. **[001_create_profiles_table.sql](file:///c:/Users/Uyar/Desktop/antigravity/yedirenklicinar/.agent/skills/quiz-db/migrations/001_create_profiles_table.sql)** - Profiles tablosunu oluşturur
2. **[005_add_grade_id.sql](file:///c:/Users/Uyar/Desktop/antigravity/yedirenklicinar/.agent/skills/quiz-db/migrations/005_add_grade_id.sql)** - grade_id kolonunu ekler
3. **[003_fix_rls_policies.sql](file:///c:/Users/Uyar/Desktop/antigravity/yedirenklicinar/.agent/skills/quiz-db/migrations/003_fix_rls_policies.sql)** - RLS politikalarını düzeltir

VEYA

1. **[004_disable_rls_dev_only.sql](file:///c:/Users/Uyar/Desktop/antigravity/yedirenklicinar/.agent/skills/quiz-db/migrations/004_disable_rls_dev_only.sql)** - RLS'i tamamen devre dışı bırakır (sadece geliştirme için!)

## 🧪 Test

Migration'ı çalıştırdıktan sonra:

1. Sayfayı yenileyin (F5)
2. Login sayfasına gidin
3. Test kullanıcısıyla giriş yapın
4. Console'da şu mesajları görmelisiniz:

```
Attempting login for: admin@yedirenklicinar.com
Login successful, user: 3b2863a6-9c24-4af9-b2bc-a7a862054ba2
Fetching profile for user: 3b2863a6-9c24-4af9-b2bc-a7a862054ba2
Profile fetched successfully: {id: "...", email: "admin@yedirenklicinar.com", role: "admin", ...}
Auth state changed: SIGNED_IN
```

5. Otomatik olarak ilgili sayfaya yönlendirilmelisiniz

## ⚠️ Önemli Notlar

- **Geliştirme**: RLS'i devre dışı bırakmak en hızlı çözümdür
- **Üretim**: Mutlaka RLS politikalarını düzgün yapılandırın
- `grade_id` kolonu zaten var gibi görünüyor, ama migration'da yoktu - bu yüzden ekleme scripti hazırladım

## 📝 Hangi Çözümü Seçmeliyim?

**Şu anda geliştirme yapıyorsanız**: 
→ `004_disable_rls_dev_only.sql` çalıştırın (en hızlı)

**Üretim ortamına yakınsanız veya güvenlik önemliyse**: 
→ `003_fix_rls_policies.sql` çalıştırın (önerilen)
