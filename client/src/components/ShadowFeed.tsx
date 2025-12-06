import { useRef, useEffect } from 'react';
import type { ShadowThought } from '../types';

interface ShadowFeedProps {
  thoughts: ShadowThought[];
}

export default function ShadowFeed({ thoughts }: ShadowFeedProps) {
  const feedEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new thoughts arrive
  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thoughts]);

  if (thoughts.length === 0) {
    return (
      <div className="bg-white rounded-lg border-2 border-gray-200 p-8 text-center">
        <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <p className="text-sm text-gray-500">No shadow thoughts yet</p>
        <p className="text-xs text-gray-400 mt-1">Hidden agent reactions will appear here</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-4 max-h-96 overflow-y-auto">
      <div className="space-y-3">
        {thoughts.map((thought, index) => (
          <div
            key={index}
            className={`shadow-thought ${
              thought.agentRole === 'employee'
                ? 'border-blue-400 bg-blue-50'
                : 'border-purple-400 bg-purple-50'
            }`}
          >
            <div className="flex items-start justify-between mb-1">
              <div className="flex items-center space-x-2">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    thought.agentRole === 'employee'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {thought.agentRole === 'employee' ? 'Employee' : 'HR Observer'}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(thought.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-700 leading-relaxed">{thought.thought}</p>

            {thought.flags && thought.flags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {thought.flags.map((flag, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                  >
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                    </svg>
                    {flag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
        <div ref={feedEndRef} />
      </div>
    </div>
  );
}
