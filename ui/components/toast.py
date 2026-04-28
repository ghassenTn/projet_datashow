"""
Toast notification component.
Shows a temporary message that slides in and fades out.
"""
import tkinter as tk
from ui.theme import (
    ACCENT, SUCCESS, DANGER, WARNING, TEXT_PRIMARY,
    FONT_BODY, PADDING_MD, PADDING_SM,
)


class Toast:
    """Toast notification manager. Call show() to display a toast."""

    def __init__(self, parent):
        self.parent = parent
        self._current = None

    def show(self, message, variant="success", duration=3000):
        """Show a toast notification.
        variant: 'success' | 'error' | 'warning' | 'info'
        """
        # Remove existing toast
        if self._current:
            try:
                self._current.destroy()
            except:
                pass

        colors = {
            "success": SUCCESS,
            "error": DANGER,
            "warning": WARNING,
            "info": ACCENT,
        }
        bg = colors.get(variant, ACCENT)
        icons = {
            "success": "✅",
            "error": "❌",
            "warning": "⚠️",
            "info": "ℹ️",
        }
        icon = icons.get(variant, "ℹ️")

        toast = tk.Frame(self.parent, bg=bg)
        toast.place(relx=1.0, rely=1.0, anchor="se", x=-20, y=-20)

        label = tk.Label(
            toast, text=f"  {icon}  {message}  ",
            font=FONT_BODY, fg=TEXT_PRIMARY, bg=bg,
            padx=PADDING_MD, pady=PADDING_SM,
        )
        label.pack()

        self._current = toast

        # Auto-remove after duration
        self.parent.after(duration, lambda: self._dismiss(toast))

    def _dismiss(self, toast):
        try:
            toast.destroy()
            if self._current == toast:
                self._current = None
        except:
            pass
