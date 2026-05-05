import { useState, useRef, type ReactNode } from 'react'

// =====================================================================
// SHARED ATOMS — these mirror the Figma Components page
// =====================================================================

export function Button({ variant = 'primary', children, onClick, disabled, icon }: {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'disabled';
  children: ReactNode; onClick?: () => void; disabled?: boolean; icon?: ReactNode;
}) {
  const isDisabled = disabled || variant === 'disabled'
  const cls = {
    primary: 'bg-sage-600 text-white hover:bg-sage-700',
    secondary: 'bg-white text-sage-700 border border-sage-600 hover:bg-sage-50',
    ghost: 'bg-white text-ink border border-bd hover:bg-surf2',
    destructive: 'bg-red text-white hover:opacity-90',
    disabled: 'bg-[#C9CFC2] text-white cursor-not-allowed',
  }[isDisabled ? 'disabled' : variant]
  return (
    <button
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      className={`px-5 py-3 rounded-lg text-[13px] font-semibold inline-flex items-center gap-2 transition ${cls}`}
    >
      {children}{icon}
    </button>
  )
}

export function Pill({ children, tone = 'sage' }: { children: ReactNode; tone?: 'sage' | 'purple' | 'amber' | 'gray' }) {
  const cls = {
    sage: 'bg-sage-100 text-sage-700',
    purple: 'bg-purple-100 text-purple-700',
    amber: 'bg-amber-50 text-amber-700 border border-amber-bd',
    gray: 'bg-[#E5E2D2] text-mute',
  }[tone]
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${cls}`}>{children}</span>
}

// Lightweight tooltip primitive — fixed positioning + keyboard accessible
function HoverTip({ children, tip, label }: { children: ReactNode; tip: string; label?: string }) {
  const [hover, setHover] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const ref = useRef<HTMLSpanElement>(null)

  function show() {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return setHover(true)
    let left = rect.left
    const top = rect.bottom + 6
    const tipWidth = 280
    if (left + tipWidth > window.innerWidth - 16) left = window.innerWidth - tipWidth - 16
    if (left < 16) left = 16
    // If would clip below viewport, anchor above instead
    const tipHeight = 110
    const finalTop = top + tipHeight > window.innerHeight - 16 ? rect.top - tipHeight - 6 : top
    setPos({ top: finalTop, left })
    setHover(true)
  }

  return (
    <span
      ref={ref}
      onMouseEnter={show}
      onMouseLeave={() => setHover(false)}
      onFocus={show}
      onBlur={() => setHover(false)}
      tabIndex={0}
      className="relative inline-flex items-center cursor-help focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-1 rounded"
    >
      {children}
      {hover && (
        <span
          role="tooltip"
          className="fixed w-[280px] p-3 bg-ink text-white text-[11px] rounded-lg shadow-2xl leading-relaxed pointer-events-none"
          style={{ top: pos.top, left: pos.left, zIndex: 1000 }}
        >
          {label && <span className="block uppercase tracking-widest text-[9px] text-sage-300 mb-1">{label}</span>}
          {tip}
        </span>
      )}
    </span>
  )
}

// PURPLE MEMO: Confidence chip for AI-suggested values
export function ConfidenceChip({ level }: { level: 'high' | 'medium' | 'low' }) {
  const cfg = {
    high:   { dot: 'bg-sage-500', label: 'High',   tip: 'Sourced directly from a UW system of record (Workday, OPB, or Grad School). No interpolation.' },
    medium: { dot: 'bg-yellow-hi', label: 'Med',   tip: 'Derived from a structured rate table. Requires GM confirmation if rate effective date is older than 6 months.' },
    low:    { dot: 'bg-red',       label: 'Low',   tip: 'Suggested from similar past budgets. Verify before accepting.' },
  }[level]
  return (
    <HoverTip tip={cfg.tip} label={`${cfg.label} confidence`}>
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-surf2 text-mute border border-bdLt whitespace-nowrap leading-none">
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} aria-hidden></span>
        <span className="whitespace-nowrap">{cfg.label}</span>
      </span>
    </HoverTip>
  )
}

// PURPLE MEMO: Source tag with hover popover preview
export function SourceTag({ source, snippet }: { source: string; snippet?: string }) {
  if (!snippet) return <span className="text-[10px] text-sage-700 font-medium">↓ {source}</span>
  return (
    <HoverTip tip={snippet} label="Source preview">
      <span className="text-[10px] text-sage-700 font-medium underline decoration-dotted underline-offset-2">↓ {source}</span>
    </HoverTip>
  )
}

// PURPLE MEMO: Stale data indicator (red text)
export function StaleValue({ children, reason }: { children: ReactNode; reason: string }) {
  return (
    <HoverTip tip={reason} label="Stale data">
      <span className="inline-flex items-center gap-1 text-red font-medium underline decoration-dotted underline-offset-2">
        ⚠ {children}
      </span>
    </HoverTip>
  )
}

// PURPLE MEMO: Feedback toast — sits above the green footer band
export function FeedbackToast({ show, message }: { show: boolean; message: string }) {
  return (
    <div
      className={`fixed bottom-16 right-6 z-[60] transition-all duration-300 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
      role="status" aria-live="polite"
    >
      <div className="bg-sage-700 text-white px-5 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[320px] max-w-[420px]">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg" aria-hidden>✓</div>
        <div className="text-[13px] font-medium leading-snug">{message}</div>
      </div>
    </div>
  )
}

