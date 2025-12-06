import { useState } from 'react';

interface Client {
  id: string;
  name: string;
  company: string;
  role: string;
  scenarioCount: number;
  lastActive: string;
}

interface Scenario {
  id: string;
  name: string;
  description: string;
  employeeName: string;
  employeeRole: string;
  estimatedTime: string;
}

// Mock clients data
const mockClients: Client[] = [
  {
    id: 'client-001',
    name: 'Sarah Mitchell',
    company: 'Vertex Analytics',
    role: 'VP of Engineering',
    scenarioCount: 3,
    lastActive: '2 days ago'
  },
  {
    id: 'client-002',
    name: 'David Park',
    company: 'CloudScale Systems',
    role: 'Director of Product',
    scenarioCount: 3,
    lastActive: '1 week ago'
  },
  {
    id: 'client-003',
    name: 'Rachel Torres',
    company: 'Momentum Health',
    role: 'Chief People Officer',
    scenarioCount: 3,
    lastActive: '3 days ago'
  }
];

// Client-specific scenarios with different employee names
const clientScenarios: Record<string, Scenario[]> = {
  'client-001': [
    {
      id: 'sc-001-1',
      name: 'Delivering Difficult Feedback',
      description: 'A mid-level engineer has missed multiple deadlines and is deflecting blame. Practice giving clear, specific feedback.',
      employeeName: 'Marcus Webb',
      employeeRole: 'Software Engineer II',
      estimatedTime: '15-20 min'
    },
    {
      id: 'sc-001-2',
      name: 'Re-engaging a Disengaged Employee',
      description: 'A previously high-performing senior employee has become disengaged and their attitude is affecting team morale.',
      employeeName: 'Diana Reyes',
      employeeRole: 'Senior Customer Success Manager',
      estimatedTime: '20-25 min'
    },
    {
      id: 'sc-001-3',
      name: 'Navigating a Bias Complaint',
      description: 'Your top performer filed an HR complaint about bias. Navigate this sensitive conversation professionally.',
      employeeName: 'Kenji Tanaka',
      employeeRole: 'Senior ML Engineer',
      estimatedTime: '25-30 min'
    }
  ],
  'client-002': [
    {
      id: 'sc-002-1',
      name: 'Delivering Difficult Feedback',
      description: 'A mid-level engineer has missed multiple deadlines and is deflecting blame. Practice giving clear, specific feedback.',
      employeeName: 'Tyler Brooks',
      employeeRole: 'Product Manager',
      estimatedTime: '15-20 min'
    },
    {
      id: 'sc-002-2',
      name: 'Re-engaging a Disengaged Employee',
      description: 'A previously high-performing senior employee has become disengaged and their attitude is affecting team morale.',
      employeeName: 'Nina Patel',
      employeeRole: 'Senior UX Designer',
      estimatedTime: '20-25 min'
    },
    {
      id: 'sc-002-3',
      name: 'Navigating a Bias Complaint',
      description: 'Your top performer filed an HR complaint about bias. Navigate this sensitive conversation professionally.',
      employeeName: 'Chris Okonkwo',
      employeeRole: 'Staff Engineer',
      estimatedTime: '25-30 min'
    }
  ],
  'client-003': [
    {
      id: 'sc-003-1',
      name: 'Delivering Difficult Feedback',
      description: 'A mid-level engineer has missed multiple deadlines and is deflecting blame. Practice giving clear, specific feedback.',
      employeeName: 'Jamie Sullivan',
      employeeRole: 'HR Business Partner',
      estimatedTime: '15-20 min'
    },
    {
      id: 'sc-003-2',
      name: 'Re-engaging a Disengaged Employee',
      description: 'A previously high-performing senior employee has become disengaged and their attitude is affecting team morale.',
      employeeName: 'Morgan Liu',
      employeeRole: 'Senior Recruiter',
      estimatedTime: '20-25 min'
    },
    {
      id: 'sc-003-3',
      name: 'Navigating a Bias Complaint',
      description: 'Your top performer filed an HR complaint about bias. Navigate this sensitive conversation professionally.',
      employeeName: 'Sam Washington',
      employeeRole: 'Learning & Development Lead',
      estimatedTime: '25-30 min'
    }
  ]
};

