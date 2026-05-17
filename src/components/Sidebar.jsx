const STAGES = [
  { id: 1, label: 'Job Intake' },
  { id: 2, label: 'Boolean Generator' },
  { id: 3, label: 'Candidate Screener' },
  { id: 4, label: 'Outreach Generator' },
  { id: 5, label: 'Clarification Message' },
  { id: 6, label: 'Candidate Writeup' },
  { id: 7, label: 'Interview Prep Email' },
];

export default function Sidebar({ activeStage, onStageChange, hasJD }) {
  return (
    <nav className="w-60 flex-shrink-0 bg-slate-900 h-screen flex flex-col sticky top-0">
      <div className="px-5 py-6 border-b border-slate-700">
        <div className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
          Recruiting
        </div>
        <div className="text-base font-semibold text-white mt-0.5">Workflow</div>
      </div>

      <ul className="flex-1 py-4 space-y-0.5 overflow-y-auto scrollbar-thin">
        {STAGES.map(stage => {
          const isActive = activeStage === stage.id;
          const needsJD = stage.id > 1 && !hasJD;

          return (
            <li key={stage.id}>
              <button
                onClick={() => onStageChange(stage.id)}
                className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-all duration-150
                  ${isActive
                    ? 'bg-slate-700 text-white'
                    : needsJD
                    ? 'text-slate-600 cursor-pointer hover:bg-slate-800 hover:text-slate-400'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                    ${isActive
                      ? 'bg-blue-500 text-white'
                      : needsJD
                      ? 'bg-slate-800 text-slate-600'
                      : 'bg-slate-700 text-slate-400'
                    }`}
                >
                  {stage.id}
                </span>
                <span className="text-sm font-medium leading-tight">{stage.label}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="px-5 py-4 border-t border-slate-700">
        <div className="text-xs text-slate-500">
          Powered by Claude
        </div>
      </div>
    </nav>
  );
}
