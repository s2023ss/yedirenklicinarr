---
name: quiz-db-schema
description: Quiz Uygulaması için sınavlar, sorular, seçenekler ve gönderimler tablolarını içeren veritabanı yapısı dokümantasyonu.
---

# Quiz Veritabanı Şeması Yeteneği (Skill)

Bu yetenek, Supabase üzerindeki Quiz Uygulaması için tam ve detaylı veritabanı yapısını içerir.

## Tablolar

### 1. `quizzes` (Sınavlar)
Her sınav için meta verileri depolar.
- `id` (SERIAL PRIMARY KEY): Benzersiz kimlik.
- `title` (TEXT, NOT NULL): Sınav başlığı.
- `description` (TEXT): Sınav hakkında kısa açıklama.
- `created_at` (TIMESTAMP): Oluşturulma tarihi.

### 2. `questions` (Sorular)
Belirli bir sınava bağlı soruları içerir.
- `id` (SERIAL PRIMARY KEY): Benzersiz kimlik.
- `quiz_id` (INTEGER, REFERENCES quizzes(id)): `quizzes` tablosuna bağlantı.
- `question_text` (TEXT, NOT NULL): Sorunun kendisi.
- `image_url` (TEXT): İsteğe bağlı görsel bağlantısı.
- `created_at` (TIMESTAMP).

### 3. `options` (Seçenekler)
Her soru için cevap seçeneklerini içerir.
- `id` (SERIAL PRIMARY KEY).
- `question_id` (INTEGER, REFERENCES questions(id)): `questions` tablosuna bağlantı.
- `option_text` (TEXT, NOT NULL): Seçenek metni.
- `is_correct` (BOOLEAN): Doğru cevap ise `true`, değilse `false`.

### 4. `submissions` (Gönderimler)
Kullanıcılar tarafından tamamlanan sınavların sonuçlarını depolar.
- `id` (SERIAL PRIMARY KEY).
- `quiz_id` (INTEGER, REFERENCES quizzes(id)): Tamamlanan sınav.
- `score` (INTEGER, NOT NULL): Alınan puan (genellikle yüzde).
- `user_name` (TEXT): Sınavı alan kişinin adı.
- `created_at` (TIMESTAMP).

## SQL Kurulum Kodu

Yapıyı yeniden oluşturmak için Supabase SQL Editor'de bu kodu kullanabilirsiniz:

```sql
CREATE TABLE IF NOT EXISTS quizzes (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS options (
    id SERIAL PRIMARY KEY,
    question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS submissions (
    id SERIAL PRIMARY KEY,
    quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    user_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Veri İlişkileri (ERD)
- Bir **Quiz** birden fazla **Soruya** sahip olabilir.
- Bir **Soru** birden fazla **Seçeneğe** sahiptir.
- Bir **Quiz** birden fazla **Gönderime** sahip olabilir.