export default function CoachHome() {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = mockClients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Render client detail view
  if (selectedClient) {
    const scenarios = clientScenarios[selectedClient.id] || [];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E0FBFC] via-white to-[#98C1D9] relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#EE6C4D] rounded-full opacity-10 blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#3D5A80] rounded-full opacity-5 blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        {/* Header */}
        <div className="relative bg-[#3D5A80] border-b-2 border-[#293241] shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSelectedClient(null)}
                  className="p-2 hover:bg-[#293241] rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-white">{selectedClient.name}</h1>
                  <p className="text-[#E0FBFC]">{selectedClient.role} at {selectedClient.company}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 bg-[#293241] rounded-xl p-1 border-2 border-[#98C1D9]">
                <button
                  onClick={() => window.location.href = '/'}
                  className="px-4 py-2 text-[#E0FBFC] hover:bg-[#3D5A80] rounded-lg font-bold transition-colors"
                >
                  🎓 Learner
                </button>
                <button className="px-4 py-2 bg-[#98C1D9] text-[#293241] rounded-lg font-bold shadow-md">
                  👨‍🏫 Coach
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scenarios Grid */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h2 className="text-xl font-bold text-[#293241] mb-6">Assigned Scenarios</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {scenarios.map((scenario) => (
              <div
                key={scenario.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border-2 border-[#E0FBFC] hover:border-[#98C1D9] overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#293241] mb-2">{scenario.name}</h3>
                  <p className="text-sm text-[#3D5A80] mb-4">{scenario.description}</p>
                  
                  {/* Employee Info */}
                  <div className="flex items-center space-x-3 p-3 bg-[#E0FBFC] rounded-lg mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#3D5A80] to-[#98C1D9] rounded-full flex items-center justify-center text-white font-bold">
                      {scenario.employeeName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#293241]">{scenario.employeeName}</p>
                      <p className="text-xs text-[#3D5A80]">{scenario.employeeRole}</p>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="flex items-center text-xs text-[#3D5A80] mb-4">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{scenario.estimatedTime}</span>
                  </div>

                  {/* Action Button */}
                  <button className="w-full py-3 bg-[#3D5A80] hover:bg-[#293241] text-white rounded-lg font-medium transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render client list view
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E0FBFC] via-white to-[#98C1D9] relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#EE6C4D] rounded-full opacity-10 blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#3D5A80] rounded-full opacity-5 blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      {/* Header */}
      <div className="relative bg-[#3D5A80] border-b-2 border-[#293241] shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <img 
                src="/pathwiseicon_square.png" 
                alt="Pathwise" 
                className="w-16 h-16 rounded-2xl shadow-lg"
              />
              <div>
                <img 
                  src="/pathwise_wordmark_white.png" 
                  alt="Pathwise" 
                  className="h-10 mb-2"
                />
                <p className="text-[#E0FBFC] font-medium">Manage your coaching clients</p>
              </div>
            </div>
            
            {/* Mode Switcher */}
            <div className="flex items-center space-x-2 bg-[#293241] rounded-xl p-1 border-2 border-[#98C1D9]">
              <button
                onClick={() => window.location.href = '/'}
                className="px-4 py-2 text-[#E0FBFC] hover:bg-[#3D5A80] rounded-lg font-bold transition-colors"
              >
                🎓 Learner
              </button>
              <button className="px-4 py-2 bg-[#98C1D9] text-[#293241] rounded-lg font-bold shadow-md">
                👨‍🏫 Coach
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search clients... 🔍"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 pl-14 text-lg border-3 border-[#98C1D9] rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#98C1D9] focus:ring-opacity-30 focus:border-[#3D5A80] transition-all shadow-lg bg-white"
            />
            <svg className="w-6 h-6 text-[#3D5A80] absolute left-5 top-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Client List */}
      <div className="max-w-7xl mx-auto px-6 py-8 relative">
        <h2 className="text-xl font-bold text-[#293241] mb-6">Your Clients</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              onClick={() => setSelectedClient(client)}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all border-2 border-[#E0FBFC] hover:border-[#98C1D9] overflow-hidden cursor-pointer transform hover:-translate-y-1"
            >
              <div className="p-6">
                {/* Client Avatar & Name */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#3D5A80] to-[#98C1D9] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform">
                    {client.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#293241] group-hover:text-[#3D5A80] transition-colors">
                      {client.name}
                    </h3>
                    <p className="text-sm text-[#3D5A80]">{client.role}</p>
                  </div>
                </div>

                {/* Company */}
                <div className="flex items-center text-sm text-[#3D5A80] mb-3">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>{client.company}</span>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-[#E0FBFC]">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#293241]">{client.scenarioCount}</p>
                    <p className="text-xs text-[#3D5A80]">Scenarios</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-[#3D5A80]">Last active</p>
                    <p className="text-sm font-medium text-[#293241]">{client.lastActive}</p>
                  </div>
                </div>
              </div>

              {/* Hover indicator */}
              <div className="bg-[#3D5A80] text-white text-center py-3 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                View Scenarios →
              </div>
            </div>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-16">
            <div className="text-8xl mb-4">🔍</div>
            <p className="text-2xl font-bold text-[#293241] mb-2">No clients found</p>
            <p className="text-[#3D5A80]">Try adjusting your search</p>
          </div>
        )}
      </div>
    </div>
  );
}

