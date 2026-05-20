/**
 * @fileoverview Production-Grade Form Component System — v2
 *
 * Fully upgraded: bugs fixed, new components, typing indicator,
 * aggressive design, modular — each component is self-contained.
 *
 * Components:
 *  - FormFieldMessage     — shared helper/error message renderer
 *  - TextField            — text input with typing indicator
 *  - EmailField           — email input with live validation feedback
 *  - PhoneField           — phone input with country-code prefix
 *  - PasswordField        — password with show/hide toggle
 *  - TextArea             — resizable textarea + word count + char count
 *  - NumberField          — numeric input with +/- spinner buttons
 *  - SelectField          — native select with custom chevron + suggestions
 *  - SearchableSelect     — searchable custom dropdown (z-index fixed)
 *  - DateField            — native date input
 *  - TimeField            — native time input
 *  - CalendarField        — custom calendar picker
 *  - RadioGroup           — group of radio options (horizontal/vertical)
 *  - CheckboxGroup        — group of checkboxes (horizontal/vertical)
 *  - SwitchField          — toggle switch (switchPosition: left | right)
 *  - TagsField            — comma/enter separated tag badge input
 *  - UrlField             — URL input with live favicon/link preview
 *  - ImagePickerField     — drag-drop image picker, single/multi preview
 *  - VideoPickerField     — drag-drop video picker with real video player
 *  - FilePickerField      — drag-drop generic file picker with file list
 *  - SearchField          — search input with live result popup, keyboard nav, inner result search
 *
 * @module FormComponents
 */

import React, {
    useState,
    useRef,
    useId,
    useCallback,
    useEffect,
    useMemo,
} from "react";

/* ═══════════════════════════════════════════════════════════════════════════════
   ICONS — inline SVG, zero dependencies
═══════════════════════════════════════════════════════════════════════════════ */

const Icon = {
    Eye: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    ),
    EyeOff: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
            <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
    ),
    ChevronDown: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
        </svg>
    ),
    ChevronLeft: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
        </svg>
    ),
    ChevronRight: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
        </svg>
    ),
    Check: () => (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    ),
    X: () => (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    ),
    Info: () => (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
    ),
    AlertCircle: () => (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
    ),
    Calendar: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
        </svg>
    ),
    Clock: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
    ),
    Link: () => (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
    ),
    Upload: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
        </svg>
    ),
    Image: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
        </svg>
    ),
    Video: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
    ),
    File: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" />
        </svg>
    ),
    Search: () => (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    ),
    ExternalLink: () => (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
        </svg>
    ),
    Plus: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    ),
    Minus: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    ),
    /* New in v2 */
    Mail: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
        </svg>
    ),
    Phone: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.61 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.63a16 16 0 0 0 6.16 6.16l.95-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
    ),
    Refresh: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
        </svg>
    ),
    PlayCircle: () => (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
        </svg>
    ),
    Camera: () => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
        </svg>
    ),
    Palette: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="13.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            <circle cx="17.5" cy="10.5" r="1" fill="currentColor" stroke="none" />
            <circle cx="8.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
            <circle cx="6.5" cy="12.5" r="1" fill="currentColor" stroke="none" />
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
        </svg>
    ),
    Braces: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1" />
            <path d="M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1" />
        </svg>
    ),
    Sparkle: () => (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l1.5 6.5L20 12l-6.5 1.5L12 21l-1.5-6.5L4 12l6.5-1.5z" fill="currentColor" stroke="none" opacity="0.85" />
        </svg>
    ),
};

/* ═══════════════════════════════════════════════════════════════════════════════
   SHARED: FormFieldMessage
═══════════════════════════════════════════════════════════════════════════════ */

/**
 * Renders helper text or an error message below a form field.
 * If `errors` array is provided, delegates to FormFieldErrors.
 *
 * @param {Object}   props
 * @param {boolean}  props.hasError
 * @param {string}   [props.helperText]
 * @param {string}   [props.error]
 * @param {Array}    [props.errors]     - [{file?, message, code?}] structured errors
 * @param {boolean}  [props.showError=true]
 */
export function FormFieldMessage({ hasError, helperText, error, errors, showError = true }) {
    if (showError && errors?.length > 0) {
        return <FormFieldErrors errors={errors} />;
    }
    if (hasError && error) {
        return (
            <div className="ff-message ff-message--error" role="alert" aria-live="polite">
                <span className="ff-message-icon"><Icon.AlertCircle /></span>
                {error}
            </div>
        );
    }
    if (helperText) {
        return (
            <div className="ff-message ff-message--helper">
                <span className="ff-message-icon"><Icon.Info /></span>
                {helperText}
            </div>
        );
    }
    return null;
}

/**
 * FormFieldErrors — Renders a structured list of field errors.
 * Supports both file-level errors (with filename) and field-level errors.
 *
 * @param {Object}   props
 * @param {Array}    props.errors   - [{file?: string, message: string, code?: string}]
 * @param {boolean}  [props.showError=true]
 *
 * @example
 * <FormFieldErrors errors={[
 *   { file: "photo.jpg", message: "File exceeds the 2 MB size limit.", code: "FILE_TOO_LARGE" },
 *   { message: "Atomic upload rejected: 1 error(s) found.", code: "ATOMIC_BATCH_REJECTED" }
 * ]} />
 */
