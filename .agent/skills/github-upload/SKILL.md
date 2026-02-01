---
name: github-upload
description: Projeyi GitHub'a yüklemek ve sürüm kontrolü işlemlerini yönetmek için kullanılan yetenek.
---

# GitHub Yükleme Yeteneği (Skill)

Bu yetenek, projenin GitHub'a yüklenmesi, güncellenmesi ve sürüm kontrolü süreçlerini standartlaştırır.

## Yapılandırma Gereksinimleri

Bu yeteneği kullanmadan önce aşağıdaki bilgilerin sağlanması veya Git yapılandırmasının yapılmış olması gerekir:
- **Kullanıcı Adı**: GitHub kullanıcı adınız.
- **E-posta**: GitHub hesabınıza bağlı e-posta adresiniz.
- **PAT (Personal Access Token)**: Şifre yerine kullanılan güvenli erişim belirteci.

## Git İş Akışları

### 1. Yerel Depoyu Başlatma (Init)
Eğer henüz yapılmadıysa:
```bash
git init
git add .
git commit -m "İlk commit: Proje kurulumu tamamlandı"
```

### 2. Uzak Depoyu (Remote) Bağlama
```bash
git remote add origin https://github.com/KULLANICI_ADI/REPO_ADI.git
git branch -M main
```

### 3. Değişiklikleri Gönderme (Push)
```bash
git add .
git commit -m "Özellik: [Açıklama]"
git push -u origin main
```

## Önemli Güvenlik Notları

> [!CAUTION]
> **.gitignore**: Asla `.env`, `node_modules`, veya kişisel anahtarları GitHub'a göndermeyin. Mevcut projenizdeki `.gitignore` dosyasının bu klasörleri içerdiğinden emin olun.

> [!IMPORTANT]
> **Personal Access Token**: GitHub artık şifre ile `push` yapılmasına izin vermemektedir. Token'ınızı `git remote set-url` veya bir kimlik yöneticisi kullanarak güvenli bir şekilde saklayın.

## Yardımcı Betikler
Git yapılandırmanızı otomatize etmek için klasör içindeki `scripts/setup_git.py` dosyasını kullanabilirsiniz.
