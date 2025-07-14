# test_login.py
import requests
import json

# Login endpoint URL'si
LOGIN_URL = "http://127.0.0.1:5000/api/login"

# Test kullanıcı bilgileri (Godmin)
# create_db.py'de oluşturduğun kullanıcılar bunlar
payload_godmin = {
    "companyId": "60DM1N",
    "username": "@godmin",
    "password": "0666"
}

# Test kullanıcı bilgileri (Test User)
payload_testuser = {
    "companyId": "R163L",
    "username": "@testuser",
    "password": "testuser"
}

# Yanlış şifre testi (Godmin için)
payload_wrong_password = {
    "companyId": "60DM1N",
    "username": "@godmin",
    "password": "yanlis_sifre" # Yanlış şifre
}

def test_login(payload, test_name):
    print(f"\n--- {test_name} Testi ---")
    try:
        # POST isteği gönderiyoruz
        response = requests.post(LOGIN_URL, json=payload)

        print(f"Status Kodu: {response.status_code}")
        print(f"Yanıt: {json.dumps(response.json(), indent=2)}")

    except requests.exceptions.ConnectionError:
        print("Hata: Backend sunucusu çalışmıyor gibi görünüyor. Lütfen Flask uygulamasını başlattığınızdan emin olun.")
    except Exception as e:
        print(f"Beklenmeyen bir hata oluştu: {e}")

if __name__ == "__main__":
    # requests kütüphanesinin kurulu olduğundan emin ol:
    # pip install requests

    # Önce backend sunucusunun (run.py ile) çalışır durumda olması gerekiyor!

    test_login(payload_godmin, "Godmin Başarılı Giriş")
    test_login(payload_testuser, "Test User Başarılı Giriş")
    test_login(payload_wrong_password, "Godmin Yanlış Şifre")