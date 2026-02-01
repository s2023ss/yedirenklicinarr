# Ürün Gereksinim Belgesi (PRD): Akıllı Test ve Takip Platformu

Bu belge; öğrenciler için kişiselleştirilmiş bir test deneyimi sunan, öğretmen ve adminler için ise derinlemesine raporlama yetenekleri sağlayan web ve mobil tabanlı uygulamanın kapsamını tanımlar.

---

## 1. Proje Vizyonu ve Hedefler

Uygulama, öğrencilerin test çözme süreçlerini dijitalleştirirken, veriye dayalı analizlerle öğretmenlerin sınıf yönetimini, adminlerin ise kurum genelindeki akademik başarıyı optimize etmesini hedefler.

* **Temel Hedef:** Rol bazlı esnek bir yönetim yapısı ve detaylı performans analitiği sunmak.
* **Platformlar:** Web (Admin ve Öğretmen ağırlıklı), Mobil (Öğrenci odaklı - iOS/Android).

---

## 2. Kullanıcı Rolleri ve Yetkilendirme (RBAC)

Sistem, Supabase tabanlı **Row Level Security (RLS)** mimarisi üzerine kurgulanacaktır.

| Rol | Erişim Yetkisi | Temel Sorumluluk |
| --- | --- | --- |
| **Admin** | Tam Erişim (Modül Yönetimi dahil) | Sistem yapılandırması, yetki tanımlama, makro raporlar. |
| **Öğretmen** | Sınıf ve Öğrenci Bazlı Erişim | İçerik üretimi, ödevlendirme, sınıf içi başarı takibi. |
| **Öğrenci** | Kişisel Veri ve Leaderboard Erişimi | Test çözme, bireysel gelişim takibi, rekabet. |

> **Admin Kontrol Paneli Özelliği:** Admin, "Öğretmen" rolünün hangi modüllere (Örn: Soru Bankası Düzenleme, Manuel Puan Girişi) erişebileceğini panel üzerinden açıp kapatabilmelidir.

---

## 3. Fonksiyonel Gereksinimler

### 3.1. İçerik ve Test Yönetimi

* **Dinamik Soru Bankası:** Ders, konu ve zorluk seviyesine göre etiketlenmiş soru yapısı.
* **Test Motoru (Mobil/Web):** Süreli sınavlar, "sonra dön" özelliği ve optik form benzeri işaretleme arayüzü.
* **Çevrimdışı Mod (Mobil):** Testlerin önceden indirilip internet olmadan çözülebilmesi.

### 3.2. Raporlama ve Analitik (Dashboard Hiyerarşisi)

* **Admin Raporları:**
* Kurum geneli başarı ortalaması (Ders/Konu bazlı).
* **Soru Analitiği:** Hangi soru kaç kez çözüldü, yanlış yapılma oranı nedir? (Hatalı soruları tespit etmek için).


* **Öğretmen Raporları:**
* Sınıf ortalaması ile genel ortalamanın kıyaslanması.
* Öğrenci bazlı "Konu Eksik Analizi".


* **Öğrenci Raporları:**
* Hangi konularda iyiyim, hangilerine çalışmalıyım?
* Haftalık soru çözüm hedefi ilerleme çubuğu.



### 3.3. Sosyal ve Motivasyon (Gamification)

* **Sınıf Leaderboard:** Öğrenciler, sınıf arkadaşlarının sadece puanlarını ve sıralamasını görebilir. Kişisel cevap detayları gizli tutulur.
* **Rozet Sistemi:** "Konu Şampiyonu", "Sabah Kuşu" (erken saatte çözenler için) gibi dijital ödüller.

---

## 4. Teknik Mimari

Uygulama, yüksek ölçeklenebilirlik ve gerçek zamanlı veri akışı için aşağıdaki yapıda kurgulanacaktır:

* **Veritabanı ve Auth:** **Supabase**.
* *Realtime:* Leaderboard güncellemeleri için.
* *Edge Functions:* Python/LangGraph entegrasyonu için.


* **Frontend:** **TypeScript**.
* Web için *React*, mobil için *React Native* (Kod paylaşımı maksimize edilecek).


* **Yapay Zeka (AI) Katmanı:** **LangGraph**.
* Öğrencinin geçmiş performansına göre "Bir sonraki en iyi test" önerisi üretme.
* Admin için doğal dilde rapor özetleme (Örn: "Bu hafta 10-A sınıfının matematik başarısı %15 düştü").



---

## 5. Platform Spesifik Gereksinimler

### Mobil (Öğrenci Öncelikli)

* **Push Notifications:** "Sınav vaktin geldi", "Birisi seni leaderboard'da geçti".
* **Kamera Entegrasyonu:** (Gelecek faz) Soru çözüm videosu yükleme veya profil fotoğrafı.

### Web (Admin/Öğretmen Öncelikli)

* **Toplu Veri Girişi:** Excel veya JSON üzerinden soru/öğrenci listesi içe aktarma.
* **Gelişmiş Filtreleme:** Raporları PDF veya CSV olarak dışa aktarma.

---

## 6. Kabul Kriterleri (Örnekler)

* Admin, bir öğretmenin "Soru Ekleme" yetkisini kaldırdığında, öğretmenin ekranında ilgili menü anında gizlenmelidir.
* Öğrenci testi bitirdiği an, öğretmenin dashboard'undaki sınıf ortalaması 1 saniyeden kısa sürede güncellenmelidir.
* Veritabanı seviyesinde, bir öğrenci asla başka bir öğrencinin "doğru/yanlış" detayına API üzerinden erişememelidir (RLS Check).

---

**Bu PRD'nin teknik ayağını somutlaştırmak için Supabase üzerinde kullanabileceğin bir "Veritabanı Şema Tasarımı" (SQL tabloları ve ilişkileri) hazırlamamı ister misin?**