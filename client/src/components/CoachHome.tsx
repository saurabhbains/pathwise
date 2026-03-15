import { useState } from 'react';

interface Client {
  id: string;
  name: string;
  title: string;
  company: string;
  department: string;
  activeLearners: number;
  totalRuns: number;
  avgScore: number;
}

// Mock clients - corporate coaching clients
const mockClients: Client[] = [
  {
    id: 'client-001',
    name: 'Sarah Mitchell',
    title: 'VP of Engineering',
    company: 'TechFlow Solutions',
    department: 'Engineering',
    activeLearners: 8,
    totalRuns: 42,
    avgScore: 72
  },
  {
    id: 'client-002',
    name: 'Michael Chen',
    title: 'Director of Product',
    company: 'Innovate Labs',
    department: 'Product',
    activeLearners: 5,
    totalRuns: 28,
    avgScore: 68
  },
  {
    id: 'client-003',
    name: 'Jennifer Brooks',
    title: 'Chief People Officer',
    company: 'Global Dynamics',
    department: 'Human Resources',
    activeLearners: 12,
    totalRuns: 64,
    avgScore: 78
  },
  {
    id: 'client-004',
    name: 'David Park',
    title: 'SVP of Operations',
    company: 'Nexus Corp',
    department: 'Operations',
    activeLearners: 6,
    totalRuns: 35,
    avgScore: 71
  }
];

export default function CoachHome() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = mockClients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStats = {
    clients: mockClients.length,
    totalRuns: mockClients.reduce((sum, c) => sum + c.totalRuns, 0),
    avgScore: Math.round(mockClients.reduce((sum, c) => sum + c.avgScore, 0) / mockClients.length),
    activeLearners: mockClients.reduce((sum, c) => sum + c.activeLearners, 0)
  };

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
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 bg-[#2E4057] rounded-lg p-1">
                <button onClick={() => window.location.href = '/'} className="px-4 py-1.5 text-slate-300 hover:text-white text-sm font-medium rounded-md transition-colors">
                  Learner
                </button>
                <button className="px-4 py-1.5 bg-[#6366F1] text-white text-sm font-medium rounded-md shadow">
                  Coach
                </button>
              </div>
              <button onClick={() => window.location.href = '/history'} className="flex items-center space-x-1.5 px-4 py-2 bg-[#2E4057] hover:bg-[#3a5068] text-slate-200 rounded-lg text-sm font-medium transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>History</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-8 pt-10 pb-6">
        <div className="mb-2">
          <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full uppercase tracking-wide">Coach Dashboard</span>
        </div>
        <h1 className="text-3xl font-bold text-[#1E2D3D] mb-1">Your Clients</h1>
        <p className="text-slate-500 text-sm">Track simulation sessions and performance across all your clients.</p>
      </div>

      {/* Stats Row */}
      <div className="max-w-6xl mx-auto px-8 mb-8">
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Clients', value: totalStats.clients, icon: '👥' },
            { label: 'Total Runs', value: totalStats.totalRuns, icon: '⚡' },
            { label: 'Avg Score', value: `${totalStats.avgScore}%`, icon: '🎯' },
            { label: 'Active Learners', value: totalStats.activeLearners, icon: '📚' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-5 border border-[#E8E4DE] shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{stat.label}</span>
                <span className="text-xl">{stat.icon}</span>
              </div>
              <p className="text-3xl font-bold text-[#1E2D3D]">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Search + Clients */}
      <div className="max-w-6xl mx-auto px-8 pb-16">
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-5 py-3 pl-11 border border-[#E8E4DE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366F1]/30 focus:border-[#6366F1] bg-white text-sm text-[#1E2D3D] placeholder-slate-400"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              onClick={() => window.location.href = `/coach/client/${client.id}`}
              className="group bg-white rounded-2xl border border-[#E8E4DE] hover:border-[#6366F1] hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer"
            >
              <div className="h-1 bg-gradient-to-r from-[#6366F1] to-[#818CF8]" />
              <div className="p-6 flex items-center space-x-4">
                <div className="w-14 h-14 bg-[#EEF2FF] rounded-2xl flex items-center justify-center text-lg font-bold text-[#6366F1] flex-shrink-0">
                  {client.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-[#1E2D3D] truncate">{client.name}</h3>
                  <p className="text-sm text-slate-500">{client.title}</p>
                  <p className="text-xs text-slate-400">{client.company} · {client.department}</p>
                </div>
                <svg className="w-5 h-5 text-slate-300 group-hover:text-[#6366F1] transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div className="px-6 pb-5 flex items-center space-x-6 border-t border-[#F0EDE8] pt-4">
                <div>
                  <p className="text-lg font-bold text-[#1E2D3D]">{client.activeLearners}</p>
                  <p className="text-xs text-slate-400">Learners</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-[#1E2D3D]">{client.totalRuns}</p>
                  <p className="text-xs text-slate-400">Runs</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-[#1E2D3D]">{client.avgScore}%</p>
                  <p className="text-xs text-slate-400">Avg Score</p>
                </div>
                <div className="ml-auto">
                  <span className="px-3 py-1 bg-[#EEF2FF] text-[#6366F1] rounded-full text-xs font-semibold">3 Scenarios</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-16">
            <p className="text-lg font-semibold text-[#1E2D3D] mb-1">No clients found</p>
            <p className="text-slate-400 text-sm">Try adjusting your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}

