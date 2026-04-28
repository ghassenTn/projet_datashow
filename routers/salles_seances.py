from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import crud, schemas
from database import get_db
from security import get_current_user, get_current_admin_user

router = APIRouter()

# Salles
@router.post("/salles", response_model=schemas.SalleResponse, tags=["Salles"])
def create_salle(salle: schemas.SalleBase, db: Session = Depends(get_db), admin = Depends(get_current_admin_user)):
    db_salle = crud.get_salle(db, numero=salle.numero)
    if db_salle:
        raise HTTPException(status_code=400, detail="Salle already exists")
    return crud.create_salle(db, salle)

@router.get("/salles", response_model=List[schemas.SalleResponse], tags=["Salles"])
def read_salles(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), user = Depends(get_current_user)):
    return crud.get_salles(db, skip=skip, limit=limit)

@router.delete("/salles/{numero}", response_model=schemas.SalleResponse, tags=["Salles"])
def delete_salle(numero: str, db: Session = Depends(get_db), admin = Depends(get_current_admin_user)):
    salle = crud.delete_salle(db, numero)
    if not salle:
        raise HTTPException(status_code=404, detail="Salle not found")
    return salle

# Seances
@router.post("/seances", response_model=schemas.SeanceResponse, tags=["Seances"])
def create_seance(seance: schemas.SeanceBase, db: Session = Depends(get_db), admin = Depends(get_current_admin_user)):
    db_seance = crud.get_seance(db, seance_id=seance.id)
    if db_seance:
        raise HTTPException(status_code=400, detail="Seance already exists")
    return crud.create_seance(db, seance)

@router.get("/seances", response_model=List[schemas.SeanceResponse], tags=["Seances"])
def read_seances(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), user = Depends(get_current_user)):
    return crud.get_seances(db, skip=skip, limit=limit)

@router.delete("/seances/{seance_id}", response_model=schemas.SeanceResponse, tags=["Seances"])
def delete_seance(seance_id: str, db: Session = Depends(get_db), admin = Depends(get_current_admin_user)):
    seance = crud.delete_seance(db, seance_id)
    if not seance:
        raise HTTPException(status_code=404, detail="Seance not found")
    return seance
