"""
Réclamations view.
"""
import tkinter as tk
from ui.theme import BG_PRIMARY, PADDING_LG, PADDING_MD, create_styled_button, ICONS
from ui.components.table import DataTable
from ui.components.dialog import FormDialog


class ReclamationsView(tk.Frame):
    def __init__(self, parent, app):
        super().__init__(parent, bg=BG_PRIMARY)
        self.app = app
        self._build()

    def _build(self):
        toolbar = tk.Frame(self, bg=BG_PRIMARY)
        toolbar.pack(fill="x", padx=PADDING_LG, pady=PADDING_LG)

        if self.app.api.is_admin():
            create_styled_button(
                toolbar, text=f"{ICONS['check']} Traiter",
                command=self._traiter_selected, variant="success"
            ).pack(side="left")
        else:
            create_styled_button(
                toolbar, text=f"{ICONS['add']} Nouvelle Réclamation",
                command=self._show_add_dialog, variant="primary"
            ).pack(side="left")

        create_styled_button(
            toolbar, text=f"{ICONS['refresh']} Actualiser",
            command=self.on_show, variant="ghost"
        ).pack(side="right")

        columns = [
            ("id", "ID"),
            ("professeur_id", "ID Prof"),
            ("date_reclamation", "Date"),
            ("etat", "État"),
            ("description", "Description"),
            ("reponse_admin", "Réponse Admin")
        ]
        self.table = DataTable(self, columns, column_widths={"description": 250, "reponse_admin": 200, "etat": 100})
        self.table.pack(fill="both", expand=True, padx=PADDING_LG, pady=(0, PADDING_LG))

    def on_show(self):
        success, data = self.app.api.get_reclamations()
        if success:
            if not self.app.api.is_admin():
                my_id = self.app.api.user_info.get("id")
                data = [d for d in data if d["professeur_id"] == my_id]
                
            for row in data:
                if row["etat"] == "en_attente":
                    row["etat"] = "🟡 EN_ATTENTE"
                else:
                    row["etat"] = "🟢 TRAITEE"
                if not row.get("reponse_admin"):
                    row["reponse_admin"] = "---"
            self.table.set_data(data)
        else:
            self.app.show_toast(f"Erreur de chargement: {data}", "error")

    def _show_add_dialog(self):
        fields = [
            {"name": "date_reclamation", "label": "Date (YYYY-MM-DD)", "type": "date"},
            {"name": "description", "label": "Description du problème", "type": "text"},
        ]
        
        def on_submit(data):
            success, res = self.app.api.create_reclamation(data)
            if success:
                self.app.show_toast("Réclamation envoyée", "success")
                self.on_show()
            else:
                self.app.show_toast(f"Erreur: {res}", "error")

        FormDialog(self, "Nouvelle Réclamation", fields, on_submit)

    def _traiter_selected(self):
        selected = self.table.get_selected()
        if not selected:
            self.app.show_toast("Veuillez sélectionner une réclamation", "warning")
            return
            
        if "TRAITEE" in selected["etat"]:
            self.app.show_toast("Cette réclamation est déjà traitée", "warning")
            return

        fields = [
            {"name": "reponse", "label": "Réponse de l'administration", "type": "text"},
        ]
        
        def on_submit(data):
            reponse = data.get("reponse", "").strip()
            if not reponse:
                self.app.show_toast("La réponse ne peut pas être vide", "error")
                return
                
            success, res = self.app.api.traiter_reclamation(selected["id"], reponse)
            if success:
                self.app.show_toast("Réclamation traitée", "success")
                self.on_show()
            else:
                self.app.show_toast(f"Erreur: {res}", "error")

        FormDialog(self, f"Traiter Réclamation {selected['id']}", fields, on_submit)
