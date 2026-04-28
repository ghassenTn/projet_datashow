"""
Header bar component.
Shows page title, user name, and role badge.
"""
import tkinter as tk
from ui.theme import (
    BG_PRIMARY, BG_CARD, ACCENT, SUCCESS, TEXT_PRIMARY, TEXT_SECONDARY,
    FONT_HEADING_SM, FONT_BODY, FONT_SMALL_BOLD,
    HEADER_HEIGHT, PADDING_LG, PADDING_MD, BORDER, ICONS,
)


class Header(tk.Frame):
    """Top header bar displaying page info and user details."""

    def __init__(self, parent, title="Tableau de Bord", user_name="", role="admin"):
        super().__init__(parent, bg=BG_PRIMARY, height=HEADER_HEIGHT)
        self.pack_propagate(False)
        self._title = title
        self._user_name = user_name
        self._role = role
        self._build()

    def _build(self):
        # Left side — page title
        left = tk.Frame(self, bg=BG_PRIMARY)
        left.pack(side="left", fill="y", padx=PADDING_LG)

        self.title_label = tk.Label(
            left, text=self._title,
            font=FONT_HEADING_SM, fg=TEXT_PRIMARY, bg=BG_PRIMARY,
        )
        self.title_label.pack(side="left", pady=PADDING_MD)

        # Right side — user info
        right = tk.Frame(self, bg=BG_PRIMARY)
        right.pack(side="right", fill="y", padx=PADDING_LG)

        # Role badge
        badge_bg = ACCENT if self._role == "admin" else SUCCESS
        badge_text = "Admin" if self._role == "admin" else "Professeur"
        badge = tk.Label(
            right, text=f" {badge_text} ",
            font=FONT_SMALL_BOLD, fg=TEXT_PRIMARY, bg=badge_bg,
        )
        badge.pack(side="right", pady=PADDING_MD, padx=(PADDING_MD, 0))

        # User name
        tk.Label(
            right, text=f"{ICONS['user']} {self._user_name}",
            font=FONT_BODY, fg=TEXT_SECONDARY, bg=BG_PRIMARY,
        ).pack(side="right", pady=PADDING_MD)

        # Bottom border
        border = tk.Frame(self, bg=BORDER, height=1)
        border.pack(side="bottom", fill="x")

    def update_title(self, new_title):
        """Update the page title."""
        self._title = new_title
        if hasattr(self, 'title_label'):
            self.title_label.configure(text=new_title)
