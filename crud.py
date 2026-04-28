from sqlalchemy.orm import Session
import models, schemas

# ==========================================
# 1. Utilisateurs
# ==========================================
def get_utilisateur(db: Session, user_id: int):
    return db.query(models.Utilisateur).filter(models.Utilisateur.id == user_id).first()

def get_utilisateur_by_login(db: Session, login: str):
    return db.query(models.Utilisateur).filter(models.Utilisateur.login == login).first()

def get_utilisateurs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Utilisateur).offset(skip).limit(limit).all()

def create_professeur(db: Session, prof: schemas.UtilisateurCreate):
    db_prof = models.Utilisateur(
        login=prof.login,
        mot_de_passe=prof.mot_de_passe, 
        nom=prof.nom,
        prenom=prof.prenom,
        role=models.RoleUtilisateur.PROFESSEUR
    )
    db.add(db_prof)
    db.commit()
    db.refresh(db_prof)
    return db_prof

def create_admin(db: Session, admin: schemas.UtilisateurCreate):
    db_admin = models.Utilisateur(
        login=admin.login,
        mot_de_passe=admin.mot_de_passe, 
        nom=admin.nom,
        prenom=admin.prenom,
        role=models.RoleUtilisateur.ADMIN
    )
    db.add(db_admin)
    db.commit()
    db.refresh(db_admin)
    return db_admin

def get_professeurs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Utilisateur).filter(
        models.Utilisateur.role == models.RoleUtilisateur.PROFESSEUR
    ).offset(skip).limit(limit).all()

def delete_utilisateur(db: Session, user_id: int):
    db_user = db.query(models.Utilisateur).filter(models.Utilisateur.id == user_id).first()
    if db_user:
        db.delete(db_user)
        db.commit()
    return db_user

# ==========================================
# 2. Salles
# ==========================================
def get_salle(db: Session, numero: str):
    return db.query(models.Salle).filter(models.Salle.numero == numero).first()

def get_salles(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Salle).offset(skip).limit(limit).all()

def create_salle(db: Session, salle: schemas.SalleBase):
    db_salle = models.Salle(**salle.model_dump())
    db.add(db_salle)
    db.commit()
    db.refresh(db_salle)
    return db_salle

def update_salle(db: Session, numero: str, salle_update: schemas.SalleBase):
    db_salle = get_salle(db, numero)
    if db_salle:
        for key, value in salle_update.model_dump(exclude_unset=True).items():
            setattr(db_salle, key, value)
        db.commit()
        db.refresh(db_salle)
    return db_salle

def delete_salle(db: Session, numero: str):
    db_salle = get_salle(db, numero)
    if db_salle:
        db.delete(db_salle)
        db.commit()
    return db_salle

# ==========================================
# 3. Séances
# ==========================================
def get_seance(db: Session, seance_id: str):
    return db.query(models.Seance).filter(models.Seance.id == seance_id).first()

def get_seances(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Seance).offset(skip).limit(limit).all()

def create_seance(db: Session, seance: schemas.SeanceBase):
    db_seance = models.Seance(**seance.model_dump())
    db.add(db_seance)
    db.commit()
    db.refresh(db_seance)
    return db_seance

def update_seance(db: Session, seance_id: str, seance_update: schemas.SeanceBase):
    db_seance = get_seance(db, seance_id)
    if db_seance:
        for key, value in seance_update.model_dump(exclude_unset=True).items():
            setattr(db_seance, key, value)
        db.commit()
        db.refresh(db_seance)
    return db_seance

def delete_seance(db: Session, seance_id: str):
    db_seance = get_seance(db, seance_id)
    if db_seance:
        db.delete(db_seance)
        db.commit()
    return db_seance

# ==========================================
# 4. Data Shows
# ==========================================
def get_datashow(db: Session, datashow_id: int):
    return db.query(models.DataShow).filter(models.DataShow.id == datashow_id).first()

def get_datashows(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.DataShow).offset(skip).limit(limit).all()

def create_datashow(db: Session, datashow: schemas.DataShowCreate):
    db_datashow = models.DataShow(**datashow.model_dump())
    db.add(db_datashow)
    db.commit()
    db.refresh(db_datashow)
    return db_datashow

def update_datashow(db: Session, datashow_id: int, datashow_update: schemas.DataShowCreate):
    db_datashow = get_datashow(db, datashow_id)
    if db_datashow:
        for key, value in datashow_update.model_dump(exclude_unset=True).items():
            setattr(db_datashow, key, value)
        db.commit()
        db.refresh(db_datashow)
    return db_datashow

