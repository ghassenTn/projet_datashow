"""
Sidebar navigation component.
Displays different menu items based on user role (admin vs professeur).
"""
import tkinter as tk
from ui.theme import (
    BG_SECONDARY, BG_HOVER, ACCENT, TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED,
    FONT_HEADING_SM, FONT_NAV, FONT_NAV_ACTIVE, FONT_SMALL,
    SIDEBAR_WIDTH, PADDING_LG, PADDING_MD, PADDING_SM, ICONS, BORDER,
)


class Sidebar(tk.Frame):
    """Left sidebar with navigation menu."""

    ADMIN_ITEMS = [
        ("dashboard", "Tableau de Bord", "dashboard"),
        ("utilisateurs", "Utilisateurs", "users"),
        ("salles", "Salles", "rooms"),
        ("seances", "Séances", "sessions"),
        ("datashows", "DataShows", "datashows"),
        ("emplois", "Emploi du Temps", "schedule"),
        ("semaines", "Semaines", "weeks"),
        ("reservations", "Réservations", "reservations"),
        ("reclamations", "Réclamations", "complaints"),
    ]

    PROF_ITEMS = [
        ("dashboard", "Tableau de Bord", "dashboard"),
        ("emplois", "Mon Emploi", "schedule"),
        ("reservations", "Réservations", "reservations"),
        ("reclamations", "Mes Réclamations", "complaints"),
    ]

    def __init__(self, parent, app, role="admin"):
        super().__init__(parent, bg=BG_SECONDARY, width=SIDEBAR_WIDTH)
        self.app = app
        self.role = role
        self.active_view = "dashboard"
        self.nav_buttons = {}
        self.pack_propagate(False)
        self._build()

    def _build(self):
        # Logo / Title area
        title_frame = tk.Frame(self, bg=BG_SECONDARY)
        title_frame.pack(fill="x", pady=(PADDING_LG, PADDING_SM))

        tk.Label(
            title_frame, text="📽", font=("Segoe UI", 28),
            bg=BG_SECONDARY, fg=ACCENT,
        ).pack(pady=(PADDING_SM, 0))
        tk.Label(
            title_frame, text="DataShow", font=FONT_HEADING_SM,
            bg=BG_SECONDARY, fg=TEXT_PRIMARY,
        ).pack()
        tk.Label(
            title_frame, text="IPSAS", font=FONT_SMALL,
            bg=BG_SECONDARY, fg=TEXT_MUTED,
        ).pack()

        # Separator
        sep = tk.Frame(self, bg=BORDER, height=1)
        sep.pack(fill="x", padx=PADDING_LG, pady=PADDING_MD)

        # Menu label
        tk.Label(
            self, text="MENU", font=FONT_SMALL,
            bg=BG_SECONDARY, fg=TEXT_MUTED, anchor="w",
        ).pack(fill="x", padx=PADDING_LG, pady=(PADDING_SM, PADDING_XS))

        # Navigation items
        items = self.ADMIN_ITEMS if self.role == "admin" else self.PROF_ITEMS
        for view_name, label, icon_key in items:
            self._create_nav_item(view_name, label, ICONS.get(icon_key, "•"))

        # Spacer
        spacer = tk.Frame(self, bg=BG_SECONDARY)
        spacer.pack(fill="both", expand=True)

        # Logout button at bottom
        sep2 = tk.Frame(self, bg=BORDER, height=1)
        sep2.pack(fill="x", padx=PADDING_LG, pady=PADDING_XS)
        self._create_nav_item("logout", "Déconnexion", ICONS["logout"], is_danger=True)

        # Bottom padding
        tk.Frame(self, bg=BG_SECONDARY, height=PADDING_MD).pack()

    def _create_nav_item(self, view_name, label, icon, is_danger=False):
        """Create a single nav button."""
        is_active = view_name == self.active_view

        btn_frame = tk.Frame(self, bg=BG_SECONDARY)
        btn_frame.pack(fill="x", padx=PADDING_SM, pady=2)

        bg = ACCENT if is_active else BG_SECONDARY
        fg = TEXT_PRIMARY if is_active else (TEXT_SECONDARY if not is_danger else "#e17055")

        btn = tk.Button(
            btn_frame,
            text=f"  {icon}  {label}",
            font=FONT_NAV_ACTIVE if is_active else FONT_NAV,
            bg=bg, fg=fg,
            relief="flat", bd=0, cursor="hand2",
            anchor="w", padx=PADDING_MD, pady=PADDING_SM,
            activebackground=ACCENT if is_active else BG_HOVER,
            activeforeground=TEXT_PRIMARY,
            command=lambda v=view_name: self._on_nav_click(v),
        )
        btn.pack(fill="x")

        if not is_active:
            btn.bind("<Enter>", lambda e, b=btn: b.configure(bg=BG_HOVER))
            btn.bind("<Leave>", lambda e, b=btn: b.configure(bg=BG_SECONDARY))

        self.nav_buttons[view_name] = btn

    def _on_nav_click(self, view_name):
        """Handle nav item click."""
        if view_name == "logout":
            self.app.logout()
            return

        self.active_view = view_name
        self._refresh_buttons()
        self.app.show_view(view_name)

    def _refresh_buttons(self):
        """Re-render all buttons to reflect active state."""
        # Clear and rebuild
        for widget in self.winfo_children():
            widget.destroy()
        self.nav_buttons.clear()
        self._build()

    def set_active(self, view_name):
        """Externally set the active view."""
        self.active_view = view_name
        self._refresh_buttons()


# Fix missing import
from ui.theme import PADDING_XS
