import { useParams } from 'react-router-dom';

interface Client {
  id: string;
  name: string;
  title: string;
  company: string;
  department: string;
}

interface Scenario {
  id: string;
  name: string;
  description: string;
  characterName: string;
  characterRole: string;
  estimatedTime: string;
  timesRun: number;
  avgScore: number;
}

// Mock clients
const mockClients: Record<string, Client> = {
  'client-001': {
    id: 'client-001',
    name: 'Sarah Mitchell',
    title: 'VP of Engineering',
    company: 'TechFlow Solutions',
    department: 'Engineering'
  },
  'client-002': {
    id: 'client-002',
    name: 'Michael Chen',
    title: 'Director of Product',
    company: 'Innovate Labs',
    department: 'Product'
  },
  'client-003': {
    id: 'client-003',
    name: 'Jennifer Brooks',
    title: 'Chief People Officer',
    company: 'Global Dynamics',
    department: 'Human Resources'
  },
  'client-004': {
    id: 'client-004',
    name: 'David Park',
    title: 'SVP of Operations',
    company: 'Nexus Corp',
    department: 'Operations'
  }
};

// The 3 scenarios - matching learner area titles
const scenarios: Scenario[] = [
  {
    id: 'def-dev-001',
    name: 'Delivering Difficult Feedback',
    description: 'A mid-level engineer has missed multiple deadlines and is deflecting blame. Practice giving clear, specific feedback.',
    characterName: 'Alex Chen',
    characterRole: 'Software Engineer II',
    estimatedTime: '15-20 min',
    timesRun: 42,
    avgScore: 58
  },
  {
    id: 'check-sen-001',
    name: 'Re-engaging a Disengaged Employee',
    description: 'A previously high-performing senior employee has become disengaged and their attitude is affecting team morale.',
    characterName: 'Jordan Martinez',
    characterRole: 'Senior Customer Success Manager',
    estimatedTime: '20-25 min',
    timesRun: 28,
    avgScore: 65
  },
  {
    id: 'hp-bias-001',
    name: 'Navigating a Bias Complaint',
    description: 'Your top performer filed an HR complaint about bias. Navigate this sensitive conversation professionally.',
    characterName: 'Priya Sharma',
    characterRole: 'Senior ML Engineer',
    estimatedTime: '25-30 min',
    timesRun: 18,
    avgScore: 72
  }
];

export default function ClientScenarios() {
  const { clientId } = useParams<{ clientId: string }>();
  const client = clientId ? mockClients[clientId] : null;

  if (!client) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E0FBFC] via-white to-[#98C1D9] flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-[#293241]">Client not found</p>
          <button
            onClick={() => window.location.href = '/coach'}
            className="mt-4 px-6 py-3 bg-[#EE6C4D] text-white rounded-xl font-bold"
          >
            Back to Clients
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      {/* Header */}
      <div className="bg-[#1E2D3D] border-b border-[#2E4057]">
        <div className="max-w-6xl mx-auto px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src="/pathwiseicon_square.png" alt="Pathwise" className="w-10 h-10 rounded-xl shadow" />
              <img src="/pathwise_wordmark_white.png" alt="Pathwise" className="h-8" />
            </div>
            <div className="flex items-center space-x-1 bg-[#2E4057] rounded-lg p-1">
              <button onClick={() => window.location.href = '/'} className="px-4 py-1.5 text-slate-300 hover:text-white text-sm font-medium rounded-md transition-colors">
                Learner
              </button>
              <button className="px-4 py-1.5 bg-[#6366F1] text-white text-sm font-medium rounded-md shadow">
                Coach
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Client Info */}
      <div className="max-w-6xl mx-auto px-8 pt-8 pb-4">
        <div className="flex items-center space-x-4 mb-6">
          <button onClick={() => window.location.href = '/coach'} className="p-2 bg-white hover:bg-[#F0EDE8] rounded-xl border border-[#E8E4DE] transition-colors">
            <svg className="w-5 h-5 text-[#1E2D3D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="w-12 h-12 bg-[#EEF2FF] rounded-xl flex items-center justify-center text-base font-bold text-[#6366F1]">
            {client.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#1E2D3D]">{client.name}</h2>
            <p className="text-sm text-slate-500">{client.title} · {client.company}</p>
          </div>
          <div className="ml-auto">
            <span className="px-3 py-1 bg-[#EEF2FF] text-[#6366F1] rounded-full text-xs font-semibold">3 Scenarios</span>
          </div>
        </div>
      </div>

      {/* Scenarios List */}
      <div className="max-w-6xl mx-auto px-8 pb-16">
        <div className="grid grid-cols-1 gap-5">
          {scenarios.map((scenario) => (
            <div key={scenario.id} className="bg-white rounded-2xl border border-[#E8E4DE] overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-[#6366F1] to-[#818CF8]" />
              <div className="flex flex-col md:flex-row">
                {/* Left: Character */}
                <div className="md:w-48 bg-[#1E2D3D] p-6 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-[#EEF2FF] rounded-xl flex items-center justify-center text-xl font-bold text-[#6366F1] mb-3">
                    {scenario.characterName.charAt(0)}
                  </div>
                  <p className="text-sm font-semibold text-white text-center">{scenario.characterName}</p>
                  <p className="text-xs text-slate-400 text-center mt-0.5">{scenario.characterRole}</p>
                </div>

                {/* Middle: Details */}
                <div className="flex-1 p-6">
                  <h3 className="text-lg font-bold text-[#1E2D3D] mb-1">{scenario.name}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">{scenario.description}</p>
                  <div className="flex items-center space-x-5 text-xs text-slate-400">
                    <span>📊 {scenario.timesRun} runs</span>
                    <span>🎯 {scenario.avgScore}% avg</span>
                    <span>⏱ {scenario.estimatedTime}</span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="md:w-52 p-5 border-l border-[#F0EDE8] flex flex-col space-y-2.5 justify-center">
                  <button
                    onClick={() => window.location.href = `/coach/scenario/${scenario.id}/configure`}
                    className="w-full py-2 px-4 border border-[#E8E4DE] hover:border-[#6366F1] hover:text-[#6366F1] text-[#1E2D3D] rounded-xl text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Configure</span>
                  </button>
                  <button
                    onClick={() => window.location.href = `/coach/scenario/${scenario.id}/test`}
                    className="w-full py-2 px-4 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Test Run</span>
                  </button>
                  <button
                    onClick={() => window.location.href = `/coach/scenario/${scenario.id}/analytics`}
                    className="w-full py-2 px-4 border border-[#E8E4DE] hover:border-[#6366F1] hover:text-[#6366F1] text-[#1E2D3D] rounded-xl text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>Analytics</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

