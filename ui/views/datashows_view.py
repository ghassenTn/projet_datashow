"""
DataShows view.
Manage DataShows and repairs (Admin only for full features).
"""
import tkinter as tk
from ui.theme import BG_PRIMARY, PADDING_LG, PADDING_MD, create_styled_button, ICONS
from ui.components.table import DataTable
from ui.components.dialog import FormDialog


class DataShowsView(tk.Frame):
    def __init__(self, parent, app):
        super().__init__(parent, bg=BG_PRIMARY)
        self.app = app
        self._build()

    def _build(self):
        # Toolbar
        toolbar = tk.Frame(self, bg=BG_PRIMARY)
        toolbar.pack(fill="x", padx=PADDING_LG, pady=PADDING_LG)

        if self.app.api.is_admin():
            create_styled_button(
                toolbar, text=f"{ICONS['add']} Ajouter DataShow",
                command=self._show_add_dialog, variant="primary"
            ).pack(side="left")

            create_styled_button(
                toolbar, text=f"{ICONS['edit']} Changer État",
                command=self._change_etat, variant="warning"
            ).pack(side="left", padx=PADDING_MD)

            create_styled_button(
                toolbar, text=f"{ICONS['add']} Ajouter Réparation",
                command=self._add_reparation, variant="primary"
            ).pack(side="left")

        create_styled_button(
            toolbar, text=f"{ICONS['refresh']} Actualiser",
            command=self.on_show, variant="ghost"
        ).pack(side="right")

        # Two tables: DataShows and Reparations
        tables_frame = tk.Frame(self, bg=BG_PRIMARY)
        tables_frame.pack(fill="both", expand=True, padx=PADDING_LG, pady=(0, PADDING_LG))

        # DataShows Table
        tk.Label(tables_frame, text="Liste des DataShows", bg=BG_PRIMARY, fg="white", font=("Segoe UI", 12, "bold")).pack(anchor="w", pady=(0, 5))
        ds_cols = [
            ("id", "ID"),
            ("numero_unique", "Numéro Unique"),
            ("date_achat", "Date Achat"),
            ("etat", "État")
        ]
        self.table_ds = DataTable(tables_frame, ds_cols, height=8)
        self.table_ds.pack(fill="x", pady=(0, PADDING_LG))

        # Reparations Table (only show if admin)
        if self.app.api.is_admin():
            tk.Label(tables_frame, text="Historique des Réparations", bg=BG_PRIMARY, fg="white", font=("Segoe UI", 12, "bold")).pack(anchor="w", pady=(0, 5))
            rep_cols = [
                ("id", "ID Rép."),
                ("datashow_id", "ID DataShow"),
                ("date_reparation", "Date"),
                ("description_panne", "Panne"),
                ("action_realisee", "Action")
            ]
            self.table_rep = DataTable(tables_frame, rep_cols, height=6)
            self.table_rep.pack(fill="both", expand=True)

    def on_show(self):
        # Load Datashows
        success, data = self.app.api.get_datashows()
        if success:
            for row in data:
                # Add icon to state
                if row["etat"] == "disponible":
                    row["etat"] = f"🟢 {row['etat'].upper()}"
                else:
                    row["etat"] = f"🔴 {row['etat'].upper()}"
            self.table_ds.set_data(data)
        
        # Load Reparations if admin
        if self.app.api.is_admin():
            s_rep, d_rep = self.app.api.get_reparations()
            if s_rep:
                self.table_rep.set_data(d_rep)

    def _show_add_dialog(self):
        fields = [
            {"name": "numero_unique", "label": "Numéro Unique (ex: DS-01)", "type": "entry"},
            {"name": "date_achat", "label": "Date Achat (YYYY-MM-DD)", "type": "date"},
        ]
        FormDialog(self, "Ajouter DataShow", fields, self._on_add_submit)

    def _on_add_submit(self, data):
        data["etat"] = "disponible"
        success, res = self.app.api.create_datashow(data)
        if success:
            self.app.show_toast("DataShow ajouté", "success")
            self.on_show()
        else:
            self.app.show_toast(f"Erreur: {res}", "error")

    def _change_etat(self):
        selected = self.table_ds.get_selected()
        if not selected:
            self.app.show_toast("Veuillez sélectionner un DataShow", "warning")
            return
            
        current = selected["etat"]
        new_etat = "disponible" if "EN_PANNE" in current else "en_panne"
        
        success, res = self.app.api.update_datashow_etat(selected["id"], new_etat)
        if success:
            self.app.show_toast("État mis à jour", "success")
            self.on_show()
        else:
            self.app.show_toast(f"Erreur: {res}", "error")

    def _add_reparation(self):
        selected = self.table_ds.get_selected()
        if not selected:
            self.app.show_toast("Veuillez d'abord sélectionner le DataShow concerné en haut", "warning")
            return
            
        fields = [
            {"name": "date_reparation", "label": "Date (YYYY-MM-DD)", "type": "date"},
            {"name": "description_panne", "label": "Description Panne", "type": "entry"},
            {"name": "action_realisee", "label": "Action Réalisée", "type": "entry"},
        ]
        
        def on_submit(data):
            data["datashow_id"] = selected["id"]
            success, res = self.app.api.create_reparation(data)
            if success:
                self.app.show_toast("Réparation enregistrée", "success")
                self.on_show()
            else:
                self.app.show_toast(f"Erreur: {res}", "error")
                
        FormDialog(self, f"Réparation DataShow {selected['numero_unique']}", fields, on_submit)
