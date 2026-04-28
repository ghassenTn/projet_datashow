"""
Theme constants and styling helpers for the DataShow Tkinter app.
Dark mode design with modern aesthetics.
"""
import tkinter as tk
from tkinter import ttk

# ==========================================
# Color Palette
# ==========================================
BG_PRIMARY = "#1a1b2e"
BG_SECONDARY = "#16172b"
BG_CARD = "#222442"
BG_INPUT = "#2a2d4a"
BG_HOVER = "#2e3155"
ACCENT = "#6c5ce7"
ACCENT_HOVER = "#7c6ff7"
ACCENT_LIGHT = "#a29bfe"
SUCCESS = "#00b894"
SUCCESS_DARK = "#00a383"
DANGER = "#e17055"
DANGER_DARK = "#c0392b"
WARNING = "#fdcb6e"
TEXT_PRIMARY = "#ffffff"
TEXT_SECONDARY = "#a0a3bd"
TEXT_MUTED = "#6c6f93"
BORDER = "#2d2f54"
BORDER_LIGHT = "#383b62"
TRANSPARENT = "#1a1b2e"

# ==========================================
# Fonts
# ==========================================
FONT_FAMILY = "Segoe UI"
FONT_FAMILY_FALLBACK = "Helvetica"

FONT_HEADING_XL = (FONT_FAMILY, 24, "bold")
FONT_HEADING = (FONT_FAMILY, 18, "bold")
FONT_HEADING_SM = (FONT_FAMILY, 14, "bold")
FONT_BODY = (FONT_FAMILY, 11)
FONT_BODY_BOLD = (FONT_FAMILY, 11, "bold")
FONT_SMALL = (FONT_FAMILY, 9)
FONT_SMALL_BOLD = (FONT_FAMILY, 9, "bold")
FONT_BUTTON = (FONT_FAMILY, 10, "bold")
FONT_NAV = (FONT_FAMILY, 11)
FONT_NAV_ACTIVE = (FONT_FAMILY, 11, "bold")

# ==========================================
# Dimensions
# ==========================================
SIDEBAR_WIDTH = 230
HEADER_HEIGHT = 60
PADDING_XL = 24
PADDING_LG = 16
PADDING_MD = 12
PADDING_SM = 8
PADDING_XS = 4
BORDER_RADIUS = 8
CARD_HEIGHT = 100

# ==========================================
# Navigation Icons (Unicode)
# ==========================================
ICONS = {
    "dashboard": "📊",
    "users": "👥",
    "rooms": "🏫",
    "sessions": "🕐",
    "datashows": "📽",
    "schedule": "📅",
    "weeks": "📆",
    "reservations": "📋",
    "complaints": "📝",
    "logout": "🚪",
    "add": "➕",
    "delete": "🗑",
    "edit": "✏️",
    "toggle": "🔄",
    "check": "✅",
    "cross": "❌",
    "open": "🟢",
    "closed": "🔴",
    "available": "🟢",
    "broken": "🔴",
    "pending": "🟡",
    "user": "👤",
    "search": "🔍",
    "refresh": "🔄",
}


def configure_styles():
    """Configure ttk styles for the entire app."""
    style = ttk.Style()
    style.theme_use("clam")

    # Treeview (data tables)
    style.configure(
        "Dark.Treeview",
        background=BG_CARD,
        foreground=TEXT_PRIMARY,
        fieldbackground=BG_CARD,
        borderwidth=0,
        font=FONT_BODY,
        rowheight=36,
    )
    style.configure(
        "Dark.Treeview.Heading",
        background=BG_SECONDARY,
        foreground=TEXT_SECONDARY,
        font=FONT_SMALL_BOLD,
        borderwidth=0,
        relief="flat",
    )
    style.map(
        "Dark.Treeview",
        background=[("selected", ACCENT)],
        foreground=[("selected", TEXT_PRIMARY)],
    )
    style.map(
        "Dark.Treeview.Heading",
        background=[("active", BG_HOVER)],
    )

    # Scrollbar
    style.configure(
        "Dark.Vertical.TScrollbar",
        background=BG_CARD,
        troughcolor=BG_PRIMARY,
        borderwidth=0,
        arrowsize=0,
    )

    # Combobox
    style.configure(
        "Dark.TCombobox",
        fieldbackground=BG_INPUT,
        background=BG_INPUT,
        foreground=TEXT_PRIMARY,
        borderwidth=0,
        arrowsize=14,
    )
    style.map(
        "Dark.TCombobox",
        fieldbackground=[("readonly", BG_INPUT)],
        selectbackground=[("readonly", ACCENT)],
    )

    return style


