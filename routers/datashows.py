from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import crud, schemas, models
from database import get_db
from security import get_current_user, get_current_admin_user

router = APIRouter()

# DataShows
@router.post("/datashows", response_model=schemas.DataShowResponse, tags=["DataShows"])
def create_datashow(datashow: schemas.DataShowCreate, db: Session = Depends(get_db), admin = Depends(get_current_admin_user)):
    return crud.create_datashow(db, datashow)

@router.get("/datashows", response_model=List[schemas.DataShowResponse], tags=["DataShows"])
def read_datashows(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), user = Depends(get_current_user)):
    return crud.get_datashows(db, skip=skip, limit=limit)

@router.put("/datashows/{datashow_id}/etat", response_model=schemas.DataShowResponse, tags=["DataShows"])
def update_datashow_etat(datashow_id: int, etat: schemas.EtatDataShow, db: Session = Depends(get_db), admin = Depends(get_current_admin_user)):
    db_datashow = crud.get_datashow(db, datashow_id)
    if not db_datashow:
        raise HTTPException(status_code=404, detail="DataShow not found")
    db_datashow.etat = etat
    db.commit()
    db.refresh(db_datashow)
    return db_datashow

# Reparations
@router.post("/reparations", response_model=schemas.ReparationResponse, tags=["Reparations"])
def create_reparation(reparation: schemas.ReparationCreate, db: Session = Depends(get_db), admin = Depends(get_current_admin_user)):
    db_datashow = crud.get_datashow(db, reparation.datashow_id)
    if not db_datashow:
        raise HTTPException(status_code=404, detail="DataShow not found")
    
    # Auto-update datashow status if it was broken and gets repaired, etc. 
    # Or just log the repair
    return crud.create_reparation(db, reparation)

@router.get("/reparations", response_model=List[schemas.ReparationResponse], tags=["Reparations"])
def read_reparations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), admin = Depends(get_current_admin_user)):
    return crud.get_reparations(db, skip=skip, limit=limit)
