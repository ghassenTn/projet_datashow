from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# L'URL de connexion à la base de données SQLite
# Le fichier sera créé à la racine du projet sous le nom "datashow.db"
SQLALCHEMY_DATABASE_URL = "sqlite:///./datashow.db"

# Création de l'engine
# connect_args={"check_same_thread": False} est indispensable pour SQLite dans FastAPI
# car FastAPI peut utiliser plusieurs threads pour traiter les requêtes.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Configuration de la session de base de données
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Classe de base dont hériteront tous les modèles (déjà utilisée dans models.py)
Base = declarative_base()

# Fonction de dépendance (Dependency) pour FastAPI
# Elle ouvre une session pour chaque requête et la ferme une fois la requête terminée
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()