"""
Semaines de Réservation view (Admin only).
"""
import tkinter as tk
from ui.theme import BG_PRIMARY, PADDING_LG, PADDING_MD, create_styled_button, ICONS
from ui.components.table import DataTable
from ui.components.dialog import FormDialog


class SemainesView(tk.Frame):
    def __init__(self, parent, app):
        super().__init__(parent, bg=BG_PRIMARY)
        self.app = app
        self._build()

    def _build(self):
        toolbar = tk.Frame(self, bg=BG_PRIMARY)
        toolbar.pack(fill="x", padx=PADDING_LG, pady=PADDING_LG)

        create_styled_button(
            toolbar, text=f"{ICONS['add']} Ajouter Semaine",
            command=self._show_add_dialog, variant="primary"
        ).pack(side="left")

        create_styled_button(
            toolbar, text=f"{ICONS['toggle']} Ouvrir / Fermer",
            command=self._toggle_selected, variant="warning"
        ).pack(side="left", padx=PADDING_MD)

        create_styled_button(
            toolbar, text=f"{ICONS['refresh']} Actualiser",
            command=self.on_show, variant="ghost"
        ).pack(side="right")

        columns = [
            ("id", "ID"),
            ("date_lundi", "Date du Lundi"),
            ("est_ouverte", "Statut Réservation")
        ]
        self.table = DataTable(self, columns)
        self.table.pack(fill="both", expand=True, padx=PADDING_LG, pady=(0, PADDING_LG))

    def on_show(self):
        success, data = self.app.api.get_semaines()
        if success:
            for row in data:
                row["est_ouverte"] = "🟢 Ouverte" if row["est_ouverte"] else "🔴 Fermée"
            # Sort by date descending
            data.sort(key=lambda x: x["date_lundi"], reverse=True)
            self.table.set_data(data)
        else:
            self.app.show_toast(f"Erreur de chargement: {data}", "error")

    def _show_add_dialog(self):
        fields = [
            {"name": "date_lundi", "label": "Date du Lundi (YYYY-MM-DD)", "type": "date"},
            {"name": "est_ouverte", "label": "Ouvrir immédiatement", "type": "check", "default": False},
        ]
        FormDialog(self, "Ajouter une Semaine", fields, self._on_add_submit)

    def _on_add_submit(self, data):
        success, res = self.app.api.create_semaine(data)
        if success:
            self.app.show_toast("Semaine ajoutée", "success")
            self.on_show()
        else:
            self.app.show_toast(f"Erreur: {res}", "error")

    def _toggle_selected(self):
        selected = self.table.get_selected()
        if not selected:
            self.app.show_toast("Veuillez sélectionner une semaine", "warning")
            return

        is_open = "Ouverte" in selected["est_ouverte"]
        new_state = not is_open
        
        success, res = self.app.api.toggle_semaine(selected["id"], new_state)
        if success:
            self.app.show_toast("Statut mis à jour", "success")
            self.on_show()
        else:
            self.app.show_toast(f"Erreur: {res}", "error")
