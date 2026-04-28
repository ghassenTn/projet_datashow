"""
API Client — HTTP wrapper for the DataShow FastAPI backend.
All API calls go through this class. Stores auth token after login.
"""
import requests
from typing import Optional, Tuple, Any


class ApiClient:
    """HTTP client for communicating with the FastAPI backend."""

    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        self.token: Optional[str] = None
        self.role: Optional[str] = None
        self.user_info: Optional[dict] = None

    def _headers(self) -> dict:
        """Return auth headers if token exists."""
        if self.token:
            return {"Authorization": f"Bearer {self.token}"}
        return {}

    def _request(self, method: str, endpoint: str, **kwargs) -> Tuple[bool, Any]:
        """Generic request wrapper. Returns (success, data_or_error)."""
        url = f"{self.base_url}{endpoint}"
        try:
            resp = getattr(requests, method)(url, headers=self._headers(), **kwargs)
            if resp.status_code in (200, 201):
                return True, resp.json()
            else:
                detail = resp.json().get("detail", resp.text) if resp.headers.get("content-type", "").startswith("application/json") else resp.text
                return False, detail
        except requests.ConnectionError:
            return False, "Impossible de se connecter au serveur. Vérifiez que le backend est lancé."
        except Exception as e:
            return False, str(e)

    # ==========================================
    # Authentication
    # ==========================================
    def login(self, username: str, password: str) -> Tuple[bool, str]:
        """Login and store token. Returns (success, role_or_error)."""
        try:
            resp = requests.post(
                f"{self.base_url}/login",
                data={"username": username, "password": password},
            )
            if resp.status_code == 200:
                data = resp.json()
                self.token = data["access_token"]
                self.role = data["role"]
                # Fetch user info
                ok, user = self.get_me()
                if ok:
                    self.user_info = user
                return True, self.role
            else:
                return False, "Identifiants incorrects"
        except requests.ConnectionError:
            return False, "Impossible de se connecter au serveur"
        except Exception as e:
            return False, str(e)

    def logout(self):
        """Clear auth state."""
        self.token = None
        self.role = None
        self.user_info = None

    def get_me(self) -> Tuple[bool, Any]:
        """GET /utilisateurs/me"""
        return self._request("get", "/utilisateurs/me")

    def is_admin(self) -> bool:
        return self.role == "admin"

    # ==========================================
    # Utilisateurs
    # ==========================================
    def get_utilisateurs(self) -> Tuple[bool, Any]:
        return self._request("get", "/utilisateurs/")

    def create_professeur(self, data: dict) -> Tuple[bool, Any]:
        return self._request("post", "/utilisateurs/professeur", json=data)

    def delete_utilisateur(self, user_id: int) -> Tuple[bool, Any]:
        return self._request("delete", f"/utilisateurs/{user_id}")

    # ==========================================
    # Salles
    # ==========================================
    def get_salles(self) -> Tuple[bool, Any]:
        return self._request("get", "/salles")

    def create_salle(self, data: dict) -> Tuple[bool, Any]:
        return self._request("post", "/salles", json=data)

    def delete_salle(self, numero: str) -> Tuple[bool, Any]:
        return self._request("delete", f"/salles/{numero}")

    # ==========================================
    # Séances
    # ==========================================
    def get_seances(self) -> Tuple[bool, Any]:
        return self._request("get", "/seances")

    def create_seance(self, data: dict) -> Tuple[bool, Any]:
        return self._request("post", "/seances", json=data)

    def delete_seance(self, seance_id: str) -> Tuple[bool, Any]:
        return self._request("delete", f"/seances/{seance_id}")

    # ==========================================
    # DataShows
    # ==========================================
    def get_datashows(self) -> Tuple[bool, Any]:
        return self._request("get", "/datashows")

    def create_datashow(self, data: dict) -> Tuple[bool, Any]:
        return self._request("post", "/datashows", json=data)

    def update_datashow_etat(self, datashow_id: int, etat: str) -> Tuple[bool, Any]:
        return self._request("put", f"/datashows/{datashow_id}/etat", params={"etat": etat})

    # ==========================================
    # Réparations
    # ==========================================
    def get_reparations(self) -> Tuple[bool, Any]:
        return self._request("get", "/reparations")

    def create_reparation(self, data: dict) -> Tuple[bool, Any]:
        return self._request("post", "/reparations", json=data)

    # ==========================================
    # Emplois du temps
    # ==========================================
    def get_emplois(self) -> Tuple[bool, Any]:
        return self._request("get", "/emplois/")

    def create_emploi(self, data: dict, professeur_id: int) -> Tuple[bool, Any]:
        return self._request("post", f"/emplois/?professeur_id={professeur_id}", json=data)

    def delete_emploi(self, ligne_id: int) -> Tuple[bool, Any]:
        return self._request("delete", f"/emplois/{ligne_id}")

    # ==========================================
    # Semaines de Réservation
    # ==========================================
    def get_semaines(self) -> Tuple[bool, Any]:
        return self._request("get", "/semaines")

    def create_semaine(self, data: dict) -> Tuple[bool, Any]:
        return self._request("post", "/semaines", json=data)

    def toggle_semaine(self, semaine_id: int, est_ouverte: bool) -> Tuple[bool, Any]:
        return self._request("put", f"/semaines/{semaine_id}/toggle", params={"est_ouverte": est_ouverte})

    # ==========================================
    # Réservations
    # ==========================================
    def get_reservations(self) -> Tuple[bool, Any]:
        return self._request("get", "/reservations")

    def create_reservation(self, data: dict) -> Tuple[bool, Any]:
        return self._request("post", "/reservations", json=data)

    def delete_reservation(self, reservation_id: int) -> Tuple[bool, Any]:
        return self._request("delete", f"/reservations/{reservation_id}")

    # ==========================================
    # Réclamations
    # ==========================================
    def get_reclamations(self) -> Tuple[bool, Any]:
        return self._request("get", "/reclamations/")

    def create_reclamation(self, data: dict) -> Tuple[bool, Any]:
        return self._request("post", "/reclamations/", json=data)

    def traiter_reclamation(self, reclamation_id: int, reponse: str) -> Tuple[bool, Any]:
        return self._request("put", f"/reclamations/{reclamation_id}/traiter", params={"reponse": reponse})
