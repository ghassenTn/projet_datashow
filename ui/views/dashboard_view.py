"""
Dashboard view.
Shows summary statistics for Admin, or personal summary for Professeur.
"""
import tkinter as tk
from ui.theme import (
    BG_PRIMARY, PADDING_LG, PADDING_MD, ICONS, ACCENT, SUCCESS, WARNING, DANGER,
    FONT_HEADING
)
from ui.components.card import StatCard


class DashboardView(tk.Frame):
    """Dashboard displaying summary statistics."""

    def __init__(self, parent, app):
        super().__init__(parent, bg=BG_PRIMARY)
        self.app = app
        self.cards_frame = None
        self._build()

    def _build(self):
        # Header
        header_frame = tk.Frame(self, bg=BG_PRIMARY)
        header_frame.pack(fill="x", padx=PADDING_LG, pady=PADDING_LG)
        
        tk.Label(
            header_frame, text="Aperçu Général", font=FONT_HEADING,
            bg=BG_PRIMARY, fg="white",
        ).pack(side="left")

        # Container for cards
        self.cards_frame = tk.Frame(self, bg=BG_PRIMARY)
        self.cards_frame.pack(fill="both", expand=True, padx=PADDING_LG)

    def on_show(self):
        """Called when the view is displayed. Fetch data and update."""
        # Clear existing cards
        for widget in self.cards_frame.winfo_children():
            widget.destroy()

        if self.app.api.is_admin():
            self._build_admin_dashboard()
        else:
            self._build_prof_dashboard()

    def _build_admin_dashboard(self):
        # Fetch data
        ok_users, users = self.app.api.get_utilisateurs()
        ok_ds, datashows = self.app.api.get_datashows()
        ok_res, reservations = self.app.api.get_reservations()
        ok_rec, reclamations = self.app.api.get_reclamations()

        # Calculate stats
        prof_count = len([u for u in users if u["role"] == "professeur"]) if ok_users else 0
        ds_total = len(datashows) if ok_ds else 0
        ds_dispo = len([ds for ds in datashows if ds["etat"] == "disponible"]) if ok_ds else 0
        res_count = len(reservations) if ok_res else 0
        rec_attente = len([r for r in reclamations if r["etat"] == "en_attente"]) if ok_rec else 0

        # Create cards
        row1 = tk.Frame(self.cards_frame, bg=BG_PRIMARY)
        row1.pack(fill="x", pady=(0, PADDING_MD))

        StatCard(row1, ICONS["users"], prof_count, "Professeurs", ACCENT).pack(side="left", padx=(0, PADDING_MD))
        StatCard(row1, ICONS["datashows"], ds_total, "DataShows Total", ACCENT).pack(side="left", padx=(0, PADDING_MD))
        StatCard(row1, ICONS["available"], ds_dispo, "DataShows Dispo", SUCCESS).pack(side="left", padx=(0, PADDING_MD))

        row2 = tk.Frame(self.cards_frame, bg=BG_PRIMARY)
        row2.pack(fill="x", pady=(0, PADDING_MD))

        StatCard(row2, ICONS["reservations"], res_count, "Réservations", SUCCESS).pack(side="left", padx=(0, PADDING_MD))
        StatCard(row2, ICONS["complaints"], rec_attente, "Réclamations Attente", WARNING if rec_attente > 0 else SUCCESS).pack(side="left", padx=(0, PADDING_MD))

    def _build_prof_dashboard(self):
        # Fetch personal data
        me = self.app.api.user_info
        my_id = me["id"] if me else None

        ok_ds, datashows = self.app.api.get_datashows()
        ok_res, reservations = self.app.api.get_reservations()
        ok_rec, reclamations = self.app.api.get_reclamations()

        ds_dispo = len([ds for ds in datashows if ds["etat"] == "disponible"]) if ok_ds else 0
        my_res = len([r for r in reservations if r["professeur_id"] == my_id]) if ok_res and my_id else 0
        my_rec = len([r for r in reclamations if r["professeur_id"] == my_id and r["etat"] == "en_attente"]) if ok_rec and my_id else 0

        # Create cards
        row1 = tk.Frame(self.cards_frame, bg=BG_PRIMARY)
        row1.pack(fill="x", pady=(0, PADDING_MD))

        StatCard(row1, ICONS["available"], ds_dispo, "DataShows Dispo", SUCCESS).pack(side="left", padx=(0, PADDING_MD))
        StatCard(row1, ICONS["reservations"], my_res, "Mes Réservations", ACCENT).pack(side="left", padx=(0, PADDING_MD))
        StatCard(row1, ICONS["complaints"], my_rec, "Mes Réc. en Attente", WARNING if my_rec > 0 else SUCCESS).pack(side="left", padx=(0, PADDING_MD))

