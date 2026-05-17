import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Stage1JobIntake from './components/stages/Stage1JobIntake';
import Stage2BooleanGenerator from './components/stages/Stage2BooleanGenerator';
import Stage3CandidateScreener from './components/stages/Stage3CandidateScreener';
import Stage4OutreachGenerator from './components/stages/Stage4OutreachGenerator';
import Stage5ClarificationMessage from './components/stages/Stage5ClarificationMessage';
import Stage6CandidateWriteup from './components/stages/Stage6CandidateWriteup';
import Stage7InterviewPrep from './components/stages/Stage7InterviewPrep';

export default function App() {
  const [activeStage, setActiveStage] = useState(1);
  const [jobDescription, setJobDescription] = useState('');

  const stageProps = { jobDescription };

  const renderStage = () => {
    switch (activeStage) {
      case 1:
        return (
          <Stage1JobIntake
            jobDescription={jobDescription}
            onJobDescriptionChange={setJobDescription}
          />
        );
      case 2:
        return <Stage2BooleanGenerator {...stageProps} />;
      case 3:
        return <Stage3CandidateScreener {...stageProps} />;
      case 4:
        return <Stage4OutreachGenerator {...stageProps} />;
      case 5:
        return <Stage5ClarificationMessage {...stageProps} />;
      case 6:
        return <Stage6CandidateWriteup {...stageProps} />;
      case 7:
        return <Stage7InterviewPrep {...stageProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar
        activeStage={activeStage}
        onStageChange={setActiveStage}
        hasJD={Boolean(jobDescription)}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-full px-10 py-10">
          {renderStage()}
        </div>
      </main>
    </div>
  );
}
