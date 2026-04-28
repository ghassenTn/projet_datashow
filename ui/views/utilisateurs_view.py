"""
Utilisateurs view (Admin only).
Manage professors and other admins.
"""
import tkinter as tk
from ui.theme import BG_PRIMARY, PADDING_LG, PADDING_MD, create_styled_button, ICONS
from ui.components.table import DataTable
from ui.components.dialog import FormDialog


class UtilisateursView(tk.Frame):
    def __init__(self, parent, app):
        super().__init__(parent, bg=BG_PRIMARY)
        self.app = app
        self._build()

    def _build(self):
        # Toolbar
        toolbar = tk.Frame(self, bg=BG_PRIMARY)
        toolbar.pack(fill="x", padx=PADDING_LG, pady=PADDING_LG)

        create_styled_button(
            toolbar, text=f"{ICONS['add']} Ajouter Professeur",
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

        # Table
        columns = [
            ("id", "ID"),
            ("login", "Login"),
            ("nom", "Nom"),
            ("prenom", "Prénom"),
            ("role", "Rôle")
        ]
        self.table = DataTable(self, columns, column_widths={"id": 50, "role": 100})
        self.table.pack(fill="both", expand=True, padx=PADDING_LG, pady=(0, PADDING_LG))

    def on_show(self):
        success, data = self.app.api.get_utilisateurs()
        if success:
            # Format role display
            for row in data:
                row["role"] = "Admin" if row["role"] == "admin" else "Professeur"
            self.table.set_data(data)
        else:
            self.app.show_toast(f"Erreur de chargement: {data}", "error")

    def _show_add_dialog(self):
        fields = [
            {"name": "login", "label": "Login", "type": "entry"},
            {"name": "mot_de_passe", "label": "Mot de passe", "type": "entry"},
            {"name": "nom", "label": "Nom", "type": "entry"},
            {"name": "prenom", "label": "Prénom", "type": "entry"},
        ]
        FormDialog(self, "Ajouter un Professeur", fields, self._on_add_submit)

    def _on_add_submit(self, data):
        success, res = self.app.api.create_professeur(data)
        if success:
            self.app.show_toast("Professeur ajouté avec succès", "success")
            self.on_show()
        else:
            self.app.show_toast(f"Erreur: {res}", "error")

    def _delete_selected(self):
        selected = self.table.get_selected()
        if not selected:
            self.app.show_toast("Veuillez sélectionner un utilisateur", "warning")
            return
        
        # Don't delete yourself
        if selected["id"] == self.app.api.user_info.get("id"):
            self.app.show_toast("Vous ne pouvez pas vous supprimer vous-même", "error")
            return

        success, res = self.app.api.delete_utilisateur(selected["id"])
        if success:
            self.app.show_toast("Utilisateur supprimé", "success")
            self.on_show()
        else:
            self.app.show_toast(f"Erreur: {res}", "error")
