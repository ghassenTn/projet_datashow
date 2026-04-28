from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import crud, schemas
from database import get_db
from security import get_password_hash, get_current_user, get_current_admin_user

router = APIRouter(prefix="/utilisateurs", tags=["Utilisateurs"])

@router.post("/professeur", response_model=schemas.UtilisateurResponse)
def create_professeur(prof: schemas.UtilisateurCreate, db: Session = Depends(get_db)):
    db_user = crud.get_utilisateur_by_login(db, login=prof.login)
    if db_user:
        raise HTTPException(status_code=400, detail="Login already registered")
    prof.mot_de_passe = get_password_hash(prof.mot_de_passe)
    return crud.create_professeur(db=db, prof=prof)

@router.post("/admin", response_model=schemas.UtilisateurResponse)
def create_admin(admin: schemas.UtilisateurCreate, db: Session = Depends(get_db)):
    db_user = crud.get_utilisateur_by_login(db, login=admin.login)
    if db_user:
        raise HTTPException(status_code=400, detail="Login already registered")
    admin.mot_de_passe = get_password_hash(admin.mot_de_passe)
    return crud.create_admin(db=db, admin=admin)

@router.get("/me", response_model=schemas.UtilisateurResponse)
def read_users_me(current_user = Depends(get_current_user)):
    return current_user

@router.get("/", response_model=List[schemas.UtilisateurResponse])
def read_utilisateurs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), admin = Depends(get_current_admin_user)):
    return crud.get_utilisateurs(db, skip=skip, limit=limit)

@router.delete("/{user_id}", response_model=schemas.UtilisateurResponse)
def delete_utilisateur(user_id: int, db: Session = Depends(get_db), admin = Depends(get_current_admin_user)):
    db_user = crud.get_utilisateur(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.delete_utilisateur(db, user_id=user_id)
