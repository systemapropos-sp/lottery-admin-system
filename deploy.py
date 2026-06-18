"""Deploy nmv-admin dist to nmvapp.com/admin/"""
import ftplib
import os

# ─── Credentials ──────────────────────────────────────────────────────────────
FTP_HOST = '82.25.87.157'
FTP_PORT = 21
FTP_USER = 'u108221933.nmvapp.com'
FTP_PASS = 'Producers0587@'
REMOTE_BASE = '/public_html/admin'
LOCAL_DIST = r'C:\Users\DELL\Desktop\nmv-admin\dist'

# ─── Connect ──────────────────────────────────────────────────────────────────
print("Conectando al servidor FTP...")
ftp = ftplib.FTP()
ftp.connect(FTP_HOST, FTP_PORT, timeout=120)
ftp.login(FTP_USER, FTP_PASS)
ftp.set_pasv(True)
print(f"✅ Conectado como {FTP_USER}")

# ─── Helper to ensure remote dir exists ───────────────────────────────────────
def ensure_dir(path):
    try:
        ftp.mkd(path)
        print(f"  📁 Creado directorio: {path}")
    except ftplib.error_perm:
        pass  # already exists

# ─── Upload function ──────────────────────────────────────────────────────────
def upload_file(local_path, remote_path):
    with open(local_path, 'rb') as f:
        ftp.storbinary(f'STOR {remote_path}', f)
    size = os.path.getsize(local_path)
    print(f"  ✅ {remote_path} ({size:,} bytes)")

# ─── Upload all files from dist ───────────────────────────────────────────────
print(f"\nSubiendo archivos desde {LOCAL_DIST} → {REMOTE_BASE}/")

uploaded = 0
for root, dirs, files in os.walk(LOCAL_DIST):
    # Calculate relative path
    rel_root = os.path.relpath(root, LOCAL_DIST).replace('\\', '/')
    if rel_root == '.':
        remote_dir = REMOTE_BASE
    else:
        remote_dir = f"{REMOTE_BASE}/{rel_root}"
        ensure_dir(remote_dir)
    
    for filename in files:
        local_file = os.path.join(root, filename)
        remote_file = f"{remote_dir}/{filename}"
        upload_file(local_file, remote_file)
        uploaded += 1

ftp.quit()
print(f"\n🎉 Deploy completo! {uploaded} archivos subidos a {REMOTE_BASE}/")
print(f"🌐 Ver en: https://nmvapp.com/admin/")
