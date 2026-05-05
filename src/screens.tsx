import { useState } from 'react'
import {
  Button, Pill, ConfidenceChip, SourceTag, StaleValue,
  AIDisclaimer, AIToggle, CommentThread, Header, Footer, HamburgerButton,
  IssuesPanel, StickyCta, type Issue,
  type StepKey,
} from './ui'

type Nav = { go: (k: StepKey) => void; toast: (m: string) => void; aiOn: boolean; setAiOn: (v: boolean) => void; collapsed: boolean; setCollapsed: (v: boolean) => void }

// =====================================================================
// SCREEN 1 — Summary (eGC1 vs NoA delta) — Green memo: context setup
// =====================================================================
export function SummaryScreen({ go, toast }: Nav) {
  return (
    <div className="flex-1 overflow-auto bg-page">
      <Header title="A225412 — Linking Lakes and Learners through Science" idChip="ASR draft" />
      <div className="p-8 space-y-5 max-w-[1100px]">
        <div>
          <h2 className="text-[26px] font-semibold">Budget and Award Lines</h2>
          <p className="text-mute text-[13px] mt-1">NASA · PI: Faisal Hossain · HCDE · Review award changes before building the budget</p>
        </div>

        <AIDisclaimer />

        {/* GREEN MEMO: Side-by-side eGC1 vs NoA delta card */}
        <div className="bg-amber-50 border border-amber-bd rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-base text-amber-700">⚠</span>
            <p className="text-[13px] text-amber-700 leading-relaxed">
              The awarded amount and start dates differ from your proposal. Review the changes below before building the budget draft. The budget will be copied from the eGC1 and adjusted to match the history of award.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-bdLt rounded-lg p-5">
            <div className="text-[10px] text-sub uppercase tracking-widest font-semibold mb-3">Amount</div>
            <Row k="Proposed total" v="$320,000" />
            <Row k="Awarded total (NoA)" v="$298,500" highlight />
            <Row k="Shortfall" v="− $21,500" tone="red" />
          </div>
          <div className="bg-white border border-bdLt rounded-lg p-5">
            <div className="text-[10px] text-sub uppercase tracking-widest font-semibold mb-3">Dates</div>
            <Row k="Proposed start" v="9/1/2026" />
            <Row k="Awarded start (NoA)" v="10/1/2026" highlight />
            <Row k="Impact" v="Crosses July 1 — fringe and tuition rates may change" tone="amber" small />
          </div>
        </div>

        <div className="bg-white border border-bdLt rounded-lg p-5">
          <h3 className="text-[14px] font-semibold mb-2">How would you like to proceed?</h3>
          <p className="text-[13px] text-mute leading-relaxed">
            The budget draft will be pre-filled from the eGC1 copy and adjusted to the awarded amount and dates. Any line items affected by the $21,500 shortfall will need to be revisited with the PI — you can do this now or after building the draft.
          </p>
        </div>
      </div>
      <StickyCta hint="Step 1 of 4 · Review award changes">
        <Button variant="ghost">Notify PI of changes first</Button>
        <div className="flex-1" />
        <Button variant="primary" onClick={() => { toast('Award delta acknowledged. Moving to Budget Settings.'); go('settings') }} icon={<span>→</span>}>
          Proceed to Budget Settings
        </Button>
      </StickyCta>
      <Footer />
    </div>
  )
}

function Row({ k, v, tone, highlight, small }: { k: string; v: string; tone?: 'red' | 'amber'; highlight?: boolean; small?: boolean }) {
  const color = tone === 'red' ? 'text-red' : tone === 'amber' ? 'text-amber-700' : highlight ? 'text-sage-700' : 'text-ink'
  return (
    <div className="flex items-center justify-between py-2 text-[13px]">
      <span className="text-mute">{k}</span>
      <span className={`font-semibold ${color} ${small ? 'text-[12px] text-right max-w-[260px]' : ''}`}>{v}</span>
    </div>
  )
}

