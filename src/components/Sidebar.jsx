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

function LHLogo() {
  return (
    <div className="select-none">
      <div className="text-lh-400 text-xs font-light tracking-[0.25em] uppercase leading-none mb-0.5">
        lawrence
      </div>
      <div className="inline-block bg-white px-1.5 py-0.5">
        <span className="text-lh-950 text-sm font-black tracking-[0.2em] uppercase leading-none">
          HARVEY
        </span>
      </div>
    </div>
  );
}

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
    <div className="px-3 py-3 border-b border-lh-900/60" ref={ref}>
      <div className="text-[10px] font-semibold tracking-widest text-lh-500 uppercase mb-1.5 px-2">
        Active Search
      </div>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-2.5 py-2 rounded
          bg-lh-900/60 hover:bg-lh-900 border border-lh-800/50 hover:border-lh-700
          transition-all text-left group"
      >
        <span className="text-sm text-white truncate pr-2 font-medium">
          {activeRole?.name || 'No role selected'}
        </span>
        <svg className={`w-3.5 h-3.5 text-lh-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="mt-1 rounded border border-lh-800 bg-lh-950 overflow-hidden shadow-xl">
          {roles.map(role => (
            <div
              key={role.id}
              className={`flex items-center justify-between px-2.5 py-2 group
                ${role.id === activeRoleId ? 'bg-lh-900 border-l-2 border-lh-500' : 'hover:bg-lh-900/60 border-l-2 border-transparent'}
                transition-all`}
            >
              <button
                className="flex-1 text-left text-sm text-lh-100 truncate"
                onClick={() => { onSwitch(role.id); setOpen(false); }}
              >
                {role.name}
                {role.id === activeRoleId && (
                  <span className="ml-2 text-[10px] text-lh-400 font-mono">active</span>
                )}
              </button>
              {roles.length > 1 && (
                <button
                  onClick={() => onDelete(role.id)}
                  className="ml-2 text-lh-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() => { onCreate(); setOpen(false); }}
            className="w-full flex items-center gap-2 px-2.5 py-2 text-sm text-lh-400
              hover:bg-lh-900/60 transition-colors border-t border-lh-800 hover:text-lh-300"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-mono text-xs tracking-wide">New search</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ activeStage, onStageChange, hasJD, roles, activeRoleId, onSwitchRole, onCreateRole, onDeleteRole }) {
  return (
    <nav className="w-64 flex-shrink-0 bg-lh-950 h-screen flex flex-col sticky top-0 border-r border-lh-900/80">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-lh-900/60">
        <LHLogo />
        <div className="mt-3 text-[10px] font-mono text-lh-700 tracking-widest uppercase">
          Recruiting OS
        </div>
      </div>

      <RoleSelector
        roles={roles}
        activeRoleId={activeRoleId}
        onSwitch={onSwitchRole}
        onCreate={onCreateRole}
        onDelete={onDeleteRole}
      />

      {/* Stage nav */}
      <ul className="flex-1 py-3 space-y-0.5 overflow-y-auto scrollbar-thin">
        {STAGES.map(stage => {
          const isActive = activeStage === stage.id;
          const needsJD = stage.id > 1 && !hasJD;

          return (
            <li key={stage.id}>
              <button
                onClick={() => onStageChange(stage.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-150 relative
                  ${isActive
                    ? 'bg-lh-900/80 text-white border-l-2 border-lh-500'
                    : needsJD
                    ? 'text-white/30 hover:bg-lh-900/30 border-l-2 border-transparent'
                    : 'text-white hover:bg-lh-900/50 border-l-2 border-transparent'
                  }`}
              >
                <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-mono font-bold flex-shrink-0
                  ${isActive
                    ? 'bg-lh-500 text-white'
                    : needsJD
                    ? 'bg-lh-950 text-lh-800 border border-lh-900'
                    : 'bg-lh-900/60 text-lh-500 border border-lh-800/50'
                  }`}>
                  {String(stage.id).padStart(2, '0')}
                </span>
                <span className="text-sm font-medium leading-tight tracking-wide">{stage.label}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="px-5 py-4 border-t border-lh-900/60">
        <div className="text-[10px] font-mono text-lh-800 tracking-widest uppercase">
          Powered by Claude AI
        </div>
      </div>
    </nav>
  );
}
