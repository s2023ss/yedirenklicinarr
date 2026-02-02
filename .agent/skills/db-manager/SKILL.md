---
name: db-manager
description: Supabase veritabanında SQL komutları çalıştırmak ve veri yönetimi yapmak için kullanılan yetenek.
---

# Veritabanı Yöneticisi Yeteneği (DB Manager Skill)

Bu yetenek, asistanın SQL sorgularını doğrudan çalıştırmasına ve veritabanı şemasını yönetmesine olanak tanır. `scripts/db_manager.py` dosyasını kullanarak Supabase üzerinde işlemler gerçekleştirebilir.

## Özellikler
- **SQL Çalıştırma**: `exec_sql` RPC fonksiyonu üzerinden (eğer mevcutsa) veya doğrudan tablo işlemleri.
- **Şema Yönetimi**: Yeni tablolar oluşturma, sütun ekleme/silme.
- **Veri Manipülasyonu**: RLS politikalarını baypas ederek (Service Role Key ile) veri ekleme, güncelleme ve silme.

## Kullanım

Asistan bu yeteneği `run_command` aracı ile bir Python betiği çalıştırarak kullanır.

### Örnek Komut:
```bash
python .agent/skills/db-manager/scripts/db_manager.py "SELECT * FROM public.profiles LIMIT 5"
```

## Gereksinimler
- `python` kurulu olmalı.
- `supabase` kütüphanesi kurulu olmalı (`pip install supabase`).

> [!CAUTION]
> Bu yetenek **Service Role Key** kullanır. Bu anahtar tüm güvenlik kurallarını (RLS) geçersiz kılar. Çok dikkatli kullanılmalıdır.