def delete_datashow(db: Session, datashow_id: int):
    db_datashow = get_datashow(db, datashow_id)
    if db_datashow:
        db.delete(db_datashow)
        db.commit()
    return db_datashow

# ==========================================
# 5. Réparations
# ==========================================
def get_reparation(db: Session, reparation_id: int):
    return db.query(models.Reparation).filter(models.Reparation.id == reparation_id).first()

def get_reparations(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Reparation).offset(skip).limit(limit).all()

def create_reparation(db: Session, reparation: schemas.ReparationCreate):
    db_reparation = models.Reparation(**reparation.model_dump())
    db.add(db_reparation)
    db.commit()
    db.refresh(db_reparation)
    return db_reparation

def delete_reparation(db: Session, reparation_id: int):
    db_reparation = get_reparation(db, reparation_id)
    if db_reparation:
        db.delete(db_reparation)
        db.commit()
    return db_reparation

# ==========================================
# 6. Semaines de Réservation
# ==========================================
def get_semaine_reservation(db: Session, semaine_id: int):
    return db.query(models.SemaineReservation).filter(models.SemaineReservation.id == semaine_id).first()

def get_semaines_reservation(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.SemaineReservation).offset(skip).limit(limit).all()

def create_semaine_reservation(db: Session, semaine: schemas.SemaineReservationCreate):
    db_semaine = models.SemaineReservation(**semaine.model_dump())
    db.add(db_semaine)
    db.commit()
    db.refresh(db_semaine)
    return db_semaine

def delete_semaine_reservation(db: Session, semaine_id: int):
    db_semaine = get_semaine_reservation(db, semaine_id)
    if db_semaine:
        db.delete(db_semaine)
        db.commit()
    return db_semaine

# ==========================================
# 7. Lignes Emploi
# ==========================================
def get_ligne_emploi(db: Session, ligne_id: int):
    return db.query(models.LigneEmploi).filter(models.LigneEmploi.id == ligne_id).first()

def get_lignes_emploi(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.LigneEmploi).offset(skip).limit(limit).all()

def create_ligne_emploi(db: Session, ligne: schemas.LigneEmploiCreate, professeur_id: int):
    db_ligne = models.LigneEmploi(**ligne.model_dump(), professeur_id=professeur_id)
    db.add(db_ligne)
    db.commit()
    db.refresh(db_ligne)
    return db_ligne

def delete_ligne_emploi(db: Session, ligne_id: int):
    db_ligne = get_ligne_emploi(db, ligne_id)
    if db_ligne:
        db.delete(db_ligne)
        db.commit()
    return db_ligne

# ==========================================
# 8. Réservations
# ==========================================
def get_reservation(db: Session, reservation_id: int):
    return db.query(models.Reservation).filter(models.Reservation.id == reservation_id).first()

def get_reservations(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Reservation).offset(skip).limit(limit).all()

def create_reservation(db: Session, reservation: schemas.ReservationCreate, professeur_id: int):
    db_reservation = models.Reservation(**reservation.model_dump(), professeur_id=professeur_id)
    db.add(db_reservation)
    db.commit()
    db.refresh(db_reservation)
    return db_reservation

def delete_reservation(db: Session, reservation_id: int):
    db_reservation = get_reservation(db, reservation_id)
    if db_reservation:
        db.delete(db_reservation)
        db.commit()
    return db_reservation

# ==========================================
# 9. Réclamations
# ==========================================
def get_reclamation(db: Session, reclamation_id: int):
    return db.query(models.Reclamation).filter(models.Reclamation.id == reclamation_id).first()

def get_reclamations(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Reclamation).offset(skip).limit(limit).all()

def create_reclamation(db: Session, reclamation: schemas.ReclamationCreate, professeur_id: int):
    db_reclamation = models.Reclamation(**reclamation.model_dump(), professeur_id=professeur_id)
    db.add(db_reclamation)
    db.commit()
    db.refresh(db_reclamation)
    return db_reclamation

def update_reclamation_etat(db: Session, reclamation_id: int, etat: models.EtatReclamation, reponse: str = None):
    db_reclamation = get_reclamation(db, reclamation_id)
    if db_reclamation:
        db_reclamation.etat = etat
        if reponse:
            db_reclamation.reponse_admin = reponse
        db.commit()
        db.refresh(db_reclamation)
    return db_reclamation

def delete_reclamation(db: Session, reclamation_id: int):
    db_reclamation = get_reclamation(db, reclamation_id)
    if db_reclamation:
        db.delete(db_reclamation)
        db.commit()
    return db_reclamation