// =====================================================================
// SCREEN 2 — Budget Settings (pre-fill source labels, identical SAGE layout)
// =====================================================================
export function SettingsScreen({ go, toast }: Nav) {
  const [title, setTitle] = useState('NASA Linking Lakes — Award Setup 2026')
  const [start, setStart] = useState('10/1/2026')
  const [periods, setPeriods] = useState('5')
  const [length, setLength] = useState('12')

  return (
    <div className="flex-1 overflow-auto bg-page">
      <Header title="Copy of Linking Lakes and Learners through Science" idChip="B161463" totals={[
        { label: 'Total Project Costs', value: '$298,500' },
        { label: 'Total Direct Costs', value: '—' },
        { label: 'Facilities & Administrative', value: '—' },
      ]} />
      <div className="p-8 space-y-5 max-w-[1100px]">
        <div>
          <h2 className="text-[26px] font-semibold">Budget Settings</h2>
          <p className="text-mute text-[13px] mt-1">Add a title and establish dates for each time period · NASA Linking Lakes · Target: $298,500</p>
        </div>

        <div className="bg-sage-50 border border-sage-500 rounded-md px-4 py-3 flex items-center gap-3 text-[13px] text-sage-700">
          <span>✓</span>
          <span className="font-medium">Fields highlighted in green are pre-filled from your eGC1 and Notice of Award. Review and confirm before opening the worksheet.</span>
        </div>

        <Panel title="Budget Title & Periods" subtitle="Add a title and establish dates for each time period">
          <Field label="Budget Title" required prefilled value={title} onChange={setTitle} hint={<SourceTag source="From eGC1 project title" snippet="eGC1 #25-1842 · Field: project_title · Last edited 2026-04-12 by Maria Chen" />} />
          <div className="flex gap-7 my-1">
            <Radio checked label="Equal Length Periods" />
            <Radio checked={false} label="Varied Length Periods" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Budget Start Date" required prefilled value={start} onChange={setStart} hint={<SourceTag source="From NoA (adjusted — was 9/1/2026)" snippet="Notice of Award · Section 5 (Period of Performance) · Date adjusted by sponsor 2026-03-15" />} />
            <Field label="Total Number of Periods" required value={periods} onChange={setPeriods} hint={<span className="text-[10px] text-sub">User selects</span>} />
            <Field label="Length of Each Period (Months)" required value={length} onChange={setLength} hint={<span className="text-[10px] text-sub">User confirms</span>} />
          </div>
          <Field label="Description" value="Period 1" onChange={() => {}} hint={<span className="text-[10px] text-sub">Optional — e.g., Year 1, Phase 1</span>} />
        </Panel>

        <Panel title="Rates & Configuration" subtitle="Pre-configured from sponsor and project type">
          <div className="grid grid-cols-2 gap-4">
            <Field label="F&A Rate" prefilled value="54.5% — MTDC" onChange={() => {}} hint={<SourceTag source="From project type in eGC1" snippet="Federal Awards · F&A negotiated rate agreement DHHS-2024-08 · effective FY26" />} />
            <Field label="Salary Escalation Rate" prefilled value="3% per year" onChange={() => {}} hint={<SourceTag source="UW standard rate" snippet="OPB Cost Forecast 2026 · standard escalation 3% applied to all sponsored projects" />} />
            <Field label="Dollar Target" value="On — $298,500 (from NoA)" onChange={() => {}} hint={<span className="text-[10px] text-sub">User confirms</span>} />
            <Field label="Salary Cap" value="Not applicable — NASA sponsor" onChange={() => {}} hint={<span className="text-[10px] text-sub">User confirms</span>} />
          </div>
        </Panel>

      </div>
      <StickyCta hint="Step 2 of 4 · Set rates and dates">
        <Button variant="ghost" onClick={() => go('summary')}>Cancel</Button>
        <div className="flex-1" />
        <Button variant="primary" onClick={() => { toast('Settings saved. Opening worksheet…'); go('worksheet') }} icon={<span>→</span>}>Save and Open Worksheet</Button>
      </StickyCta>
      <Footer />
    </div>
  )
}

function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-bdLt rounded-lg p-5 space-y-4">
      <div className="flex items-baseline justify-between">
        <h3 className="text-[14px] font-semibold">{title}</h3>
        {subtitle && <span className="text-[11px] text-sub">{subtitle}</span>}
      </div>
      {children}
    </div>
  )
}

function Field({ label, value, onChange, prefilled, required, hint }: {
  label: string; value: string; onChange: (v: string) => void; prefilled?: boolean; required?: boolean; hint?: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[12px] font-medium flex items-center gap-1">
        {label} {required && <span className="text-red">*</span>}
      </label>
      <input
        value={value} onChange={e => onChange(e.target.value)}
        className={`w-full px-3 py-2.5 text-[13px] rounded-md border focus:outline-none focus:ring-2 ${
          prefilled ? 'bg-sage-50 border-sage-500 focus:ring-sage-500/30' : 'bg-white border-bd focus:ring-sage-500/30 focus:border-sage-500'
        }`}
      />
      {hint && <div>{hint}</div>}
    </div>
  )
}

