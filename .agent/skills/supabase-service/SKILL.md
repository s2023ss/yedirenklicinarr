---
name: supabase-service
description: Veritabanı işlemleri için belirli bir Supabase servisi ile etkileşime girmeyi sağlar.
---

# Supabase Servis Yeteneği (Skill)

bu yetenek, asistanın yapılandırılmış Supabase servisi ile etkileşime girmesini sağlar. Resmi `supabase-py` kütüphanesini kullanır.

## Yapılandırma
- **URL**: `http://supabasesecond-supabase-121a0e-94-154-32-150.traefik.me`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3Njk4ODgxNDQsImV4cCI6MTg5MzQ1NjAwMCwicm9sZSI6ImFub24iLCJpc3MiOiJzdXBhYmFzZSJ9.RDyrrTH3Av-5AaG22l6zP02i32xLtpnqOft1NTddB4o`
- **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3Njk4ODgxNDQsImV4cCI6MTg5MzQ1NjAwMCwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlzcyI6InN1cGFiYXNlIn0.jzfQt7YIzdDTx3ZDPQYNtxhiaK8CCNKC8IP7lYHzUfw`

> [!CAUTION]
> **Service Role Key** yönetici ayrıcalıklarına sahiptir. Asla frontend tarafında paylaşmayın.

## Kullanım Talimatları

Bu yeteneği kullanmak için `supabase` kütüphanesinin kurulu olması gerekir:
```bash
pip install supabase
```

### Python'da Başlatma
```python
from supabase import create_client, Client

url: str = "http://supabasesecond-supabase-121a0e-94-154-32-150.traefik.me"
key: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3Njk4ODgxNDQsImV4cCI6MTg5MzQ1NjAwMCwicm9sZSI6ImFub24iLCJpc3MiOiJzdXBhYmFzZSJ9.RDyrrTH3Av-5AaG22l6zP02i32xLtpnqOft1NTddB4o"
supabase: Client = create_client(url, key)
```

### Yaygın İşlemler

#### Veri Okuma
```python
response = supabase.table("tablo_adi").select("*").execute()
```

#### Veri Ekleme
```python
response = supabase.table("tablo_adi").insert({"sutun": "deger"}).execute()
```

#### Veri Güncelleme
```python
response = supabase.table("tablo_adi").update({"sutun": "yeni_deger"}).eq("id", 1).execute()
```

#### Veri Silme
```python
response = supabase.table("tablo_adi").delete().eq("id", 1).execute()
```

#### SQL Çalıştırma (RPC üzerinden)
```python
response = supabase.rpc("exec_sql", {"sql_query": "CREATE TABLE ..."}).execute()
```

> [!IMPORTANT]
> Supabase'deki RLS (Satır Düzeyinde Güvenlik) politikalarının gerçekleştirmeye çalıştığınız işlemlere izin verdiğinden emin olun.
