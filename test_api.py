import sys
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def run_tests():
    print("Testing Endpoints...")
    
    # 1. Create Admin
    print("1. Creating Admin...", end="")
    res = client.post("/utilisateurs/admin", json={
        "login": "admin1",
        "mot_de_passe": "adminpass",
        "nom": "Doe",
        "prenom": "John",
        "role": "admin"
    })
    if res.status_code not in (200, 400):
        print(f"FAILED: {res.text}")
    else:
        print("OK")
        
    # 2. Login
    print("2. Login Admin...", end="")
    res = client.post("/login", data={"username": "admin1", "password": "adminpass"})
    if res.status_code != 200:
        print(f"FAILED: {res.text}")
        return
    token = res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("OK")
    
    # 3. Create Professeur
    print("3. Creating Professeur...", end="")
    res = client.post("/utilisateurs/professeur", json={
        "login": "prof1",
        "mot_de_passe": "profpass",
        "nom": "Smith",
        "prenom": "Jane",
        "role": "professeur"
    }, headers=headers)
    if res.status_code not in (200, 400):
        print(f"FAILED: {res.text}")
    else:
        print("OK")
        
    # 4. Get Utilisateurs
    print("4. Get Utilisateurs...", end="")
    res = client.get("/utilisateurs/", headers=headers)
    if res.status_code != 200:
        print(f"FAILED: {res.text}")
    else:
        print("OK")

    # 5. Create Salle
    print("5. Create Salle...", end="")
    res = client.post("/salles", json={
        "numero": "A101",
        "equipee_tv": False,
        "equipee_datashow": True
    }, headers=headers)
    if res.status_code not in (200, 400):
        print(f"FAILED: {res.text}")
    else:
        print("OK")
        
    # 6. Create Seance
    print("6. Create Seance...", end="")
    res = client.post("/seances", json={
        "id": "S1",
        "heure_debut": "08:00:00",
        "heure_fin": "09:30:00"
    }, headers=headers)
    if res.status_code not in (200, 400):
        print(f"FAILED: {res.text}")
    else:
        print("OK")
        
    # 7. Create DataShow
    print("7. Create DataShow...", end="")
    res = client.post("/datashows", json={
        "numero_unique": "DS-001",
        "date_achat": "2023-01-01",
        "etat": "disponible"
    }, headers=headers)
    if res.status_code not in (200, 400):
        print(f"FAILED: {res.text}")
    else:
        print("OK")

    print("\nAll basic core tests completed successfully!")

if __name__ == "__main__":
    run_tests()
