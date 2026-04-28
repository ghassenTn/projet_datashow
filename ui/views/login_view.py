"""
Login view.
First screen the user sees. Handles authentication via the API.
"""
import tkinter as tk
from ui.theme import (
    BG_PRIMARY, BG_CARD, ACCENT, TEXT_PRIMARY, TEXT_SECONDARY, DANGER,
    FONT_HEADING_XL, FONT_BODY, FONT_SMALL, PADDING_XL, PADDING_LG, PADDING_MD,
    make_rounded_frame, create_styled_button, create_styled_entry
)


class LoginView(tk.Frame):
    """Login screen."""

    def __init__(self, parent, app):
        super().__init__(parent, bg=BG_PRIMARY)
        self.app = app
        self._build()

    def _build(self):
        # Center container
        center = tk.Frame(self, bg=BG_PRIMARY)
        center.place(relx=0.5, rely=0.5, anchor="center")

        # Logo and Title
        tk.Label(
            center, text="📽", font=("Segoe UI", 48),
            bg=BG_PRIMARY, fg=ACCENT,
        ).pack(pady=(0, PADDING_MD))

        tk.Label(
            center, text="Système de Réservation",
            font=FONT_HEADING_XL, bg=BG_PRIMARY, fg=TEXT_PRIMARY,
        ).pack()

        tk.Label(
            center, text="DataShow — IPSAS",
            font=FONT_BODY, bg=BG_PRIMARY, fg=TEXT_SECONDARY,
        ).pack(pady=(0, PADDING_XL))

        # Login Card
        card = make_rounded_frame(center, bg=BG_CARD)
        card.pack(fill="x", padx=PADDING_XL, pady=PADDING_LG)

        inner = tk.Frame(card, bg=BG_CARD)
        inner.pack(padx=PADDING_XL, pady=PADDING_XL, fill="both", expand=True)

        # Username
        tk.Label(
            inner, text="Identifiant", font=FONT_SMALL,
            bg=BG_CARD, fg=TEXT_SECONDARY, anchor="w",
        ).pack(fill="x", pady=(0, 4))
        
        self.username_entry = create_styled_entry(inner, placeholder="Entrez votre identifiant")
        self.username_entry.pack(fill="x", pady=(0, PADDING_LG))

        # Password
        tk.Label(
            inner, text="Mot de passe", font=FONT_SMALL,
            bg=BG_CARD, fg=TEXT_SECONDARY, anchor="w",
        ).pack(fill="x", pady=(0, 4))
        
        self.password_entry = create_styled_entry(inner, show="*")
        self.password_entry.pack(fill="x", pady=(0, PADDING_LG))

        # Error label
        self.error_label = tk.Label(
            inner, text="", font=FONT_SMALL,
            bg=BG_CARD, fg=DANGER,
        )
        self.error_label.pack(fill="x", pady=(0, PADDING_MD))

        # Login button
        self.login_btn = create_styled_button(
            inner, text="Se Connecter", command=self._do_login, width=20
        )
        self.login_btn.pack(fill="x", pady=(0, PADDING_MD))

        # Bind enter key
        self.password_entry.entry.bind("<Return>", lambda e: self._do_login())
        self.username_entry.entry.bind("<Return>", lambda e: self.password_entry.entry.focus_set())

    def _do_login(self):
        username = self.username_entry.entry.get().strip()
        password = self.password_entry.entry.get()

        if not username or not password or username == "Entrez votre identifiant":
            self.error_label.configure(text="Veuillez remplir tous les champs")
            return

        self.error_label.configure(text="")
        self.login_btn.configure(text="Connexion...", state="disabled")
        self.update_idletasks()

        # Call API
        success, role_or_err = self.app.api.login(username, password)

        self.login_btn.configure(text="Se Connecter", state="normal")

        if success:
            # Tell app to switch to main layout
            self.app.on_login_success()
        else:
            self.error_label.configure(text=str(role_or_err))