// Issue model used by the IssuesPanel
export type Issue = {
  id: string
  cellRef: string  // Excel-style ref e.g. "F4"
  location: string
  type: string
  correction: string
}

// Issues panel — collapsed by default so the Excel surface stays large
export function IssuesPanel({
  issues, onFix, onFixAll, onDismiss, onDismissAll, onHover,
}: {
  issues: Issue[];
  onFix: (id: string) => void;
  onFixAll: () => void;
  onDismiss: (id: string) => void;
  onDismissAll: () => void;
  onHover?: (cellRef: string | null) => void;
}) {
  const n = issues.length
  // Default: collapsed when N>1, auto-expanded when N=1
  const [open, setOpen] = useState(false)
  if (n === 0) return null
  const showHeader = n > 1
  const showList = !showHeader || open

  return (
    <div className="bg-[#FBE4E4] border border-red rounded-lg overflow-hidden border-l-4 border-l-red">
      {showHeader && (
        <button
          onClick={() => setOpen(!open)}
          className="w-full px-5 py-3 flex items-center gap-3 text-left hover:bg-red/5 transition"
          aria-expanded={open}
          aria-controls="issues-list"
        >
          <span className="text-red text-lg leading-none" aria-hidden>⚠</span>
          <div className="flex-1">
            <div className="text-[14px] font-semibold text-red leading-tight">
              {n} mismatch{n > 1 ? 'es' : ''} detected
            </div>
            <div className="text-[12px] text-red/80">
              {open ? 'Resolve one at a time below, or use Fix all.' : `Click to review${n > 1 ? ` all ${n}` : ''} or use Fix all.`}
            </div>
          </div>
          <span onClick={e => { e.stopPropagation(); onFixAll() }}
            role="button" tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); onFixAll() } }}
            className="px-3 py-1.5 bg-red text-white rounded-md text-[12px] font-semibold hover:opacity-90 transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-red ring-offset-2 ring-offset-[#FBE4E4]">
            Fix all
          </span>
          <span onClick={e => { e.stopPropagation(); onDismissAll() }}
            role="button" tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); onDismissAll() } }}
            className="px-3 py-1.5 bg-white border border-red/40 text-red rounded-md text-[12px] font-medium hover:bg-red-50 transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-red ring-offset-2 ring-offset-[#FBE4E4]">
            Dismiss all
          </span>
          <span className="w-7 h-7 flex items-center justify-center text-red rounded text-base">
            {open ? '▾' : '▸'}
          </span>
        </button>
      )}
      {showList && (
        <ul id="issues-list" className="divide-y divide-red/20">
          {issues.map(issue => (
            <li key={issue.id}
              onMouseEnter={() => onHover?.(issue.cellRef)}
              onMouseLeave={() => onHover?.(null)}
              className="px-5 py-3 flex items-start gap-3 hover:bg-red/5 transition">
              {!showHeader && (
                <span className="text-red text-lg leading-none mt-0.5" aria-hidden>⚠</span>
              )}
              <span className="inline-flex items-center justify-center min-w-[36px] h-[22px] px-2 rounded bg-white border border-red text-red text-[11px] font-bold mt-0.5 font-mono">
                {issue.cellRef}
              </span>
              <div className="flex-1 text-[13px] text-red leading-relaxed">
                {!showHeader && <div className="text-[14px] font-semibold leading-tight mb-1">Budget Mismatch</div>}
                <div><span className="font-semibold">Location:</span> {issue.location}</div>
                <div><span className="font-semibold">Type:</span> {issue.type}</div>
                <div><span className="font-semibold">Correction:</span> {issue.correction}</div>
              </div>
              <div className="flex gap-2 pt-0.5 shrink-0">
                <button onClick={() => onFix(issue.id)}
                  className="px-3 py-1.5 bg-red text-white rounded-md text-[12px] font-semibold hover:opacity-90 transition whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-red ring-offset-2 ring-offset-[#FBE4E4]">
                  Yes, fix it
                </button>
                <button onClick={() => onDismiss(issue.id)}
                  className="px-3 py-1.5 bg-white border border-bd text-ink rounded-md text-[12px] font-medium hover:bg-surf2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-red ring-offset-2 ring-offset-[#FBE4E4]">
                  Dismiss
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// Kept for backward compatibility — single-issue convenience wrapper
export function BudgetMismatchWarning({
  location, type, correction, onFix, onDismiss,
}: {
  location: string; type: string; correction: string;
  onFix: () => void; onDismiss: () => void;
}) {
  return (
    <IssuesPanel
      issues={[{ id: 'single', cellRef: '—', location, type, correction }]}
      onFix={onFix} onDismiss={onDismiss}
      onFixAll={onFix} onDismissAll={onDismiss}
    />
  )
}

// GREEN MEMO: AI disclaimer banner
export function AIDisclaimer() {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-amber-50 border border-amber-bd rounded-lg text-[12px] text-amber-700">
      <span className="text-base">⚡</span>
      <span><strong>AI-assisted:</strong> The system is partially integrated with AI for efficient workflow. While we strive for accuracy, we encourage users to verify important information.</span>
    </div>
  )
}

// PURPLE MEMO: AI opt-in toggle with explainer + visible derivation count
export function AIToggle({ on, onChange, derivedCount }: { on: boolean; onChange: (v: boolean) => void; derivedCount?: number }) {
  const tip = on
    ? `AI assist auto-derives ${derivedCount ?? 4} values from UW systems of record (Workday salaries, OPB tuition rates, Grad School fringe, F&A agreement). Each derived value shows a confidence chip and source tag. Turn off to enter values manually.`
    : `AI assist is off. Cells normally auto-derived (salary, fringe, tuition, F&A) are blank — enter manually. No confidence chips or source tags appear.`
  return (
    <HoverTip tip={tip} label={on ? 'AI assist · ON' : 'AI assist · OFF'}>
      <button
        onClick={() => onChange(!on)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-medium border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 ${
          on ? 'bg-sage-100 border-sage-500 text-sage-700' : 'bg-white border-bd text-mute'
        }`}
      >
        <span className={`w-7 h-4 rounded-full relative transition ${on ? 'bg-sage-600' : 'bg-[#C9C6B6]'}`}>
          <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition ${on ? 'left-3.5' : 'left-0.5'}`}></span>
        </span>
        AI assist {on ? `on · ${derivedCount ?? 4} auto-derived` : 'off'}
      </button>
    </HoverTip>
  )
}

// =====================================================================
// LAYOUT — sidebar nav + footer
// =====================================================================

export type StepKey = 'summary' | 'settings' | 'worksheet' | 'import'
export const STEPS: { key: StepKey; label: string; icon: string }[] = [
  { key: 'summary',   label: 'Summary (All Worksheets)',      icon: '▦' },
  { key: 'settings',  label: 'Budget Settings',                icon: '⚙' },
  { key: 'worksheet', label: 'NASA Linking Lakes — Worksheet', icon: '◫' },
  { key: 'import',    label: 'Import to SAGE',                 icon: '↑' },
]

export function Sidebar({ active, onJump, completed, collapsed }: { active: StepKey; onJump: (k: StepKey) => void; completed: Set<StepKey>; collapsed: boolean }) {
  if (collapsed) {
    // Hamburger / icon-only rail (matches Figma W4)
    return (
      <aside className="w-[60px] bg-surf2 border-r border-bdLt py-4 flex flex-col items-center">
        <div className="w-8 h-8 rounded-lg bg-sage-700 text-white flex items-center justify-center font-bold mb-3">S</div>
        <div className="flex-1 w-full">
          {STEPS.map(s => {
            const isActive = active === s.key
            const isDone = completed.has(s.key) && !isActive
            return (
              <button key={s.key} onClick={() => onJump(s.key)} title={s.label}
                className="w-full h-12 flex items-center hover:bg-white/40 transition relative">
                <span className={`w-[3px] h-7 ${isActive ? 'bg-sage-600' : 'bg-transparent'}`} />
                <span className={`flex-1 flex items-center justify-center text-base ${
                  isActive ? 'bg-white text-sage-700 font-semibold' : isDone ? 'text-sage-500' : 'text-sub'
                } h-full`}>
                  {isDone ? '✓' : s.icon}
                </span>
              </button>
            )
          })}
        </div>
        <button className="w-9 h-9 rounded-lg bg-sage-600 text-white flex items-center justify-center font-bold shadow-sm" title="Import to SAGE">→</button>
      </aside>
    )
  }
  return (
    <aside className="w-60 bg-surf2 border-r border-bdLt py-4 flex flex-col">
      <div className="px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sage-700 text-white flex items-center justify-center font-bold">S</div>
          <div className="text-[13px] font-semibold">SAGE</div>
        </div>
      </div>
      <div className="mt-2">
        {STEPS.map(s => {
          const isActive = active === s.key
          const isDone = completed.has(s.key) && !isActive
          return (
            <button key={s.key} onClick={() => onJump(s.key)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-left text-[13px] transition ${isActive ? 'bg-white' : 'hover:bg-white/50'}`}>
              <span className={`w-1 h-5 ${isActive ? 'bg-sage-600' : 'bg-transparent'}`} />
              <span className={`text-xs ${isDone ? 'text-sage-500' : 'text-sub'}`}>{isDone ? '✓' : s.icon}</span>
              <span className={`${isActive ? 'text-sage-700 font-semibold' : 'text-ink'}`}>{s.label}</span>
            </button>
          )
        })}
      </div>
      <div className="mt-auto px-3 pb-3">
        <div className="text-[10px] text-sub uppercase tracking-widest mb-2">Footer utilities</div>
        <button className="w-full text-left text-[12px] py-1.5 text-mute hover:text-ink">⚠ Simulate load error</button>
        <button className="w-full text-left text-[12px] py-1.5 text-mute hover:text-ink">⚙ Budget Settings</button>
        <button className="w-full text-left text-[12px] py-1.5 text-mute hover:text-ink">≡ Snapshots & History</button>
      </div>
    </aside>
  )
}

export function HamburgerButton({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle}
      className="w-9 h-9 rounded-lg bg-surf2 border border-bdLt flex flex-col items-center justify-center gap-[3px] hover:bg-white transition"
      title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
      <span className="w-4 h-[2px] bg-ink rounded-full" />
      <span className="w-4 h-[2px] bg-ink rounded-full" />
      <span className="w-4 h-[2px] bg-ink rounded-full" />
    </button>
  )
}

// Sticky bottom CTA bar — stays above the green footer with consistent placement
export function StickyCta({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="sticky bottom-0 z-30 bg-card border-t border-bdLt px-7 py-3 flex items-center gap-3 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
      {hint && <span className="text-[12px] text-mute mr-auto">{hint}</span>}
      {children}
    </div>
  )
}

export function Footer({ summary }: { summary?: string }) {
  return (
    <footer className="bg-sage-700 text-[#E8F0EB] text-[12px] px-7 py-3.5 flex items-center justify-between">
      <span>University of Washington</span>
      <span>{summary || 'About SAGE  ·  Learning  ·  Contact Us'}</span>
      <span>Release Date: March 2, 2026</span>
    </footer>
  )
}

export function Header({ title, idChip, status, totals, leading }: { title: string; idChip: string; status?: string; totals?: { label: string; value: string }[]; leading?: ReactNode }) {
  return (
    <header className="bg-white border-b border-bdLt px-7 py-4 flex items-center gap-4">
      {leading}
      <button className="text-mute text-xl">‹</button>
      <h1 className="text-[16px] font-semibold">{title}</h1>
      <span className="text-[13px] text-mute">({idChip})</span>
      {status && <span className="text-[13px] font-medium text-sage-700">{status}</span>}
      <span className="text-sub text-xs">ⓘ</span>
      <div className="flex-1" />
      <div className="flex gap-8">
        {(totals || [
          { label: 'Total Project Costs', value: '—' },
          { label: 'Total Direct Costs', value: '—' },
          { label: 'Facilities & Administrative', value: '—' },
        ]).map(t => (
          <div key={t.label} className="flex flex-col">
            <span className="text-[9px] text-sub uppercase tracking-widest font-semibold">{t.label}</span>
            <span className="text-[13px] font-semibold">{t.value}</span>
          </div>
        ))}
      </div>
    </header>
  )
}

// PURPLE MEMO: Comment thread for human reviews
export function CommentThread() {
  const [comments, setComments] = useState([
    { id: 1, author: 'Maria · GM', text: 'Confirmed Faisal salary against Workday — matches the 9/1 letter.', time: '2 hrs ago', avatar: 'M' },
    { id: 2, author: 'Dr. Hossain · PI', text: 'The Grad RA tuition number looks right. Approving.', time: '12 min ago', avatar: 'H' },
  ])
  const [draft, setDraft] = useState('')
  return (
    <div className="bg-white border border-bdLt rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[12px] font-semibold uppercase tracking-widest text-sub">Human review · Comments</h3>
        <span className="text-[11px] text-mute">{comments.length} comments</span>
      </div>
      <div className="space-y-3 mb-3">
        {comments.map(c => (
          <div key={c.id} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-sage-100 text-sage-700 flex items-center justify-center text-[12px] font-bold flex-shrink-0">{c.avatar}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 text-[12px]">
                <span className="font-semibold">{c.author}</span>
                <span className="text-sub">·  {c.time}</span>
              </div>
              <p className="text-[13px] mt-0.5 text-ink leading-relaxed">{c.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 pt-3 border-t border-bdLt">
        <input
          value={draft} onChange={e => setDraft(e.target.value)}
          placeholder="Leave a note for the PI…"
          className="flex-1 px-3 py-2 text-[13px] border border-bd rounded-md focus:border-sage-500 focus:outline-none"
        />
        <Button variant="primary" onClick={() => {
          if (!draft.trim()) return
          setComments([...comments, { id: Date.now(), author: 'You', text: draft, time: 'just now', avatar: 'Y' }])
          setDraft('')
        }}>Post</Button>
      </div>
    </div>
  )
}
