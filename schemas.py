from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, time
from models import RoleUtilisateur, EtatDataShow, EtatReclamation, JourSemaine

# ==========================================
# 2. Utilisateur (Professeur & Administrateur)
# ==========================================
class UtilisateurBase(BaseModel):
    login: str # 
    nom: str # [cite: 112]
    prenom: str # [cite: 113]
    role: RoleUtilisateur

class UtilisateurCreate(UtilisateurBase):
    mot_de_passe: str # Masqué dans les réponses 

class UtilisateurResponse(UtilisateurBase):
    id: int
    
    class Config:
        from_attributes = True # Permet de lire depuis le modèle SQLAlchemy

# ==========================================
# 3. Séance
# ==========================================
class SeanceBase(BaseModel):
    id: str = Field(..., description="S1 à S6") # [cite: 136]
    heure_debut: time # [cite: 136]
    heure_fin: time # [cite: 136]

class SeanceResponse(SeanceBase):
    class Config:
        from_attributes = True

# ==========================================
# 4. Salle
# ==========================================
class SalleBase(BaseModel):
    numero: str # [cite: 137]
    equipee_tv: bool = False # [cite: 137]
    equipee_datashow: bool = False # [cite: 137]

class SalleResponse(SalleBase):
    class Config:
        from_attributes = True

# ==========================================
# 5. Data Show
# ==========================================
class DataShowBase(BaseModel):
    numero_unique: str # 
    date_achat: date # 
    etat: EtatDataShow = EtatDataShow.DISPONIBLE # 

class DataShowCreate(DataShowBase):
    pass

class DataShowResponse(DataShowBase):
    id: int

    class Config:
        from_attributes = True

# ==========================================
# 6. Réparation
# ==========================================
class ReparationBase(BaseModel):
    date_reparation: date # [cite: 148]
    description_panne: str # [cite: 148]
    action_realisee: Optional[str] = None # [cite: 149]

class ReparationCreate(ReparationBase):
    datashow_id: int

class ReparationResponse(ReparationBase):
    id: int
    datashow_id: int

    class Config:
        from_attributes = True

# ==========================================
# 7. Semaine de Réservation
# ==========================================
class SemaineReservationBase(BaseModel):
    date_lundi: date # [cite: 141]
    est_ouverte: bool = False # [cite: 142]

class SemaineReservationCreate(SemaineReservationBase):
    pass

class SemaineReservationResponse(SemaineReservationBase):
    id: int

    class Config:
        from_attributes = True

# ==========================================
# 8. Ligne Emploi du Temps
# ==========================================
class LigneEmploiBase(BaseModel):
    jour_de_la_semaine: JourSemaine # [cite: 122]
    seance_id: str
    salle_id: str

class LigneEmploiCreate(LigneEmploiBase):
    pass

class LigneEmploiResponse(LigneEmploiBase):
    id: int
    professeur_id: int

    class Config:
        from_attributes = True

# ==========================================
# 9. Réservation
# ==========================================
class ReservationBase(BaseModel):
    date_reservation: date # [cite: 124]
    est_hors_emploi: bool = False # [cite: 124]
    seance_id: str
    salle_id: str
    datashow_id: int
    semaine_id: int

class ReservationCreate(ReservationBase):
    pass

class ReservationResponse(ReservationBase):
    id: int
    professeur_id: int

    class Config:
        from_attributes = True

# ==========================================
# 10. Réclamation
# ==========================================
class ReclamationBase(BaseModel):
    date_reclamation: date # [cite: 125]
    description: str # [cite: 125]

class ReclamationCreate(ReclamationBase):
    pass

class ReclamationResponse(ReclamationBase):
    id: int
    reponse_admin: Optional[str] = None # [cite: 125]
    etat: EtatReclamation = EtatReclamation.EN_ATTENTE # [cite: 125]
    professeur_id: int

    class Config:
        from_attributes = True
