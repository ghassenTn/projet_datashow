"""
Salles view.
"""
import tkinter as tk
from ui.theme import BG_PRIMARY, PADDING_LG, PADDING_MD, create_styled_button, ICONS
from ui.components.table import DataTable
from ui.components.dialog import FormDialog


class SallesView(tk.Frame):
    def __init__(self, parent, app):
        super().__init__(parent, bg=BG_PRIMARY)
        self.app = app
        self._build()

    def _build(self):
        toolbar = tk.Frame(self, bg=BG_PRIMARY)
        toolbar.pack(fill="x", padx=PADDING_LG, pady=PADDING_LG)

        if self.app.api.is_admin():
            create_styled_button(
                toolbar, text=f"{ICONS['add']} Ajouter Salle",
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
            ("numero", "Numéro de Salle"),
            ("equipee_tv", "Équipée TV"),
            ("equipee_datashow", "Équipée DataShow")
        ]
        self.table = DataTable(self, columns)
        self.table.pack(fill="both", expand=True, padx=PADDING_LG, pady=(0, PADDING_LG))

    def on_show(self):
        success, data = self.app.api.get_salles()
        if success:
            for row in data:
                row["equipee_tv"] = "Oui" if row["equipee_tv"] else "Non"
                row["equipee_datashow"] = "Oui" if row["equipee_datashow"] else "Non"
            self.table.set_data(data)
        else:
            self.app.show_toast(f"Erreur de chargement: {data}", "error")

    def _show_add_dialog(self):
        fields = [
            {"name": "numero", "label": "Numéro de Salle (ex: Amphi A)", "type": "entry"},
            {"name": "equipee_tv", "label": "Équipée TV", "type": "check"},
            {"name": "equipee_datashow", "label": "Équipée DataShow fixe", "type": "check"},
        ]
        FormDialog(self, "Ajouter une Salle", fields, self._on_add_submit)

    def _on_add_submit(self, data):
        success, res = self.app.api.create_salle(data)
        if success:
            self.app.show_toast("Salle ajoutée", "success")
            self.on_show()
        else:
            self.app.show_toast(f"Erreur: {res}", "error")

    def _delete_selected(self):
        selected = self.table.get_selected()
        if not selected:
            self.app.show_toast("Veuillez sélectionner une salle", "warning")
            return

        success, res = self.app.api.delete_salle(selected["numero"])
        if success:
            self.app.show_toast("Salle supprimée", "success")
            self.on_show()
        else:
            self.app.show_toast(f"Erreur: {res}", "error")
