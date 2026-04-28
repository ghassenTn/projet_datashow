"""
Reusable data table component based on ttk.Treeview.
Dark-themed with selection support and optional action buttons.
"""
import tkinter as tk
from tkinter import ttk
from ui.theme import (
    BG_PRIMARY, BG_CARD, TEXT_PRIMARY, TEXT_SECONDARY, ACCENT,
    FONT_BODY, FONT_SMALL_BOLD, PADDING_MD, PADDING_SM, BORDER,
)


class DataTable(tk.Frame):
    """Reusable Treeview-based data table."""

    def __init__(self, parent, columns, column_widths=None, height=15):
        """
        columns: list of (key, display_name) tuples
        column_widths: optional dict of {key: width}
        """
        super().__init__(parent, bg=BG_PRIMARY)
        self.columns = columns
        self.column_widths = column_widths or {}
        self._build(height)

    def _build(self, height):
        # Container frame with border
        container = tk.Frame(self, bg=BORDER)
        container.pack(fill="both", expand=True)

        inner = tk.Frame(container, bg=BG_CARD)
        inner.pack(fill="both", expand=True, padx=1, pady=1)

        # Column keys
        col_keys = [c[0] for c in self.columns]

        # Treeview
        self.tree = ttk.Treeview(
            inner,
            columns=col_keys,
            show="headings",
            style="Dark.Treeview",
            height=height,
            selectmode="browse",
        )

        # Configure columns
        for key, name in self.columns:
            width = self.column_widths.get(key, 150)
            self.tree.heading(key, text=name, anchor="w")
            self.tree.column(key, width=width, anchor="w", minwidth=80)

        # Scrollbar
        scrollbar = ttk.Scrollbar(
            inner, orient="vertical",
            command=self.tree.yview,
            style="Dark.Vertical.TScrollbar",
        )
        self.tree.configure(yscrollcommand=scrollbar.set)

        self.tree.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")

        # Tag for striped rows
        self.tree.tag_configure("oddrow", background="#1e2040")
        self.tree.tag_configure("evenrow", background=BG_CARD)

    def set_data(self, rows):
        """Replace all data. rows: list of dicts or list of tuples."""
        # Clear existing
        for item in self.tree.get_children():
            self.tree.delete(item)

        # Insert rows
        col_keys = [c[0] for c in self.columns]
        for i, row in enumerate(rows):
            if isinstance(row, dict):
                values = [row.get(k, "") for k in col_keys]
            else:
                values = row
            tag = "oddrow" if i % 2 == 0 else "evenrow"
            self.tree.insert("", "end", values=values, tags=(tag,))

    def get_selected(self):
        """Return the selected row's values as a dict, or None."""
        selection = self.tree.selection()
        if not selection:
            return None
        values = self.tree.item(selection[0])["values"]
        col_keys = [c[0] for c in self.columns]
        return dict(zip(col_keys, values))

    def bind_select(self, callback):
        """Bind selection event."""
        self.tree.bind("<<TreeviewSelect>>", callback)

    def bind_double_click(self, callback):
        """Bind double-click event."""
        self.tree.bind("<Double-1>", callback)
