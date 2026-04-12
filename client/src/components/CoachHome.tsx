import { useState, useEffect } from 'react';
import { config } from '../config';

interface Session {
  id: string;
  scenarioId: string;
  scenarioName: string;
  completedAt: string;
  report: {
    outcome: string;
    turnCount: number;
    duration: number;
    finalMetrics: {
      psychologicalSafety: number;
      legalCompliance: number;
      clarityOfFeedback: number;
    };
    recommendations: string[];
    topIssues: { managerStatement: string; issue: string; severity: string }[];
  };
}

interface Stats {
  totalSessions: number;
  avgPsychSafety: number;
  avgLegal: number;
  avgClarity: number;
  avgOverall: number;
}

function scoreColor(v: number) {
  if (v >= 70) return 'text-emerald-600';
  if (v >= 50) return 'text-amber-600';
  return 'text-red-600';
}

function outcomeColor(o: string) {
  if (o === 'success') return 'bg-emerald-100 text-emerald-700';
  if (o === 'failure') return 'bg-red-100 text-red-700';
  return 'bg-amber-100 text-amber-700';
}

function formatDuration(ms: number) {
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  return `${mins}m ${secs}s`;
}

export default function CoachHome() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessRes, statsRes] = await Promise.all([
          fetch(`${config.apiUrl}/api/sessions`),
          fetch(`${config.apiUrl}/api/sessions/stats`),
        ]);
        const sessData = await sessRes.json();
        const statsData = await statsRes.json();
        setSessions(sessData.sessions || []);
        setStats(statsData);
      } catch {
        // backend not yet available — show empty state
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = sessions.filter(s =>
    s.scenarioName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.report.outcome.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h1 className="text-3xl font-bold text-[#1E2D3D] mb-1">Session History</h1>
        <p className="text-slate-500 text-sm">Real simulation sessions and performance data.</p>
      </div>

      {/* Stats Row */}
      {stats && (
        <div className="max-w-6xl mx-auto px-8 mb-8">
          <div className="grid grid-cols-5 gap-4">
            {[
              { label: 'Total Sessions', value: stats.totalSessions, icon: '⚡' },
              { label: 'Overall Avg', value: stats.totalSessions > 0 ? `${stats.avgOverall}%` : '—', icon: '🎯' },
              { label: 'Psych Safety', value: stats.totalSessions > 0 ? `${stats.avgPsychSafety}%` : '—', icon: '🧠' },
              { label: 'Legal', value: stats.totalSessions > 0 ? `${stats.avgLegal}%` : '—', icon: '⚖️' },
              { label: 'Clarity', value: stats.totalSessions > 0 ? `${stats.avgClarity}%` : '—', icon: '🎯' },
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
      )}

      {/* Sessions list */}
      <div className="max-w-6xl mx-auto px-8 pb-16">
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search sessions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-5 py-3 pl-11 border border-[#E8E4DE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366F1]/30 focus:border-[#6366F1] bg-white text-sm text-[#1E2D3D] placeholder-slate-400"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-[#6366F1] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#E8E4DE]">
            <div className="text-5xl mb-4">🎓</div>
            <p className="text-lg font-semibold text-[#1E2D3D] mb-2">No sessions yet</p>
            <p className="text-slate-400 text-sm mb-6">Complete a simulation as a Learner and your session will appear here.</p>
            <button onClick={() => window.location.href = '/'} className="px-6 py-2.5 bg-[#6366F1] text-white rounded-xl text-sm font-medium hover:bg-[#4F46E5]">
              Start a Simulation
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((session) => {
              const avg = Math.round((
                session.report.finalMetrics.psychologicalSafety +
                session.report.finalMetrics.legalCompliance +
                session.report.finalMetrics.clarityOfFeedback
              ) / 3);
              return (
                <div
                  key={session.id}
                  onClick={() => setSelectedSession(selectedSession?.id === session.id ? null : session)}
                  className="bg-white rounded-2xl border border-[#E8E4DE] hover:border-[#6366F1] hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer"
                >
                  <div className="h-1 bg-gradient-to-r from-[#6366F1] to-[#818CF8]" />
                  <div className="p-5 flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#EEF2FF] rounded-xl flex items-center justify-center text-[#6366F1] font-bold text-lg flex-shrink-0">
                      {avg}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-0.5">
                        <h3 className="text-sm font-bold text-[#1E2D3D]">{session.scenarioName}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${outcomeColor(session.report.outcome)}`}>
                          {session.report.outcome}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {new Date(session.completedAt).toLocaleString()} · {session.report.turnCount} exchanges · {formatDuration(session.report.duration)}
                      </p>
                    </div>
                    <div className="hidden sm:flex items-center space-x-4 flex-shrink-0">
                      <div className="text-center">
                        <p className={`text-sm font-bold ${scoreColor(session.report.finalMetrics.psychologicalSafety)}`}>
                          {Math.round(session.report.finalMetrics.psychologicalSafety)}
                        </p>
                        <p className="text-xs text-slate-400">Safety</p>
                      </div>
                      <div className="text-center">
                        <p className={`text-sm font-bold ${scoreColor(session.report.finalMetrics.legalCompliance)}`}>
                          {Math.round(session.report.finalMetrics.legalCompliance)}
                        </p>
                        <p className="text-xs text-slate-400">Legal</p>
                      </div>
                      <div className="text-center">
                        <p className={`text-sm font-bold ${scoreColor(session.report.finalMetrics.clarityOfFeedback)}`}>
                          {Math.round(session.report.finalMetrics.clarityOfFeedback)}
                        </p>
                        <p className="text-xs text-slate-400">Clarity</p>
                      </div>
                    </div>
                    <svg className={`w-4 h-4 text-slate-300 flex-shrink-0 transition-transform ${selectedSession?.id === session.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {/* Expanded detail */}
                  {selectedSession?.id === session.id && (
                    <div className="border-t border-[#F0EDE8] px-5 py-4 bg-[#F8F7F4] space-y-4">
                      {session.report.recommendations.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Coaching Recommendations</p>
                          <ul className="space-y-1">
                            {session.report.recommendations.map((rec, i) => (
                              <li key={i} className="text-xs text-[#1E2D3D] flex items-start space-x-2">
                                <span className="text-[#6366F1] mt-0.5">•</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {session.report.topIssues.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">The Cringe List</p>
                          <ul className="space-y-1.5">
                            {session.report.topIssues.map((issue, i) => (
                              <li key={i} className="text-xs bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                                <span className="font-medium text-red-800">"{issue.managerStatement}"</span>
                                <span className="text-red-600"> — {issue.issue}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
