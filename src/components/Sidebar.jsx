import { useState, useRef, useEffect } from 'react';

const STAGES = [
  { id: 1, label: 'Job Intake' },
  { id: 2, label: 'Boolean Generator' },
  { id: 3, label: 'Candidate Screener' },
  { id: 4, label: 'Outreach Generator' },
  { id: 5, label: 'Clarification Message' },
  { id: 6, label: 'Candidate Writeup' },
  { id: 7, label: 'Interview Prep Email' },
];

function RoleSelector({ roles, activeRoleId, onSwitch, onCreate, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const activeRole = roles.find(r => r.id === activeRoleId);

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="px-3 py-3 border-b border-slate-700" ref={ref}>
      <div className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-1.5 px-2">
        Active Role
      </div>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg
          bg-slate-800 hover:bg-slate-700 transition-colors text-left"
      >
        <span className="text-sm text-white truncate pr-2">
          {activeRole?.name || 'No role selected'}
        </span>
        <svg className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="mt-1 rounded-lg border border-slate-700 bg-slate-800 overflow-hidden">
          {roles.map(role => (
            <div
              key={role.id}
              className={`flex items-center justify-between px-2.5 py-2 group
                ${role.id === activeRoleId ? 'bg-slate-700' : 'hover:bg-slate-700/60'}
                transition-colors`}
            >
              <button
                className="flex-1 text-left text-sm text-slate-200 truncate"
                onClick={() => { onSwitch(role.id); setOpen(false); }}
              >
                {role.name}
                {role.id === activeRoleId && (
                  <span className="ml-2 text-xs text-blue-400">active</span>
                )}
              </button>
              {roles.length > 1 && (
                <button
                  onClick={() => onDelete(role.id)}
                  className="ml-2 text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  title="Remove role"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() => { onCreate(); setOpen(false); }}
            className="w-full flex items-center gap-2 px-2.5 py-2 text-sm text-blue-400
              hover:bg-slate-700/60 transition-colors border-t border-slate-700"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New role
          </button>
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ activeStage, onStageChange, hasJD, roles, activeRoleId, onSwitchRole, onCreateRole, onDeleteRole }) {
  return (
    <nav className="w-60 flex-shrink-0 bg-slate-900 h-screen flex flex-col sticky top-0">
      <div className="px-5 py-4 border-b border-slate-700">
        <div className="text-xs font-semibold tracking-widest text-slate-400 uppercase">Recruiting</div>
        <div className="text-base font-semibold text-white mt-0.5">Workflow</div>
      </div>

      <RoleSelector
        roles={roles}
        activeRoleId={activeRoleId}
        onSwitch={onSwitchRole}
        onCreate={onCreateRole}
        onDelete={onDeleteRole}
      />

      <ul className="flex-1 py-3 space-y-0.5 overflow-y-auto scrollbar-thin">
        {STAGES.map(stage => {
          const isActive = activeStage === stage.id;
          const needsJD = stage.id > 1 && !hasJD;

          return (
            <li key={stage.id}>
              <button
                onClick={() => onStageChange(stage.id)}
                className={`w-full flex items-center gap-3 px-5 py-2.5 text-left transition-all duration-150
                  ${isActive
                    ? 'bg-slate-700 text-white'
                    : needsJD
                    ? 'text-slate-600 hover:bg-slate-800 hover:text-slate-500'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                  ${isActive ? 'bg-blue-500 text-white' : needsJD ? 'bg-slate-800 text-slate-600' : 'bg-slate-700 text-slate-400'}`}>
                  {stage.id}
                </span>
                <span className="text-sm font-medium leading-tight">{stage.label}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="px-5 py-3 border-t border-slate-700">
        <div className="text-xs text-slate-500">Powered by Claude</div>
      </div>
    </nav>
  );
}
