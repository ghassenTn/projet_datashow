"""
Modal dialog component for forms.
Opens a Toplevel window with dynamically generated form fields.
"""
import tkinter as tk
from tkinter import ttk
from ui.theme import (
    BG_PRIMARY, BG_CARD, BG_INPUT, ACCENT, TEXT_PRIMARY, TEXT_SECONDARY, BORDER, TEXT_MUTED,
    FONT_HEADING_SM, FONT_BODY, FONT_BUTTON, FONT_SMALL,
    PADDING_LG, PADDING_MD, PADDING_SM,
    create_styled_button,
)


class FormDialog(tk.Toplevel):
    """Modal dialog with auto-generated form fields.
    
    fields: list of dicts with keys:
        - name: field key
        - label: display label
        - type: 'entry' | 'combo' | 'check' | 'text' | 'date'
        - options: list of options for 'combo' type
        - default: default value
    """

    def __init__(self, parent, title, fields, on_submit, width=420, height=None):
        super().__init__(parent)
        self.title(title)
        self.configure(bg=BG_PRIMARY)
        self.resizable(False, False)
        self.transient(parent)
        self.grab_set()

        # Center on screen
        self.update_idletasks()
        calc_height = height or (len(fields) * 70 + 120)
        x = parent.winfo_rootx() + (parent.winfo_width() - width) // 2
        y = parent.winfo_rooty() + (parent.winfo_height() - calc_height) // 2
        self.geometry(f"{width}x{calc_height}+{x}+{y}")

        self.fields = fields
        self.on_submit = on_submit
        self.field_vars = {}
        self.result = None
        self._build()

    def _build(self):
        # Main container
        main = tk.Frame(self, bg=BG_PRIMARY)
        main.pack(fill="both", expand=True, padx=PADDING_LG, pady=PADDING_LG)

        # Fields
        for field in self.fields:
            field_frame = tk.Frame(main, bg=BG_PRIMARY)
            field_frame.pack(fill="x", pady=PADDING_SM)

            # Label
            tk.Label(
                field_frame, text=field["label"],
                font=FONT_SMALL, fg=TEXT_SECONDARY, bg=BG_PRIMARY, anchor="w",
            ).pack(fill="x")

            field_type = field.get("type", "entry")
            default = field.get("default", "")

            if field_type == "entry" or field_type == "date":
                var = tk.StringVar(value=str(default))
                entry = tk.Entry(
                    field_frame, textvariable=var,
                    bg=BG_INPUT, fg=TEXT_PRIMARY, insertbackground=TEXT_PRIMARY,
                    font=FONT_BODY, relief="flat", bd=0,
                )
                entry_wrapper = tk.Frame(field_frame, bg=BG_INPUT, highlightbackground=BORDER, highlightthickness=1)
                entry_wrapper.pack(fill="x", pady=(2, 0))
                entry = tk.Entry(
                    entry_wrapper, textvariable=var,
                    bg=BG_INPUT, fg=TEXT_PRIMARY, insertbackground=TEXT_PRIMARY,
                    font=FONT_BODY, relief="flat", bd=0,
                )
                entry.pack(fill="x", padx=PADDING_SM, pady=PADDING_SM)
                self.field_vars[field["name"]] = var

            elif field_type == "combo":
                var = tk.StringVar(value=str(default))
                combo_wrapper = tk.Frame(field_frame, bg=BG_INPUT, highlightbackground=BORDER, highlightthickness=1)
                combo_wrapper.pack(fill="x", pady=(2, 0))
                combo = ttk.Combobox(
                    combo_wrapper, textvariable=var,
                    values=field.get("options", []),
                    state="readonly", style="Dark.TCombobox",
                    font=FONT_BODY,
                )
                combo.pack(fill="x", padx=PADDING_SM, pady=PADDING_SM)
                self.field_vars[field["name"]] = var

            elif field_type == "check":
                var = tk.BooleanVar(value=bool(default))
                check = tk.Checkbutton(
                    field_frame, variable=var,
                    bg=BG_PRIMARY, fg=TEXT_PRIMARY,
                    selectcolor=BG_INPUT, activebackground=BG_PRIMARY,
                    activeforeground=TEXT_PRIMARY, font=FONT_BODY,
                )
                check.pack(anchor="w", pady=(2, 0))
                self.field_vars[field["name"]] = var

            elif field_type == "text":
                text_wrapper = tk.Frame(field_frame, bg=BG_INPUT, highlightbackground=BORDER, highlightthickness=1)
                text_wrapper.pack(fill="x", pady=(2, 0))
                text = tk.Text(
                    text_wrapper, bg=BG_INPUT, fg=TEXT_PRIMARY,
                    insertbackground=TEXT_PRIMARY, font=FONT_BODY,
                    relief="flat", bd=0, height=3, wrap="word",
                )
                text.pack(fill="x", padx=PADDING_SM, pady=PADDING_SM)
                if default:
                    text.insert("1.0", str(default))
                self.field_vars[field["name"]] = text  # Store widget for Text

        # Buttons
        btn_frame = tk.Frame(main, bg=BG_PRIMARY)
        btn_frame.pack(fill="x", pady=(PADDING_LG, 0))

        cancel_btn = create_styled_button(btn_frame, "Annuler", self._cancel, variant="ghost")
        cancel_btn.pack(side="right", padx=(PADDING_SM, 0))

        submit_btn = create_styled_button(btn_frame, "Confirmer", self._submit, variant="primary")
        submit_btn.pack(side="right")

    def _submit(self):
        """Collect field values and call the callback."""
        result = {}
        for field in self.fields:
            name = field["name"]
            var = self.field_vars.get(name)
            if isinstance(var, tk.Text):
                result[name] = var.get("1.0", "end-1c")
            elif isinstance(var, tk.BooleanVar):
                result[name] = var.get()
            elif isinstance(var, tk.StringVar):
                result[name] = var.get()
        
        self.result = result
        self.on_submit(result)
        self.destroy()

    def _cancel(self):
        self.result = None
        self.destroy()
