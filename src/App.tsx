import { useState } from 'react'
import { Sidebar, FeedbackToast, type StepKey } from './ui'
import { SummaryScreen, SettingsScreen, WorksheetScreen, ImportScreen } from './screens'

export default function App() {
  const [active, setActive] = useState<StepKey>('summary')
  const [completed, setCompleted] = useState<Set<StepKey>>(new Set())
  const [toastMsg, setToastMsg] = useState('')
  const [toastOn, setToastOn] = useState(false)
  const [aiOn, setAiOn] = useState(true)
  const [collapsed, setCollapsed] = useState(false)

  function go(k: StepKey) {
    setCompleted(prev => new Set(prev).add(active))
    setActive(k)
    window.scrollTo(0, 0)
  }

  function toast(message: string) {
    setToastMsg(message)
    setToastOn(true)
    setTimeout(() => setToastOn(false), 3200)
  }

  const props = { go, toast, aiOn, setAiOn, collapsed, setCollapsed }

  return (
    <div className="h-screen flex">
      <Sidebar active={active} onJump={(k) => setActive(k)} completed={completed} collapsed={collapsed} />
      {active === 'summary'   && <SummaryScreen   {...props} />}
      {active === 'settings'  && <SettingsScreen  {...props} />}
      {active === 'worksheet' && <WorksheetScreen {...props} />}
      {active === 'import'    && <ImportScreen    {...props} />}
      <FeedbackToast show={toastOn} message={toastMsg} />
    </div>
  )
}
