"""
Emplois du Temps view.
"""
import tkinter as tk
from ui.theme import BG_PRIMARY, PADDING_LG, PADDING_MD, create_styled_button, ICONS
from ui.components.table import DataTable
from ui.components.dialog import FormDialog


class EmploisView(tk.Frame):
    def __init__(self, parent, app):
        super().__init__(parent, bg=BG_PRIMARY)
        self.app = app
        self._build()

    def _build(self):
        toolbar = tk.Frame(self, bg=BG_PRIMARY)
        toolbar.pack(fill="x", padx=PADDING_LG, pady=PADDING_LG)

        if self.app.api.is_admin():
            create_styled_button(
                toolbar, text=f"{ICONS['add']} Ajouter Cours",
                command=self._show_add_dialog, variant="primary"
            ).pack(side="left")

            create_styled_button(
                toolbar, text=f"{ICONS['delete']} Supprimer",
                command=self._delete_selected, variant="danger"
            ).pack(side="right")

        create_styled_button(
            toolbar, text=f"{ICONS['refresh']} Actualiser",
            command=self.on_show, variant="ghost"
        ).pack(side="right", padx=PADDING_MD)

        columns = [
            ("id", "ID"),
            ("professeur_id", "ID Prof"),
            ("jour_de_la_semaine", "Jour"),
            ("seance_id", "Séance"),
            ("salle_id", "Salle")
        ]
        self.table = DataTable(self, columns)
        self.table.pack(fill="both", expand=True, padx=PADDING_LG, pady=(0, PADDING_LG))

    def on_show(self):
        success, data = self.app.api.get_emplois()
        if success:
            if not self.app.api.is_admin():
                # Filter for current prof
                my_id = self.app.api.user_info.get("id")
                data = [d for d in data if d["professeur_id"] == my_id]
            self.table.set_data(data)
        else:
            self.app.show_toast(f"Erreur de chargement: {data}", "error")

    def _show_add_dialog(self):
        # Need to fetch lists for dropdowns
        _, profs = self.app.api.get_utilisateurs()
        prof_list = [f"{p['id']} - {p['nom']} {p['prenom']}" for p in profs if p["role"] == "professeur"] if profs else []
        
        _, salles = self.app.api.get_salles()
        salle_list = [s["numero"] for s in salles] if salles else []
        
        _, seances = self.app.api.get_seances()
        seance_list = [s["id"] for s in seances] if seances else []

        jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]

        fields = [
            {"name": "prof", "label": "Professeur", "type": "combo", "options": prof_list},
            {"name": "jour_de_la_semaine", "label": "Jour", "type": "combo", "options": jours},
            {"name": "seance_id", "label": "Séance", "type": "combo", "options": seance_list},
            {"name": "salle_id", "label": "Salle", "type": "combo", "options": salle_list},
        ]
        
        def on_submit(data):
            if not data.get("prof"): return
            prof_id = int(data.pop("prof").split(" - ")[0])
            success, res = self.app.api.create_emploi(data, prof_id)
            if success:
                self.app.show_toast("Ligne ajoutée", "success")
                self.on_show()
            else:
                self.app.show_toast(f"Erreur: {res}", "error")

        FormDialog(self, "Ajouter à l'emploi", fields, on_submit)

    def _delete_selected(self):
        selected = self.table.get_selected()
        if not selected:
            self.app.show_toast("Veuillez sélectionner une ligne", "warning")
            return

        success, res = self.app.api.delete_emploi(selected["id"])
        if success:
            self.app.show_toast("Ligne supprimée", "success")
            self.on_show()
        else:
            self.app.show_toast(f"Erreur: {res}", "error")
