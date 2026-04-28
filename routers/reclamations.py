from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import crud, schemas, models
from database import get_db
from security import get_current_user, get_current_admin_user

router = APIRouter(prefix="/reclamations", tags=["Reclamations"])

@router.post("/", response_model=schemas.ReclamationResponse)
def create_reclamation(reclamation: schemas.ReclamationCreate, db: Session = Depends(get_db), user: models.Utilisateur = Depends(get_current_user)):
    return crud.create_reclamation(db, reclamation, professeur_id=user.id)

@router.get("/", response_model=List[schemas.ReclamationResponse])
def read_reclamations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), admin = Depends(get_current_admin_user)):
    return crud.get_reclamations(db, skip=skip, limit=limit)

@router.put("/{reclamation_id}/traiter", response_model=schemas.ReclamationResponse)
def traiter_reclamation(reclamation_id: int, reponse: str, db: Session = Depends(get_db), admin = Depends(get_current_admin_user)):
    reclamation = crud.update_reclamation_etat(db, reclamation_id, models.EtatReclamation.TRAITEE, reponse)
    if not reclamation:
        raise HTTPException(status_code=404, detail="Reclamation not found")
    return reclamation
