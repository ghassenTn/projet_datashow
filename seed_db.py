from database import SessionLocal, engine
import models
from security import get_password_hash
from datetime import date, time, timedelta

# Create all tables if they don't exist
models.Base.metadata.create_all(bind=engine)

def seed():
    db = SessionLocal()
    
    # 1. Add Users
    if not db.query(models.Utilisateur).first():
        admin = models.Utilisateur(
            login="admin",
            mot_de_passe=get_password_hash("admin"),
            nom="Admin",
            prenom="Super",
            role=models.RoleUtilisateur.ADMIN
        )
        prof1 = models.Utilisateur(
            login="prof1",
            mot_de_passe=get_password_hash("prof1"),
            nom="Martin",
            prenom="Jean",
            role=models.RoleUtilisateur.PROFESSEUR
        )
        prof2 = models.Utilisateur(
            login="prof2",
            mot_de_passe=get_password_hash("prof2"),
            nom="Dupont",
            prenom="Marie",
            role=models.RoleUtilisateur.PROFESSEUR
        )
        db.add_all([admin, prof1, prof2])
        print("Users added.")

    # 2. Add Salles
    if not db.query(models.Salle).first():
        salles = [
            models.Salle(numero="Amphi A", equipee_tv=False, equipee_datashow=True),
            models.Salle(numero="Salle 101", equipee_tv=True, equipee_datashow=False),
            models.Salle(numero="Salle 102", equipee_tv=False, equipee_datashow=False),
            models.Salle(numero="Labo Info", equipee_tv=False, equipee_datashow=True)
        ]
        db.add_all(salles)
        print("Salles added.")

    # 3. Add Seances
    if not db.query(models.Seance).first():
        seances = [
            models.Seance(id="S1", heure_debut=time(8, 0), heure_fin=time(9, 30)),
            models.Seance(id="S2", heure_debut=time(9, 45), heure_fin=time(11, 15)),
            models.Seance(id="S3", heure_debut=time(11, 30), heure_fin=time(13, 0)),
            models.Seance(id="S4", heure_debut=time(14, 0), heure_fin=time(15, 30)),
            models.Seance(id="S5", heure_debut=time(15, 45), heure_fin=time(17, 15)),
            models.Seance(id="S6", heure_debut=time(17, 30), heure_fin=time(19, 0))
        ]
        db.add_all(seances)
        print("Seances added.")

    # 4. Add DataShows
    if not db.query(models.DataShow).first():
        datashows = [
            models.DataShow(numero_unique="DS-EPSON-01", date_achat=date(2021, 5, 10), etat=models.EtatDataShow.DISPONIBLE),
            models.DataShow(numero_unique="DS-SONY-02", date_achat=date(2022, 1, 15), etat=models.EtatDataShow.DISPONIBLE),
            models.DataShow(numero_unique="DS-BENQ-03", date_achat=date(2020, 11, 20), etat=models.EtatDataShow.EN_PANNE),
        ]
        db.add_all(datashows)
        print("DataShows added.")

    # 5. Add SemaineReservation
    if not db.query(models.SemaineReservation).first():
        lundi = date.today() - timedelta(days=date.today().weekday())
        semaine = models.SemaineReservation(
            date_lundi=lundi,
            est_ouverte=True
        )
        db.add(semaine)
        print("SemaineReservation added.")

    db.commit()
    db.close()
    print("Database seeded successfully!")

if __name__ == "__main__":
    seed()
