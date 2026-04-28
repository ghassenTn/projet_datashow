"""
Dashboard stat card component.
Displays an icon, a large number, and a label.
"""
import tkinter as tk
from ui.theme import (
    BG_CARD, ACCENT, TEXT_PRIMARY, TEXT_SECONDARY, BORDER,
    FONT_HEADING_XL, FONT_HEADING_SM, FONT_BODY, FONT_SMALL,
    PADDING_LG, PADDING_MD,
)


class StatCard(tk.Frame):
    """Dashboard stat card with icon, value, and label."""

    def __init__(self, parent, icon, value, label, accent_color=ACCENT, width=200):
        super().__init__(parent, bg=BG_CARD, width=width, height=120)
        self.pack_propagate(False)
        self.configure(highlightbackground=BORDER, highlightthickness=1)

        # Accent bar on left
        accent_bar = tk.Frame(self, bg=accent_color, width=4)
        accent_bar.pack(side="left", fill="y")

        # Content
        content = tk.Frame(self, bg=BG_CARD)
        content.pack(fill="both", expand=True, padx=PADDING_MD, pady=PADDING_MD)

        # Top row: icon
        tk.Label(
            content, text=icon, font=("Segoe UI", 20),
            bg=BG_CARD, fg=accent_color,
        ).pack(anchor="w")

        # Value
        tk.Label(
            content, text=str(value), font=FONT_HEADING_SM,
            bg=BG_CARD, fg=TEXT_PRIMARY,
        ).pack(anchor="w")

        # Label
        tk.Label(
            content, text=label, font=FONT_SMALL,
            bg=BG_CARD, fg=TEXT_SECONDARY,
        ).pack(anchor="w")
