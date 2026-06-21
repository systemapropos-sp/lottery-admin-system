import ftplib
import os

HOST = '82.25.87.157'
USER = 'u108221933.nmvapp.com'
PASS = 'Producers0587@'
LOCAL_DIR = r'C:\Users\DELL\Desktop\nmv-admin\dist'
REMOTE_DIR = '/public_html/admin'

def upload_dir(ftp, local_dir, remote_dir):
    # Ensure remote dir exists
    try:
        ftp.mkd(remote_dir)
    except:
        pass
    
    for item in os.listdir(local_dir):
        local_path = os.path.join(local_dir, item)
        remote_path = f'{remote_dir}/{item}'
        
        if os.path.isdir(local_path):
            upload_dir(ftp, local_path, remote_path)
        else:
            with open(local_path, 'rb') as f:
                ftp.storbinary(f'STOR {remote_path}', f, blocksize=4096)
                size = os.path.getsize(local_path)
                print(f'  ✅ {remote_path} ({size:,} bytes)')

print('Conectando al servidor FTP...')
ftp = ftplib.FTP()
ftp.connect(HOST, 21)
ftp.login(USER, PASS)
print(f'✅ Conectado como {USER}')

print(f'\nSubiendo todos los archivos desde {LOCAL_DIR} → {REMOTE_DIR}/')
upload_dir(ftp, LOCAL_DIR, REMOTE_DIR)

ftp.quit()
print('\n🎉 Deploy completo!')
print('🌐 Ver en: https://nmvapp.com/admin/')
