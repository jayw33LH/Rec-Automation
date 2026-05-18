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

  // Deep-merge stageData for the active role
  const saveStageData = useCallback((stageId, data) => {
    if (!activeRoleId) return;
    setRoles(prev => {
      const next = prev.map(r => {
        if (r.id !== activeRoleId) return r;
        return {
          ...r,
          stageData: {
            ...(r.stageData || {}),
            [stageId]: {
              ...(r.stageData?.[stageId] || {}),
              ...data,
            },
          },
        };
      });
      persistRoles(next);
      return next;
    });
  }, [activeRoleId]);

  const createRole = useCallback(() => {
    const id = Date.now().toString();
    setRoles(prev => {
      const next = [...prev, { id, name: 'New Role', jd: '', stageData: {} }];
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

  const sd = (stageId) => activeRole?.stageData?.[stageId] || {};

  const renderStage = () => {
    // key={activeRoleId} forces a full remount when role switches,
    // so each stage re-initialises its local state from savedData.
    switch (activeStage) {
      case 1:
        return (
          <Stage1JobIntake
            key={activeRoleId}
            role={activeRole}
            savedData={sd(1)}
            onRoleUpdate={updateActiveRole}
            onCreateRole={createRole}
            onSave={(data) => saveStageData(1, data)}
          />
        );
      case 2:
        return (
          <Stage2BooleanGenerator
            key={activeRoleId}
            jobDescription={jobDescription}
            savedData={sd(2)}
            onSave={(data) => saveStageData(2, data)}
          />
        );
      case 3:
        return (
          <Stage3CandidateScreener
            key={activeRoleId}
            jobDescription={jobDescription}
            savedData={sd(3)}
            onSave={(data) => saveStageData(3, data)}
          />
        );
      case 4:
        return (
          <Stage4OutreachGenerator
            key={activeRoleId}
            jobDescription={jobDescription}
            savedData={sd(4)}
            onSave={(data) => saveStageData(4, data)}
          />
        );
      case 5:
        return (
          <Stage5ClarificationMessage
            key={activeRoleId}
            jobDescription={jobDescription}
            savedData={sd(5)}
            onSave={(data) => saveStageData(5, data)}
          />
        );
      case 6:
        return (
          <Stage6CandidateWriteup
            key={activeRoleId}
            jobDescription={jobDescription}
            savedData={sd(6)}
            onSave={(data) => saveStageData(6, data)}
          />
        );
      case 7:
        return (
          <Stage7InterviewPrep
            key={activeRoleId}
            jobDescription={jobDescription}
            savedData={sd(7)}
            onSave={(data) => saveStageData(7, data)}
          />
        );
      default:
        return null;
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
        <main className="flex-1 overflow-y-auto bg-grid">
          <div className="min-h-full px-10 py-10 bg-white/80 backdrop-blur-[1px]">
            {renderStage()}
          </div>
        </main>
      </div>
    </ApiKeyGate>
  );
}
