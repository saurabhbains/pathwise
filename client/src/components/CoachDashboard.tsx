import { useRef, useEffect } from 'react';
import type { ShadowThought, Metrics } from '../types';
import MetricCard from './MetricCard';
import ShadowFeed from './ShadowFeed';

interface CoachDashboardProps {
  shadowThoughts: ShadowThought[];
  metrics: Metrics;
}

export default function CoachDashboard({ shadowThoughts, metrics }: CoachDashboardProps) {
  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Dashboard Header */}
      <div className="bg-gray-800 text-white px-6 py-4 shadow-sm">
        <h2 className="text-lg font-semibold">Coach Dashboard</h2>
        <p className="text-sm text-gray-300">Real-time insights & analytics</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Live Metrics */}
        <section>
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
            Live Metrics
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <MetricCard
              title="Psychological Safety"
              value={metrics.psychologicalSafety}
              description="Employee's comfort level"
              color={metrics.psychologicalSafety >= 70 ? 'green' : metrics.psychologicalSafety >= 50 ? 'yellow' : 'red'}
            />
            <MetricCard
              title="Legal Risk"
              value={metrics.legalRisk}
              description="Potential legal exposure"
              color={metrics.legalRisk <= 30 ? 'green' : metrics.legalRisk <= 60 ? 'yellow' : 'red'}
              inverse
            />
            <MetricCard
              title="Clarity of Feedback"
              value={metrics.clarityOfFeedback}
              description="Specificity & actionability"
              color={metrics.clarityOfFeedback >= 70 ? 'green' : metrics.clarityOfFeedback >= 50 ? 'yellow' : 'red'}
            />
          </div>
        </section>

        {/* Shadow Feed */}
        <section>
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
            Shadow Channel
          </h3>
          <ShadowFeed thoughts={shadowThoughts} />
        </section>
      </div>
    </div>
  );
}
