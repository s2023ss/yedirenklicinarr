# Veritabanı Kurulum Rehberi

Bu rehber, Yedi Renkli Çınar Quiz Uygulaması için Supabase veritabanını kurmak için gerekli adımları içerir.

## Adım 1: Supabase Projesine Giriş Yapın

1. [Supabase Dashboard](https://app.supabase.com/) adresine gidin
2. Projenizi seçin
3. Sol menüden **SQL Editor**'ü açın

## Adım 2: Profiles Tablosunu Oluşturun

1. SQL Editor'de yeni bir sorgu açın
2. `migrations/001_create_profiles_table.sql` dosyasının içeriğini kopyalayın
3. SQL Editor'e yapıştırın ve **Run** butonuna tıklayın

Bu işlem:
- ✅ `profiles` tablosunu oluşturur
- ✅ Row Level Security (RLS) politikalarını ayarlar
- ✅ Yeni kullanıcı kaydında otomatik profil oluşturma tetikleyicisini ekler
- ✅ `updated_at` alanını otomatik güncelleyen tetikleyiciyi ekler

## Adım 3: Test Kullanıcılarını Oluşturun

### 3.1. Supabase Dashboard'da Kullanıcı Oluşturma

1. Sol menüden **Authentication** > **Users**'a gidin
2. **Add User** > **Create new user** butonuna tıklayın
3. Aşağıdaki kullanıcıları tek tek oluşturun:

#### Admin Kullanıcısı
- **Email**: `admin@yedirenklicinar.com`
- **Password**: `Password123!`
- **Auto Confirm User**: ✅ İşaretleyin
- **User Metadata** (JSON):
  ```json
  {
    "full_name": "Admin User",
    "role": "admin"
  }
  ```

#### Öğretmen Kullanıcısı
- **Email**: `ogretmen@yedirenklicinar.com`
- **Password**: `Password123!`
- **Auto Confirm User**: ✅ İşaretleyin
- **User Metadata** (JSON):
  ```json
  {
    "full_name": "Öğretmen User",
    "role": "teacher"
  }
  ```

#### Öğrenci Kullanıcısı
- **Email**: `ogrenci@yedirenklicinar.com`
- **Password**: `Password123!`
- **Auto Confirm User**: ✅ İşaretleyin
- **User Metadata** (JSON):
  ```json
  {
    "full_name": "Öğrenci User",
    "role": "student"
  }
  ```

### 3.2. Profillerin Oluşturulduğunu Doğrulama

SQL Editor'de aşağıdaki sorguyu çalıştırın:

```sql
SELECT p.id, p.email, p.full_name, p.role, p.created_at
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.email IN (
    'admin@yedirenklicinar.com',
    'ogretmen@yedirenklicinar.com',
    'ogrenci@yedirenklicinar.com'
);
```

3 satır görmelisiniz. Eğer görmüyorsanız, `002_test_users_setup.sql` dosyasındaki manuel ekleme talimatlarını takip edin.

## Adım 4: Quiz Tablolarını Oluşturun (Opsiyonel)

Eğer daha önce oluşturmadıysanız, quiz tablolarını oluşturun:

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

## Adım 5: Environment Variables'ı Kontrol Edin

`.env` dosyanızda aşağıdaki değişkenlerin doğru olduğundan emin olun:

```env
VITE_SUPABASE_URL=your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Bu değerleri Supabase Dashboard > **Settings** > **API** bölümünden alabilirsiniz.

## Adım 6: Uygulamayı Test Edin

1. Uygulamayı başlatın: `npm run dev`
2. Login sayfasına gidin: `http://localhost:5173/login`
3. Test kullanıcılarından biriyle giriş yapın
4. Console'da hata olmadığını kontrol edin

## Sorun Giderme

### Profil Oluşturulmadı
Eğer kullanıcı oluşturdunuz ama profil oluşmadıysa:

1. Tetikleyicinin çalıştığını kontrol edin:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
   ```

2. Manuel olarak profil ekleyin:
   ```sql
   -- Önce user ID'yi bulun
   SELECT id, email FROM auth.users WHERE email = 'admin@yedirenklicinar.com';
   
   -- Sonra profil ekleyin (UUID'yi yukarıdaki sonuçtan alın)
   INSERT INTO profiles (id, email, full_name, role)
   VALUES ('USER_ID_HERE', 'admin@yedirenklicinar.com', 'Admin User', 'admin');
   ```

### RLS Politikaları Çalışmıyor
RLS'in etkin olduğunu kontrol edin:

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'profiles';
```

`rowsecurity` sütunu `true` olmalıdır.

### Login Hatası
Console'da detaylı hata mesajlarını kontrol edin. Şu logları görmelisiniz:
- `Attempting login for: [email]`
- `Login successful, user: [user-id]`
- `Fetching profile for user: [user-id]`
- `Profile fetched successfully: [profile-data]`

## Başarılı Kurulum Kontrolü

✅ Profiles tablosu oluşturuldu  
✅ RLS politikaları aktif  
✅ Tetikleyiciler çalışıyor  
✅ Test kullanıcıları oluşturuldu  
✅ Profiller otomatik oluşturuldu  
✅ Login başarılı  
✅ Kullanıcı yönlendirmesi çalışıyor  

Tüm bu adımlar tamamlandığında, authentication sisteminiz çalışır durumda olacaktır! 🎉
