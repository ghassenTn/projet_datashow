from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import crud, schemas
from database import get_db
from security import get_current_user, get_current_admin_user

router = APIRouter(prefix="/emplois", tags=["Emplois"])

@router.post("/", response_model=schemas.LigneEmploiResponse)
def create_ligne_emploi(ligne: schemas.LigneEmploiCreate, professeur_id: int, db: Session = Depends(get_db), admin = Depends(get_current_admin_user)):
    # Validate professor exists
    db_prof = crud.get_utilisateur(db, professeur_id)
    if not db_prof:
        raise HTTPException(status_code=404, detail="Professeur not found")
        
    return crud.create_ligne_emploi(db, ligne, professeur_id)

@router.get("/", response_model=List[schemas.LigneEmploiResponse])
def read_lignes_emploi(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), user = Depends(get_current_user)):
    return crud.get_lignes_emploi(db, skip=skip, limit=limit)

@router.delete("/{ligne_id}", response_model=schemas.LigneEmploiResponse)
def delete_ligne_emploi(ligne_id: int, db: Session = Depends(get_db), admin = Depends(get_current_admin_user)):
    ligne = crud.delete_ligne_emploi(db, ligne_id)
    if not ligne:
        raise HTTPException(status_code=404, detail="Ligne Emploi not found")
    return ligne
