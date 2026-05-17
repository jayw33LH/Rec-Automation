import { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import ApiKeyGate from './components/ApiKeyGate';
import Stage1JobIntake from './components/stages/Stage1JobIntake';
import Stage2BooleanGenerator from './components/stages/Stage2BooleanGenerator';
import Stage3CandidateScreener from './components/stages/Stage3CandidateScreener';
import Stage4OutreachGenerator from './components/stages/Stage4OutreachGenerator';
import Stage5ClarificationMessage from './components/stages/Stage5ClarificationMessage';
import Stage6CandidateWriteup from './components/stages/Stage6CandidateWriteup';
import Stage7InterviewPrep from './components/stages/Stage7InterviewPrep';

const ROLES_KEY = 'rec_roles';
const ACTIVE_KEY = 'rec_active_role';

function loadRoles() {
  try { return JSON.parse(localStorage.getItem(ROLES_KEY) || '[]'); }
  catch { return []; }
}

function persistRoles(roles) {
  localStorage.setItem(ROLES_KEY, JSON.stringify(roles));
}

export default function App() {
  const [activeStage, setActiveStage] = useState(1);
  const [roles, setRoles] = useState(loadRoles);
  const [activeRoleId, setActiveRoleId] = useState(() => {
    const saved = localStorage.getItem(ACTIVE_KEY);
    const all = loadRoles();
    return (saved && all.find(r => r.id === saved)) ? saved : all[0]?.id || null;
  });

  const activeRole = roles.find(r => r.id === activeRoleId) || null;
  const jobDescription = activeRole?.jd || '';

  const updateActiveRole = useCallback((updates) => {
    if (!activeRoleId) return;
    setRoles(prev => {
      const next = prev.map(r => r.id === activeRoleId ? { ...r, ...updates } : r);
      persistRoles(next);
      return next;
    });
  }, [activeRoleId]);

  const createRole = useCallback(() => {
    const id = Date.now().toString();
    const name = `New Role`;
    setRoles(prev => {
      const next = [...prev, { id, name, jd: '' }];
      persistRoles(next);
      return next;
    });
    setActiveRoleId(id);
    localStorage.setItem(ACTIVE_KEY, id);
    setActiveStage(1);
  }, []);

  const switchRole = useCallback((id) => {
    setActiveRoleId(id);
    localStorage.setItem(ACTIVE_KEY, id);
  }, []);

  const deleteRole = useCallback((id) => {
    setRoles(prev => {
      const next = prev.filter(r => r.id !== id);
      persistRoles(next);
      if (activeRoleId === id) {
        const fallback = next[0]?.id || null;
        setActiveRoleId(fallback);
        localStorage.setItem(ACTIVE_KEY, fallback || '');
      }
      return next;
    });
  }, [activeRoleId]);

  const renderStage = () => {
    const stageProps = { jobDescription };
    switch (activeStage) {
      case 1:
        return (
          <Stage1JobIntake
            role={activeRole}
            onRoleUpdate={updateActiveRole}
            onCreateRole={createRole}
          />
        );
      case 2: return <Stage2BooleanGenerator {...stageProps} />;
      case 3: return <Stage3CandidateScreener {...stageProps} />;
      case 4: return <Stage4OutreachGenerator {...stageProps} />;
      case 5: return <Stage5ClarificationMessage {...stageProps} />;
      case 6: return <Stage6CandidateWriteup {...stageProps} />;
      case 7: return <Stage7InterviewPrep {...stageProps} />;
      default: return null;
    }
  };

  return (
    <ApiKeyGate>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar
          activeStage={activeStage}
          onStageChange={setActiveStage}
          hasJD={Boolean(jobDescription)}
          roles={roles}
          activeRoleId={activeRoleId}
          onSwitchRole={switchRole}
          onCreateRole={createRole}
          onDeleteRole={deleteRole}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full px-10 py-10">
            {renderStage()}
          </div>
        </main>
      </div>
    </ApiKeyGate>
  );
}