export function FormFieldErrors({ errors = [], showError = true }) {
    if (!showError || !errors?.length) return null;
    return (
        <div className="ff-field-errors" role="alert" aria-live="polite">
            {errors.map((e, i) => (
                <div key={`${e.code ?? 'err'}-${i}`} className="ff-field-errors-row">
                    <span className="ff-field-errors-x" aria-hidden="true">×</span>
                    <span className="ff-field-errors-text">
                        {e.file ? (
                            <>
                                <span className="ff-field-errors-filename">{e.file}</span>
                                <span className="ff-field-errors-dash"> — </span>
                            </>
                        ) : null}
                        {e.message}
                    </span>
                </div>
            ))}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SHARED: FieldCard
   Optional card wrapper for any field or group of fields.
   Provides the aggressive card treatment (gold glow, accent bar, depth hierarchy).

   @param {Object}  props
   @param {string}  [props.title]       - Optional section heading (uppercase)
   @param {string}  [props.description] - Optional muted sub-heading below title
   @param {string}  [props.className]
   @param {React.ReactNode} props.children

   @example — single field with card:
   <FieldCard>
     <TextField label="Full Name" value={name} setValue={setName} />
   </FieldCard>

   @example — form section with title:
   <FieldCard title="Personal Information" description="Used for your public profile">
     <TextField label="Display Name" value={name} setValue={setName} />
     <EmailField label="Email" value={email} setValue={setEmail} />
     <PhoneField label="Phone" value={phone} setValue={setPhone} />
   </FieldCard>
 */
export function FieldCard({ title, description, children, className = "" }) {
    return (
        <div className={`ff-card ${className}`}>
            {title && (
                <div className="ff-card-header">
                    <p className="ff-card-title">{title}</p>
                    {description && <p className="ff-card-desc">{description}</p>}
                </div>
            )}
            {children}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SHARED: FieldLabel
═══════════════════════════════════════════════════════════════════════════════ */

function FieldLabel({ htmlFor, label, required, info, className = "" }) {
    if (!label) return null;
    if (info) {
        return (
            <div className="ff-label-row">
                <label htmlFor={htmlFor} className={`ff-label ${className}`}>
                    {label}
                    {required && <span className="ff-required" aria-hidden="true">*</span>}
                </label>
                <span className="ff-label-meta">{info}</span>
            </div>
        );
    }
    return (
        <label htmlFor={htmlFor} className={`ff-label ${className}`}>
            {label}
            {required && <span className="ff-required" aria-hidden="true">*</span>}
        </label>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SHARED: SuggestionChips
═══════════════════════════════════════════════════════════════════════════════ */

function SuggestionChips({ suggestions = [], onSelect, wrapClass = "ff-select-suggestions", chipClass = "ff-select-suggestion" }) {
    if (!suggestions.length) return null;
    return (
        <div className={wrapClass}>
            {suggestions.map((s) => (
                <button
                    key={typeof s === "object" ? s.value : s}
                    type="button"
                    className={chipClass}
                    onClick={() => onSelect(typeof s === "object" ? s.value : s)}
                >
                    {typeof s === "object" ? s.label : s}
                </button>
            ))}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SHARED: useClickOutside
═══════════════════════════════════════════════════════════════════════════════ */

function useClickOutside(ref, handler) {
    useEffect(() => {
        const listener = (e) => {
            if (!ref.current || ref.current.contains(e.target)) return;
            handler(e);
        };
        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);
        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, [ref, handler]);
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SHARED: formatFileSize
═══════════════════════════════════════════════════════════════════════════════ */

function formatFileSize(bytes) {
    if (!bytes) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SHARED: getFileType
   — Returns visual info (color, bg, label) based on file extension.
   — Used by FilePickerField single preview to render a colored type badge.
═══════════════════════════════════════════════════════════════════════════════ */

function getFileType(filename) {
    const ext = (filename?.split(".").pop() || "").toLowerCase();
    const map = {
        // Documents
        pdf: { color: "#f87171", bg: "rgba(248,113,113,0.22)", label: "PDF" },
        doc: { color: "#60a5fa", bg: "rgba(96,165,250,0.22)", label: "DOC" },
        docx: { color: "#60a5fa", bg: "rgba(96,165,250,0.22)", label: "DOCX" },
        odt: { color: "#60a5fa", bg: "rgba(96,165,250,0.22)", label: "ODT" },
        // Spreadsheets
        xls: { color: "#4ade80", bg: "rgba(74,222,128,0.22)", label: "XLS" },
        xlsx: { color: "#4ade80", bg: "rgba(74,222,128,0.22)", label: "XLSX" },
        csv: { color: "#4ade80", bg: "rgba(74,222,128,0.22)", label: "CSV" },
        // Presentations
        ppt: { color: "#fb923c", bg: "rgba(251,146,60,0.22)", label: "PPT" },
        pptx: { color: "#fb923c", bg: "rgba(251,146,60,0.22)", label: "PPTX" },
        // Archives
        zip: { color: "#fbbf24", bg: "rgba(251,191,36,0.22)", label: "ZIP" },
        rar: { color: "#fbbf24", bg: "rgba(251,191,36,0.22)", label: "RAR" },
        "7z": { color: "#fbbf24", bg: "rgba(251,191,36,0.22)", label: "7Z" },
        tar: { color: "#fbbf24", bg: "rgba(251,191,36,0.22)", label: "TAR" },
        // Code
        js: { color: "#fbbf24", bg: "rgba(251,191,36,0.22)", label: "JS" },
        ts: { color: "#60a5fa", bg: "rgba(96,165,250,0.22)", label: "TS" },
        jsx: { color: "#60a5fa", bg: "rgba(96,165,250,0.22)", label: "JSX" },
        tsx: { color: "#60a5fa", bg: "rgba(96,165,250,0.22)", label: "TSX" },
        py: { color: "#4ade80", bg: "rgba(74,222,128,0.22)", label: "PY" },
        json: { color: "#a78bfa", bg: "rgba(167,139,250,0.22)", label: "JSON" },
        // Text / Other
        txt: { color: "#94a3b8", bg: "rgba(148,163,184,0.22)", label: "TXT" },
        md: { color: "#94a3b8", bg: "rgba(148,163,184,0.22)", label: "MD" },
        html: { color: "#fb923c", bg: "rgba(251,146,60,0.22)", label: "HTML" },
        css: { color: "#60a5fa", bg: "rgba(96,165,250,0.22)", label: "CSS" },
        sql: { color: "#a78bfa", bg: "rgba(167,139,250,0.22)", label: "SQL" },
    };
    return (
        map[ext] || {
            color: "#d4a843",
            bg: "rgba(212,168,67,0.22)",
            label: ext.toUpperCase().slice(0, 5) || "FILE",
        }
    );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SHARED: useTypingIndicator
   — Returns { isTyping, triggerTyping }
   — Call triggerTyping() inside any onChange handler to show the animated bar
═══════════════════════════════════════════════════════════════════════════════ */

function useTypingIndicator(delay = 1200) {
    const [isTyping, setIsTyping] = useState(false);
    const timerRef = useRef(null);

    const triggerTyping = useCallback(() => {
        setIsTyping(true);
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setIsTyping(false), delay);
    }, [delay]);

    // Cleanup timer on unmount
    useEffect(() => () => clearTimeout(timerRef.current), []);

    return { isTyping, triggerTyping };
}

/* ═══════════════════════════════════════════════════════════════════════════════
   1. TextField
═══════════════════════════════════════════════════════════════════════════════ */

/**
 * TextField — General purpose text input with typing indicator animation.
 *
 * @param {Object}   props
 * @param {string}   [props.label]            - Field label
 * @param {string}   [props.value]            - Controlled value
 * @param {Function} [props.onChange]         - (value, event) => void
 * @param {Function} [props.setValue]         - Direct setter shorthand
 * @param {string}   [props.placeholder]      - Placeholder text
 * @param {string}   [props.type="text"]      - Input type: text | search
 * @param {string}   [props.name]             - Native name attribute
 * @param {string}   [props.id]              - Native id (auto-generated if omitted)
 * @param {boolean}  [props.required]
 * @param {boolean}  [props.disabled]
 * @param {boolean}  [props.readOnly]
 * @param {number}   [props.maxLength]
 * @param {boolean}  [props.autoFocus]
 * @param {string}   [props.helperText]
 * @param {string}   [props.error]
 * @param {boolean}  [props.showError=true]
 * @param {React.ReactNode} [props.leftIcon]
 * @param {React.ReactNode} [props.rightIcon]
 * @param {string}   [props.className]
 * @param {string}   [props.inputClassName]
 *
 * @example
 * <TextField
 *   label="Full Name"
 *   value={name}
 *   setValue={setName}
 *   placeholder="John Doe"
 *   required
 *   error={errors.name}
 *   helperText="As it appears on your ID"
 * />
 */
export function TextField({
    label = "",
    value = "",
    onChange,
    setValue,
    placeholder = "",
    type = "text",
    name = "",
    id,
    required = false,
    disabled = false,
    readOnly = false,
    maxLength,
    autoFocus = false,
    helperText = "",
    error = "",
    showError = true,
    leftIcon,
    rightIcon,
    onBlur,
    onFocus,
    onKeyDown,
    errors = [],
    info = "",
    className = "",
    inputClassName = "",
}) {
    const uid = useId();
    const inputId = id || `ff-text-${uid}`;
    const hasError = showError && (Boolean(error) || Boolean(errors?.length));
    const { isTyping, triggerTyping } = useTypingIndicator();

    const handleChange = useCallback((e) => {
        const v = e.target.value;
        setValue?.(v);
        onChange?.(v, e);
        triggerTyping();
    }, [setValue, onChange, triggerTyping]);

    return (
        <div className={`ff ${className}`}>
            <FieldLabel htmlFor={inputId} label={label} required={required} info={info} />
            <div className="ff-input-wrap">
                {leftIcon && <span className="ff-icon ff-icon--left">{leftIcon}</span>}
                <input
                    id={inputId}
                    type={type}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    readOnly={readOnly}
                    required={required}
                    maxLength={maxLength}
                    autoFocus={autoFocus}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    onKeyDown={onKeyDown}
                    aria-invalid={hasError}
                    aria-required={required}
                    aria-disabled={disabled}
                    className={`ff-input
                        ${hasError ? "ff-input--error" : ""}
                        ${leftIcon ? "ff-input--has-left" : ""}
                        ${rightIcon ? "ff-input--has-right" : ""}
                        ${inputClassName}
                    `}
                />
                {rightIcon && <span className="ff-icon ff-icon--right">{rightIcon}</span>}
                {/* Animated typing indicator bar */}
                <div className={`ff-typing-bar${isTyping ? " ff-typing-bar--active" : ""}`} aria-hidden="true" />
            </div>
            <FormFieldMessage hasError={hasError} helperText={helperText} error={error} errors={errors} />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   2. EmailField — NEW in v2
═══════════════════════════════════════════════════════════════════════════════ */

/**
 * EmailField — Email input with live format validation indicator.
 *
 * Shows a check icon when the email format is valid.
 * Independent component — does not depend on TextField.
 *
 * @param {Object}   props
 * @param {string}   [props.label]
 * @param {string}   [props.value]
 * @param {Function} [props.onChange]    - (value, event) => void
 * @param {Function} [props.setValue]
 * @param {string}   [props.placeholder]
 * @param {string}   [props.name]
 * @param {string}   [props.id]
 * @param {boolean}  [props.required]
 * @param {boolean}  [props.disabled]
 * @param {boolean}  [props.readOnly]
 * @param {boolean}  [props.autoFocus]
 * @param {string}   [props.helperText]
 * @param {string}   [props.error]
 * @param {boolean}  [props.showError=true]
 * @param {string}   [props.className]
 *
 * @example
 * <EmailField
 *   label="Email Address"
 *   value={email}
 *   setValue={setEmail}
 *   placeholder="you@example.com"
 *   required
 *   error={errors.email}
 *   helperText="We'll never share your email."
 * />
 */
export function EmailField({
    label = "Email Address",
    value = "",
    onChange,
    setValue,
    placeholder = "you@example.com",
    name = "",
    id,
    required = false,
    disabled = false,
    readOnly = false,
    autoFocus = false,
    helperText = "",
    error = "",
    showError = true,
    onBlur,
    onFocus,
    onKeyDown,
    errors = [],
    info = "",
    className = "",
}) {
    const uid = useId();
    const inputId = id || `ff-email-${uid}`;
    const hasError = showError && (Boolean(error) || Boolean(errors?.length));
    const { isTyping, triggerTyping } = useTypingIndicator();

    // Simple RFC-friendly email regex check
    const isValidEmail = useMemo(() => {
        if (!value) return false;
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
    }, [value]);

    const handleChange = useCallback((e) => {
        const v = e.target.value;
        setValue?.(v);
        onChange?.(v, e);
        triggerTyping();
    }, [setValue, onChange, triggerTyping]);

    return (
        <div className={`ff ${className}`}>
            <FieldLabel htmlFor={inputId} label={label} required={required} info={info} />
            <div className="ff-input-wrap">
                {/* Mail icon always on left */}
                <span className="ff-icon ff-icon--left">
                    <Icon.Mail />
                </span>
                <input
                    id={inputId}
                    type="email"
                    name={name}
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    readOnly={readOnly}
                    required={required}
                    autoFocus={autoFocus}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    onKeyDown={onKeyDown}
                    aria-invalid={hasError}
                    aria-required={required}
                    className={`ff-input ff-input--has-left
                        ${isValidEmail && value ? "ff-input--has-right" : ""}
                        ${hasError ? "ff-input--error" : ""}
                    `}
                />
                {/* Checkmark appears when email format is valid */}
                {isValidEmail && value && !hasError && (
                    <span className="ff-icon ff-icon--right ff-email-valid-icon" aria-label="Valid email format">
                        <Icon.Check />
                    </span>
                )}
                <div className={`ff-typing-bar${isTyping ? " ff-typing-bar--active" : ""}`} aria-hidden="true" />
            </div>
            <FormFieldMessage hasError={hasError} helperText={helperText} error={error} errors={errors} />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   3. PhoneField — NEW in v2
═══════════════════════════════════════════════════════════════════════════════ */

/**
 * PhoneField — Phone number input with editable country-code prefix.
 *
 * Value is stored as a full string: "+880 1712345678"
 * Country code and number are edited separately then combined.
 *
 * @param {Object}   props
 * @param {string}   [props.label]
 * @param {string}   [props.value]              - Full phone value e.g. "+880 1712345678"
 * @param {Function} [props.onChange]           - (value, event) => void
 * @param {Function} [props.setValue]
 * @param {string}   [props.placeholder]        - Number placeholder
 * @param {string}   [props.defaultCountryCode] - Default country code, e.g. "+880"
 * @param {string}   [props.name]
 * @param {string}   [props.id]
 * @param {boolean}  [props.required]
 * @param {boolean}  [props.disabled]
 * @param {boolean}  [props.readOnly]
 * @param {string}   [props.helperText]
 * @param {string}   [props.error]
 * @param {boolean}  [props.showError=true]
 * @param {string}   [props.className]
 *
 * @example
 * <PhoneField
 *   label="Phone Number"
 *   value={phone}
 *   setValue={setPhone}
 *   defaultCountryCode="+880"
 *   placeholder="1712 345 678"
 *   required
 *   error={errors.phone}
 *   helperText="Include your area code"
 * />
 */
export function PhoneField({
    label = "Phone Number",
    value = "",
    onChange,
    setValue,
    placeholder = "Enter number",
    defaultCountryCode = "+880",
    name = "",
    id,
    required = false,
    disabled = false,
    readOnly = false,
    helperText = "",
    error = "",
    showError = true,
    onBlur,
    onFocus,
    errors = [],
    info = "",
    className = "",
}) {
    const uid = useId();
    const inputId = id || `ff-phone-${uid}`;
    const hasError = showError && (Boolean(error) || Boolean(errors?.length));
    const { isTyping, triggerTyping } = useTypingIndicator();

    // Parse stored value into { code, number }
    const parseValue = useCallback((v) => {
        if (!v) return { code: defaultCountryCode, number: "" };
        const match = v.match(/^(\+\d{1,4})\s?(.*)$/);
        if (match) return { code: match[1], number: match[2] };
        return { code: defaultCountryCode, number: v };
    }, [defaultCountryCode]);

    const parsed = useMemo(() => parseValue(value), [value, parseValue]);
    const [internalCode, setInternalCode] = useState(parsed.code);

    // Number string only — derived from value
    const numberPart = useMemo(() => {
        const p = parseValue(value);
        return p.number;
    }, [value, parseValue]);

    const handleCodeChange = useCallback((e) => {
        let code = e.target.value;
        // Ensure it starts with +
        if (code && !code.startsWith("+")) {
            code = "+" + code.replace(/\+/g, "");
        }
        setInternalCode(code);
        const full = numberPart ? `${code} ${numberPart}` : code;
        setValue?.(full);
        onChange?.(full, e);
    }, [numberPart, setValue, onChange]);

    const handleNumberChange = useCallback((e) => {
        // Only allow digits, spaces, hyphens, parentheses
        const num = e.target.value.replace(/[^\d\s\-\(\)]/g, "");
        const full = num ? `${internalCode} ${num}` : internalCode;
        setValue?.(full);
        onChange?.(full, e);
        triggerTyping();
    }, [internalCode, setValue, onChange, triggerTyping]);

    return (
        <div className={`ff ${className}`}>
            <FieldLabel htmlFor={inputId} label={label} required={required} info={info} />
            <div className={`ff-phone-wrap ${hasError ? "ff-phone-wrap--error" : ""}`}>
                {/* Phone icon */}
                <span className="ff-phone-icon" aria-hidden="true">
                    <Icon.Phone />
                </span>
                {/* Country code input */}
                <input
                    type="text"
                    className="ff-phone-code"
                    value={internalCode}
                    onChange={handleCodeChange}
                    disabled={disabled}
                    readOnly={readOnly}
                    maxLength={5}
                    aria-label="Country code"
                    tabIndex={0}
                />
                {/* Visual divider */}
                <span className="ff-phone-divider" aria-hidden="true" />
                {/* Phone number input */}
                <input
                    id={inputId}
                    type="tel"
                    name={name}
                    className="ff-phone-number"
                    value={numberPart}
                    onChange={handleNumberChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    readOnly={readOnly}
                    required={required}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    aria-invalid={hasError}
                    aria-required={required}
                />
                {/* Typing indicator spans full width of the wrap */}
                <div className={`ff-typing-bar ff-typing-bar--phone${isTyping ? " ff-typing-bar--active" : ""}`} aria-hidden="true" />
            </div>
            <FormFieldMessage hasError={hasError} helperText={helperText} error={error} errors={errors} />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   4. PasswordField
═══════════════════════════════════════════════════════════════════════════════ */

/**
 * PasswordField — Password input with show/hide toggle + typing indicator.
 *
 * @param {Object}   props
 * @param {string}   [props.label]
 * @param {string}   [props.value]
 * @param {Function} [props.onChange]     - (value, event) => void
 * @param {Function} [props.setValue]
 * @param {string}   [props.placeholder]
 * @param {string}   [props.name]
 * @param {string}   [props.id]
 * @param {boolean}  [props.required]
 * @param {boolean}  [props.disabled]
 * @param {number}   [props.maxLength]
 * @param {boolean}  [props.autoFocus]
 * @param {string}   [props.helperText]
 * @param {string}   [props.error]
 * @param {boolean}  [props.showError=true]
 * @param {string}   [props.className]
 *
 * @example
 * <PasswordField
 *   label="Password"
 *   value={password}
 *   setValue={setPassword}
 *   error={errors.password}
 *   helperText="Min 8 characters, include a number"
 * />
 */
export function PasswordField({
    label = "Password",
    value = "",
    onChange,
    setValue,
    placeholder = "Enter password",
    name = "",
    id,
    required = false,
    disabled = false,
    maxLength,
    autoFocus = false,
    helperText = "",
    error = "",
    showError = true,
    onBlur,
    onFocus,
    onKeyDown,
    errors = [],
    info = "",
    className = "",
    inputClassName = "",
}) {
    const [show, setShow] = useState(false);
    const uid = useId();
    const inputId = id || `ff-pwd-${uid}`;
    const hasError = showError && (Boolean(error) || Boolean(errors?.length));
    const { isTyping, triggerTyping } = useTypingIndicator();

    const handleChange = useCallback((e) => {
        const v = e.target.value;
        setValue?.(v);
        onChange?.(v, e);
        triggerTyping();
    }, [setValue, onChange, triggerTyping]);

    return (
        <div className={`ff ${className}`}>
            <FieldLabel htmlFor={inputId} label={label} required={required} info={info} />
            <div className="ff-input-wrap">
                <input
                    id={inputId}
                    type={show ? "text" : "password"}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    maxLength={maxLength}
                    autoFocus={autoFocus}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    onKeyDown={onKeyDown}
                    aria-invalid={hasError}
                    aria-required={required}
                    className={`ff-input ff-input--has-right
                        ${hasError ? "ff-input--error" : ""}
                        ${inputClassName}
                    `}
                />
                <button
                    type="button"
                    className="ff-password-toggle"
                    onClick={() => setShow((s) => !s)}
                    aria-label={show ? "Hide password" : "Show password"}
                    tabIndex={-1}
                >
                    {show ? <Icon.EyeOff /> : <Icon.Eye />}
                </button>
                <div className={`ff-typing-bar${isTyping ? " ff-typing-bar--active" : ""}`} aria-hidden="true" />
            </div>
            <FormFieldMessage hasError={hasError} helperText={helperText} error={error} errors={errors} />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   5. TextArea
═══════════════════════════════════════════════════════════════════════════════ */

/**
 * TextArea — Resizable textarea with word count, char count, typing indicator.
 *
 * @param {Object}   props
 * @param {string}   [props.label]
 * @param {string}   [props.value]
 * @param {Function} [props.onChange]     - (value, event) => void
 * @param {Function} [props.setValue]
 * @param {string}   [props.placeholder]
 * @param {number}   [props.rows=5]
 * @param {number}   [props.maxLength]    - Shows char counter when set
 * @param {number}   [props.minLength]
 * @param {boolean}  [props.required]
 * @param {boolean}  [props.disabled]
 * @param {boolean}  [props.readOnly]
 * @param {boolean}  [props.autoFocus]
 * @param {string}   [props.helperText]
 * @param {string}   [props.error]
 * @param {boolean}  [props.showError=true]
 * @param {string}   [props.className]
 *
 * @example
 * <TextArea
 *   label="Bio"
 *   value={bio}
 *   setValue={setBio}
 *   rows={4}
 *   maxLength={500}
 *   placeholder="Tell us about yourself..."
 *   error={errors.bio}
 *   helperText="Keep it concise and friendly."
 * />
 */
export function TextArea({
    label = "",
    value = "",
    onChange,
    setValue,
    placeholder = "",
    rows = 5,
    maxLength,
    minLength,
    name = "",
    id,
    required = false,
    disabled = false,
    readOnly = false,
    autoFocus = false,
    helperText = "",
    error = "",
    showError = true,
    onBlur,
    onFocus,
    onKeyDown,
    errors = [],
    info = "",
    className = "",
    inputClassName = "",
}) {
    const uid = useId();
    const inputId = id || `ff-ta-${uid}`;
    const hasError = showError && (Boolean(error) || Boolean(errors?.length));
    const { isTyping, triggerTyping } = useTypingIndicator();

    const charCount = value.length;
    const nearLimit = maxLength && charCount >= maxLength * 0.85;
    const overLimit = maxLength && charCount > maxLength;

    // Word count: count non-empty word groups
    const wordCount = useMemo(() => {
        const trimmed = value.trim();
        if (!trimmed) return 0;
        return trimmed.split(/\s+/).length;
    }, [value]);

    // Reading time: ~200 words per minute
    const readingTime = useMemo(() => {
        if (wordCount < 1) return null;
        const mins = wordCount / 200;
        if (mins < 1) return `< 1 min read`;
        return `${Math.ceil(mins)} min read`;
    }, [wordCount]);

    const handleChange = useCallback((e) => {
        const v = e.target.value;
        setValue?.(v);
        onChange?.(v, e);
        triggerTyping();
    }, [setValue, onChange, triggerTyping]);

    return (
        <div className={`ff ${className}`}>
            <FieldLabel htmlFor={inputId} label={label} required={required} info={info} />
            {/* Wrapper needed for typing indicator positioning */}
            <div className="ff-textarea-wrap">
                <textarea
                    id={inputId}
                    name={name}
                    value={value}
                    rows={rows}
                    onChange={handleChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    readOnly={readOnly}
                    required={required}
                    maxLength={maxLength}
                    minLength={minLength}
                    autoFocus={autoFocus}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    onKeyDown={onKeyDown}
                    aria-invalid={hasError}
                    aria-required={required}
                    className={`ff-textarea
                        ${hasError ? "ff-textarea--error" : ""}
                        ${inputClassName}
                    `}
                    style={{ minHeight: `${rows * 1.65 + 2}rem`, borderRadius: "var(--form-radius-md) var(--form-radius-md) 0 0" }}
                />
                <div className={`ff-typing-bar ff-typing-bar--textarea${isTyping ? " ff-typing-bar--active" : ""}`} aria-hidden="true" />
            </div>
            {/* Footer bar: word count + reading time (left) + char count (right) */}
            <div className="ff-textarea-footer">
                <div className="ff-textarea-footer-left">
                    <span className="ff-word-count">
                        {wordCount} {wordCount === 1 ? "word" : "words"}
                    </span>
                    {readingTime && (
                        <>
                            <span className="ff-textarea-footer-dot" aria-hidden="true">·</span>
                            <span className="ff-reading-time">{readingTime}</span>
                        </>
                    )}
                </div>
                {maxLength && (
                    <span className={`ff-char-count
                        ${overLimit ? "ff-char-count--over" : ""}
                        ${nearLimit && !overLimit ? "ff-char-count--near" : ""}
                    `}>
                        {charCount} / {maxLength}
                    </span>
                )}
            </div>
            <FormFieldMessage hasError={hasError} helperText={helperText} error={error} errors={errors} />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   6. NumberField
═══════════════════════════════════════════════════════════════════════════════ */

/**
 * NumberField — Numeric input with +/- spinner buttons.
 *
 * @param {Object}   props
 * @param {string}   [props.label]
 * @param {number|string} [props.value]
 * @param {Function} [props.onChange]    - (value: number, event) => void
 * @param {Function} [props.setValue]
 * @param {number}   [props.min]
 * @param {number}   [props.max]
 * @param {number}   [props.step=1]
 * @param {string}   [props.placeholder]
 * @param {boolean}  [props.required]
 * @param {boolean}  [props.disabled]
 * @param {string}   [props.helperText]
 * @param {string}   [props.error]
 *
 * @example
 * <NumberField
 *   label="Quantity"
 *   value={qty}
 *   setValue={setQty}
 *   min={1}
 *   max={99}
 *   step={1}
 *   error={errors.qty}
 *   helperText="Maximum 99 items"
 * />
 */
export function NumberField({
    label = "",
    value = "",
    onChange,
    setValue,
    min,
    max,
    step = 1,
    placeholder = "0",
    name = "",
    id,
    required = false,
    disabled = false,
    helperText = "",
    error = "",
    showError = true,
    onBlur,
    onFocus,
    errors = [],
    info = "",
    className = "",
}) {
    const uid = useId();
    const inputId = id || `ff-num-${uid}`;
    const hasError = showError && (Boolean(error) || Boolean(errors?.length));

    const handleChange = useCallback((e) => {
        const v = e.target.value === "" ? "" : Number(e.target.value);
        setValue?.(v);
        onChange?.(v, e);
    }, [setValue, onChange]);

    const increment = useCallback(() => {
        const next = (Number(value) || 0) + step;
        const clamped = max !== undefined ? Math.min(next, max) : next;
        setValue?.(clamped);
        onChange?.(clamped);
    }, [value, step, max, setValue, onChange]);

    const decrement = useCallback(() => {
        const next = (Number(value) || 0) - step;
        const clamped = min !== undefined ? Math.max(next, min) : next;
        setValue?.(clamped);
        onChange?.(clamped);
    }, [value, step, min, setValue, onChange]);

    const atMin = min !== undefined && Number(value) <= min;
    const atMax = max !== undefined && Number(value) >= max;

    return (
        <div className={`ff ${className}`}>
            <FieldLabel htmlFor={inputId} label={label} required={required} info={info} />
            <div className={`ff-number-wrap ${hasError ? "ff-number-wrap--error" : ""}`}>
                <button
                    type="button"
                    className="ff-number-btn ff-number-btn--dec"
                    onClick={decrement}
                    disabled={disabled || atMin}
                    aria-label="Decrease"
                >
                    <Icon.Minus />
                </button>
                <input
                    id={inputId}
                    type="number"
                    name={name}
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    min={min}
                    max={max}
                    step={step}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    aria-invalid={hasError}
                    className="ff-input ff-number-input"
                />
                <button
                    type="button"
                    className="ff-number-btn ff-number-btn--inc"
                    onClick={increment}
                    disabled={disabled || atMax}
                    aria-label="Increase"
                >
                    <Icon.Plus />
                </button>
            </div>
            <FormFieldMessage hasError={hasError} helperText={helperText} error={error} errors={errors} />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   7. SelectField
═══════════════════════════════════════════════════════════════════════════════ */

/**
 * SelectField — Native <select> with custom chevron + suggestion chips.
 *
 * @param {Object}   props
 * @param {string}   [props.label]
 * @param {string}   [props.value]
 * @param {Function} [props.onChange]    - (value, event) => void
 * @param {Function} [props.setValue]
 * @param {Array}    props.options        - [{ value, label, disabled? }] | ["str"]
 * @param {string}   [props.placeholder]
 * @param {Array}    [props.suggestions]  - Quick-select chips
 * @param {boolean}  [props.required]
 * @param {boolean}  [props.disabled]
 * @param {string}   [props.helperText]
 * @param {string}   [props.error]
 *
 * @example
 * <SelectField
 *   label="Country"
 *   value={country}
 *   setValue={setCountry}
 *   options={[
 *     { value: "bd", label: "Bangladesh" },
 *     { value: "us", label: "United States" },
 *     { value: "gb", label: "United Kingdom" },
 *   ]}
 *   suggestions={[{ value: "bd", label: "Bangladesh" }]}
 *   placeholder="Select your country"
 *   error={errors.country}
 * />
 */
export function SelectField({
    label = "",
    value = "",
    onChange,
    setValue,
    options = [],
    placeholder = "Select an option",
    suggestions = [],
    name = "",
    id,
    required = false,
    disabled = false,
    helperText = "",
    error = "",
    showError = true,
    onBlur,
    onFocus,
    errors = [],
    info = "",
    className = "",
}) {
    const uid = useId();
    const inputId = id || `ff-sel-${uid}`;
    const hasError = showError && (Boolean(error) || Boolean(errors?.length));

    const normalized = useMemo(() =>
        options.map((o) => (typeof o === "object" ? o : { value: o, label: String(o) })),
        [options]
    );

    const handleChange = useCallback((e) => {
        const v = e.target.value;
        setValue?.(v);
        onChange?.(v, e);
    }, [setValue, onChange]);

    return (
        <div className={`ff ${className}`}>
            <FieldLabel htmlFor={inputId} label={label} required={required} info={info} />
            <div className="ff-select-wrap">
                <select
                    id={inputId}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    disabled={disabled}
                    required={required}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    aria-invalid={hasError}
                    className={`ff-input ff-select
                        ${hasError ? "ff-select--error" : ""}
                        ${!value ? "ff-select--placeholder" : ""}
                    `}
                >
                    {placeholder && (
                        <option value="" disabled hidden>{placeholder}</option>
                    )}
                    {normalized.map((o) => (
                        <option key={o.value} value={o.value} disabled={o.disabled}>
                            {o.label}
                        </option>
                    ))}
                </select>
                <span className="ff-select-chevron">
                    <Icon.ChevronDown />
                </span>
            </div>
            <SuggestionChips
                suggestions={suggestions}
                onSelect={(v) => { setValue?.(v); onChange?.(v); }}
            />
            <FormFieldMessage hasError={hasError} helperText={helperText} error={error} errors={errors} />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   8. SearchableSelect
   FIX: z-index boosted on parent .ff when dropdown is open
═══════════════════════════════════════════════════════════════════════════════ */

/**
 * SearchableSelect — Custom searchable dropdown with suggestion chips.
 *
 * Bug fix v2: when open, the parent .ff wrapper gets z-index: 9999
 * so the dropdown always renders above subsequent form fields.
 *
 * @param {Object}   props
 * @param {string}   [props.label]
 * @param {string}   [props.value]        - Selected value
 * @param {Function} [props.onChange]     - (value, option) => void
 * @param {Function} [props.setValue]
 * @param {Array}    props.options         - [{ value, label, description? }]
 * @param {string}   [props.placeholder]
 * @param {Array}    [props.suggestions]
 * @param {boolean}  [props.required]
 * @param {boolean}  [props.disabled]
 * @param {boolean}  [props.clearable]
 * @param {string}   [props.helperText]
 * @param {string}   [props.error]
 *
 * @example
 * <SearchableSelect
 *   label="Framework"
 *   value={framework}
 *   setValue={setFramework}
 *   options={[
 *     { value: "react", label: "React", description: "Meta's UI library" },
 *     { value: "vue",   label: "Vue.js", description: "Progressive framework" },
 *     { value: "svelte",label: "Svelte", description: "Cybernetically enhanced" },
 *   ]}
 *   suggestions={[{ value: "react", label: "React" }]}
 *   placeholder="Search frameworks..."
 *   clearable
 *   error={errors.framework}
 * />
 */
export function SearchableSelect({
    label = "",
    value = "",
    onChange,
    setValue,
    options = [],
    placeholder = "Select an option",
    suggestions = [],
    name = "",
    id,
    required = false,
    disabled = false,
    clearable = false,
    helperText = "",
    error = "",
    showError = true,
    errors = [],
    info = "",
    className = "",
}) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const uid = useId();
    const inputId = id || `ff-ss-${uid}`;
    const wrapRef = useRef(null);
    const searchRef = useRef(null);
    const hasError = showError && (Boolean(error) || Boolean(errors?.length));

    const normalized = useMemo(() =>
        options.map((o) => (typeof o === "object" ? o : { value: o, label: String(o) })),
        [options]
    );

    const filtered = useMemo(() =>
        query.trim()
            ? normalized.filter((o) =>
                o.label.toLowerCase().includes(query.toLowerCase()) ||
                (o.description || "").toLowerCase().includes(query.toLowerCase())
            )
            : normalized,
        [normalized, query]
    );

    const selectedLabel = useMemo(() =>
        normalized.find((o) => o.value === value)?.label,
        [normalized, value]
    );

    useClickOutside(wrapRef, () => { setOpen(false); setQuery(""); });

    useEffect(() => {
        if (open) setTimeout(() => searchRef.current?.focus(), 50);
    }, [open]);

    const select = useCallback((opt) => {
        setValue?.(opt.value);
        onChange?.(opt.value, opt);
        setOpen(false);
        setQuery("");
    }, [setValue, onChange]);

    const clear = useCallback((e) => {
        e.stopPropagation();
        setValue?.("");
        onChange?.("", null);
    }, [setValue, onChange]);

    return (
        /* z-index fix: boost parent .ff when dropdown is open */
        <div className={`ff ${open ? "ff--dropdown-open" : ""} ${className}`}>
            <FieldLabel htmlFor={inputId} label={label} required={required} info={info} />
            <div className="ff-search-select" ref={wrapRef}>
                <input type="hidden" name={name} value={value} id={inputId} />
                <button
                    type="button"
                    disabled={disabled}
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    aria-invalid={hasError}
                    className={`ff-search-select-trigger
                        ${open ? "ff-search-select-trigger--open" : ""}
                        ${hasError ? "ff-search-select-trigger--error" : ""}
                    `}
                    onClick={() => !disabled && setOpen((o) => !o)}
                >
                    <span className={`ff-search-select-value ${!selectedLabel ? "ff-search-select-value--placeholder" : ""}`}>
                        {selectedLabel || placeholder}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        {clearable && value && (
                            <span
                                onClick={clear}
                                style={{ color: "var(--form-text-muted)", display: "flex", alignItems: "center" }}
                                role="button"
                                aria-label="Clear selection"
                            >
                                <Icon.X />
                            </span>
                        )}
                        <span className="ff-search-select-chevron"><Icon.ChevronDown /></span>
                    </span>
                </button>

                {open && (
                    <div className="ff-search-select-dropdown" role="listbox">
                        <div className="ff-search-select-search-wrap">
                            <input
                                ref={searchRef}
                                type="text"
                                className="ff-search-select-search"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search..."
                                aria-label="Search options"
                            />
                        </div>
                        <div className="ff-search-select-list">
                            {filtered.length === 0 ? (
                                <div className="ff-search-select-empty">No options found</div>
                            ) : (
                                filtered.map((opt) => (
                                    <div
                                        key={opt.value}
                                        role="option"
                                        aria-selected={opt.value === value}
                                        className={`ff-search-select-option ${opt.value === value ? "ff-search-select-option--selected" : ""}`}
                                        onClick={() => select(opt)}
                                    >
                                        <span>
                                            <span style={{ display: "block" }}>{opt.label}</span>
                                            {opt.description && (
                                                <span style={{ fontSize: "0.74rem", color: "var(--form-text-muted)", display: "block", marginTop: 2 }}>{opt.description}</span>
                                            )}
                                        </span>
                                        {opt.value === value && (
                                            <span className="ff-search-select-tick"><Icon.Check /></span>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
            <SuggestionChips
                suggestions={suggestions}
                onSelect={(v) => {
                    const opt = normalized.find((o) => o.value === v) || { value: v, label: v };
                    select(opt);
                }}
                wrapClass="ff-search-select-suggestions"
                chipClass="ff-search-select-suggestion"
            />
            <FormFieldMessage hasError={hasError} helperText={helperText} error={error} errors={errors} />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   9. DateField
═══════════════════════════════════════════════════════════════════════════════ */

/**
 * DateField — Native date input with styled calendar icon.
 *
 * @param {Object}  props
 * @param {string}  [props.label]
 * @param {string}  [props.value]       - "YYYY-MM-DD"
 * @param {Function}[props.onChange]    - (value, event) => void
 * @param {Function}[props.setValue]
 * @param {string}  [props.min]
 * @param {string}  [props.max]
 * @param {boolean} [props.required]
 * @param {boolean} [props.disabled]
 * @param {string}  [props.helperText]
 * @param {string}  [props.error]
 *
 * @example
 * <DateField
 *   label="Date of Birth"
 *   value={dob}
 *   setValue={setDob}
 *   max={new Date().toISOString().split("T")[0]}
 *   error={errors.dob}
 *   helperText="You must be at least 18 years old"
 * />
 */
export function DateField({
    label = "",
    value = "",
    onChange,
    setValue,
    min,
    max,
    name = "",
    id,
    required = false,
    disabled = false,
    helperText = "",
    error = "",
    showError = true,
    errors = [],
    info = "",
    className = "",
}) {
    const uid = useId();
    const inputId = id || `ff-date-${uid}`;
    const hasError = showError && (Boolean(error) || Boolean(errors?.length));

    const handleChange = useCallback((e) => {
        const v = e.target.value;
        setValue?.(v);
        onChange?.(v, e);
    }, [setValue, onChange]);

    return (
        <div className={`ff ${className}`}>
            <FieldLabel htmlFor={inputId} label={label} required={required} info={info} />
            <div className="ff-input-wrap">
                <span className="ff-icon ff-icon--left"><Icon.Calendar /></span>
                <input
                    id={inputId}
                    type="date"
                    name={name}
                    value={value}
                    onChange={handleChange}
                    min={min}
                    max={max}
                    disabled={disabled}
                    required={required}
                    aria-invalid={hasError}
                    className={`ff-input ff-input--has-left ${hasError ? "ff-input--error" : ""}`}
                />
            </div>
            <FormFieldMessage hasError={hasError} helperText={helperText} error={error} errors={errors} />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   10. TimeField
═══════════════════════════════════════════════════════════════════════════════ */

/**
 * TimeField — Native time input.
 *
 * @param {Object}  props
 * @param {string}  [props.label]
 * @param {string}  [props.value]     - "HH:MM"
 * @param {Function}[props.onChange]  - (value, event) => void
 * @param {Function}[props.setValue]
 * @param {string}  [props.min]
 * @param {string}  [props.max]
 * @param {boolean} [props.required]
 * @param {boolean} [props.disabled]
 * @param {string}  [props.helperText]
 * @param {string}  [props.error]
 *
 * @example
 * <TimeField
 *   label="Meeting Time"
 *   value={time}
 *   setValue={setTime}
 *   min="09:00"
 *   max="17:00"
 *   error={errors.time}
 *   helperText="Business hours: 9 AM – 5 PM"
 * />
 */
export function TimeField({
    label = "",
    value = "",
    onChange,
    setValue,
    min,
    max,
    name = "",
    id,
    required = false,
    disabled = false,
    helperText = "",
    error = "",
    showError = true,
    errors = [],
    info = "",
    className = "",
}) {
    const uid = useId();
    const inputId = id || `ff-time-${uid}`;
    const hasError = showError && (Boolean(error) || Boolean(errors?.length));

    const handleChange = useCallback((e) => {
        const v = e.target.value;
        setValue?.(v);
        onChange?.(v, e);
    }, [setValue, onChange]);

    return (
        <div className={`ff ${className}`}>
            <FieldLabel htmlFor={inputId} label={label} required={required} info={info} />
            <div className="ff-input-wrap">
                <span className="ff-icon ff-icon--left"><Icon.Clock /></span>
                <input
                    id={inputId}
                    type="time"
                    name={name}
                    value={value}
                    onChange={handleChange}
                    min={min}
                    max={max}
                    disabled={disabled}
                    required={required}
                    aria-invalid={hasError}
                    className={`ff-input ff-input--has-left ${hasError ? "ff-input--error" : ""}`}
                />
            </div>
            <FormFieldMessage hasError={hasError} helperText={helperText} error={error} errors={errors} />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   11. CalendarField — Custom calendar picker
   FIX: parent .ff gets z-index boost when open
═══════════════════════════════════════════════════════════════════════════════ */

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

/**
 * CalendarField — Custom calendar date picker.
 *
 * @param {Object}  props
 * @param {string}  [props.label]
 * @param {string}  [props.value]         - "YYYY-MM-DD"
 * @param {Function}[props.onChange]       - (value: "YYYY-MM-DD") => void
 * @param {Function}[props.setValue]
 * @param {string}  [props.min]
 * @param {string}  [props.max]
 * @param {string}  [props.placeholder]
 * @param {boolean} [props.required]
 * @param {boolean} [props.disabled]
 * @param {string}  [props.helperText]
 * @param {string}  [props.error]
 *
 * @example
 * <CalendarField
 *   label="Event Date"
 *   value={date}
 *   setValue={setDate}
 *   min={new Date().toISOString().split("T")[0]}
 *   placeholder="Pick a date"
 *   error={errors.date}
 *   helperText="Select a future date"
 * />
 */
export function CalendarField({
    label = "",
    value = "",
    onChange,
    setValue,
    min,
    max,
    placeholder = "Pick a date",
    name = "",
    id,
    required = false,
    disabled = false,
    helperText = "",
    error = "",
    showError = true,
    errors = [],
    info = "",
    className = "",
}) {
    const uid = useId();
    const inputId = id || `ff-cal-${uid}`;
    const hasError = showError && (Boolean(error) || Boolean(errors?.length));
    const [open, setOpen] = useState(false);
    const wrapRef = useRef(null);

    const today = new Date();
    const initDate = value ? new Date(value + "T00:00:00") : today;
    const [viewYear, setViewYear] = useState(initDate.getFullYear());
    const [viewMonth, setViewMonth] = useState(initDate.getMonth());

    // Sync view to value when value changes externally (e.g. form reset or prefill)
    useEffect(() => {
        if (value) {
            const d = new Date(value + "T00:00:00");
            setViewYear(d.getFullYear());
            setViewMonth(d.getMonth());
        }
    }, [value]);

    useClickOutside(wrapRef, () => setOpen(false));

    const displayValue = useMemo(() => {
        if (!value) return null;
        const d = new Date(value + "T00:00:00");
        return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    }, [value]);

    const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
    const firstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

    const cells = useMemo(() => {
        const days = [];
        const first = firstDayOfMonth(viewYear, viewMonth);
        const dim = daysInMonth(viewYear, viewMonth);
        const prevDim = daysInMonth(viewYear, viewMonth - 1);
        for (let i = first - 1; i >= 0; i--) days.push({ day: prevDim - i, current: false, type: "prev" });
        for (let i = 1; i <= dim; i++) days.push({ day: i, current: true, type: "curr" });
        const remaining = 42 - days.length;
        for (let i = 1; i <= remaining; i++) days.push({ day: i, current: false, type: "next" });
        return days;
    }, [viewYear, viewMonth]);

    const toDateStr = (y, m, d) =>
        `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

    const selectDay = useCallback((cell) => {
        if (!cell.current) return;
        const dateStr = toDateStr(viewYear, viewMonth, cell.day);
        if (min && dateStr < min) return;
        if (max && dateStr > max) return;
        setValue?.(dateStr);
        onChange?.(dateStr);
        setOpen(false);
    }, [viewYear, viewMonth, min, max, setValue, onChange]);

    const prevMonth = () => {
        if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11); }
        else setViewMonth((m) => m - 1);
    };
    const nextMonth = () => {
        if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0); }
        else setViewMonth((m) => m + 1);
    };

    const isTodayCell = (cell) =>
        cell.current && cell.day === today.getDate() &&
        viewMonth === today.getMonth() && viewYear === today.getFullYear();

    const isSelectedCell = (cell) =>
        cell.current && value === toDateStr(viewYear, viewMonth, cell.day);

    const isDisabledCell = (cell) => {
        if (!cell.current) return true;
        const ds = toDateStr(viewYear, viewMonth, cell.day);
        return (min && ds < min) || (max && ds > max);
    };

    return (
        /* z-index fix: boost when calendar panel is open */
        <div className={`ff ${open ? "ff--dropdown-open" : ""} ${className}`}>
            <FieldLabel htmlFor={inputId} label={label} required={required} info={info} />
            <div className="ff-calendar" ref={wrapRef}>
                <input type="hidden" name={name} id={inputId} value={value} />
                <button
                    type="button"
                    disabled={disabled}
                    aria-haspopup="dialog"
                    aria-expanded={open}
                    className={`ff-calendar-trigger
                        ${open ? "ff-calendar-trigger--open" : ""}
                        ${hasError ? "ff-calendar-trigger--error" : ""}
                    `}
                    onClick={() => !disabled && setOpen((o) => !o)}
                >
                    <span className={!displayValue ? "ff-calendar-trigger-value--placeholder" : ""} style={{ flex: 1, textAlign: "left" }}>
                        {displayValue || placeholder}
                    </span>
                    <span className="ff-calendar-trigger-right">
                        {value && (
                            <span
                                role="button"
                                aria-label="Clear date"
                                style={{ display: "flex", alignItems: "center", padding: "2px" }}
                                onClick={(e) => { e.stopPropagation(); setValue?.(""); onChange?.(""); }}
                            >
                                <Icon.X />
                            </span>
                        )}
                        <Icon.Calendar />
                    </span>
                </button>

                {open && (
                    <div className="ff-calendar-panel" role="dialog" aria-label="Date picker">
                        <div className="ff-cal-header">
                            <button type="button" className="ff-cal-nav" onClick={prevMonth} aria-label="Previous month">
                                <Icon.ChevronLeft />
                            </button>
                            <span className="ff-cal-title">{MONTHS[viewMonth]} {viewYear}</span>
                            <button type="button" className="ff-cal-nav" onClick={nextMonth} aria-label="Next month">
                                <Icon.ChevronRight />
                            </button>
                        </div>
                        <div className="ff-cal-weekdays">
                            {DAYS.map((d) => <span key={d} className="ff-cal-weekday">{d}</span>)}
                        </div>
                        <div className="ff-cal-grid" role="grid">
                            {cells.map((cell, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    role="gridcell"
                                    className={`ff-cal-day
                                        ${!cell.current ? "ff-cal-day--other-month" : ""}
                                        ${isTodayCell(cell) ? "ff-cal-day--today" : ""}
                                        ${isSelectedCell(cell) ? "ff-cal-day--selected" : ""}
                                        ${isDisabledCell(cell) ? "ff-cal-day--disabled" : ""}
                                    `}
                                    onClick={() => selectDay(cell)}
                                    aria-selected={isSelectedCell(cell)}
                                    disabled={isDisabledCell(cell) || !cell.current}
                                    tabIndex={cell.current && !isDisabledCell(cell) ? 0 : -1}
                                >
                                    {cell.day}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <FormFieldMessage hasError={hasError} helperText={helperText} error={error} errors={errors} />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   12. RadioGroup
═══════════════════════════════════════════════════════════════════════════════ */

/**
 * RadioGroup — A group of styled radio buttons.
 *
 * @param {Object}   props
 * @param {string}   [props.label]
 * @param {string}   [props.value]           - Selected value
 * @param {Function} [props.onChange]         - (value) => void
 * @param {Function} [props.setValue]
 * @param {Array}    props.options             - [{ value, label, description?, disabled? }]
 * @param {string}   [props.direction]        - "vertical" | "horizontal"
 * @param {boolean}  [props.required]
 * @param {boolean}  [props.disabled]
 * @param {string}   [props.helperText]
 * @param {string}   [props.error]
 *
 * @example
 * <RadioGroup
 *   label="Subscription Plan"
 *   value={plan}
 *   setValue={setPlan}
 *   options={[
 *     { value: "free",  label: "Free",       description: "Basic features only" },
 *     { value: "pro",   label: "Pro",        description: "All features, $9/mo" },
 *     { value: "team",  label: "Team",       description: "For teams, $29/mo" },
 *   ]}
 *   error={errors.plan}
 * />
 */
export function RadioGroup({
    label = "",
    value = "",
    onChange,
    setValue,
    options = [],
    direction = "vertical",
    required = false,
    disabled = false,
    helperText = "",
    error = "",
    showError = true,
    errors = [],
    info = "",
    className = "",
}) {
    const uid = useId();
    const hasError = showError && (Boolean(error) || Boolean(errors?.length));

    const select = useCallback((v) => {
        if (disabled) return;
        setValue?.(v);
        onChange?.(v);
    }, [disabled, setValue, onChange]);

    return (
        <div
            className={`ff ${className}`}
            role="radiogroup"
            aria-required={required}
            aria-invalid={hasError}
        >
            {label && <div className="ff-label">{label}{required && <span className="ff-required">*</span>}</div>}
            <div className={`ff-radio-group-list ${direction === "horizontal" ? "ff-radio-group-list--horizontal" : ""}`}>
                {options.map((opt) => {
                    const o = typeof opt === "object" ? opt : { value: opt, label: String(opt) };
                    const isSelected = value === o.value;
                    const isDisabled = disabled || o.disabled;
                    return (
                        <div
                            key={o.value}
                            role="radio"
                            aria-checked={isSelected}
                            aria-disabled={isDisabled}
                            tabIndex={isDisabled ? -1 : 0}
                            className={`ff-radio-item
                                ${isSelected ? "ff-radio-item--selected" : ""}
                                ${isDisabled ? "ff-radio-item--disabled" : ""}
                            `}
                            onClick={() => !isDisabled && select(o.value)}
                            onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); !isDisabled && select(o.value); } }}
                        >
                            <span className="ff-radio-circle">
                                <span className="ff-radio-dot" />
                            </span>
                            <span className="ff-radio-text">
                                <span className="ff-radio-label">{o.label}</span>
                                {o.description && <span className="ff-radio-description">{o.description}</span>}
                            </span>
                        </div>
                    );
                })}
            </div>
            <FormFieldMessage hasError={hasError} helperText={helperText} error={error} errors={errors} />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   13. CheckboxGroup
═══════════════════════════════════════════════════════════════════════════════ */

/**
 * CheckboxGroup — A group of styled checkboxes with min/max selection limits.
 *
 * @param {Object}   props
 * @param {string}   [props.label]
 * @param {Array}    [props.value]            - Array of selected values
 * @param {Function} [props.onChange]          - (values: string[]) => void
 * @param {Function} [props.setValue]
 * @param {Array}    props.options              - [{ value, label, description?, disabled? }]
 * @param {string}   [props.direction]         - "vertical" | "horizontal"
 * @param {number}   [props.min]
 * @param {number}   [props.max]               - Max selections allowed
 * @param {boolean}  [props.disabled]
 * @param {string}   [props.helperText]
 * @param {string}   [props.error]
 *
 * @example
 * <CheckboxGroup
 *   label="Tech Skills"
 *   value={skills}
 *   setValue={setSkills}
 *   options={["React", "TypeScript", "Node.js", "GraphQL", "PostgreSQL"]}
 *   direction="horizontal"
 *   max={3}
 *   error={errors.skills}
 *   helperText="Select up to 3 skills"
 * />
 */
export function CheckboxGroup({
    label = "",
    value = [],
    onChange,
    setValue,
    options = [],
    direction = "vertical",
    min,
    max,
    required = false,
    disabled = false,
    helperText = "",
    error = "",
    showError = true,
    errors = [],
    info = "",
    className = "",
}) {
    const hasError = showError && (Boolean(error) || Boolean(errors?.length));

    const toggle = useCallback((v) => {
        if (disabled) return;
        let next;
        if (value.includes(v)) {
            next = value.filter((x) => x !== v);
        } else {
            if (max && value.length >= max) return;
            next = [...value, v];
        }
        setValue?.(next);
        onChange?.(next);
    }, [value, disabled, max, setValue, onChange]);

    return (
        <div className={`ff ${className}`} role="group" aria-invalid={hasError}>
            {label && <div className="ff-label">{label}{required && <span className="ff-required">*</span>}</div>}
            <div className={`ff-checkbox-group-list ${direction === "horizontal" ? "ff-checkbox-group-list--horizontal" : ""}`}>
                {options.map((opt) => {
                    const o = typeof opt === "object" ? opt : { value: opt, label: String(opt) };
                    const checked = value.includes(o.value);
                    const isDisabled = disabled || o.disabled || (!checked && max && value.length >= max);
                    return (
                        <div
                            key={o.value}
                            role="checkbox"
                            aria-checked={checked}
                            aria-disabled={isDisabled}
                            tabIndex={isDisabled ? -1 : 0}
                            className={`ff-checkbox-item
                                ${checked ? "ff-checkbox-item--checked" : ""}
                                ${isDisabled ? "ff-checkbox-item--disabled" : ""}
                            `}
                            onClick={() => !isDisabled && toggle(o.value)}
                            onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); !isDisabled && toggle(o.value); } }}
                        >
                            <span className="ff-checkbox-box">
                                <span className="ff-checkbox-tick"><Icon.Check /></span>
                            </span>
                            <span style={{ flex: 1 }}>
                                <span className="ff-checkbox-label">{o.label}</span>
                                {o.description && <span className="ff-checkbox-description">{o.description}</span>}
                            </span>
                        </div>
                    );
                })}
            </div>
            {max && <div className="ff-char-count">{value.length} / {max} selected</div>}
            <FormFieldMessage hasError={hasError} helperText={helperText} error={error} errors={errors} />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   14. SwitchField
   NEW: switchPosition prop — "left" dile toggle switch-ti text-er bame bosbe
═══════════════════════════════════════════════════════════════════════════════ */

/**
 * SwitchField — Label ebong short description shohho toggle switch.
 *
 * @param {Object}   props
 * @param {string}   [props.label]           - Switch row-er upore thaka main section label
 * @param {string}   [props.switchLabel]     - Switch row-er bitore thaka main text
 * @param {string}   [props.description]     - Switch row-er bitore thaka sub-text
 * @param {boolean}  [props.value]           - Controlled on/off state (true/false)
 * @param {Function} [props.onChange]         - (value: boolean) => void
 * @param {Function} [props.setValue]
 * @param {string}   [props.switchPosition]  - "right" (default) | "left"
 * @param {boolean}  [props.disabled]
 * @param {string}   [props.helperText]
 * @param {string}   [props.error]
 */
export function SwitchField({
    label = "",
    switchLabel = "",
    description = "",
    value = false,
    onChange,
    setValue,
    switchPosition = "right",
    disabled = false,
    helperText = "",
    error = "",
    showError = true,
    errors = [],
    info = "",
    className = "",
}) {
    // Error check korar logic (string ba array jekono format-ei asuk na keno)
    const hasError = showError && (Boolean(error) || (Array.isArray(errors) ? errors.length > 0 : Boolean(errors)));

    // Click ba Space/Enter press korle state change korar function
    const toggle = useCallback(() => {
        if (disabled) return;
        setValue?.(!value);
        onChange?.(!value);
    }, [value, disabled, setValue, onChange]);

    // Switch-er track ebong thumb (gol button-ti)
    const switchTrack = (
        <span
            className={`ff-switch-track 
                ${value ? "ff-switch-track--on" : ""} 
                ${disabled ? "ff-switch-track--disabled" : ""}
            `}
        >
            <span className="ff-switch-thumb" />
        </span>
    );

    // Switch-er pasher main label ebong sub-description text
    const switchText = (switchLabel || description) ? (
        <span className="ff-switch-text">
            {switchLabel && <span className="ff-switch-main-label">{switchLabel}</span>}
            {description && <span className="ff-switch-sub-label">{description}</span>}
        </span>
    ) : null;

    // switchPosition dynamic class
    const rowClass = `ff-switch-row ${value ? "ff-switch-row--on" : ""} ${disabled ? "ff-switch-row--disabled" : ""} ${switchPosition === "left" ? "ff-switch-row--left" : ""}`;

    return (
        <div className={`ff ${hasError ? "ff--error" : ""} ${disabled ? "ff--disabled" : ""} ${className}`}>
            {/* Section-er main header label (jodi thake) */}
            {label && <div className="ff-label">{label}</div>}

            {/* Clickable switch row area */}
            <div
                role="switch"
                aria-checked={value}
                aria-disabled={disabled}
                tabIndex={disabled ? -1 : 0}
                className={rowClass}
                onClick={toggle}
                onKeyDown={(e) => {
                    if (e.key === " " || e.key === "Enter") {
                        e.preventDefault();
                        toggle();
                    }
                }}
            >
                {/* switchPosition prop er upor vitti kore bame ba dane render hbe */}
                {switchPosition === "left" ? (
                    <>
                        {switchTrack}
                        {switchText}
                    </>
                ) : (
                    <>
                        {switchText}
                        {switchTrack}
                    </>
                )}
            </div>

            {/* Error ba helper message dekhonor component */}
            <FormFieldMessage hasError={hasError} helperText={helperText} error={error} errors={errors} />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   15. TagsField
═══════════════════════════════════════════════════════════════════════════════ */

/**
 * TagsField — Tag/badge input. Press Enter or comma to add a tag.
 *
 * @param {Object}   props
 * @param {string}   [props.label]
 * @param {string[]} [props.value]        - Controlled array of tags
 * @param {Function} [props.onChange]      - (tags: string[]) => void
 * @param {Function} [props.setValue]
 * @param {string}   [props.placeholder]
 * @param {number}   [props.max]           - Max number of tags
 * @param {number}   [props.maxLength]     - Max chars per tag
 * @param {string[]} [props.suggestions]
 * @param {Function} [props.validate]     - (tag: string) => string | null
 * @param {boolean}  [props.disabled]
 * @param {string}   [props.helperText]
 * @param {string}   [props.error]
 *
 * @example
 * <TagsField
 *   label="Tech Stack"
 *   value={stack}
 *   setValue={setStack}
 *   placeholder="Add a technology..."
 *   suggestions={["React", "TypeScript", "Tailwind", "Node.js"]}
 *   max={8}
 *   maxLength={20}
 *   error={errors.stack}
 *   helperText="Press Enter or comma to add"
 * />
 */
export function TagsField({
    label = "",
    value = [],
    onChange,
    setValue,
    placeholder = "Add tag...",
    max,
    maxLength,
    suggestions = [],
    validate,
    disabled = false,
    id,
    helperText = "",
    error = "",
    showError = true,
    errors = [],
    info = "",
    className = "",
}) {
    const uid = useId();
    const inputId = id || `ff-tags-${uid}`;
    const [input, setInput] = useState("");
    const [localError, setLocalError] = useState("");
    const inputRef = useRef(null);
    const hasError = showError && (Boolean(error) || Boolean(localError));
    const displayError = error || localError;

    const addTag = useCallback((raw) => {
        const tag = raw.trim();
        if (!tag) return;
        if (value.includes(tag)) { setLocalError("Tag already exists"); return; }
        if (max && value.length >= max) { setLocalError(`Max ${max} tags allowed`); return; }
        if (maxLength && tag.length > maxLength) { setLocalError(`Tag too long (max ${maxLength} chars)`); return; }
        if (validate) {
            const err = validate(tag);
            if (err) { setLocalError(err); return; }
        }
        setLocalError("");
        const next = [...value, tag];
        setValue?.(next);
        onChange?.(next);
        setInput("");
    }, [value, max, maxLength, validate, setValue, onChange]);

    const removeTag = useCallback((tag) => {
        const next = value.filter((t) => t !== tag);
        setValue?.(next);
        onChange?.(next);
    }, [value, setValue, onChange]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag(input);
        } else if (e.key === "Backspace" && !input && value.length) {
            removeTag(value[value.length - 1]);
        } else {
            setLocalError("");
        }
    }, [input, value, addTag, removeTag]);

    const handleChange = useCallback((e) => {
        const v = e.target.value;
        if (v.endsWith(",")) {
            addTag(v.slice(0, -1));
        } else {
            setInput(v);
        }
    }, [addTag]);

    return (
        <div className={`ff ${className}`}>
            {label && <label htmlFor={inputId} className="ff-label">{label}</label>}
            <div
                className={`ff-tags-wrap ${hasError ? "ff-tags-wrap--error" : ""}`}
                onClick={() => inputRef.current?.focus()}
            >
                {value.map((tag) => (
                    <span key={tag} className="ff-tag">
                        {tag}
                        {!disabled && (
                            <button
                                type="button"
                                className="ff-tag-remove"
                                onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
                                aria-label={`Remove ${tag}`}
                            >
                                <Icon.X />
                            </button>
                        )}
                    </span>
                ))}
                {(!max || value.length < max) && !disabled && (
                    <input
                        ref={inputRef}
                        id={inputId}
                        type="text"
                        className="ff-tags-input"
                        value={input}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        placeholder={value.length === 0 ? placeholder : ""}
                        aria-label="Add tag"
                    />
                )}
            </div>
            {suggestions.length > 0 && (
                <div className="ff-tags-hint">
                    Suggestions:&nbsp;
                    {suggestions
                        .filter((s) => !value.includes(s))
                        .map((s) => (
                            <span
                                key={s}
                                onClick={() => { if (!value.includes(s)) addTag(s); }}
                                className="ff-tag-suggestion"
                            >
                                + {s}
                            </span>
                        ))}
                </div>
            )}
            <div className="ff-tags-hint">Press Enter or comma to add a tag</div>
            <FormFieldMessage hasError={hasError} helperText={!hasError ? helperText : ""} error={displayError} />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   16. UrlField
═══════════════════════════════════════════════════════════════════════════════ */

/**
 * UrlField — URL input with live favicon/link preview.
 *
 * @param {Object}   props
 * @param {string}   [props.label]
 * @param {string}   [props.value]
 * @param {Function} [props.onChange]     - (value, event) => void
 * @param {Function} [props.setValue]
 * @param {string}   [props.placeholder]
 * @param {boolean}  [props.showPreview=true]
 * @param {boolean}  [props.required]
 * @param {boolean}  [props.disabled]
 * @param {string}   [props.helperText]
 * @param {string}   [props.error]
 *
 * @example
 * <UrlField
 *   label="Portfolio Website"
 *   value={url}
 *   setValue={setUrl}
 *   placeholder="https://yoursite.com"
 *   showPreview
 *   error={errors.url}
 *   helperText="Your public portfolio URL"
 * />
 */
export function UrlField({
    label = "",
    value = "",
    onChange,
    setValue,
    placeholder = "https://example.com",
    showPreview = true,
    name = "",
    id,
    required = false,
    disabled = false,
    maxLength,
    helperText = "",
    error = "",
    showError = true,
    errors = [],
    info = "",
    className = "",
}) {
    const uid = useId();
    const inputId = id || `ff-url-${uid}`;
    const hasError = showError && (Boolean(error) || Boolean(errors?.length));
    const { isTyping, triggerTyping } = useTypingIndicator();

    const handleChange = useCallback((e) => {
        const v = e.target.value;
        setValue?.(v);
        onChange?.(v, e);
        triggerTyping();
    }, [setValue, onChange, triggerTyping]);

    const isValidUrl = useMemo(() => {
        if (!value) return false;
        try { new URL(value); return true; } catch { return false; }
    }, [value]);

    const domain = useMemo(() => {
        if (!isValidUrl) return null;
        try { return new URL(value).hostname; } catch { return null; }
    }, [value, isValidUrl]);

    return (
        <div className={`ff ${className}`}>
            <FieldLabel htmlFor={inputId} label={label} required={required} info={info} />
            <div className="ff-input-wrap">
                <span className="ff-icon ff-icon--left"><Icon.Link /></span>
                <input
                    id={inputId}
                    type="url"
                    name={name}
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    maxLength={maxLength}
                    aria-invalid={hasError}
                    className={`ff-input ff-input--has-left
                        ${isValidUrl ? "ff-input--has-right" : ""}
                        ${hasError ? "ff-input--error" : ""}
                    `}
                />
                {isValidUrl && (
                    <span className="ff-icon ff-icon--right" style={{ color: "var(--form-success-text)" }}>
                        <Icon.ExternalLink />
                    </span>
                )}
                <div className={`ff-typing-bar${isTyping ? " ff-typing-bar--active" : ""}`} aria-hidden="true" />
            </div>
            {showPreview && isValidUrl && domain && (
                <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ff-url-preview"
                >
                    <img
                        src={`https://www.google.com/s2/favicons?domain=${domain}&sz=16`}
                        alt=""
                        className="ff-url-favicon"
                        onError={(e) => { e.target.style.display = "none"; }}
                    />
                    <span className="ff-url-preview-text">{value}</span>
                    <Icon.ExternalLink />
                </a>
            )}
            <FormFieldMessage hasError={hasError} helperText={helperText} error={error} errors={errors} />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SHARED: useFilePicker base hook
   FIX v2: reset input.value after processing so same file can be re-selected
═══════════════════════════════════════════════════════════════════════════════ */

function useFilePicker({ accept, multiple, maxSize, maxFiles, onFiles, disabled }) {
    const [dragging, setDragging] = useState(false);
    // fileErrors: [{ name, message }] — per-file validation failures
    // atomicError: string — shown when the whole batch is rejected
    const [fileErrors, setFileErrors] = useState([]);
    const [atomicError, setAtomicError] = useState("");
    // legacy single-string error (kept for backward compat)
    const localError = fileErrors.length > 0 ? fileErrors[0].message : atomicError;
    const inputRef = useRef(null);

    const process = useCallback((fileList) => {
        const files = Array.from(fileList);
        if (!files.length) return;
        if (maxFiles && files.length > maxFiles) {
            setFileErrors([]);
            setAtomicError(`Max ${maxFiles} files allowed`);
            return;
        }
        const invalid = maxSize ? files.filter((f) => f.size > maxSize) : [];
        if (invalid.length) {
            // Build per-file errors
            const errs = invalid.map((f) => ({
                name: f.name,
                message: `File exceeds the ${formatFileSize(maxSize)} size limit (actual: ${formatFileSize(f.size)}).`,
            }));
            setFileErrors(errs);
            setAtomicError(`Atomic upload rejected: ${errs.length} error(s) found. No files were saved.`);
            return;
        }
        setFileErrors([]);
        setAtomicError("");
        onFiles?.(files);
    }, [maxFiles, maxSize, onFiles]);

    const handleNative = useCallback((e) => {
        process(e.target.files);
        // BUG FIX: reset so the same file can be selected again after removal
        if (inputRef.current) inputRef.current.value = "";
    }, [process]);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setDragging(false);
        if (disabled) return;
        process(e.dataTransfer.files);
    }, [disabled, process]);

    const handleDragOver = useCallback((e) => { e.preventDefault(); if (!disabled) setDragging(true); }, [disabled]);
    const handleDragLeave = useCallback(() => setDragging(false), []);

    const clearPickerErrors = useCallback(() => { setFileErrors([]); setAtomicError(""); }, []);

    return { dragging, localError, fileErrors, atomicError, inputRef, handleNative, handleDrop, handleDragOver, handleDragLeave, clearPickerErrors };
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SHARED: FilePickerErrors
   Renders grouped per-file errors + atomic error in one styled wrapper.
   Each row: "× filename — message" (filename highlighted), last row is atomic.
═══════════════════════════════════════════════════════════════════════════════ */

function FilePickerErrors({ fileErrors = [], atomicError = "", externalError = "", showError = true }) {
    const rows = [];
    fileErrors.forEach((e, i) => rows.push({ key: `fe-${i}`, name: e.name, message: e.message }));
    if (atomicError) rows.push({ key: "atomic", name: null, message: atomicError });
    if (!atomicError && !fileErrors.length && externalError) rows.push({ key: "ext", name: null, message: externalError });

    if (!showError || rows.length === 0) return null;

    return (
        <div className="ff-file-errors" role="alert" aria-live="polite">
            {rows.map((row) => (
                <div key={row.key} className="ff-file-errors-row">
                    <span className="ff-file-errors-x" aria-hidden="true">×</span>
                    <span className="ff-file-errors-text">
                        {row.name && <span className="ff-file-errors-filename">{row.name}</span>}
                        {row.name && <span className="ff-file-errors-dash"> — </span>}
                        {row.message}
                    </span>
                </div>
            ))}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   17. ImagePickerField
   FIX v2: previewMap keeps file↔url in sync; single mode shows big preview
═══════════════════════════════════════════════════════════════════════════════ */

/**
 * ImagePickerField — Drag-drop image picker.
 *
 * Single mode (multiple=false): replaces upload zone with a prominent preview
 * once an image is selected, with Change and Remove actions.
 *
 * Multi mode (multiple=true): shows previews below the upload zone.
 *
 * @param {Object}   props
 * @param {string}   [props.label]
 * @param {string}   [props.previewWidth]
 * @param {string}   [props.previewMode="list"]    - Multi preview style: "list" | "grid"
 * @param {File[]}   [props.value]
 * @param {Function} [props.onChange]              - (files: File[]) => void
 * @param {Function} [props.setValue]
 * @param {boolean}  [props.multiple=true]
 * @param {number}   [props.maxFiles=10]
 * @param {number}   [props.maxSize]               - Bytes e.g. 2 * 1024 * 1024
 * @param {string}   [props.helperText]
 * @param {string}   [props.error]
 * @param {boolean}  [props.disabled]
 * @param {"card"|"avatar"}          [props.variant="card"]           - Single-file display style. "avatar" enables the picker below.
 * @param {"circle"|"square"}        [props.avatarShape="circle"]     - Shape of the avatar (variant="avatar" only)
 * @param {"left"|"center"|"right"}  [props.avatarPosition="left"]    - Horizontal alignment of the avatar block (variant="avatar" only)
 * @param {boolean}                  [props.showDot=true]             - Show/hide the status dot on the border (variant="avatar" only)
 * @param {boolean}                  [props.dotDisabled=false]        - Render the dot in a disabled/greyed style (variant="avatar" only)
 * @param {boolean}                  [props.showFileName=false]       - Show file name and size below the avatar (variant="avatar" only, hidden by default)
 *
 * @example
 * // Default card style:
 * <ImagePickerField label="Photo" value={f} setValue={setF} multiple={false} />
 *
 * @example
 * // Avatar — circle, centered, no dot, show filename:
 * <ImagePickerField
 *   label="Profile Photo"
 *   value={avatar} setValue={setAvatar}
 *   multiple={false}
 *   variant="avatar"
 *   avatarShape="circle"
 *   avatarPosition="center"
 *   showDot={false}
 *   showFileName
 * />
 *
 * @example
 * // Avatar — square, right-aligned, dot disabled:
 * <ImagePickerField
 *   label="Cover"
 *   value={cover} setValue={setCover}
 *   multiple={false}
 *   variant="avatar"
 *   avatarShape="square"
 *   avatarPosition="right"
 *   dotDisabled
 * />
 *
 * // Multi image gallery — list view:
 * <ImagePickerField
 *   label="Gallery Images"
 *   value={images}
 *   setValue={setImages}
 *   multiple
 *   maxFiles={8}
 *   previewMode="list"
 *   maxSize={5 * 1024 * 1024}
 *   error={errors.images}
 * />
 *
 * // Multi image gallery — grid view:
 * <ImagePickerField
 *   label="Gallery Images"
 *   value={images}
 *   setValue={setImages}
 *   multiple
 *   maxFiles={8}
 *   previewMode="grid"
 *   maxSize={5 * 1024 * 1024}
 *   error={errors.images}
 * />
 */
export function ImagePickerField({
    label = "",
    value = [],
    onChange,
    setValue,
    multiple = true,
    maxFiles = 10,
    maxSize,
    helperText = "",
    error = "",
    showError = true,
    disabled = false,
    errors = [],
    info = "",
    className = "",
    previewWidth = "auto",
    previewMode = "list",
    /**
     * variant — controls the single-file (multiple=false) display style.
     * "card"   (default) — original card with thumb + footer (unchanged).
     * "avatar" — avatar picker with hover overlay + action buttons on image.
     */
    variant = "card",
    /** avatarShape — "circle" (default) | "square". Only used when variant="avatar". */
    avatarShape = "circle",
    /** avatarPosition — "left" (default) | "center" | "right". Only used when variant="avatar". */
    avatarPosition = "left",
    /** showDot — show the status dot on the border edge. Default true. Only used when variant="avatar". */
    showDot = true,
    /** dotDisabled — render the dot greyed out (e.g. inactive/unverified state). Default false. */
    dotDisabled = false,
    /** showFileName — show file name + size text below the avatar. Default false. Only used when variant="avatar". */
    showFileName = false,
}) {
    const hasError = showError && (Boolean(error) || Boolean(errors?.length));

    // previewMap: [{ file: File, url: string }]
    // Keeps file references and their Object URLs in sync
    const [previewMap, setPreviewMap] = useState([]);

    // Clean up Object URLs when component unmounts to prevent memory leaks
    useEffect(() => {
        return () => previewMap.forEach((p) => URL.revokeObjectURL(p.url));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Sync previewMap if value is reset externally (e.g. parent sets value=[])
    useEffect(() => {
        if (value.length === 0 && previewMap.length > 0) {
            previewMap.forEach((p) => URL.revokeObjectURL(p.url));
            setPreviewMap([]);
        }
    }, [value.length]); // eslint-disable-line react-hooks/exhaustive-deps

    const onFiles = useCallback((files) => {
        const entries = files.map((f) => ({ file: f, url: URL.createObjectURL(f) }));
        const nextFiles = multiple ? [...value, ...files] : files;
        setValue?.(nextFiles);
        onChange?.(nextFiles);
        setPreviewMap((p) => multiple ? [...p, ...entries] : entries);
    }, [value, multiple, setValue, onChange]);

    const { dragging, localError, fileErrors, atomicError, inputRef, handleNative, handleDrop, handleDragOver, handleDragLeave } =
        useFilePicker({ accept: "image/*", multiple, maxSize, maxFiles, onFiles, disabled });

    const remove = useCallback((i) => {
        URL.revokeObjectURL(previewMap[i]?.url); // Free memory
        const nextFiles = value.filter((_, idx) => idx !== i);
        setValue?.(nextFiles);
        onChange?.(nextFiles);
        setPreviewMap((p) => p.filter((_, idx) => idx !== i));
    }, [value, previewMap, setValue, onChange]);

    const displayError = error || localError;
    const showErr = showError && (Boolean(displayError) || Boolean(errors?.length));
    // Use grouped errors when picker produced per-file errors; fall back to external error string
    const hasPickerErrors = fileErrors.length > 0 || Boolean(atomicError);

    // Hidden file input — always rendered so inputRef works
    const hiddenInput = (
        <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple={multiple}
            className="ff-file-native"
            onChange={handleNative}
            disabled={disabled}
        />
    );

    // Single mode: image thumbnail card.
    // BUG FIX: condition was `value.length === 1 && previewMap.length === 1`
    // but `value` comes from parent — if parent state isn't updated yet,
    // value.length stays 0 and the single card never renders (shows multi-grid instead).
    // Fix: only check previewMap.length (our internal truth), and read
    // file metadata from previewMap[0].file instead of value[0].
    // Build metadata string: "max N files · X MB each · images only"
    const imgMeta = [
        multiple && maxFiles ? `max ${maxFiles} files` : null,
        maxSize ? `${formatFileSize(maxSize)} each` : null,
        multiple ? "images only" : null,
    ].filter(Boolean).join(" · ");

    // ── Avatar variant (single mode only) ────────────────────────────────
    // Activated by variant="avatar". The "card" variant below is untouched.
    if (!multiple && variant === "avatar") {
        const hasImage = previewMap.length === 1;
        const file = hasImage ? previewMap[0].file : null;

        const positionClass = avatarPosition === "center"
            ? "ff-avatar-wrap--center"
            : avatarPosition === "right"
                ? "ff-avatar-wrap--right"
                : "ff-avatar-wrap--left";

        const shapeClass = avatarShape === "square" ? "ff-avatar-circle--square" : "";

        return (
            <div className={`ff ff--picker ${className}`}>
                {label && (
                    <div className="ff-label-row">
                        <span className="ff-label">{label}</span>
                        {imgMeta && <span className="ff-label-meta">{imgMeta}</span>}
                    </div>
                )}
                {hiddenInput}
                <div className={`ff-avatar-wrap ${positionClass}`}>

                    {/* Clickable avatar circle/square */}
                    <button
                        type="button"
                        className={`ff-avatar-circle ${shapeClass} ${showErr ? "ff-avatar-circle--error" : ""} ${disabled ? "ff-avatar-circle--disabled" : ""}`}
                        onClick={() => !disabled && inputRef.current?.click()}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        disabled={disabled}
                        aria-label={hasImage ? "Change image" : "Upload image"}
                    >
                        {hasImage ? (
                            <img src={previewMap[0].url} alt={file?.name || "Preview"} className="ff-avatar-img" />
                        ) : (
                            <span className="ff-avatar-empty" aria-hidden="true"><Icon.Camera /></span>
                        )}

                        {/* Hover overlay — shows Replace + Remove when image is loaded, camera prompt when empty */}
                        <span className={`ff-avatar-overlay ${shapeClass}`} aria-hidden="true">
                            {hasImage ? (
                                // Two icon buttons shown on top of the image on hover
                                <span className="ff-avatar-overlay-actions">
                                    <span className="ff-avatar-overlay-btn ff-avatar-overlay-btn--replace" title="Replace">
                                        <Icon.Refresh />
                                    </span>
                                    <span
                                        className="ff-avatar-overlay-btn ff-avatar-overlay-btn--remove"
                                        title="Remove"
                                        onMouseDown={(e) => {
                                            // Stop propagation so the parent button's onClick (file picker) doesn't fire
                                            e.stopPropagation();
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (!disabled) remove(0);
                                        }}
                                    >
                                        <Icon.X />
                                    </span>
                                </span>
                            ) : (
                                // Empty state: camera + prompt
                                <>
                                    <Icon.Camera />
                                    <span className="ff-avatar-overlay-label">UPLOAD</span>
                                </>
                            )}
                        </span>
                    </button>

                    {/* Status dot — conditionally shown, optionally disabled */}
                    {showDot && hasImage && (
                        <span
                            className={`ff-avatar-dot ${avatarShape === "square" ? "ff-avatar-dot--square" : ""} ${dotDisabled ? "ff-avatar-dot--disabled" : ""}`}
                            aria-hidden="true"
                        />
                    )}

                    {/* File name + size — hidden by default, shown when showFileName=true */}
                    {showFileName && hasImage && (
                        <div className="ff-avatar-filename-row">
                            <span className="ff-avatar-filename">{file?.name}</span>
                            <span className="ff-avatar-filesize">{formatFileSize(file?.size)}</span>
                        </div>
                    )}
                </div>

                {hasPickerErrors && <FilePickerErrors fileErrors={fileErrors} atomicError={atomicError} externalError={error} showError={showError} />}
                {errors?.length > 0 && <FormFieldErrors errors={errors} showError={showError} />}
                {!hasPickerErrors && !errors?.length && <FormFieldMessage hasError={showErr} helperText={helperText} error={displayError} errors={errors} />}
            </div>
        );
    }

    if (!multiple && previewMap.length === 1) {
        const file = previewMap[0].file;
        return (
            <div className={`ff ff--picker ${className}`}>
                {label && (
                    <div className="ff-label-row">
                        <span className="ff-label">{label}</span>
                        {imgMeta && <span className="ff-label-meta">{imgMeta}</span>}
                    </div>
                )}
                {hiddenInput}
                <div className={`ff-sp-card ${showErr ? "ff-sp-card--error" : ""}`}>
                    {/* Thumbnail — image fills the area, subtle zoom on hover */}
                    <div className="ff-sp-thumb ff-sp-thumb--image">
                        <img
                            src={previewMap[0].url}
                            alt={file?.name || "Preview"}
                            className={`ff-sp-thumb-img ${previewWidth}`}
                        />
                    </div>
                    {/* Footer: icon + name/size + actions */}
                    <div className="ff-sp-footer">
                        <div className="ff-sp-meta">
                            <span className="ff-sp-type-icon ff-sp-type-icon--image">
                                <Icon.Image />
                            </span>
                            <div className="ff-sp-meta-text">
                                <span className="ff-sp-name">{file?.name}</span>
                                <span className="ff-sp-size">{formatFileSize(file?.size)}</span>
                            </div>
                        </div>
                        <div className="ff-sp-actions">
                            <button
                                type="button"
                                className="ff-sp-change"
                                onClick={() => inputRef.current?.click()}
                                disabled={disabled}
                            >
                                <Icon.Refresh />
                                <span>Change</span>
                            </button>
                            <button
                                type="button"
                                className="ff-sp-remove"
                                onClick={() => remove(0)}
                                disabled={disabled}
                                aria-label="Remove image"
                            >
                                <Icon.X />
                            </button>
                        </div>
                    </div>
                </div>
                {hasPickerErrors && <FilePickerErrors fileErrors={fileErrors} atomicError={atomicError} externalError={error} showError={showError} />}
                {errors?.length > 0 && <FormFieldErrors errors={errors} showError={showError} />}
                {!hasPickerErrors && !errors?.length && <FormFieldMessage hasError={showErr} helperText={helperText} error={displayError} errors={errors} />}
            </div>
        );
    }

    return (
        <div className={`ff ff--picker ${className}`}>
            {label && (
                <div className="ff-label-row">
                    <span className="ff-label">{label}</span>
                    {imgMeta && <span className="ff-label-meta">{imgMeta}</span>}
                </div>
            )}
            {hiddenInput}
            <div
                className={`ff-file-zone
                    ${dragging ? "ff-file-zone--drag" : ""}
                    ${showErr ? "ff-file-zone--error" : ""}
                `}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => !disabled && inputRef.current?.click()}
            >
                <div className="ff-file-icon"><Icon.Image /></div>
                <div className="ff-file-zone-title">{dragging ? "Drop images here" : "Upload Images"}</div>
                <div className="ff-file-zone-sub">Drag & drop or click to browse</div>
                <button type="button" className="ff-file-btn" onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}>
                    <Icon.Upload /> Choose Images
                </button>
                {maxSize && <div className="ff-file-info">Max {formatFileSize(maxSize)} per file</div>}
            </div>
            {previewMap.length > 0 && previewMode === "list" && (
                <div className="ff-media-list ff-media-list--image">
                    {previewMap.map((entry, i) => {
                        const nameParts = entry.file.name.lastIndexOf(".");
                        const baseName = nameParts > 0 ? entry.file.name.slice(0, nameParts) : entry.file.name;
                        const ext = nameParts > 0 ? entry.file.name.slice(nameParts + 1).toUpperCase() : "";
                        return (
                            <div key={i} className="ff-media-list-item">
                                <div className="ff-media-list-thumb ff-media-list-thumb--image">
                                    <img src={entry.url} alt={`Preview ${i + 1}`} className="ff-media-list-thumb-img" />
                                </div>
                                <div className="ff-media-list-info">
                                    <span className="ff-media-list-name">{baseName}</span>
                                    <div className="ff-media-list-meta">
                                        {ext && <span className="ff-media-list-ext">{ext}</span>}
                                        <span className="ff-media-list-size">{formatFileSize(entry.file.size)}</span>
                                    </div>
                                </div>
                                <button type="button" className="ff-media-list-remove" onClick={() => remove(i)} aria-label="Remove image">
                                    <Icon.X />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
            {previewMap.length > 0 && previewMode === "grid" && (
                <div className="ff-preview-grid">
                    {previewMap.map((entry, i) => (
                        <div key={i} className="ff-preview-item">
                            <img src={entry.url} alt={`Preview ${i + 1}`} className="ff-preview-media" />
                            <div className="ff-preview-overlay">
                                <button type="button" className="ff-preview-remove" onClick={() => remove(i)} aria-label="Remove image">
                                    <Icon.X />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {hasPickerErrors && <FilePickerErrors fileErrors={fileErrors} atomicError={atomicError} externalError={error} showError={showError} />}
            {errors?.length > 0 && <FormFieldErrors errors={errors} showError={showError} />}
            {!hasPickerErrors && !errors?.length && <FormFieldMessage hasError={showErr} helperText={helperText} error={displayError} errors={errors} />}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   18. VideoPickerField
   FIX v2: video element now has `controls` so it's actually playable.
           Single mode shows a full video player UI.
═══════════════════════════════════════════════════════════════════════════════ */

/**
 * VideoPickerField — Drag-drop video picker with real video player preview.
 *
 * Single mode: shows a full-width video player with controls.
 * Multi mode: shows a grid of video thumbnails (hover to reveal remove button).
 *
 * @param {Object}   props
 * @param {string}   [props.previewMode="list"] - Multi preview style: "list" | "grid"
 * @param {string}   [props.previewWidth]
 * @param {File[]}   [props.value]
 * @param {Function} [props.onChange]     - (files: File[]) => void
 * @param {Function} [props.setValue]
 * @param {boolean}  [props.multiple=false]
 * @param {number}   [props.maxFiles=5]
 * @param {number}   [props.maxSize]      - Bytes
 * @param {string}   [props.helperText]
 * @param {string}   [props.error]
 * @param {boolean}  [props.disabled]
 *
 * @example
 * // Single video upload:
 * <VideoPickerField
 *   label="Intro Video"
 *   value={video}
 *   setValue={setVideo}
 *   multiple={false}
 *   maxSize={100 * 1024 * 1024}
 *   error={errors.video}
 *   helperText="Max 100 MB. MP4 recommended."
 * />
 *
 * // Multi video course:
 * <VideoPickerField
 *   label="Course Videos"
 *   value={videos}
 *   setValue={setVideos}
 *   multiple
 *   maxFiles={5}
 *   maxSize={200 * 1024 * 1024}
 *   error={errors.videos}
 * />
 */
export function VideoPickerField({
    label = "",
    value = [],
    onChange,
    setValue,
    multiple = false,
    maxFiles = 5,
    maxSize,
    helperText = "",
    error = "",
    showError = true,
    disabled = false,
    errors = [],
    info = "",
    className = "",
    previewWidth = "auto",
    previewMode = "list",
    /**
     * variant — controls the single-file (multiple=false) display style.
     * "card"   (default) — original card with video thumb + footer (unchanged).
     * "avatar" — circular avatar with play badge, hover overlay + purple dot.
     */
    variant = "card",
}) {
    const hasError = showError && (Boolean(error) || Boolean(errors?.length));
    const [previewMap, setPreviewMap] = useState([]);

    useEffect(() => {
        return () => previewMap.forEach((p) => URL.revokeObjectURL(p.url));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (value.length === 0 && previewMap.length > 0) {
            previewMap.forEach((p) => URL.revokeObjectURL(p.url));
            setPreviewMap([]);
        }
    }, [value.length]); // eslint-disable-line react-hooks/exhaustive-deps

    const onFiles = useCallback((files) => {
        const entries = files.map((f) => ({ file: f, url: URL.createObjectURL(f) }));
        const nextFiles = multiple ? [...value, ...files] : files;
        setValue?.(nextFiles);
        onChange?.(nextFiles);
        setPreviewMap((p) => multiple ? [...p, ...entries] : entries);
    }, [value, multiple, setValue, onChange]);

    const { dragging, localError, fileErrors, atomicError, inputRef, handleNative, handleDrop, handleDragOver, handleDragLeave } =
        useFilePicker({ accept: "video/*", multiple, maxSize, maxFiles, onFiles, disabled });

    const remove = useCallback((i) => {
        URL.revokeObjectURL(previewMap[i]?.url);
        const nextFiles = value.filter((_, idx) => idx !== i);
        setValue?.(nextFiles);
        onChange?.(nextFiles);
        setPreviewMap((p) => p.filter((_, idx) => idx !== i));
    }, [value, previewMap, setValue, onChange]);

    const displayError = error || localError;
    const showErr = showError && (Boolean(displayError) || Boolean(errors?.length));
    const hasPickerErrors = fileErrors.length > 0 || Boolean(atomicError);

    const hiddenInput = (
        <input
            ref={inputRef}
            type="file"
            accept="video/*"
            multiple={multiple}
            className="ff-file-native"
            onChange={handleNative}
            disabled={disabled}
        />
    );

    // Build metadata string
    const vidMeta = [
        multiple && maxFiles ? `max ${maxFiles} files` : null,
        maxSize ? `${formatFileSize(maxSize)} each` : null,
        multiple ? "videos only" : null,
    ].filter(Boolean).join(" · ");

    // ── Avatar variant: circle picker (single mode only) ──────────────────
    if (!multiple && variant === "avatar") {
        const hasVideo = previewMap.length === 1;
        const file = hasVideo ? previewMap[0].file : null;
        return (
            <div className={`ff ff--picker ${className}`}>
                {label && (
                    <div className="ff-label-row">
                        <span className="ff-label">{label}</span>
                        {vidMeta && <span className="ff-label-meta">{vidMeta}</span>}
                    </div>
                )}
                {hiddenInput}
                <div className="ff-avatar-wrap">
                    <button
                        type="button"
                        className={`ff-avatar-circle ff-avatar-circle--video ${showErr ? "ff-avatar-circle--error" : ""} ${disabled ? "ff-avatar-circle--disabled" : ""}`}
                        onClick={() => !disabled && inputRef.current?.click()}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        disabled={disabled}
                        aria-label={hasVideo ? "Change video" : "Upload video"}
                    >
                        {hasVideo ? (
                            <>
                                <video src={previewMap[0].url} className="ff-avatar-img" preload="metadata" muted playsInline />
                                <span className="ff-avatar-play-badge" aria-hidden="true"><Icon.PlayCircle /></span>
                            </>
                        ) : (
                            <span className="ff-avatar-empty ff-avatar-empty--video" aria-hidden="true"><Icon.Video /></span>
                        )}
                        <span className="ff-avatar-overlay" aria-hidden="true">
                            <Icon.Camera />
                            <span className="ff-avatar-overlay-label">CHANGE</span>
                        </span>
                    </button>
                    {hasVideo && <span className="ff-avatar-dot ff-avatar-dot--video" aria-hidden="true" />}
                    {hasVideo && (
                        <div className="ff-avatar-actions">
                            <button type="button" className="ff-avatar-remove" onClick={() => remove(0)} disabled={disabled} aria-label="Remove video">
                                <Icon.X /><span>Remove</span>
                            </button>
                            <span className="ff-avatar-filename">{file?.name}</span>
                            <span className="ff-avatar-filesize">{formatFileSize(file?.size)}</span>
                        </div>
                    )}
                </div>
                {hasPickerErrors && <FilePickerErrors fileErrors={fileErrors} atomicError={atomicError} externalError={error} showError={showError} />}
                {errors?.length > 0 && <FormFieldErrors errors={errors} showError={showError} />}
                {!hasPickerErrors && !errors?.length && <FormFieldMessage hasError={showErr} helperText={helperText} error={displayError} errors={errors} />}
            </div>
        );
    }

    // Single mode: video thumbnail card.
    // BUG FIX: same root cause as ImagePickerField —
    // `value.length === 1` fails when parent state isn't updated yet.
    // Fix: only check previewMap.length, read metadata from previewMap[0].file.
    if (!multiple && previewMap.length === 1) {
        const file = previewMap[0].file;
        return (
            <div className={`ff ff--picker ${className}`}>
                {label && (
                    <div className="ff-label-row">
                        <span className="ff-label">{label}</span>
                        {vidMeta && <span className="ff-label-meta">{vidMeta}</span>}
                    </div>
                )}
                {hiddenInput}
                <div className={`ff-sp-card ${showErr ? "ff-sp-card--error" : ""}`}>
                    {/* Thumbnail — preload="metadata" loads the first frame as poster.
                        NO `controls` — intentionally static thumbnail with play overlay. */}
                    <div className="ff-sp-thumb ff-sp-thumb--video">
                        <video
                            src={previewMap[0].url}
                            className={`ff-sp-thumb-video ${previewWidth}`}
                            preload="metadata"
                            muted
                            playsInline
                        />
                        {/* Play button overlay — visual indicator that this is a video */}
                        <div className="ff-sp-video-overlay" aria-hidden="true">
                            <div className="ff-sp-play-btn">
                                <Icon.PlayCircle />
                            </div>
                        </div>
                    </div>
                    {/* Footer */}
                    <div className="ff-sp-footer">
                        <div className="ff-sp-meta">
                            <span className="ff-sp-type-icon ff-sp-type-icon--video">
                                <Icon.Video />
                            </span>
                            <div className="ff-sp-meta-text">
                                <span className="ff-sp-name">{file?.name}</span>
                                <span className="ff-sp-size">{formatFileSize(file?.size)}</span>
                            </div>
                        </div>
                        <div className="ff-sp-actions">
                            <button
                                type="button"
                                className="ff-sp-change"
                                onClick={() => inputRef.current?.click()}
                                disabled={disabled}
                            >
                                <Icon.Refresh />
                                <span>Change</span>
                            </button>
                            <button
                                type="button"
                                className="ff-sp-remove"
                                onClick={() => remove(0)}
                                disabled={disabled}
                                aria-label="Remove video"
                            >
                                <Icon.X />
                            </button>
                        </div>
                    </div>
                </div>
                {hasPickerErrors && <FilePickerErrors fileErrors={fileErrors} atomicError={atomicError} externalError={error} showError={showError} />}
                {errors?.length > 0 && <FormFieldErrors errors={errors} showError={showError} />}
                {!hasPickerErrors && !errors?.length && <FormFieldMessage hasError={showErr} helperText={helperText} error={displayError} errors={errors} />}
            </div>
        );
    }

    return (
        <div className={`ff ff--picker ${className}`}>
            {label && (
                <div className="ff-label-row">
                    <span className="ff-label">{label}</span>
                    {vidMeta && <span className="ff-label-meta">{vidMeta}</span>}
                </div>
            )}
            {hiddenInput}
            <div
                className={`ff-file-zone
                    ${dragging ? "ff-file-zone--drag" : ""}
                    ${showErr ? "ff-file-zone--error" : ""}
                `}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => !disabled && inputRef.current?.click()}
            >
                <div className="ff-file-icon"><Icon.Video /></div>
                <div className="ff-file-zone-title">{dragging ? "Drop videos here" : "Upload Videos"}</div>
                <div className="ff-file-zone-sub">Drag & drop or click to browse</div>
                <button type="button" className="ff-file-btn" onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}>
                    <Icon.Upload /> Choose Videos
                </button>
                {maxSize && <div className="ff-file-info">Max {formatFileSize(maxSize)} per file</div>}
            </div>
            {previewMap.length > 0 && previewMode === "list" && (
                <div className="ff-media-list ff-media-list--video">
                    {previewMap.map((entry, i) => {
                        const nameParts = entry.file.name.lastIndexOf(".");
                        const baseName = nameParts > 0 ? entry.file.name.slice(0, nameParts) : entry.file.name;
                        const ext = nameParts > 0 ? entry.file.name.slice(nameParts + 1).toUpperCase() : "";
                        return (
                            <div key={i} className="ff-media-list-item">
                                <div className="ff-media-list-thumb ff-media-list-thumb--video">
                                    <video src={entry.url} className="ff-media-list-thumb-img" muted preload="metadata" />
                                    <span className="ff-media-list-play-icon" aria-hidden="true"><Icon.PlayCircle /></span>
                                </div>
                                <div className="ff-media-list-info">
                                    <span className="ff-media-list-name">{baseName}</span>
                                    <div className="ff-media-list-meta">
                                        {ext && <span className="ff-media-list-ext ff-media-list-ext--video">{ext}</span>}
                                        <span className="ff-media-list-size">{formatFileSize(entry.file.size)}</span>
                                    </div>
                                </div>
                                <button type="button" className="ff-media-list-remove" onClick={() => remove(i)} aria-label="Remove video">
                                    <Icon.X />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
            {previewMap.length > 0 && previewMode === "grid" && (
                <div className="ff-preview-grid">
                    {previewMap.map((entry, i) => (
                        <div key={i} className="ff-preview-item ff-preview-item--video">
                            <video src={entry.url} className="ff-preview-media" muted preload="metadata" />
                            <div className="ff-preview-overlay ff-preview-overlay--always">
                                <span className="ff-preview-play-icon" aria-hidden="true"><Icon.PlayCircle /></span>
                                <button type="button" className="ff-preview-remove" onClick={() => remove(i)} aria-label="Remove video">
                                    <Icon.X />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {hasPickerErrors && <FilePickerErrors fileErrors={fileErrors} atomicError={atomicError} externalError={error} showError={showError} />}
            {errors?.length > 0 && <FormFieldErrors errors={errors} showError={showError} />}
            {!hasPickerErrors && !errors?.length && <FormFieldMessage hasError={showErr} helperText={helperText} error={displayError} errors={errors} />}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   19. FilePickerField
   FIX v2: single mode shows prominent selected-file card instead of the zone
═══════════════════════════════════════════════════════════════════════════════ */

/**
 * FilePickerField — Generic drag-drop file picker.
 *
 * Single mode: when a file is selected, replaces the upload zone with a
 * prominent file card showing the icon, name, size, and Change/Remove actions.
 *
 * Multi mode: shows all selected files in a clean list below the upload zone.
 *
 * @param {Object}   props
 * @param {string}   [props.label]
 * @param {File[]}   [props.value]
 * @param {Function} [props.onChange]      - (files: File[]) => void
 * @param {Function} [props.setValue]
 * @param {string}   [props.accept]        - MIME types / extensions
 * @param {boolean}  [props.multiple=true]
 * @param {number}   [props.maxFiles=10]
 * @param {number}   [props.maxSize]       - Bytes
 * @param {string}   [props.previewMode="list"] - Multi preview style: "list" | "grid"
 * @param {string}   [props.helperText]
 * @param {string}   [props.error]
 * @param {boolean}  [props.disabled]
 *
 * @example
 * // Single file (e.g. resume):
 * <FilePickerField
 *   label="Resume / CV"
 *   value={resume}
 *   setValue={setResume}
 *   accept=".pdf,.doc,.docx"
 *   multiple={false}
 *   maxSize={5 * 1024 * 1024}
 *   error={errors.resume}
 *   helperText="PDF or Word document, max 5 MB"
 * />
 *
 * // Multi file attachments:
 * <FilePickerField
 *   label="Attachments"
 *   value={files}
 *   setValue={setFiles}
 *   accept=".pdf,.docx,.xlsx,.jpg"
 *   maxSize={10 * 1024 * 1024}
 *   maxFiles={5}
 *   error={errors.files}
 * />
 */
export function FilePickerField({
    label = "",
    value = [],
    onChange,
    setValue,
    accept = "*",
    multiple = true,
    maxFiles = 10,
    maxSize,
    helperText = "",
    error = "",
    showError = true,
    disabled = false,
    errors = [],
    info = "",
    className = "",
    previewMode = "list",
    /**
     * variant — controls the single-file (multiple=false) display style.
     * "card"   (default) — original colored file-type card (unchanged).
     * "avatar" — circular avatar with file ext badge + hover overlay.
     */
    variant = "card",
}) {
    /*
     * ROOT CAUSE FIX:
     * আগে শুধু `value` prop দেখে render করা হতো।
     * `value` parent-এ update না হলে preview দেখাত না।
     *
     * এখন ImagePickerField-এর previewMap-এর মতোই `internalFiles` রাখা হচ্ছে।
     * ফলে parent state ছাড়াও component নিজেই সঠিকভাবে কাজ করে।
     *
     * Flow:
     *   file select → internalFiles update (তাৎক্ষণিক render)
     *               → setValue / onChange (parent inform)
     */
    const [internalFiles, setInternalFiles] = useState(() => value || []);

    // Parent যদি value=[] করে reset করে (যেমন form.reset()), internal-ও clear হবে
    useEffect(() => {
        if (value.length === 0 && internalFiles.length > 0) {
            setInternalFiles([]);
        }
    }, [value.length]); // eslint-disable-line react-hooks/exhaustive-deps

    const onFiles = useCallback((newFiles) => {
        // internalFiles থেকে build করি, value prop নয় —
        // এটাই guarantee করে যে সবসময় সঠিক current list পাওয়া যাবে
        const next = multiple
            ? [...internalFiles, ...newFiles]
            : newFiles;
        setInternalFiles(next); // এখনই render হবে
        setValue?.(next);       // parent inform
        onChange?.(next);
    }, [internalFiles, multiple, setValue, onChange]);

    const { dragging, localError, fileErrors, atomicError, inputRef, handleNative, handleDrop, handleDragOver, handleDragLeave } =
        useFilePicker({ accept, multiple, maxSize, maxFiles, onFiles, disabled });

    const remove = useCallback((i) => {
        const next = internalFiles.filter((_, idx) => idx !== i);
        setInternalFiles(next);
        setValue?.(next);
        onChange?.(next);
    }, [internalFiles, setValue, onChange]);

    const displayError = error || localError;
    const showErr = showError && (Boolean(displayError) || Boolean(errors?.length));
    const hasPickerErrors = fileErrors.length > 0 || Boolean(atomicError);

    // Hidden input — সবসময় DOM-এ থাকে যাতে inputRef কখনো null না হয়
    const hiddenInput = (
        <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            className="ff-file-native"
            onChange={handleNative}
            disabled={disabled}
        />
    );

    // Build metadata string
    const fileMeta = [
        multiple && maxFiles ? `max ${maxFiles} files` : null,
        maxSize ? `${formatFileSize(maxSize)} each` : null,
        accept && accept !== "*" ? accept : null,
    ].filter(Boolean).join(" · ");

    // ── Avatar variant: circle picker (single mode only) ──────────────────
    if (!multiple && variant === "avatar" && internalFiles.length === 1) {
        const ft = getFileType(internalFiles[0]?.name);
        return (
            <div className={`ff ff--picker ${className}`}>
                {label && (
                    <div className="ff-label-row">
                        <span className="ff-label">{label}</span>
                        {fileMeta && <span className="ff-label-meta">{fileMeta}</span>}
                    </div>
                )}
                {hiddenInput}
                <div className="ff-avatar-wrap">
                    <button
                        type="button"
                        className={`ff-avatar-circle ff-avatar-circle--file ${showErr ? "ff-avatar-circle--error" : ""} ${disabled ? "ff-avatar-circle--disabled" : ""}`}
                        style={{ background: ft.bg }}
                        onClick={() => !disabled && inputRef.current?.click()}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        disabled={disabled}
                        aria-label="Change file"
                    >
                        <span className="ff-avatar-file-ext" style={{ color: ft.color }}>{ft.label}</span>
                        <span className="ff-avatar-overlay" aria-hidden="true">
                            <Icon.Camera />
                            <span className="ff-avatar-overlay-label">CHANGE</span>
                        </span>
                    </button>
                    <span
                        className="ff-avatar-dot"
                        style={{ background: ft.color, boxShadow: `0 0 0 3px var(--form-surface-2), 0 0 8px ${ft.color}` }}
                        aria-hidden="true"
                    />
                    <div className="ff-avatar-actions">
                        <button type="button" className="ff-avatar-remove" onClick={() => remove(0)} disabled={disabled} aria-label="Remove file">
                            <Icon.X /><span>Remove</span>
                        </button>
                        <span className="ff-avatar-filename">{internalFiles[0]?.name}</span>
                        <span className="ff-avatar-filesize">{formatFileSize(internalFiles[0]?.size)}</span>
                    </div>
                </div>
                {hasPickerErrors && <FilePickerErrors fileErrors={fileErrors} atomicError={atomicError} externalError={error} showError={showError} />}
                {errors?.length > 0 && <FormFieldErrors errors={errors} showError={showError} />}
                {!hasPickerErrors && !errors?.length && <FormFieldMessage hasError={showErr} helperText={helperText} error={displayError} errors={errors} />}
            </div>
        );
    }

    // Also show avatar empty circle when variant="avatar" and no file yet
    if (!multiple && variant === "avatar" && internalFiles.length === 0) {
        return (
            <div className={`ff ff--picker ${className}`}>
                {label && (
                    <div className="ff-label-row">
                        <span className="ff-label">{label}</span>
                        {fileMeta && <span className="ff-label-meta">{fileMeta}</span>}
                    </div>
                )}
                {hiddenInput}
                <div className="ff-avatar-wrap">
                    <button
                        type="button"
                        className={`ff-avatar-circle ff-avatar-circle--file ${showErr ? "ff-avatar-circle--error" : ""} ${disabled ? "ff-avatar-circle--disabled" : ""}`}
                        onClick={() => !disabled && inputRef.current?.click()}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        disabled={disabled}
                        aria-label="Upload file"
                    >
                        <span className="ff-avatar-empty" aria-hidden="true"><Icon.File /></span>
                        <span className="ff-avatar-overlay" aria-hidden="true">
                            <Icon.Camera />
                            <span className="ff-avatar-overlay-label">UPLOAD</span>
                        </span>
                    </button>
                </div>
                {hasPickerErrors && <FilePickerErrors fileErrors={fileErrors} atomicError={atomicError} externalError={error} showError={showError} />}
                {errors?.length > 0 && <FormFieldErrors errors={errors} showError={showError} />}
                {!hasPickerErrors && !errors?.length && <FormFieldMessage hasError={showErr} helperText={helperText} error={displayError} errors={errors} />}
            </div>
        );
    }

    // Single mode: file-type card — colored background, extension badge, decorative lines
    if (!multiple && internalFiles.length === 1) {
        // getFileType returns { color, bg, label } based on extension
        const ft = getFileType(internalFiles[0]?.name);
        return (
            <div className={`ff ff--picker ${className}`}>
                {label && (
                    <div className="ff-label-row">
                        <span className="ff-label">{label}</span>
                        {fileMeta && <span className="ff-label-meta">{fileMeta}</span>}
                    </div>
                )}
                {hiddenInput}
                <div className={`ff-sp-card ${showErr ? "ff-sp-card--error" : ""}`}>
                    {/* File type visual area — colored bg, big extension text, decorative lines */}
                    <div
                        className="ff-sp-thumb ff-sp-thumb--file"
                        style={{ background: ft.bg }}
                    >
                        <div className="ff-sp-file-visual">
                            <span className="ff-sp-file-ext" style={{ color: ft.color }}>
                                {ft.label}
                            </span>
                            {/* Decorative "lines" that mimic document rows */}
                            <div className="ff-sp-file-lines" style={{ color: ft.color }} aria-hidden="true">
                                <span style={{ width: "52px" }} />
                                <span style={{ width: "38px" }} />
                                <span style={{ width: "46px" }} />
                                <span style={{ width: "28px" }} />
                            </div>
                        </div>
                    </div>
                    {/* Footer */}
                    <div className="ff-sp-footer">
                        <div className="ff-sp-meta">
                            <span className="ff-sp-type-icon" style={{ color: ft.color }}>
                                <Icon.File />
                            </span>
                            <div className="ff-sp-meta-text">
                                <span className="ff-sp-name">{internalFiles[0]?.name}</span>
                                <span className="ff-sp-size">{formatFileSize(internalFiles[0]?.size)}</span>
                            </div>
                        </div>
                        <div className="ff-sp-actions">
                            <button
                                type="button"
                                className="ff-sp-change"
                                onClick={() => inputRef.current?.click()}
                                disabled={disabled}
                            >
                                <Icon.Refresh />
                                <span>Change</span>
                            </button>
                            <button
                                type="button"
                                className="ff-sp-remove"
                                onClick={() => remove(0)}
                                disabled={disabled}
                                aria-label="Remove file"
                            >
                                <Icon.X />
                            </button>
                        </div>
                    </div>
                </div>
                {hasPickerErrors && <FilePickerErrors fileErrors={fileErrors} atomicError={atomicError} externalError={error} showError={showError} />}
                {errors?.length > 0 && <FormFieldErrors errors={errors} showError={showError} />}
                {!hasPickerErrors && !errors?.length && <FormFieldMessage hasError={showErr} helperText={helperText} error={displayError} errors={errors} />}
            </div>
        );
    }

    // Multi mode: upload zone + selected files list নিচে
    return (
        <div className={`ff ff--picker ${className}`}>
            {label && (
                <div className="ff-label-row">
                    <span className="ff-label">{label}</span>
                    {fileMeta && <span className="ff-label-meta">{fileMeta}</span>}
                </div>
            )}
            {hiddenInput}
            <div
                className={`ff-file-zone
                    ${dragging ? "ff-file-zone--drag" : ""}
                    ${showErr ? "ff-file-zone--error" : ""}
                `}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => !disabled && inputRef.current?.click()}
            >
                <div className="ff-file-icon"><Icon.File /></div>
                <div className="ff-file-zone-title">{dragging ? "Drop files here" : "Upload Files"}</div>
                <div className="ff-file-zone-sub">Drag & drop or click to browse</div>
                <button type="button" className="ff-file-btn" onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}>
                    <Icon.Upload /> Choose Files
                </button>
                <div className="ff-file-info">
                    {accept !== "*" && `Accepted: ${accept}`}
                    {maxSize && ` · Max ${formatFileSize(maxSize)}`}
                </div>
            </div>

            {/* File list — list or grid view controlled by previewMode prop */}
            {internalFiles.length > 0 && previewMode === "list" && (
                <div className="ff-media-list ff-media-list--file">
                    {internalFiles.map((file, i) => {
                        const ft = getFileType(file.name);
                        const nameParts = file.name.lastIndexOf(".");
                        const baseName = nameParts > 0 ? file.name.slice(0, nameParts) : file.name;
                        const ext = nameParts > 0 ? file.name.slice(nameParts + 1).toUpperCase() : "";
                        return (
                            <div key={`${file.name}-${file.size}-${i}`} className="ff-media-list-item">
                                <div className="ff-media-list-thumb ff-media-list-thumb--file" style={{ background: ft.bg }}>
                                    <span className="ff-media-list-file-ext" style={{ color: ft.color }}>{ft.label}</span>
                                </div>
                                <div className="ff-media-list-info">
                                    <span className="ff-media-list-name">{baseName}</span>
                                    <div className="ff-media-list-meta">
                                        {ext && <span className="ff-media-list-ext" style={{ color: ft.color, borderColor: `${ft.color}44`, background: ft.bg }}>{ext}</span>}
                                        <span className="ff-media-list-size">{formatFileSize(file.size)}</span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="ff-media-list-remove"
                                    onClick={() => remove(i)}
                                    aria-label={`Remove ${file.name}`}
                                >
                                    <Icon.X />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
            {internalFiles.length > 0 && previewMode === "grid" && (
                <div className="ff-preview-grid ff-preview-grid--file">
                    {internalFiles.map((file, i) => {
                        const ft = getFileType(file.name);
                        const nameParts = file.name.lastIndexOf(".");
                        const baseName = nameParts > 0 ? file.name.slice(0, nameParts) : file.name;
                        return (
                            <div key={`${file.name}-${file.size}-${i}`} className="ff-preview-item ff-preview-item--file">
                                <div className="ff-preview-file-card" style={{ background: ft.bg }}>
                                    <span className="ff-preview-file-card-ext" style={{ color: ft.color }}>{ft.label}</span>
                                    <div className="ff-preview-file-card-lines" style={{ color: ft.color }} aria-hidden="true">
                                        <span style={{ width: "52%" }} /><span style={{ width: "38%" }} /><span style={{ width: "46%" }} />
                                    </div>
                                </div>
                                <div className="ff-preview-file-card-footer">
                                    <span className="ff-preview-file-card-name" title={baseName}>{baseName}</span>
                                    <span className="ff-preview-file-card-size">{formatFileSize(file.size)}</span>
                                </div>
                                <button
                                    type="button"
                                    className="ff-preview-remove ff-preview-remove--file"
                                    onClick={() => remove(i)}
                                    aria-label={`Remove ${file.name}`}
                                >
                                    <Icon.X />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
            {hasPickerErrors && <FilePickerErrors fileErrors={fileErrors} atomicError={atomicError} externalError={error} showError={showError} />}
            {errors?.length > 0 && <FormFieldErrors errors={errors} showError={showError} />}
            {!hasPickerErrors && !errors?.length && <FormFieldMessage hasError={showErr} helperText={helperText} error={displayError} errors={errors} />}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   20. ColorPickerField
   Two variants: "swatches" (preset palette + optional hex input)
                 "input"    (native color wheel + hex + RGB breakdown)
═══════════════════════════════════════════════════════════════════════════════ */

/**
 * ColorPickerField — Color selection field with two visual styles.
 *
 * @param {Object}    props
 * @param {string}    [props.label]
 * @param {string}    [props.value]              - Hex color e.g. "#d4a843"
 * @param {Function}  [props.onChange]           - (hex: string) => void
 * @param {Function}  [props.setValue]
 * @param {string}    [props.variant="swatches"] - "swatches" | "input"
 * @param {string[]}  [props.swatches]           - Preset hex colors (swatches mode)
 * @param {boolean}   [props.allowCustom=true]   - Show hex input below swatches
 * @param {boolean}   [props.disabled]
 * @param {string}    [props.helperText]
 * @param {string}    [props.error]
 *
 * @example
 * // Swatches palette:
 * <ColorPickerField label="Brand Color" value={color} setValue={setColor} variant="swatches" />
 *
 * // Full color wheel + hex:
 * <ColorPickerField label="Accent" value={color} setValue={setColor} variant="input" />
 */
export function ColorPickerField({
    label = "",
    value = "#d4a843",
    onChange,
    setValue,
    variant = "swatches",
    swatches = [
        "#d4a843", "#f87171", "#fb923c", "#fbbf24",
        "#4ade80", "#34d399", "#60a5fa", "#818cf8",
        "#a78bfa", "#e879f9", "#f472b6", "#94a3b8",
        "#ffffff", "#000000",
    ],
    allowCustom = true,
    id,
    required = false,
    disabled = false,
    helperText = "",
    error = "",
    showError = true,
    errors = [],
    info = "",
    className = "",
}) {
    const uid = useId();
    const inputId = id || `ff-color-${uid}`;
    const hasError = showError && (Boolean(error) || Boolean(errors?.length));
    const [hexInput, setHexInput] = useState(value || "#d4a843");
    const nativeRef = useRef(null);

    // Keep hexInput in sync when value changes externally
    useEffect(() => {
        if (value && value !== hexInput) setHexInput(value);
    }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

    const commit = useCallback((hex) => {
        const clean = hex.trim();
        if (!/^#[0-9A-Fa-f]{3,6}$/.test(clean)) return;
        setValue?.(clean);
        onChange?.(clean);
    }, [setValue, onChange]);

    const handleHexChange = useCallback((e) => {
        const v = e.target.value;
        setHexInput(v);
        if (/^#[0-9A-Fa-f]{6}$/.test(v)) commit(v);
    }, [commit]);

    const handleNativeChange = useCallback((e) => {
        const hex = e.target.value;
        setHexInput(hex);
        commit(hex);
    }, [commit]);

    /* ── Swatches variant ─────────────────────────────────────────────── */
    if (variant === "swatches") {
        return (
            <div className={`ff ${className}`}>
                <FieldLabel htmlFor={inputId} label={label} required={required} info={info} />
                <div className="ff-color-swatches" role="group" aria-label="Color swatches">
                    {swatches.map((hex) => (
                        <button
                            key={hex}
                            type="button"
                            className={`ff-color-swatch ${value === hex ? "ff-color-swatch--active" : ""}`}
                            style={{ background: hex }}
                            onClick={() => { commit(hex); setHexInput(hex); }}
                            disabled={disabled}
                            aria-label={hex}
                            aria-pressed={value === hex}
                            title={hex}
                        >
                            {value === hex && (
                                <span className="ff-color-swatch-check" aria-hidden="true">
                                    <Icon.Check />
                                </span>
                            )}
                        </button>
                    ))}
                </div>
                {allowCustom && (
                    <div className="ff-color-custom-row">
                        {/* Small preview square — click to open native color picker */}
                        <button
                            type="button"
                            className="ff-color-preview-btn"
                            style={{ background: value || hexInput }}
                            onClick={() => nativeRef.current?.click()}
                            disabled={disabled}
                            aria-label="Open color picker"
                        />
                        <input
                            ref={nativeRef}
                            type="color"
                            className="ff-color-native-hidden"
                            value={value || hexInput}
                            onChange={handleNativeChange}
                            disabled={disabled}
                            tabIndex={-1}
                            aria-hidden="true"
                        />
                        <input
                            id={inputId}
                            type="text"
                            className={`ff-color-hex-input ${hasError ? "ff-input--error" : ""}`}
                            value={hexInput}
                            onChange={handleHexChange}
                            onBlur={() => commit(hexInput)}
                            placeholder="#rrggbb"
                            maxLength={7}
                            disabled={disabled}
                            spellCheck={false}
                            aria-label="Custom hex color"
                        />
                    </div>
                )}
                <FormFieldMessage hasError={hasError} helperText={helperText} error={error} errors={errors} />
            </div>
        );
    }

    /* ── Input variant ────────────────────────────────────────────────── */
    return (
        <div className={`ff ${className}`}>
            <FieldLabel htmlFor={inputId} label={label} required={required} info={info} />
            <div className="ff-color-input-row">
                {/* Big circle — click to open native color wheel */}
                <div className="ff-color-wheel-wrap">
                    <button
                        type="button"
                        className="ff-color-wheel-btn"
                        style={{ background: value || hexInput }}
                        onClick={() => nativeRef.current?.click()}
                        disabled={disabled}
                        aria-label="Open color picker"
                    >
                        <span className="ff-color-wheel-icon" aria-hidden="true">
                            <Icon.Palette />
                        </span>
                    </button>
                    <input
                        ref={nativeRef}
                        type="color"
                        className="ff-color-native-hidden"
                        value={value || hexInput}
                        onChange={handleNativeChange}
                        disabled={disabled}
                        tabIndex={-1}
                        aria-hidden="true"
                    />
                </div>
                {/* Hex text input + RGB breakdown */}
                <div className="ff-color-input-fields">
                    <label htmlFor={inputId} className="ff-color-input-label">HEX</label>
                    <div className="ff-input-wrap">
                        <input
                            id={inputId}
                            type="text"
                            className={`ff-input ff-color-hex-input-lg ${hasError ? "ff-input--error" : ""}`}
                            value={hexInput}
                            onChange={handleHexChange}
                            onBlur={() => commit(hexInput)}
                            placeholder="#rrggbb"
                            maxLength={7}
                            disabled={disabled}
                            spellCheck={false}
                        />
                        <div className="ff-typing-bar" aria-hidden="true" />
                    </div>
                    {/^#[0-9A-Fa-f]{6}$/.test(value) && (
                        <div className="ff-color-rgb-row">
                            {["R", "G", "B"].map((ch, i) => {
                                const hex16 = value.slice(1 + i * 2, 3 + i * 2);
                                return (
                                    <span key={ch} className="ff-color-rgb-chip">
                                        <span className="ff-color-rgb-label">{ch}</span>
                                        <span className="ff-color-rgb-val">{parseInt(hex16, 16)}</span>
                                    </span>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
            <FormFieldMessage hasError={hasError} helperText={helperText} error={error} errors={errors} />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   21. BooleanField — Yes / No selector
═══════════════════════════════════════════════════════════════════════════════ */

/**
 * BooleanField — True/False (Yes/No) selector as two pill buttons.
 * Clicking the active button deselects (value becomes null).
 *
 * @param {Object}       props
 * @param {string}       [props.label]
 * @param {boolean|null} [props.value]        - true | false | null (unset)
 * @param {Function}     [props.onChange]     - (value: boolean | null) => void
 * @param {Function}     [props.setValue]
 * @param {string}       [props.trueLabel="Yes"]
 * @param {string}       [props.falseLabel="No"]
 * @param {boolean}      [props.disabled]
 * @param {string}       [props.helperText]
 * @param {string}       [props.error]
 *
 * @example
 * <BooleanField label="Accept Terms" value={accepted} setValue={setAccepted} trueLabel="I agree" falseLabel="Decline" />
 */
export function BooleanField({
    label = "",
    value = null,
    onChange,
    setValue,
    trueLabel = "Yes",
    falseLabel = "No",
    disabled = false,
    required = false,
    helperText = "",
    error = "",
    showError = true,
    errors = [],
    info = "",
    id,
    className = "",
}) {
    const uid = useId();
    const groupId = id || `ff-bool-${uid}`;
    const hasError = showError && (Boolean(error) || Boolean(errors?.length));

    const select = useCallback((v) => {
        if (disabled) return;
        // Clicking the same value again deselects → null
        const next = value === v ? null : v;
        setValue?.(next);
        onChange?.(next);
    }, [value, disabled, setValue, onChange]);

    return (
        <div className={`ff ${className}`}>
            <FieldLabel htmlFor={groupId} label={label} required={required} info={info} />
            <div
                id={groupId}
                className={`ff-bool-group ${hasError ? "ff-bool-group--error" : ""}`}
                role="group"
                aria-label={label || "Boolean selection"}
            >
                <button
                    type="button"
                    className={`ff-bool-btn ff-bool-btn--true ${value === true ? "ff-bool-btn--active" : ""}`}
                    onClick={() => select(true)}
                    disabled={disabled}
                    aria-pressed={value === true}
                >
                    <span className="ff-bool-btn-icon" aria-hidden="true"><Icon.Check /></span>
                    {trueLabel}
                </button>
                <button
                    type="button"
                    className={`ff-bool-btn ff-bool-btn--false ${value === false ? "ff-bool-btn--active" : ""}`}
                    onClick={() => select(false)}
                    disabled={disabled}
                    aria-pressed={value === false}
                >
                    <span className="ff-bool-btn-icon" aria-hidden="true"><Icon.X /></span>
                    {falseLabel}
                </button>
            </div>
            <FormFieldMessage hasError={hasError} helperText={helperText} error={error} errors={errors} />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   22. JsonField — JSON textarea with live validation + format / minify
═══════════════════════════════════════════════════════════════════════════════ */

/**
 * JsonField — Multi-line JSON editor with live parse validation and prettify.
 *
 * @param {Object}   props
 * @param {string}   [props.label]
 * @param {string}   [props.value]          - Raw JSON string (controlled)
 * @param {Function} [props.onChange]       - (raw: string, parsed: object|null) => void
 * @param {Function} [props.setValue]       - (raw: string) => void
 * @param {number}   [props.rows=8]         - Visible textarea rows
 * @param {boolean}  [props.disabled]
 * @param {boolean}  [props.required]
 * @param {string}   [props.placeholder]
 * @param {string}   [props.helperText]
 * @param {string}   [props.error]
 *
 * @example
 * <JsonField label="Config" value={json} setValue={setJson} rows={10} helperText="Paste valid JSON" />
 */
export function JsonField({
    label = "",
    value = "",
    onChange,
    setValue,
    rows = 8,
    disabled = false,
    required = false,
    placeholder = '{\n  "key": "value"\n}',
    helperText = "",
    error = "",
    showError = true,
    errors = [],
    info = "",
    id,
    className = "",
}) {
    const uid = useId();
    const inputId = id || `ff-json-${uid}`;
    const [parseError, setParseError] = useState("");
    const [isValid, setIsValid] = useState(false);
    const { isTyping, triggerTyping } = useTypingIndicator(900);

    const externalError = showError && (Boolean(error) || Boolean(errors?.length));
    const hasError = externalError || Boolean(parseError);

    // Validate on every value change
    useEffect(() => {
        if (!value || !value.trim()) { setParseError(""); setIsValid(false); return; }
        try {
            JSON.parse(value);
            setParseError(""); setIsValid(true);
        } catch (e) {
            setParseError(e.message); setIsValid(false);
        }
    }, [value]);

    const handleChange = useCallback((e) => {
        const raw = e.target.value;
        setValue?.(raw);
        let parsed = null;
        try { parsed = JSON.parse(raw); } catch (_) { }
        onChange?.(raw, parsed);
        triggerTyping();
    }, [setValue, onChange, triggerTyping]);

    const handleFormat = useCallback(() => {
        if (!value) return;
        try {
            const pretty = JSON.stringify(JSON.parse(value), null, 2);
            setValue?.(pretty);
            let parsed = null; try { parsed = JSON.parse(pretty); } catch (_) { }
            onChange?.(pretty, parsed);
        } catch (_) { }
    }, [value, setValue, onChange]);

    const handleMinify = useCallback(() => {
        if (!value) return;
        try {
            const mini = JSON.stringify(JSON.parse(value));
            setValue?.(mini);
            let parsed = null; try { parsed = JSON.parse(mini); } catch (_) { }
            onChange?.(mini, parsed);
        } catch (_) { }
    }, [value, setValue, onChange]);

    const handleClear = useCallback(() => {
        setValue?.(""); onChange?.("", null);
    }, [setValue, onChange]);

    const displayError = error || parseError;

    return (
        <div className={`ff ${className}`}>
            <FieldLabel htmlFor={inputId} label={label} required={required} info={info} />
            {/* Toolbar */}
            <div className="ff-json-toolbar">
                <span className="ff-json-toolbar-label">
                    <Icon.Braces /><span>JSON</span>
                </span>
                <div className="ff-json-toolbar-actions">
                    <button type="button" className="ff-json-toolbar-btn" onClick={handleFormat} disabled={disabled || !isValid} title="Prettify">
                        <Icon.Sparkle />Format
                    </button>
                    <button type="button" className="ff-json-toolbar-btn" onClick={handleMinify} disabled={disabled || !isValid} title="Minify">
                        Minify
                    </button>
                    {value && (
                        <button type="button" className="ff-json-toolbar-btn ff-json-toolbar-btn--clear" onClick={handleClear} disabled={disabled} title="Clear">
                            <Icon.X />
                        </button>
                    )}
                    {value && value.trim() && (
                        <span className={`ff-json-status ${isValid ? "ff-json-status--valid" : "ff-json-status--invalid"}`}>
                            {isValid ? <><Icon.Check />Valid</> : <><Icon.AlertCircle />Invalid</>}
                        </span>
                    )}
                </div>
            </div>
            {/* Textarea */}
            <div className="ff-input-wrap">
                <textarea
                    id={inputId}
                    className={`ff-input ff-json-textarea ${hasError ? "ff-input--error" : ""} ${isValid && value ? "ff-json-textarea--valid" : ""}`}
                    value={value}
                    onChange={handleChange}
                    rows={rows}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    spellCheck={false}
                    autoCapitalize="off"
                    autoCorrect="off"
                    aria-invalid={hasError}
                />
                <div className={`ff-typing-bar${isTyping ? " ff-typing-bar--active" : ""}`} aria-hidden="true" />
            </div>
            {/* Error display — parse error takes priority over helper */}
            {externalError ? (
                <FormFieldMessage hasError={true} helperText={helperText} error={error} errors={errors} />
            ) : parseError ? (
                <div className="ff-message ff-message--error ff-json-parse-err" role="alert" aria-live="polite">
                    <span className="ff-message-icon"><Icon.AlertCircle /></span>
                    {parseError}
                </div>
            ) : (
                <FormFieldMessage hasError={false} helperText={helperText} />
            )}
        </div>
    );
}

/*23. SearchField
   — Search input with a live result popup.
   — 2 built -in formats: "simple" and "rich".
   — Auto - detects common field names(name, title, label, email, description…).
   — Inner result filter, fixed - height scroll, full keyboard nav(↑↓ Enter Esc).
═══════════════════════════════════════════════════════════════════════════════ */

/* ── Helpers ── */

/**
 * Pick the best "primary label" from a result item.
 * Checks common field names in priority order.
 */
function getLabel(item) {
    if (typeof item === "string") return item;
    return item?.name ?? item?.title ?? item?.label ?? item?.text ?? String(item);
}

/**
 * Pick a "secondary line" for rich format.
 */
function getSubLabel(item) {
    if (typeof item !== "object" || item === null) return "";
    return item?.description ?? item?.subtitle ?? item?.email ?? item?.meta ?? "";
}

/**
 * Pick an avatar / icon hint for rich format.
 * Returns { type: "image"|"initials"|"icon", value }.
 */
function getAvatar(item) {
    if (typeof item !== "object" || item === null) return { type: "icon" };
    if (item?.avatar || item?.image || item?.photo || item?.picture) {
        return { type: "image", value: item.avatar ?? item.image ?? item.photo ?? item.picture };
    }
    const label = getLabel(item);
    if (label) return { type: "initials", value: label.slice(0, 2).toUpperCase() };
    return { type: "icon" };
}

/**
 * SearchField — Search input with a live results popup.
 *
 * Just pass `results` — the component auto-detects common field names
 * (name, title, label, email, description, avatar, image…).
 * Two built-in display formats: "simple" (icon + text) and "rich"
 * (avatar + title + subtitle). Inner filter, keyboard nav, loading state included.
 *
 * @param {Object}   props
 * @param {string}   [props.label]
 * @param {string}   [props.value]              - Controlled query string
 * @param {Function} [props.onChange]           - (value, event) => void
 * @param {Function} [props.setValue]
 * @param {Function} [props.onSearch]           - (query) => void — called on Enter or search button
 * @param {Array}    [props.results=[]]         - Array of strings or objects
 * @param {Function} [props.onSelect]           - (item) => void
 * @param {string}   [props.resultFormat]       - "simple" (default) | "rich"
 * @param {boolean}  [props.showInnerSearch]    - Filter bar inside popup (default true)
 * @param {number}   [props.popupMaxHeight]     - px, default 320
 * @param {boolean}  [props.loading]
 * @param {string}   [props.placeholder]
 * @param {string}   [props.emptyText]
 * @param {boolean}  [props.required]
 * @param {boolean}  [props.disabled]
 * @param {string}   [props.helperText]
 * @param {string}   [props.error]
 * @param {string}   [props.className]
 *
 * @example
 * // Simple — string array:
 * <SearchField
 *   label="Search"
 *   value={q} setValue={setQ}
 *   results={["Apple", "Banana", "Cherry"]}
 *   onSelect={(item) => console.log(item)}
 * />
 *
 * // Rich — object array (auto-detects name, email, avatar):
 * <SearchField
 *   label="Search Users"
 *   value={q} setValue={setQ}
 *   onSearch={(q) => fetchUsers(q)}
 *   results={users}
 *   loading={isLoading}
 *   resultFormat="rich"
 *   onSelect={(user) => setUser(user)}
 * />
 */
export function SearchField({
    label = "",
    value = "",
    onChange,
    setValue,
    onSearch,
    results = [],
    onSelect,
    resultFormat = "simple",
    showInnerSearch = true,
    popupMaxHeight = 320,
    loading = false,
    placeholder = "Search...",
    emptyText = "No results found",
    required = false,
    disabled = false,
    helperText = "",
    error = "",
    showError = true,
    id,
    errors = [],
    info = "",
    className = "",
}) {
    const uid = useId();
    const inputId = id || `ff-sf-${uid}`;
    const hasError = showError && (Boolean(error) || Boolean(errors?.length));

    const [open, setOpen] = useState(false);
    const [innerQuery, setInnerQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(-1);

    const wrapRef = useRef(null);
    const inputRef = useRef(null);
    const innerRef = useRef(null);
    const listRef = useRef(null);

    const { isTyping, triggerTyping } = useTypingIndicator(900);

    // Filter results by inner query using auto-detected label
    const filteredResults = useMemo(() => {
        if (!innerQuery.trim()) return results;
        const q = innerQuery.toLowerCase();
        return results.filter((item) => {
            const primary = getLabel(item).toLowerCase();
            const secondary = getSubLabel(item).toLowerCase();
            return primary.includes(q) || secondary.includes(q);
        });
    }, [results, innerQuery]);

    // Open popup when results or loading state changes
    useEffect(() => {
        if (results.length > 0 || loading) setOpen(true);
    }, [results, loading]);

    // Reset active index when filtered list changes
    useEffect(() => { setActiveIndex(-1); }, [filteredResults]);

    // Scroll active item into view
    useEffect(() => {
        if (activeIndex < 0 || !listRef.current) return;
        listRef.current.children[activeIndex]?.scrollIntoView({ block: "nearest" });
    }, [activeIndex]);

    useClickOutside(wrapRef, () => { setOpen(false); setInnerQuery(""); setActiveIndex(-1); });

    const handleChange = useCallback((e) => {
        const v = e.target.value;
        setValue?.(v);
        onChange?.(v, e);
        triggerTyping();
        if (!v.trim()) { setOpen(false); setInnerQuery(""); }
    }, [setValue, onChange, triggerTyping]);

    const handleSearch = useCallback(() => {
        if (!value.trim()) return;
        onSearch?.(value.trim());
        setOpen(true);
        setInnerQuery("");
    }, [value, onSearch]);

    const handleSelect = useCallback((item) => {
        onSelect?.(item);
        setValue?.(getLabel(item));
        onChange?.(getLabel(item));
        setOpen(false);
        setInnerQuery("");
        setActiveIndex(-1);
    }, [onSelect, setValue, onChange]);

    const handleKeyDown = useCallback((e) => {
        if (!open) {
            if (e.key === "Enter") { e.preventDefault(); handleSearch(); }
            return;
        }
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, filteredResults.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, -1));
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (activeIndex >= 0 && filteredResults[activeIndex]) handleSelect(filteredResults[activeIndex]);
            else handleSearch();
        } else if (e.key === "Escape") {
            setOpen(false); setInnerQuery(""); setActiveIndex(-1);
            inputRef.current?.focus();
        } else if (e.key === "Tab") {
            setOpen(false); setInnerQuery("");
        }
    }, [open, activeIndex, filteredResults, handleSearch, handleSelect]);

    const handleInnerKeyDown = useCallback((e) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, filteredResults.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (activeIndex >= 0 && filteredResults[activeIndex]) handleSelect(filteredResults[activeIndex]);
        } else if (e.key === "Escape") {
            setOpen(false); setInnerQuery(""); setActiveIndex(-1);
            inputRef.current?.focus();
        }
    }, [activeIndex, filteredResults, handleSelect]);

    // ── Built-in result renderers ──────────────────────────────────────────────

    const renderSimple = (item, isActive) => (
        <div className="ff-sf-result-simple">
            <span className="ff-sf-result-icon"><Icon.Search /></span>
            <span className="ff-sf-result-label">{getLabel(item)}</span>
        </div>
    );

    const renderRich = (item, isActive) => {
        const av = getAvatar(item);
        const sub = getSubLabel(item);
        return (
            <div className="ff-sf-result-rich">
                <span className="ff-sf-result-avatar">
                    {av.type === "image" ? (
                        <img src={av.value} alt="" className="ff-sf-result-avatar-img" onError={(e) => { e.target.style.display = "none"; }} />
                    ) : av.type === "initials" ? (
                        <span className="ff-sf-result-avatar-initials">{av.value}</span>
                    ) : (
                        <span className="ff-sf-result-avatar-icon"><Icon.Search /></span>
                    )}
                </span>
                <span className="ff-sf-result-text">
                    <span className="ff-sf-result-label">{getLabel(item)}</span>
                    {sub && <span className="ff-sf-result-sublabel">{sub}</span>}
                </span>
            </div>
        );
    };

    const renderItem = (item, i) =>
        resultFormat === "rich" ? renderRich(item, i === activeIndex) : renderSimple(item, i === activeIndex);

    // ──────────────────────────────────────────────────────────────────────────

    return (
        <div className={`ff ${open ? "ff--dropdown-open" : ""} ${className}`} ref={wrapRef}>
            <FieldLabel htmlFor={inputId} label={label} required={required} info={info} />
            <div className="ff-input-wrap">
                <span className="ff-icon ff-icon--left"><Icon.Search /></span>
                <input
                    ref={inputRef}
                    id={inputId}
                    type="text"
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => { if (results.length > 0 || loading) setOpen(true); }}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    aria-invalid={hasError}
                    aria-autocomplete="list"
                    aria-expanded={open}
                    aria-haspopup="listbox"
                    aria-activedescendant={activeIndex >= 0 ? `ff-sf-opt-${uid}-${activeIndex}` : undefined}
                    className={`ff-input ff-input--has-left ff-input--has-right ${hasError ? "ff-input--error" : ""}`}
                />
                {/* Search / Clear */}
                <button
                    type="button"
                    className="ff-sf-action-btn"
                    onClick={() => {
                        if (value) {
                            setValue?.(""); onChange?.("");
                            setOpen(false); setInnerQuery("");
                            inputRef.current?.focus();
                        } else {
                            handleSearch();
                        }
                    }}
                    disabled={disabled}
                    aria-label={value ? "Clear" : "Search"}
                >
                    {value ? <Icon.X /> : <Icon.Search />}
                </button>
                <div className={`ff-typing-bar${isTyping ? " ff-typing-bar--active" : ""}`} aria-hidden="true" />
            </div>

            {/* ── Popup ── */}
            {open && (
                <div className="ff-sf-popup" role="listbox">

                    {/* Inner filter bar */}
                    {showInnerSearch && (results.length > 0 || loading) && (
                        <div className="ff-sf-inner-search-wrap">
                            <span className="ff-sf-inner-search-icon"><Icon.Search /></span>
                            <input
                                ref={innerRef}
                                type="text"
                                className="ff-sf-inner-search"
                                value={innerQuery}
                                onChange={(e) => { setInnerQuery(e.target.value); setActiveIndex(-1); }}
                                onKeyDown={handleInnerKeyDown}
                                placeholder="Filter results..."
                                aria-label="Filter results"
                            />
                            {innerQuery && (
                                <button
                                    type="button"
                                    className="ff-sf-inner-clear"
                                    onClick={() => { setInnerQuery(""); setActiveIndex(-1); innerRef.current?.focus(); }}
                                    aria-label="Clear filter"
                                >
                                    <Icon.X />
                                </button>
                            )}
                        </div>
                    )}

                    {/* Result count */}
                    {!loading && filteredResults.length > 0 && (
                        <div className="ff-sf-result-count">
                            {filteredResults.length} result{filteredResults.length !== 1 ? "s" : ""}
                            {innerQuery && results.length !== filteredResults.length && ` of ${results.length}`}
                        </div>
                    )}

                    {/* Scrollable list */}
                    <div className="ff-sf-result-list" ref={listRef} style={{ maxHeight: `${popupMaxHeight}px` }}>
                        {loading ? (
                            <div className="ff-sf-loading">
                                <span className="ff-sf-spinner" aria-hidden="true" />
                                <span>Searching...</span>
                            </div>
                        ) : filteredResults.length === 0 ? (
                            <div className="ff-sf-empty">
                                <span className="ff-sf-empty-icon"><Icon.Search /></span>
                                <span>{innerQuery ? `No results match "${innerQuery}"` : emptyText}</span>
                            </div>
                        ) : (
                            filteredResults.map((item, i) => (
                                <div
                                    key={typeof item === "string" ? item : (item?.id ?? item?.value ?? i)}
                                    id={`ff-sf-opt-${uid}-${i}`}
                                    role="option"
                                    aria-selected={i === activeIndex}
                                    className={`ff-sf-result-item ${i === activeIndex ? "ff-sf-result-item--active" : ""}`}
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => handleSelect(item)}
                                    onMouseEnter={() => setActiveIndex(i)}
                                >
                                    {renderItem(item, i)}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            <FormFieldMessage hasError={hasError} helperText={helperText} error={error} errors={errors} />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   DEFAULT EXPORT — convenience bundle
═══════════════════════════════════════════════════════════════════════════════ */

export default {
    FormFieldMessage,
    FormFieldErrors,
    FieldCard,
    TextField,
    EmailField,
    PhoneField,
    PasswordField,
    TextArea,
    NumberField,
    SelectField,
    SearchableSelect,
    DateField,
    TimeField,
    CalendarField,
    RadioGroup,
    CheckboxGroup,
    SwitchField,
    TagsField,
    UrlField,
    ImagePickerField,
    VideoPickerField,
    FilePickerField,
    ColorPickerField,
    BooleanField,
    JsonField,
    SearchField,
};
