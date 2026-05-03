from fastapi import FastAPI
from database import engine
import models
from routers import auth, utilisateurs, salles_seances, datashows, emplois, reservations, reclamations
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API - Système de Réservation de Data Show",
    description="Backend pour la gestion des réservations à l'IPSAS",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Bienvenue sur l'API de réservation de Data Show de l'IPSAS !"}

# Inclusion des routers
app.include_router(auth.router)
app.include_router(utilisateurs.router)
app.include_router(salles_seances.router)
app.include_router(datashows.router)
app.include_router(emplois.router)
app.include_router(reservations.router)
app.include_router(reclamations.router)
