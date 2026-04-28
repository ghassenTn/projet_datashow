# Backend Requirements: DataShow Management App

Based on the provided UML class diagram, here is a comprehensive breakdown of everything needed for the backend of the DataShow Management application.

## 1. Authentication & Authorization (Login)

The system requires authentication for two types of users:
- **Professeur**: Can login to reserve DataShows, view schedules, and submit repair reclamations.
- **Administrateur (Admin)**: Can login to manage all aspects of the system (schedules, DataShows, handle reclamations, open reservation weeks).

### Endpoints Needed
- `POST /login`: Authenticates a user using their `login` and `motDePasse`. Returns a JWT token and the user's role (`Professeur` or `Admin`).
- `GET /me`: Returns the currently logged-in user's details.

## 2. Core Entities (Models)

The database should contain the following tables/models, matching the UML:

### Utilisateur (Base Class)
- `id` (Primary Key)
- `login` (String, Unique)
- `mot_de_passe` (String, Hashed)
- `nom` (String)
- `prenom` (String)
- `role` (Enum: PROFESSEUR, ADMIN)

### Professeur & Administrateur
- Inherit from `Utilisateur`. Can be implemented via Single Table Inheritance (SQLAlchemy) using the `role` field.

### Salle
- `numero` (String, Primary Key)
- `equipee_tv` (Boolean)
- `equipee_datashow` (Boolean)

### Seance
- `id` (String: S1 to S6, Primary Key)
- `heure_debut` (Time)
- `heure_fin` (Time)

### DataShow
- `id` (Integer, Primary Key)
- `numero_unique` (String, Unique)
- `date_achat` (Date)
- `etat` (Enum: DISPONIBLE, EN_PANNE)

### Reparation
- `id` (Integer, Primary Key)
- `date_reparation` (Date)
- `description_panne` (String)
- `action_realisee` (String)
- **Relationships**: Belongs to one `DataShow`.

### SemaineReservation
- `id` (Integer, Primary Key)
- `date_lundi` (Date)
- `est_ouverte` (Boolean)

### LigneEmploi (Timetable Entry)
- `id` (Integer, Primary Key)
- `jour_de_la_semaine` (String/Enum: Lundi-Samedi)
- **Relationships**: 
  - Belongs to one `Professeur`
  - Belongs to one `Seance`
  - Belongs to one `Salle`

### Reservation
- `id` (Integer, Primary Key)
- `date_reservation` (Date)
- `est_hors_emploi` (Boolean)
- **Relationships**:
  - Made by one `Professeur`
  - For one `DataShow`
  - In one `Salle`
  - During one `Seance`
  - Belongs to one `SemaineReservation`

### Reclamation
- `id` (Integer, Primary Key)
- `date_reclamation` (Date)
- `description` (String)
- `reponse_admin` (String)
- `etat` (Enum/String: EN_ATTENTE, TRAITEE)
- **Relationships**:
  - Submitted by one `Professeur`
  - Handled by one `Administrateur`

## 3. Required REST Endpoints (CRUD & Business Logic)

### Utilisateurs
- `GET /utilisateurs` (Admin only)
- `POST /utilisateurs` (Admin only - create new Professeur/Admin)
- `GET /utilisateurs/{id}` 
- `PUT /utilisateurs/{id}`
- `DELETE /utilisateurs/{id}`

### Salles & Séances
- `GET /salles`
- `GET /seances`
- Admin routes for creating/updating/deleting Salles and Seances.

### Emplois du Temps (LigneEmploi)
- `GET /emplois` (Get schedule)
- `POST /emplois` (Admin sets up the schedule)
- `GET /emplois/professeur/{prof_id}` (Get specific teacher's schedule)

### Semaines de Réservation
- `GET /semaines-reservation`
- `POST /semaines-reservation`
- `PUT /semaines-reservation/{id}/toggle-status` (Admin opens/closes a week)

### DataShows & Réparations
- `GET /datashows`
- `POST /datashows` (Admin adds a new datashow)
- `PUT /datashows/{id}/etat` (Update status to EN_PANNE or DISPONIBLE)
- `GET /reparations`
- `POST /reparations` (Log a repair for a broken datashow)

### Réservations
- `GET /reservations`
- `POST /reservations` (Professeur makes a reservation. Must check if `SemaineReservation` is open and datashow is `DISPONIBLE`)
- `DELETE /reservations/{id}` (Cancel reservation)
- `GET /reservations/professeur/{prof_id}` (View my reservations)

### Réclamations
- `GET /reclamations` (Admin views all)
- `POST /reclamations` (Professeur submits a complaint/issue)
- `PUT /reclamations/{id}/traiter` (Admin responds to a complaint, updating state to TRAITEE and setting `reponse_admin`)

## 4. Middleware & Security
- **JWT Authentication**: Protect all routes except login.
- **Role-Based Access Control (RBAC)**: Ensure only Admins can create Datashows, manage schedules, open reservation weeks, and reply to Reclamations. Professeurs should only be able to view their data, make reservations, and create reclamations.
- **Password Hashing**: Store all passwords securely using `bcrypt` or `passlib`.
