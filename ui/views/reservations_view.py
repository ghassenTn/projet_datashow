"""
Réservations view.
"""
import tkinter as tk
from ui.theme import BG_PRIMARY, PADDING_LG, PADDING_MD, create_styled_button, ICONS
from ui.components.table import DataTable
from ui.components.dialog import FormDialog


class ReservationsView(tk.Frame):
    def __init__(self, parent, app):
        super().__init__(parent, bg=BG_PRIMARY)
        self.app = app
        self._build()

    def _build(self):
        toolbar = tk.Frame(self, bg=BG_PRIMARY)
        toolbar.pack(fill="x", padx=PADDING_LG, pady=PADDING_LG)

        if not self.app.api.is_admin():
            create_styled_button(
                toolbar, text=f"{ICONS['add']} Nouvelle Réservation",
                command=self._show_add_dialog, variant="success"
            ).pack(side="left")

        create_styled_button(
            toolbar, text=f"{ICONS['delete']} Annuler / Supprimer",
            command=self._delete_selected, variant="danger"
        ).pack(side="right")

        create_styled_button(
            toolbar, text=f"{ICONS['refresh']} Actualiser",
            command=self.on_show, variant="ghost"
        ).pack(side="right", padx=PADDING_MD)

        columns = [
            ("id", "ID Rép."),
            ("professeur_id", "ID Prof"),
            ("semaine_id", "Semaine"),
            ("date_reservation", "Date"),
            ("seance_id", "Séance"),
            ("salle_id", "Salle"),
            ("datashow_id", "DS ID"),
            ("est_hors_emploi", "Hors Emploi")
        ]
        self.table = DataTable(self, columns, column_widths={"date_reservation": 120, "est_hors_emploi": 100})
        self.table.pack(fill="both", expand=True, padx=PADDING_LG, pady=(0, PADDING_LG))

    def on_show(self):
        success, data = self.app.api.get_reservations()
        if success:
            if not self.app.api.is_admin():
                my_id = self.app.api.user_info.get("id")
                data = [d for d in data if d["professeur_id"] == my_id]
                
            for row in data:
                row["est_hors_emploi"] = "Oui" if row["est_hors_emploi"] else "Non"
            self.table.set_data(data)
        else:
            self.app.show_toast(f"Erreur: {data}", "error")

    def _show_add_dialog(self):
        # Fetch lookups
        _, semaines = self.app.api.get_semaines()
        semaine_list = [f"{s['id']} - Lundi {s['date_lundi']}" for s in semaines if s["est_ouverte"]] if semaines else []
        
        _, seances = self.app.api.get_seances()
        seance_list = [s["id"] for s in seances] if seances else []
        
        _, salles = self.app.api.get_salles()
        salle_list = [s["numero"] for s in salles] if salles else []
        
        _, datashows = self.app.api.get_datashows()
        ds_list = [f"{d['id']} - {d['numero_unique']}" for d in datashows if d["etat"] == "disponible"] if datashows else []

        if not semaine_list:
            self.app.show_toast("Aucune semaine ouverte pour la réservation", "warning")
            return
        if not ds_list:
            self.app.show_toast("Aucun DataShow disponible", "warning")
            return

        fields = [
            {"name": "semaine", "label": "Semaine", "type": "combo", "options": semaine_list},
            {"name": "date_reservation", "label": "Date exacte (YYYY-MM-DD)", "type": "date"},
            {"name": "seance_id", "label": "Séance", "type": "combo", "options": seance_list},
            {"name": "salle_id", "label": "Salle", "type": "combo", "options": salle_list},
            {"name": "ds", "label": "DataShow", "type": "combo", "options": ds_list},
            {"name": "est_hors_emploi", "label": "Hors emploi normal", "type": "check"},
        ]
        
        def on_submit(data):
            if not data.get("semaine") or not data.get("ds"): return
            data["semaine_id"] = int(data.pop("semaine").split(" - ")[0])
            data["datashow_id"] = int(data.pop("ds").split(" - ")[0])
            
            success, res = self.app.api.create_reservation(data)
            if success:
                self.app.show_toast("Réservation effectuée", "success")
                self.on_show()
            else:
                self.app.show_toast(f"Erreur: {res}", "error")

        FormDialog(self, "Nouvelle Réservation", fields, on_submit)

    def _delete_selected(self):
        selected = self.table.get_selected()
        if not selected:
            self.app.show_toast("Veuillez sélectionner une réservation", "warning")
            return

        success, res = self.app.api.delete_reservation(selected["id"])
        if success:
            self.app.show_toast("Réservation annulée", "success")
            self.on_show()
        else:
            self.app.show_toast(f"Erreur: {res}", "error")
