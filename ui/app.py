"""
Main application class.
Manages the root window, routing between views, and global state.
"""
import tkinter as tk
from ui.theme import BG_PRIMARY, configure_styles
from ui.api_client import ApiClient
from ui.components.sidebar import Sidebar
from ui.components.header import Header
from ui.components.toast import Toast

# Views
from ui.views.login_view import LoginView
from ui.views.dashboard_view import DashboardView
from ui.views.utilisateurs_view import UtilisateursView
from ui.views.salles_view import SallesView
from ui.views.seances_view import SeancesView
from ui.views.datashows_view import DataShowsView
from ui.views.emplois_view import EmploisView
from ui.views.semaines_view import SemainesView
from ui.views.reservations_view import ReservationsView
from ui.views.reclamations_view import ReclamationsView


class DataShowApp(tk.Tk):
    """Main Tkinter Application."""

    def __init__(self):
        super().__init__()

        self.title("Système de Réservation DataShow - IPSAS")
        self.geometry("1200x750")
        self.minsize(900, 600)
        self.configure(bg=BG_PRIMARY)

        # Apply global styles
        self.style = configure_styles()

        # State
        self.api = ApiClient()
        self.current_view = None
        self.views = {}

        # Toast manager
        self.toast_mgr = Toast(self)

        # Initialize UI layout
        self.main_container = tk.Frame(self, bg=BG_PRIMARY)
        self.main_container.pack(fill="both", expand=True)

        # Show login screen first
        self.show_login()

    def show_toast(self, message, variant="success"):
        self.toast_mgr.show(message, variant)

    def show_login(self):
        """Clear everything and show login screen."""
        for widget in self.main_container.winfo_children():
            widget.destroy()

        self.current_view = LoginView(self.main_container, self)
        self.current_view.pack(fill="both", expand=True)

    def on_login_success(self):
        """Called by LoginView when auth succeeds."""
        self.show_main_layout()

    def logout(self):
        """Log out and return to login screen."""
        self.api.logout()
        self.views.clear()
        self.show_login()

    def show_main_layout(self):
        """Build the main layout with sidebar and content area."""
        for widget in self.main_container.winfo_children():
            widget.destroy()

        # Sidebar
        self.sidebar = Sidebar(self.main_container, self, role=self.api.role)
        self.sidebar.pack(side="left", fill="y")

        # Right side container
        right_frame = tk.Frame(self.main_container, bg=BG_PRIMARY)
        right_frame.pack(side="right", fill="both", expand=True)

        # Header
        me = self.api.user_info
        name = f"{me['nom']} {me['prenom']}" if me else "Utilisateur"
        self.header = Header(right_frame, user_name=name, role=self.api.role)
        self.header.pack(fill="x")

        # Content area
        self.content_area = tk.Frame(right_frame, bg=BG_PRIMARY)
        self.content_area.pack(fill="both", expand=True)

        # Pre-instantiate views
        self._init_views()

        # Default to dashboard
        self.show_view("dashboard")

    def _init_views(self):
        """Instantiate all available views based on role."""
        self.views["dashboard"] = DashboardView(self.content_area, self)
        self.views["emplois"] = EmploisView(self.content_area, self)
        self.views["reservations"] = ReservationsView(self.content_area, self)
        self.views["reclamations"] = ReclamationsView(self.content_area, self)

        if self.api.is_admin():
            self.views["utilisateurs"] = UtilisateursView(self.content_area, self)
            self.views["salles"] = SallesView(self.content_area, self)
            self.views["seances"] = SeancesView(self.content_area, self)
            self.views["datashows"] = DataShowsView(self.content_area, self)
            self.views["semaines"] = SemainesView(self.content_area, self)

    def show_view(self, view_name):
        """Switch the visible content view."""
        if self.current_view and hasattr(self.current_view, "pack_forget"):
            self.current_view.pack_forget()

        if view_name in self.views:
            self.current_view = self.views[view_name]
            self.current_view.pack(fill="both", expand=True)
            
            # Call on_show hook if it exists to refresh data
            if hasattr(self.current_view, "on_show"):
                self.current_view.on_show()

            # Update header title
            titles = {
                "dashboard": "Tableau de Bord",
                "utilisateurs": "Gestion des Utilisateurs",
                "salles": "Gestion des Salles",
                "seances": "Gestion des Séances",
                "datashows": "Gestion du Matériel",
                "emplois": "Emploi du Temps",
                "semaines": "Semaines de Réservation",
                "reservations": "Réservations",
                "reclamations": "Réclamations",
            }
            if hasattr(self, "header"):
                self.header.update_title(titles.get(view_name, ""))
