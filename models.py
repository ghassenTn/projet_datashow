from sqlalchemy import Column, Integer, String, Boolean, Date, Time, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from database import Base
import enum

# ==========================================
# 1. Énumérations (Enums) pour la BD
# ==========================================
class RoleUtilisateur(enum.Enum):
    PROFESSEUR = "professeur"
    ADMIN = "admin"

class EtatDataShow(enum.Enum):
    DISPONIBLE = "disponible"
    EN_PANNE = "en_panne"

class EtatReclamation(enum.Enum):
    EN_ATTENTE = "en_attente"
    TRAITEE = "traitee"

class JourSemaine(enum.Enum):
    LUNDI = "Lundi"
    MARDI = "Mardi"
    MERCREDI = "Mercredi"
    JEUDI = "Jeudi"
    VENDREDI = "Vendredi"
    SAMEDI = "Samedi"

# ==========================================
# 2. Utilisateurs
# ==========================================
class Utilisateur(Base):
    __tablename__ = "utilisateurs"

    id = Column(Integer, primary_key=True, index=True)
    login = Column(String, unique=True, index=True, nullable=False)
    mot_de_passe = Column(String, nullable=False)
    nom = Column(String, nullable=False)
    prenom = Column(String, nullable=False)
    role = Column(Enum(RoleUtilisateur), nullable=False)

    # Relations
    reservations = relationship("Reservation", back_populates="professeur")
    reclamations = relationship("Reclamation", back_populates="professeur")
    lignes_emploi = relationship("LigneEmploi", back_populates="professeur")

# ==========================================
# 3. Salles & Séances
# ==========================================
class Salle(Base):
    __tablename__ = "salles"

    numero = Column(String, primary_key=True, index=True)
    equipee_tv = Column(Boolean, default=False)
    equipee_datashow = Column(Boolean, default=False)

class Seance(Base):
    __tablename__ = "seances"

    id = Column(String, primary_key=True, index=True) # S1, S2, etc.
    heure_debut = Column(Time, nullable=False)
    heure_fin = Column(Time, nullable=False)

# ==========================================
# 4. Matériel (Data Show & Réparations)
# ==========================================
class DataShow(Base):
    __tablename__ = "data_shows"

    id = Column(Integer, primary_key=True, index=True)
    numero_unique = Column(String, unique=True, index=True, nullable=False)
    date_achat = Column(Date, nullable=False)
    etat = Column(Enum(EtatDataShow), default=EtatDataShow.DISPONIBLE)

    # Relations
    reservations = relationship("Reservation", back_populates="data_show")
    reparations = relationship("Reparation", back_populates="data_show")

class Reparation(Base):
    __tablename__ = "reparations"

    id = Column(Integer, primary_key=True, index=True)
    date_reparation = Column(Date, nullable=False)
    description_panne = Column(Text, nullable=False)
    action_realisee = Column(Text, nullable=True)
    
    datashow_id = Column(Integer, ForeignKey("data_shows.id"), nullable=False)

    # Relations
    data_show = relationship("DataShow", back_populates="reparations")

# ==========================================
# 5. Gestion du Temps & Emploi
# ==========================================
class SemaineReservation(Base):
    __tablename__ = "semaines_reservation"

    id = Column(Integer, primary_key=True, index=True)
    date_lundi = Column(Date, unique=True, nullable=False)
    est_ouverte = Column(Boolean, default=False)

    # Relations
    reservations = relationship("Reservation", back_populates="semaine")

class LigneEmploi(Base):
    __tablename__ = "lignes_emploi"

    id = Column(Integer, primary_key=True, index=True)
    jour_de_la_semaine = Column(Enum(JourSemaine), nullable=False)
    
    professeur_id = Column(Integer, ForeignKey("utilisateurs.id"), nullable=False)
    seance_id = Column(String, ForeignKey("seances.id"), nullable=False)
    salle_id = Column(String, ForeignKey("salles.numero"), nullable=False)

    # Relations
    professeur = relationship("Utilisateur", back_populates="lignes_emploi")
    seance = relationship("Seance")
    salle = relationship("Salle")

# ==========================================
# 6. Réservations & Réclamations
# ==========================================
class Reservation(Base):
    __tablename__ = "reservations"

    id = Column(Integer, primary_key=True, index=True)
    date_reservation = Column(Date, nullable=False)
    est_hors_emploi = Column(Boolean, default=False)
    
    professeur_id = Column(Integer, ForeignKey("utilisateurs.id"), nullable=False)
    datashow_id = Column(Integer, ForeignKey("data_shows.id"), nullable=False)
    salle_id = Column(String, ForeignKey("salles.numero"), nullable=False)
    seance_id = Column(String, ForeignKey("seances.id"), nullable=False)
    semaine_id = Column(Integer, ForeignKey("semaines_reservation.id"), nullable=False)

    # Relations
    professeur = relationship("Utilisateur", back_populates="reservations")
    data_show = relationship("DataShow", back_populates="reservations")
    salle = relationship("Salle")
    seance = relationship("Seance")
    semaine = relationship("SemaineReservation", back_populates="reservations")

class Reclamation(Base):
    __tablename__ = "reclamations"

    id = Column(Integer, primary_key=True, index=True)
    date_reclamation = Column(Date, nullable=False)
    description = Column(Text, nullable=False)
    reponse_admin = Column(Text, nullable=True)
    etat = Column(Enum(EtatReclamation), default=EtatReclamation.EN_ATTENTE)
    
    professeur_id = Column(Integer, ForeignKey("utilisateurs.id"), nullable=False)

    # Relations
    professeur = relationship("Utilisateur", back_populates="reclamations")