def make_rounded_frame(parent, bg=BG_CARD, **kwargs):
    """Create a frame that looks like a card with padding."""
    frame = tk.Frame(parent, bg=bg, **kwargs)
    frame.configure(highlightbackground=BORDER, highlightthickness=1)
    return frame


def create_styled_button(parent, text, command, variant="primary", width=None):
    """Create a styled button with hover effects."""
    colors = {
        "primary": (ACCENT, ACCENT_HOVER, TEXT_PRIMARY),
        "success": (SUCCESS, SUCCESS_DARK, TEXT_PRIMARY),
        "danger": (DANGER, DANGER_DARK, TEXT_PRIMARY),
        "ghost": (TRANSPARENT, BG_HOVER, TEXT_SECONDARY),
    }
    bg, hover_bg, fg = colors.get(variant, colors["primary"])

    btn = tk.Button(
        parent,
        text=text,
        command=command,
        bg=bg,
        fg=fg,
        font=FONT_BUTTON,
        relief="flat",
        cursor="hand2",
        activebackground=hover_bg,
        activeforeground=fg,
        bd=0,
        padx=PADDING_MD,
        pady=PADDING_SM,
    )
    if width:
        btn.configure(width=width)

    # Hover effects
    btn.bind("<Enter>", lambda e: btn.configure(bg=hover_bg))
    btn.bind("<Leave>", lambda e: btn.configure(bg=bg))

    return btn


def create_styled_entry(parent, placeholder="", show=None, width=30):
    """Create a styled entry field with placeholder support."""
    entry = tk.Entry(
        parent,
        bg=BG_INPUT,
        fg=TEXT_PRIMARY,
        insertbackground=TEXT_PRIMARY,
        font=FONT_BODY,
        relief="flat",
        bd=0,
        width=width,
    )
    if show:
        entry.configure(show=show)

    # Add internal padding via a frame wrapper
    wrapper = tk.Frame(parent, bg=BG_INPUT, highlightbackground=BORDER, highlightthickness=1)
    entry_inner = tk.Entry(
        wrapper,
        bg=BG_INPUT,
        fg=TEXT_PRIMARY,
        insertbackground=TEXT_PRIMARY,
        font=FONT_BODY,
        relief="flat",
        bd=0,
        width=width,
    )
    if show:
        entry_inner.configure(show=show)
    entry_inner.pack(padx=PADDING_SM, pady=PADDING_SM)

    # Placeholder
    if placeholder:
        entry_inner.insert(0, placeholder)
        entry_inner.configure(fg=TEXT_MUTED)

        def on_focus_in(event):
            if entry_inner.get() == placeholder:
                entry_inner.delete(0, tk.END)
                entry_inner.configure(fg=TEXT_PRIMARY)
                if show:
                    entry_inner.configure(show=show)

        def on_focus_out(event):
            if entry_inner.get() == "":
                entry_inner.insert(0, placeholder)
                entry_inner.configure(fg=TEXT_MUTED)
                if show:
                    entry_inner.configure(show="")

        entry_inner.bind("<FocusIn>", on_focus_in)
        entry_inner.bind("<FocusOut>", on_focus_out)

    # Focus highlight
    def on_wrapper_focus_in(event):
        wrapper.configure(highlightbackground=ACCENT)

    def on_wrapper_focus_out(event):
        wrapper.configure(highlightbackground=BORDER)

    entry_inner.bind("<FocusIn>", lambda e: (on_focus_in(e) if placeholder else None, on_wrapper_focus_in(e)))
    entry_inner.bind("<FocusOut>", lambda e: (on_focus_out(e) if placeholder else None, on_wrapper_focus_out(e)))

    wrapper.entry = entry_inner
    return wrapper


def create_styled_label(parent, text, font=None, fg=None, bg=None):
    """Create a styled label."""
    return tk.Label(
        parent,
        text=text,
        font=font or FONT_BODY,
        fg=fg or TEXT_PRIMARY,
        bg=bg or BG_PRIMARY,
    )
