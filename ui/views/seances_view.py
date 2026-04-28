"""
Séances view.
"""
import tkinter as tk
from ui.theme import BG_PRIMARY, PADDING_LG, PADDING_MD, create_styled_button, ICONS
from ui.components.table import DataTable
from ui.components.dialog import FormDialog


class SeancesView(tk.Frame):
    def __init__(self, parent, app):
        super().__init__(parent, bg=BG_PRIMARY)
        self.app = app
        self._build()

    def _build(self):
        toolbar = tk.Frame(self, bg=BG_PRIMARY)
        toolbar.pack(fill="x", padx=PADDING_LG, pady=PADDING_LG)

        if self.app.api.is_admin():
            create_styled_button(
                toolbar, text=f"{ICONS['add']} Ajouter Séance",
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
            ("id", "ID (ex: S1)"),
            ("heure_debut", "Heure Début"),
            ("heure_fin", "Heure Fin")
        ]
        self.table = DataTable(self, columns)
        self.table.pack(fill="both", expand=True, padx=PADDING_LG, pady=(0, PADDING_LG))

    def on_show(self):
        success, data = self.app.api.get_seances()
        if success:
            # Format times (strip seconds if present)
            for row in data:
                if len(row["heure_debut"]) > 5:
                    row["heure_debut"] = row["heure_debut"][:5]
                if len(row["heure_fin"]) > 5:
                    row["heure_fin"] = row["heure_fin"][:5]
            self.table.set_data(data)
        else:
            self.app.show_toast(f"Erreur de chargement: {data}", "error")

    def _show_add_dialog(self):
        fields = [
            {"name": "id", "label": "ID (S1, S2, etc.)", "type": "entry"},
            {"name": "heure_debut", "label": "Heure Début (HH:MM)", "type": "entry"},
            {"name": "heure_fin", "label": "Heure Fin (HH:MM)", "type": "entry"},
        ]
        FormDialog(self, "Ajouter une Séance", fields, self._on_add_submit)

    def _on_add_submit(self, data):
        # Format time properly if user entered "8:00" -> "08:00:00"
        for k in ["heure_debut", "heure_fin"]:
            if len(data[k]) == 4: # H:MM
                data[k] = "0" + data[k]
            if len(data[k]) == 5: # HH:MM
                data[k] = data[k] + ":00"
                
        success, res = self.app.api.create_seance(data)
        if success:
            self.app.show_toast("Séance ajoutée", "success")
            self.on_show()
        else:
            self.app.show_toast(f"Erreur: {res}", "error")

    def _delete_selected(self):
        selected = self.table.get_selected()
        if not selected:
            self.app.show_toast("Veuillez sélectionner une séance", "warning")
            return

        success, res = self.app.api.delete_seance(selected["id"])
        if success:
            self.app.show_toast("Séance supprimée", "success")
            self.on_show()
        else:
            self.app.show_toast(f"Erreur: {res}", "error")
