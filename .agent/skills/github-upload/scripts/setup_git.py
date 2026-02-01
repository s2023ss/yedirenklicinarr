import subprocess
import sys

def setup_git(username, email):
    """Git kullanıcı bilgilerini yerel olarak yapılandırır."""
    try:
        print(f"Yapılandırılıyor: {username} <{email}>")
        
        # Git config commands
        subprocess.run(["git", "config", "--global", "user.name", username], check=True)
        subprocess.run(["git", "config", "--global", "user.email", email], check=True)
        
        print("Git başarıyla yapılandırıldı. ✅")
        
        # Check git status
        res = subprocess.run(["git", "--version"], capture_output=True, text=True)
        print(f"Sistemdeki Git Sürümü: {res.stdout.strip()}")
        
        return True
    except Exception as e:
        print(f"Hata oluştu: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Kullanım: python setup_git.py <kullanıcı_adı> <e-posta>")
    else:
        setup_git(sys.argv[1], sys.argv[2])