function Radio({ checked, label }: { checked: boolean; label: string }) {
  return (
    <label className="flex items-center gap-2 text-[13px] cursor-pointer">
      <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${checked ? 'border-sage-600 bg-sage-600' : 'border-bd bg-white'}`}>
        {checked && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
      </span>
      {label}
    </label>
  )
}

// =====================================================================
// SCREEN 3 — Budget Worksheet (Excel + Add-In + reconciliation + AI + PDF preview)
// =====================================================================
const INITIAL_ISSUES: Issue[] = [
  {
    id: 'iss-1',
    cellRef: 'F4',
    location: 'Salary and Benefit Costs · Faisal Hossain (row 4)',
    type: 'Number discrepancy — rounding error.',
    correction: 'Add $1 to 08 Student Aid so totals match the NoA.',
  },
  {
    id: 'iss-2',
    cellRef: 'C8',
    location: 'Travel · AGU Conference — New Orleans (row 8)',
    type: 'Missing fringe — sponsor requires fringe on travel honoraria.',
    correction: 'Add $164 fringe (5% × $3,281) to row 8.',
  },
  {
    id: 'iss-3',
    cellRef: 'F13',
    location: 'Indirect Costs · F&A at 54.5% MTDC (row 13)',
    type: 'Calculation drift — F&A re-base needed after equipment add.',
    correction: 'Recalculate F&A excluding the $5,000 equipment line. Reduce by $2,725.',
  },
]

export function WorksheetScreen({ go, toast, aiOn, setAiOn, collapsed, setCollapsed }: Nav) {
  const [selectedRow, setSelectedRow] = useState<string | null>('grad-ra')
  const [filledTotal, setFilledTotal] = useState(298499)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [pdfOpen, setPdfOpen] = useState(false)
  const [addinOpen, setAddinOpen] = useState(true)
  const [issues, setIssues] = useState<Issue[]>(INITIAL_ISSUES)
  const [highlightedCell, setHighlightedCell] = useState<string | null>(null)
  const target = 298500
  const remaining = target - filledTotal

  function fixIssue(id: string) {
    if (id === 'iss-1') setFilledTotal(target)
    setIssues(prev => prev.filter(i => i.id !== id))
    toast('Issue resolved.')
  }
  function fixAll() {
    setFilledTotal(target)
    setIssues([])
    toast(`Fixed ${issues.length} mismatches. Budget reconciled.`)
  }
  function dismissIssue(id: string) {
    setIssues(prev => prev.filter(i => i.id !== id))
    toast('Issue dismissed. Re-validate from the top bar to surface again.')
  }
  function dismissAll() {
    setIssues([])
    toast('All issues dismissed. Re-validate from the top bar to surface again.')
  }

  function runValidate() {
    if (issues.length === 0 && remaining === 0) {
      toast('Validation pass: 12 lines mapped, 0 errors.')
    } else {
      setIssues(INITIAL_ISSUES)
      toast(`Validation found ${INITIAL_ISSUES.length} mismatches. See panel above.`)
    }
  }

  // When PDF panel opens, auto-select Equipment row to show the link
  function openPdf() {
    setPdfOpen(true)
    setSelectedRow('eq')
    setCollapsed(true) // collapse sidebar to make room (matches Figma W4)
    toast('Equipment_Invoice_v1.pdf opened — linked to row 10.')
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-page">
      <Header title="NASA Linking Lakes — Budget Draft" idChip="B161463" status="· Period 1 of 5 ·"
        leading={<HamburgerButton collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />}
        totals={[
          { label: 'Total Project Costs', value: '$244,690' },
          { label: 'Total Direct Costs', value: '$134,690' },
          { label: 'Target', value: '$298,500' },
        ]} />

      {/* GREEN MEMO: Live reconciliation bar */}
      <div className="bg-white border-b border-bdLt px-7 py-2.5 flex items-center gap-6 text-[12px]">
        <span className="text-sub uppercase tracking-widest font-semibold whitespace-nowrap">Reconciliation</span>
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="text-mute">NoA total</span>
          <span className="font-semibold">${target.toLocaleString()}</span>
        </div>
        <span className="text-sub">−</span>
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="text-mute">Budget total</span>
          <span className="font-semibold text-sage-700">${filledTotal.toLocaleString()}</span>
        </div>
        <span className="text-sub">=</span>
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="text-mute">Delta</span>
          <span className={`font-semibold ${remaining === 0 ? 'text-sage-700' : 'text-red'}`}>
            {remaining === 0 ? 'Balanced ✓' : remaining > 0 ? `$${remaining.toLocaleString()} short` : `$${Math.abs(remaining).toLocaleString()} over`}
          </span>
        </div>
        <div className="flex-1" />
        <AIToggle on={aiOn} onChange={setAiOn} derivedCount={4} />
      </div>

      {/* Issues panel — top section, with breathing room before the Excel surface */}
      {issues.length > 0 && (
        <div className="bg-page px-7 pt-4 pb-5">
          <IssuesPanel
            issues={issues}
            onFix={fixIssue}
            onFixAll={fixAll}
            onDismiss={dismissIssue}
            onDismissAll={dismissAll}
            onHover={setHighlightedCell}
          />
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* PDF preview panel — slides in when pdfOpen */}
        {pdfOpen && <PdfPreviewPanel onClose={() => setPdfOpen(false)} />}

        {/* Excel-like worksheet */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          {/* NEW TOP BAR — file actions instead of just tabs */}
          <div className="bg-surf2 border-b border-bdLt h-12 flex items-center gap-2 text-[12px] px-3 overflow-x-auto">
            <span className="px-3 py-1.5 rounded-md bg-sage-600 text-white font-semibold text-[12px] whitespace-nowrap shrink-0">SAGE Add-In</span>
            <span className="w-px h-6 bg-bd shrink-0" />
            <ToolBtn icon="📤" label="Upload file" onClick={() => toast('File picker opened (demo).')} primary />
            <ToolBtn icon="📁" label="Manage attachments" onClick={openPdf} active={pdfOpen} />
            <span className="w-px h-6 bg-bd shrink-0" />
            <ToolBtn icon="＋" label="Add personnel" onClick={() => { setAddinOpen(true); setSelectedRow('grad-ra'); toast('Add personnel — fill in the right panel.') }} />
            <ToolBtn icon="＋" label="Add travel" onClick={() => { setAddinOpen(true); setSelectedRow('agu'); toast('Add travel — fill in the right panel.') }} />
            <ToolBtn icon="🔍" label="Lookup salary" onClick={() => { setAddinOpen(true); setSelectedRow('grad-ra'); toast('Salary lookup opened in the right panel.') }} />
            <span className="w-px h-6 bg-bd shrink-0" />
            <ToolBtn icon="✓" label="Validate" onClick={runValidate} />
            <div className="flex-1 min-w-2" />
            <span className="text-[10px] text-mute whitespace-nowrap shrink-0">LinkingLakes_Period1.xlsx</span>
            <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-sage-50 text-[10px] text-sage-700 font-medium whitespace-nowrap shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-sage-500" /> Saved 12s ago
            </span>
          </div>
          <div className="bg-white border-b border-bdLt h-7 px-3 flex items-center gap-2 text-[11px]">
            <span className="text-mute font-medium">C7</span>
            <span className="text-sub">ƒx</span>
            <span>=Salary.Lookup("GradRA","Sch1","Doctoral")</span>
          </div>

          {/* Column headers */}
          <div className="bg-[#F0EFE0] border-b border-bdLt h-6 flex text-[10px] text-mute font-medium">
            <div className="w-10 border-r border-bdLt flex items-center justify-center">A</div>
            {['B','C','D','E','F','G'].map(c => (
              <div key={c} className="flex-1 border-r border-bdLt flex items-center justify-center">{c}</div>
            ))}
          </div>

          <div className="flex-1 overflow-auto">
            {(() => {
              const issueRows = new Set(issues.map(i => i.cellRef))
              const cellProps = { issueRows, highlightedCell }
              const onRowSelect = (id: string) => { setSelectedRow(id); setAddinOpen(true) }
              return <>
                <RowSheet
                  section="A. Personnel — Salary and Benefits"
                  onSectionClick={() => { setAddinOpen(true); setSelectedRow('grad-ra') }}
                  rows={[
                    { id: 'pi', cellRef: 'F4', label: 'Faisal Hossain', role: 'Principal Investigator', cost: '$15,143', effort: '10.0000%', months: '9', subtotal: '$15,143', note: '', confidence: 'high' as const, source: 'Workday salary', aiDerived: true },
                    { id: 'tbd', cellRef: 'F5', label: 'TBD', role: 'Postdoc Sch 1', cost: '—', effort: '—', months: '—', subtotal: '—', note: '' },
                    { id: 'grad-ra', cellRef: 'F6', label: 'TBD Grad RA x2', role: 'Grad RA · Sch 1 · Doctoral', cost: '$3,621/mo × 9', effort: '50.0000%', months: '9', subtotal: '$57,936', note: '↓ derived', confidence: 'high' as const, source: 'Grad School rate table', aiDerived: true },
                  ]}
                  selectedRow={selectedRow} onSelect={(id) => { onRowSelect(id); }} aiOn={aiOn} {...cellProps}
                />
                <RowSheet
                  section="B. Travel"
                  rows={[
                    { id: 'agu', cellRef: 'C8', label: 'AGU Conf — New Orleans', role: '1 PI · 4 nights', cost: '$3,281', effort: '—', months: '—', subtotal: '$3,281', note: '' },
                  ]}
                  selectedRow={selectedRow} onSelect={onRowSelect} aiOn={aiOn} {...cellProps}
                />
                <RowSheet
                  section="C. Other Direct Costs"
                  rows={[
                    { id: 'eq', cellRef: 'F10', label: 'Equipment', role: 'Sequencer', cost: '$5,000', effort: '—', months: '—', subtotal: '$5,000', note: pdfOpen ? '📎 Equipment_Invoice ↗ ← Linked' : 'Equipment_Invoice.pdf ↗', linkedToPdf: pdfOpen },
                    { id: 'sup', cellRef: 'F11', label: 'Supplies', role: '—', cost: '$5,000', effort: '—', months: '—', subtotal: '$5,000', note: '', confidence: 'medium' as const, source: 'Past similar budget (FY25 Lake Erie)' },
                    { id: 'travel-int', cellRef: 'F12', label: 'Travel — International', role: 'Conference TBD', cost: 'See note', effort: '—', months: '—', subtotal: '$0', note: '', stale: 'OFM rate as of Aug 2024 — refresh required for FY26' },
                  ]}
                  selectedRow={selectedRow} onSelect={onRowSelect} aiOn={aiOn} {...cellProps}
                />
                <RowSheet
                  section="D. Indirect Costs (F&A)"
                  rows={[
                    { id: 'fa', cellRef: 'F13', label: 'F&A at 54.5% MTDC', role: '—', cost: 'Auto', effort: '—', months: '—', subtotal: '$110,000', note: 'Updates automatically as lines change', confidence: 'high' as const, source: 'F&A rate agreement' },
                  ]}
                  selectedRow={selectedRow} onSelect={onRowSelect} aiOn={aiOn} {...cellProps}
                />
              </>
            })()}
          </div>

          {/* Period tabs */}
          <div className="bg-[#F0EFE0] border-t border-bdLt h-8 flex items-center text-[11px]">
            {['Period 1','Period 2','Period 3','Period 4','Period 5','All Periods Summary'].map((l,i) => (
              <div key={l} className={`px-4 py-1.5 border-r border-bdLt ${i===0 ? 'bg-white text-sage-700 font-semibold' : 'text-mute'}`}>{l}</div>
            ))}
            <div className="flex-1" />
            <div className="px-3 text-sub">Sum: ${filledTotal.toLocaleString()} · Avg: ${filledTotal.toLocaleString()}</div>
          </div>
        </div>

        {/* SAGE Add-In side panel — closable */}
        {addinOpen && <aside className="w-[340px] bg-white border-l border-bdLt flex flex-col overflow-hidden shrink-0">
          <div className="bg-sage-700 text-white px-4 py-3 flex items-center justify-between text-[13px] font-semibold">
            <span>SAGE Add-In</span>
            <div className="flex gap-1">
              <button className="text-[11px] px-2 py-1 border border-white/40 rounded hover:bg-white/10" title="Back">Back</button>
              <button onClick={() => setAddinOpen(false)} className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/15" title="Close panel" aria-label="Close panel">✕</button>
            </div>
          </div>
          <div className="p-4 space-y-3 overflow-auto flex-1">
            {selectedRow === 'eq' && pdfOpen ? (
              <>
                <h3 className="text-[14px] font-semibold">Equipment — row 10</h3>
                {/* Linked-source banner (matches Figma W4) */}
                <div className="bg-yellow-hi border border-amber-bd rounded-md px-2.5 py-2 flex items-center gap-2.5">
                  <span className="text-[14px]">📎</span>
                  <div className="flex-1 leading-tight">
                    <div className="text-[11px] font-semibold">Equipment_Invoice_v1.pdf</div>
                    <div className="text-[10px] text-mute">Page 1 · highlighted line</div>
                  </div>
                  <span className="text-amber-700 font-bold">↗</span>
                </div>
                <Stat k="Vendor" v="Biotech Systems Inc." sub="4391 Logan Park, Seattle WA" />
                <Stat k="Item" v="Next-Gen Genomic Sequencer" />
                <Stat k="Quoted amount" v="$5,000.00" sub="Per invoice line 1" />
                <Stat k="SAGE object code" v="05-00 Supplies" sub="Confirmed by GM" />
                <div className="bg-sage-50 rounded-md p-3 space-y-2">
                  <Reconcile k="Filled so far" v={`$${filledTotal.toLocaleString()}`} tone="sage" />
                  <Reconcile k="Remaining" v={`$${remaining.toLocaleString()}`} tone="amber" />
                  <Reconcile k="Target" v={`$${target.toLocaleString()}`} />
                </div>
              </>
            ) : selectedRow === 'grad-ra' ? (
              <>
                <div>
                  <h3 className="text-[14px] font-semibold">Grad RA — Variable Rate, Sch 1</h3>
                  <select className="w-full mt-2 px-3 py-2 text-[12px] border border-bd rounded-md">
                    <option>Grad RA — Variable Rate, Sch 1</option>
                    <option>Grad RA — Fixed Rate, Sch 2</option>
                  </select>
                </div>
                <Stat k="Monthly Salary" v="$3,621 / month" sub="Grad School, eff. 9/1/2026" confidence="high" source="Grad School rate table" />
                <Stat k="FTE / Period" v="50% FTE × 9 months" />
                <Stat k="Tuition per quarter" v="14.0% — RA rate" sub="OPB · effective FY26" confidence="high" source="OPB Cost Forecast" />
                <Stat k="Number of students" v="2" sub="50.0000% × 2 — derived from B6" confidence="medium" source="Inferred from line item" />

                <div className="bg-sage-50 rounded-md p-3 space-y-2">
                  <Reconcile k="Filled so far" v={`$${filledTotal.toLocaleString()}`} tone="sage" />
                  <Reconcile k="Remaining" v={`$${remaining.toLocaleString()}`} tone="amber" />
                  <Reconcile k="Target" v={`$${target.toLocaleString()}`} />
                </div>

                {/* PURPLE MEMO: AI value suggestions */}
                {aiOn && (
                  <div className="border border-purple-700/30 bg-purple-100/40 rounded-md p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-purple-700">AI suggestions</span>
                      <button onClick={() => setShowSuggestions(!showSuggestions)} className="text-[11px] text-purple-700 underline">{showSuggestions ? 'Hide' : 'Show'}</button>
                    </div>
                    {showSuggestions && (
                      <>
                        <p className="text-[11px] text-mute leading-relaxed">Based on 4 similar NASA budgets in the past 18 months:</p>
                        <Suggestion text="Add $2,400 for student travel (PI typically funds 1 student conference)" onAccept={() => { setFilledTotal(filledTotal + 2400); toast('AI suggestion accepted. Worksheet updated.') }} />
                        <Suggestion text="Increase Supplies to $6,500 (median for environmental sensors)" onAccept={() => { setFilledTotal(filledTotal + 1500); toast('AI suggestion accepted. Worksheet updated.') }} />
                      </>
                    )}
                  </div>
                )}
              </>
            ) : (
              <p className="text-[12px] text-sub leading-relaxed">Click a row in the worksheet to see contextual data, source tags, and AI suggestions for that line.</p>
            )}
          </div>
          <div className="border-t border-bdLt p-3 flex gap-2">
            <Button variant="ghost" onClick={() => toast('Worksheet saved as v3 (snapshot taken)')}>Save snapshot</Button>
            <Button variant="primary" onClick={() => go('import')} icon={<span>→</span>}>Import to SAGE</Button>
          </div>
        </aside>}
      </div>
      <Footer summary={`Sum: $${filledTotal.toLocaleString()}  ·  Target: $${target.toLocaleString()}`} />
    </div>
  )
}

function RowSheet({ section, rows, selectedRow, onSelect, aiOn, issueRows, highlightedCell, onSectionClick }: {
  section: string;
  rows: { id: string; label: string; role: string; cost: string; effort: string; months: string; subtotal: string; note: string; confidence?: 'high'|'medium'|'low'; source?: string; stale?: string; linkedToPdf?: boolean; cellRef?: string; aiDerived?: boolean }[];
  selectedRow: string | null; onSelect: (id: string) => void; aiOn: boolean;
  issueRows?: Set<string>;
  highlightedCell?: string | null;
  onSectionClick?: () => void;
}) {
  return (
    <>
      <div onClick={onSectionClick}
        className={`flex bg-sage-50 text-sage-700 text-[11px] font-semibold border-b border-bdLt h-7 items-center ${onSectionClick ? 'cursor-pointer hover:bg-sage-100' : ''}`}
        title={onSectionClick ? 'Click to open the right panel for this section' : undefined}>
        <div className="w-10 border-r border-bdLt flex items-center justify-center text-mute">{section.split('.')[0]}</div>
        <div className="flex-1 px-2">{section}</div>
      </div>
      {rows.map(r => {
        const isSel = selectedRow === r.id
        const linked = !!r.linkedToPdf
        const hasIssue = r.cellRef && issueRows?.has(r.cellRef)
        const flash = highlightedCell === r.cellRef
        return (
          <div key={r.id} onClick={() => onSelect(r.id)}
            className={`flex border-b h-9 items-center text-[12px] cursor-pointer transition ${
              flash ? 'bg-red-50 border-red border-y-2'
              : linked ? 'bg-yellow-hi border-amber-bd border-y-2'
                     : isSel ? 'bg-sage-50 border-bdLt' : hasIssue ? 'bg-red-50/60 border-bdLt' : 'hover:bg-surf2 border-bdLt'
            }`}>
            <div className={`w-10 border-r h-full flex items-center justify-center text-[10px] ${
              flash ? 'bg-red text-white font-bold border-red'
              : linked ? 'bg-amber-bd text-white font-bold border-amber-bd'
              : hasIssue ? 'bg-red text-white font-bold border-red'
              : 'border-bdLt text-mute'
            }`}>{r.cellRef || r.id.slice(0,3)}</div>
            <Cell w="30%">{r.label}</Cell>
            <Cell w="20%" highlight={!!r.confidence && aiOn}>
              {r.role}
              {r.confidence && aiOn && <span className="ml-2"><ConfidenceChip level={r.confidence} /></span>}
            </Cell>
            <Cell w="14%">
              {r.aiDerived && !aiOn ? <PlaceholderCell label="Enter manually" /> : r.cost}
            </Cell>
            <Cell w="10%" highlight={!!r.confidence && aiOn}>
              {r.aiDerived && !aiOn ? <span className="text-mute text-[11px] italic">—</span> : r.effort}
            </Cell>
            <Cell w="8%">{r.months}</Cell>
            <Cell w="14%">
              {r.aiDerived && !aiOn
                ? <PlaceholderCell label="—" />
                : r.stale ? <StaleValue reason={r.stale}>{r.subtotal}</StaleValue> : <span className="font-semibold">{r.subtotal}</span>}
            </Cell>
            <Cell w="20%">
              {linked ? <span className="text-amber-700 font-semibold text-[11px]">{r.note}</span>
                : r.source && aiOn ? <SourceTag source={r.source} />
                : r.aiDerived && !aiOn ? <span className="text-mute text-[10px] italic">no AI source</span>
                : r.note}
            </Cell>
          </div>
        )
      })}
    </>
  )
}

// =====================================================================
// PDF preview panel (mirrors Figma W4 invoice paper + linked annotation)
// =====================================================================
function PdfPreviewPanel({ onClose }: { onClose: () => void }) {
  return (
    <aside className="w-[280px] bg-[#F5EFD5] border-r border-bdLt flex flex-col overflow-hidden">
      <div className="h-9 px-3.5 flex items-center gap-2 text-[11px] text-mute">
        <span>📎</span>
        <span className="font-medium">Equipment_Invoice_v1.pdf</span>
        <div className="flex-1" />
        <button onClick={onClose} className="text-sub hover:text-ink" title="Close PDF preview">✕</button>
      </div>
      {/* PDF tab strip */}
      <div className="px-3 flex gap-1 h-7 items-center border-b border-bdLt/60">
        <span className="px-2.5 py-1 rounded text-[10px] font-semibold bg-white border border-bdLt">Invoice</span>
        <span className="px-2.5 py-1 rounded text-[10px] text-mute">Equipment.docx</span>
        <span className="px-2.5 py-1 rounded text-[10px] text-mute">Quote.pdf</span>
      </div>

      <div className="p-4 flex-1 overflow-auto">
        <div className="bg-white border-2 border-amber-bd rounded p-4 space-y-3">
          <div className="flex items-center">
            <div className="leading-tight">
              <div className="text-[12px] font-bold">BIOTECH</div>
              <div className="text-[12px] font-bold">SYSTEMS</div>
              <div className="text-[10px] text-sub font-medium">INC.</div>
            </div>
            <div className="flex-1" />
            <div className="text-[16px] font-bold">INVOICE</div>
          </div>
          <p className="text-[9px] text-sub leading-relaxed">4391 Logan Park<br/>3221 Innovation Drive<br/>Seattle, WA 98103</p>

          <div className="flex items-center text-[9px] font-semibold text-mute py-1.5">
            <span>Description</span>
            <div className="flex-1" />
            <span>Amount</span>
          </div>

          {/* HIGHLIGHTED LINE — linked to Excel row 10 */}
          <div className="bg-yellow-hi border-2 border-amber-bd rounded px-2 py-2 flex items-center gap-2">
            <div className="flex-1">
              <div className="text-[10px] font-semibold">Next-Gen Genomic Sequencer</div>
              <div className="text-[9px] text-sub">Dual-Channel Reagents Kit</div>
              <div className="text-[9px] text-sub">(High-throughput SKU-A)</div>
            </div>
            <span className="text-[11px] font-bold">$5,000.00</span>
          </div>

          <div className="bg-yellow-hi border border-amber-bd rounded-full inline-flex items-center px-2.5 py-1 text-[9px] font-medium text-amber-700">
            → Linked to Excel row 10 · Equipment
          </div>

          <div className="space-y-1 pt-3">
            <div className="flex items-center text-[10px] text-mute py-1"><span>Subtotal</span><div className="flex-1" /><span className="text-ink">$5,000.00</span></div>
            <div className="flex items-center text-[10px] text-mute py-1"><span>Tax (0%)</span><div className="flex-1" /><span className="text-ink">—</span></div>
            <div className="flex items-center text-[12px] font-bold py-2 border-t border-bdLt"><span>Total:</span><div className="flex-1" /><span className="text-red">$5,000.00</span></div>
          </div>
        </div>
      </div>
    </aside>
  )
}

// Top-bar action button used in the new Excel-style ribbon
function ToolBtn({ icon, label, onClick, primary, active }: { icon: string; label: string; onClick?: () => void; primary?: boolean; active?: boolean }) {
  const cls = primary
    ? 'bg-sage-50 border-sage-500 text-sage-700 hover:bg-sage-100'
    : active
    ? 'bg-amber-50 border-amber-bd text-amber-700'
    : 'bg-white border-bd text-ink hover:bg-surf2'
  return (
    <button onClick={onClick}
      className={`shrink-0 whitespace-nowrap px-3 py-1.5 rounded-md border text-[11px] font-medium inline-flex items-center gap-1.5 leading-none transition ${cls}`}>
      <span aria-hidden className="leading-none">{icon}</span>
      <span className="whitespace-nowrap">{label}</span>
    </button>
  )
}

function Cell({ children, w, highlight }: { children: React.ReactNode; w: string; highlight?: boolean }) {
  return <div className={`px-2 border-r border-bdLt h-full flex items-center ${highlight ? 'bg-sage-50/40' : ''}`} style={{ width: w }}>{children}</div>
}

// Placeholder shown in AI-derived cells when AI assist is OFF
function PlaceholderCell({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-dashed border-bd text-[10px] text-mute italic bg-surf2">
      {label}
    </span>
  )
}

function Stat({ k, v, sub, confidence, source }: { k: string; v: string; sub?: string; confidence?: 'high'|'medium'|'low'; source?: string }) {
  return (
    <div className="space-y-1">
      <div className="text-[10px] text-sub uppercase tracking-widest font-semibold">{k}</div>
      <div className="text-[13px] font-semibold flex items-center gap-2 flex-wrap">
        {v}
        {confidence && <ConfidenceChip level={confidence} />}
      </div>
      {sub && <div className="text-[11px] text-sub">{sub}</div>}
      {source && <SourceTag source={source} />}
    </div>
  )
}

function Reconcile({ k, v, tone }: { k: string; v: string; tone?: 'sage' | 'amber' }) {
  const color = tone === 'sage' ? 'text-sage-700' : tone === 'amber' ? 'text-amber-700' : 'text-ink'
  return (
    <div className="flex items-center justify-between text-[12px]">
      <span className="text-mute">{k}</span>
      <span className={`font-semibold ${color}`}>{v}</span>
    </div>
  )
}

function Suggestion({ text, onAccept }: { text: string; onAccept: () => void }) {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null
  return (
    <div className="bg-white border border-purple-700/30 rounded-md p-2 text-[11px] space-y-1.5">
      <p className="text-ink leading-snug">{text}</p>
      <div className="flex gap-2">
        <button onClick={() => { onAccept(); setDismissed(true) }} className="px-2 py-1 bg-purple-700 text-white rounded text-[10px] font-semibold">Accept</button>
        <button onClick={() => setDismissed(true)} className="px-2 py-1 border border-bd text-mute rounded text-[10px]">Dismiss</button>
      </div>
    </div>
  )
}

// =====================================================================
// SCREEN 4 — Import to SAGE (mapping preview + checklist + submit gate)
// =====================================================================
export function ImportScreen({ go, toast }: Nav) {
  const [piSfiDone, setPiSfiDone] = useState(false)

  return (
    <div className="flex-1 overflow-auto bg-page">
      <Header title="A225412 — Linking Lakes and Learners" idChip="ASR ready to submit" status=""
        totals={[
          { label: 'Total Project Costs', value: '$298,500' },
          { label: 'Total Direct Costs', value: '$193,500' },
          { label: 'Facilities & Administrative', value: '$105,000' },
        ]} />
      <div className="p-8 space-y-5 max-w-[1200px]">
        <div>
          <h2 className="text-[26px] font-semibold">Import to SAGE Budget</h2>
          <p className="text-mute text-[13px] mt-1">Review the field mapping below, then confirm the import to SAGE Budget format.</p>
        </div>

        <div className="bg-sage-50 border border-sage-500 rounded-md px-4 py-3 flex items-center gap-3 text-[13px] text-sage-700 font-medium">
          <span>✓</span>
          <span>Budget balanced — $298,500 matches the awarded total. Ready to import.</span>
        </div>

        {/* GREEN MEMO: Mapping table preview */}
        <div className="bg-white border border-bdLt rounded-lg overflow-hidden">
          <div className="px-5 py-3.5 border-b border-bdLt flex items-center justify-between">
            <h3 className="text-[13px] font-semibold">Import mapping — what will be written to SAGE Budget</h3>
            <span className="text-[11px] text-sub">Period 2 shown · 5 periods total · 12 lines</span>
          </div>
          <div className="bg-surf2 border-b border-bdLt grid grid-cols-[2fr_1fr_1fr_1fr_0.8fr] px-5 py-3 text-[10px] text-sub uppercase tracking-widest font-semibold">
            <span>Draft line item</span><span>Dollar amount</span><span>SAGE object code</span><span>% effort (derived)</span><span>Status</span>
          </div>
          {[
            { line: 'Faisal Hossain — salary', meta: <Pill>Workday</Pill>, amount: '$15,143', code: '01-10 Faculty', effort: <span className="flex items-center gap-1.5">10.0000% <Pill>derived</Pill></span> },
            { line: 'Faisal Hossain — fringe', meta: <Pill>Auto</Pill>, amount: '$4,104', code: '01-10 Fringe', effort: 'n/a' },
            { line: 'TBD Grad RA x2 — salary', meta: <Pill>table rate</Pill>, amount: '$57,936', code: '01-33 Grad RA', effort: <span className="flex items-center gap-1.5">50.0000% <Pill>derived</Pill></span> },
            { line: 'TBD Grad RA x2 — tuition', meta: <Pill tone="purple">OPB</Pill>, amount: '$41,418', code: '08-05 Tuition', effort: 'n/a' },
            { line: 'Travel — AGU Conference', meta: null, amount: '$3,281', code: '04-00 Travel', effort: 'n/a' },
            { line: 'Supplies', meta: null, amount: '$5,000', code: '05-00 Supplies', effort: 'n/a' },
            { line: 'F&A — indirect costs', meta: <Pill>54.5% MTDC</Pill>, amount: '$171,718', code: 'F&A', effort: 'n/a' },
          ].map((r, i) => (
            <div key={i} className="grid grid-cols-[2fr_1fr_1fr_1fr_0.8fr] px-5 py-3 text-[12px] border-b border-bdLt items-center">
              <span className="flex items-center gap-2">{r.line} {r.meta}</span>
              <span className="font-semibold">{r.amount}</span>
              <span>{r.code}</span>
              <span>{r.effort}</span>
              <span className="text-sage-700 font-medium">✓ Mapped</span>
            </div>
          ))}
          <div className="bg-surf2 grid grid-cols-[2fr_1fr_1fr_1fr_0.8fr] px-5 py-3.5 text-[13px] items-center">
            <span className="font-semibold">Total</span>
            <span className="font-bold text-sage-700">$298,500</span>
            <span className="text-sage-700 font-medium">✓ Matches awarded total</span>
            <span></span><span></span>
          </div>
        </div>

        {/* GREEN MEMO: Pre-submission checklist with PI SFI gate */}
        <div className="bg-white border border-bdLt rounded-lg overflow-hidden">
          <div className="px-5 py-3.5 border-b border-bdLt">
            <h3 className="text-[13px] font-semibold">Pre-submission checklist</h3>
          </div>
          <Check icon="✓" tone="green" bold="Budget linked and balanced" mute="$298,500 matches awarded total" />
          <Check icon="✓" tone="green" bold="Notice of Award attached" />
          <Check icon="✓" tone="green" bold="Request Summary complete" mute="dates, sponsor total, PI confirmed" />
          <Check icon={piSfiDone ? '✓' : '!'} tone={piSfiDone ? 'green' : 'amber'} bold="PI SFI disclosure" mute={piSfiDone ? 'Completed by PI 2 min ago.' : 'awaiting PI action. Cannot be completed by GM.'} />
          <Check icon="○" tone="gray" bold="Sponsor agreement (optional for federal awards)" />
        </div>

        {/* PURPLE MEMO: Comment section */}
        <CommentThread />

        <p className="text-[12px] text-sub">Once PI completes SFI, ASR routes automatically to Department  ›  OSP  ›  GCA</p>
      </div>
      <StickyCta hint="Step 4 of 4 · Confirm and submit">
        <Button variant="ghost" onClick={() => go('worksheet')}>← Back to worksheet</Button>
        <div className="flex-1" />
        <Button variant="secondary" onClick={() => { setTimeout(() => setPiSfiDone(true), 600); toast('SFI reminder sent to Dr. Hossain. (Demo: PI completes in 600ms)') }}>
          Send SFI reminder to PI
        </Button>
        <Button
          variant={piSfiDone ? 'primary' : 'disabled'}
          onClick={() => piSfiDone && toast('ASR submitted. Routing to Department › OSP › GCA.')}
        >
          {piSfiDone ? 'Submit ASR' : 'Submit ASR — waiting for PI SFI'}
        </Button>
      </StickyCta>
      <Footer />
    </div>
  )
}

function Check({ icon, tone, bold, mute }: { icon: string; tone: 'green' | 'amber' | 'gray'; bold: string; mute?: string }) {
  const dotBg = tone === 'green' ? 'bg-sage-600' : tone === 'amber' ? 'bg-amber-700' : 'bg-[#D9D5C8]'
  return (
    <div className="px-5 py-3 border-b border-bdLt last:border-b-0 flex items-center gap-3">
      <span className={`w-5 h-5 rounded-full ${dotBg} text-white text-[11px] font-bold flex items-center justify-center`}>{icon}</span>
      <span className="text-[13px] font-medium">{bold}</span>
      {mute && <span className="text-[13px] text-mute">— {mute}</span>}
    </div>
  )
}
