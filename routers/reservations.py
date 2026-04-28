from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import crud, schemas, models
from database import get_db
from security import get_current_user, get_current_admin_user

router = APIRouter()

# Semaines de Réservation
@router.post("/semaines", response_model=schemas.SemaineReservationResponse, tags=["Semaines"])
def create_semaine(semaine: schemas.SemaineReservationCreate, db: Session = Depends(get_db), admin = Depends(get_current_admin_user)):
    return crud.create_semaine_reservation(db, semaine)

@router.get("/semaines", response_model=List[schemas.SemaineReservationResponse], tags=["Semaines"])
def read_semaines(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), user = Depends(get_current_user)):
    return crud.get_semaines_reservation(db, skip=skip, limit=limit)

@router.put("/semaines/{semaine_id}/toggle", response_model=schemas.SemaineReservationResponse, tags=["Semaines"])
def toggle_semaine_status(semaine_id: int, est_ouverte: bool, db: Session = Depends(get_db), admin = Depends(get_current_admin_user)):
    semaine = crud.get_semaine_reservation(db, semaine_id)
    if not semaine:
        raise HTTPException(status_code=404, detail="Semaine not found")
    semaine.est_ouverte = est_ouverte
    db.commit()
    db.refresh(semaine)
    return semaine

# Réservations
@router.post("/reservations", response_model=schemas.ReservationResponse, tags=["Reservations"])
def create_reservation(reservation: schemas.ReservationCreate, db: Session = Depends(get_db), user: models.Utilisateur = Depends(get_current_user)):
    # 1. Vérifier que la semaine de réservation existe et est ouverte
    semaine = crud.get_semaine_reservation(db, reservation.semaine_id)
    if not semaine:
        raise HTTPException(status_code=404, detail="Semaine de réservation introuvable")
    if not semaine.est_ouverte:
        raise HTTPException(status_code=403, detail="Les réservations sont fermées pour cette semaine")
    
    # 2. Vérifier que le DataShow est disponible
    datashow = crud.get_datashow(db, reservation.datashow_id)
    if not datashow or datashow.etat != models.EtatDataShow.DISPONIBLE:
        raise HTTPException(status_code=400, detail="DataShow non disponible")
        
    return crud.create_reservation(db, reservation, professeur_id=user.id)

@router.get("/reservations", response_model=List[schemas.ReservationResponse], tags=["Reservations"])
def read_reservations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), user = Depends(get_current_user)):
    return crud.get_reservations(db, skip=skip, limit=limit)

@router.delete("/reservations/{reservation_id}", response_model=schemas.ReservationResponse, tags=["Reservations"])
def delete_reservation(reservation_id: int, db: Session = Depends(get_db), user: models.Utilisateur = Depends(get_current_user)):
    reservation = crud.get_reservation(db, reservation_id)
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    
    # Check if user is the owner or admin
    if reservation.professeur_id != user.id and user.role != models.RoleUtilisateur.ADMIN:
        raise HTTPException(status_code=403, detail="Non autorisé")
        
    return crud.delete_reservation(db, reservation_id)
