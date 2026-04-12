import { useState } from 'react';
import { config } from '../config';
import type { Metrics, ScenarioReport } from '../types';

interface ScenarioEndModalProps {
  isOpen: boolean;
  onStartNew: () => void;
  report: ScenarioReport | null;
  metrics: Metrics;
  messageCount: number;
}

export default function ScenarioEndModal({ isOpen, onStartNew, report, metrics, messageCount }: ScenarioEndModalProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    if (!report) return;
    setDownloading(true);
    try {
      const response = await fetch(`${config.apiUrl}/api/report/pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report),
      });
      if (!response.ok) throw new Error('Failed to generate PDF');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pathwise-report-${report.scenarioId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF download failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  if (!isOpen) return null;

  // Determine if scenario was completed properly
  const wasAbandoned = report?.outcome === 'abandoned';

  // Calculate score based on outcome and metrics
  const calculateScore = () => {
    if (wasAbandoned) {
      // Abandoned scenarios get a maximum of 40% (or actual average if lower)
      const rawAverage = (metrics.psychologicalSafety + metrics.legalCompliance + metrics.clarityOfFeedback) / 3;
      return Math.min(40, Math.round(rawAverage));
    }

    if (report?.finalMetrics) {
      return Math.round((
        report.finalMetrics.psychologicalSafety +
        report.finalMetrics.legalCompliance +
        report.finalMetrics.clarityOfFeedback
      ) / 3);
    }

    // Fallback to current metrics
    return Math.round((metrics.psychologicalSafety + metrics.legalCompliance + metrics.clarityOfFeedback) / 3);
  };

  const averageScore = calculateScore();

  const getOverallRating = () => {
    if (wasAbandoned) {
      return { text: 'Incomplete', color: 'text-orange-600', emoji: '⚠️' };
    }
    if (averageScore >= 80) return { text: 'Excellent', color: 'text-green-600', emoji: '🎉' };
    if (averageScore >= 60) return { text: 'Good', color: 'text-blue-600', emoji: '👍' };
    if (averageScore >= 40) return { text: 'Needs Improvement', color: 'text-yellow-600', emoji: '⚠️' };
    return { text: 'Challenging', color: 'text-red-600', emoji: '📉' };
  };

  const rating = getOverallRating();
  const finalMetrics = report?.finalMetrics || metrics;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-8 text-center">
          <div className="text-6xl mb-4">{rating.emoji}</div>
          <h2 className="text-3xl font-bold mb-2">Scenario Complete!</h2>
          <p className="text-primary-100">
            {wasAbandoned
              ? "Scenario ended too early - try to complete the full conversation"
              : "Here's how you did in this performance review"}
          </p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Overall Rating */}
          <div className="text-center bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
            <div className="text-sm font-medium text-gray-600 mb-1">Overall Performance</div>
            <div className={`text-4xl font-bold ${rating.color}`}>{rating.text}</div>
            <div className="text-2xl font-semibold text-gray-700 mt-2">{averageScore}%</div>
            <div className="text-sm text-gray-600 mt-2">
              Based on {report?.turnCount || messageCount} message{(report?.turnCount || messageCount) !== 1 ? 's' : ''} exchanged
            </div>
          </div>

          {/* Detailed Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Psychological Safety */}
            <div className="bg-white border-2 border-gray-200 rounded-lg p-4 text-center">
              <div className="text-sm font-medium text-gray-600 mb-2">Psychological Safety</div>
              <div className="text-3xl font-bold text-gray-900">{Math.round(finalMetrics.psychologicalSafety)}%</div>
              <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    finalMetrics.psychologicalSafety >= 70 ? 'bg-green-500' :
                    finalMetrics.psychologicalSafety >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${finalMetrics.psychologicalSafety}%` }}
                />
              </div>
            </div>

            {/* Legal Compliance */}
            <div className="bg-white border-2 border-gray-200 rounded-lg p-4 text-center">
              <div className="text-sm font-medium text-gray-600 mb-2">Legal Compliance</div>
              <div className="text-3xl font-bold text-gray-900">{Math.round(finalMetrics.legalCompliance)}%</div>
              <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    finalMetrics.legalCompliance >= 70 ? 'bg-green-500' :
                    finalMetrics.legalCompliance >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${finalMetrics.legalCompliance}%` }}
                />
              </div>
            </div>

            {/* Clarity */}
            <div className="bg-white border-2 border-gray-200 rounded-lg p-4 text-center">
              <div className="text-sm font-medium text-gray-600 mb-2">Feedback Clarity</div>
              <div className="text-3xl font-bold text-gray-900">{Math.round(finalMetrics.clarityOfFeedback)}%</div>
              <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    finalMetrics.clarityOfFeedback >= 70 ? 'bg-green-500' :
                    finalMetrics.clarityOfFeedback >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${finalMetrics.clarityOfFeedback}%` }}
                />
              </div>
            </div>
          </div>

          {/* Key Takeaways or Recommendations */}
          {report?.recommendations && report.recommendations.length > 0 ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span>Coaching Recommendations</span>
              </h3>
              <ul className="space-y-2 text-sm text-blue-900">
                {report.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className={rec.includes('CRITICAL') || rec.includes('Work on') ? 'text-red-600' : 'text-blue-600'}>
                      {rec.includes('CRITICAL') || rec.includes('Work on') ? '!' : '•'}
                    </span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span>Key Takeaways</span>
              </h3>
              <ul className="space-y-2 text-sm text-blue-900">
                {finalMetrics.psychologicalSafety >= 70 ? (
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600">✓</span>
                    <span>You created a safe environment for the conversation</span>
                  </li>
                ) : (
                  <li className="flex items-start space-x-2">
                    <span className="text-red-600">✗</span>
                    <span>Work on building more psychological safety - the employee may have felt threatened or defensive</span>
                  </li>
                )}

                {finalMetrics.legalCompliance >= 60 ? (
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600">✓</span>
                    <span>Your feedback was fair and professional</span>
                  </li>
                ) : (
                  <li className="flex items-start space-x-2">
                    <span className="text-red-600">✗</span>
                    <span>Be mindful of vague or potentially biased language in feedback</span>
                  </li>
                )}

                {finalMetrics.clarityOfFeedback >= 70 ? (
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600">✓</span>
                    <span>You provided specific, actionable feedback</span>
                  </li>
                ) : (
                  <li className="flex items-start space-x-2">
                    <span className="text-red-600">✗</span>
                    <span>Try to be more specific with examples and clear expectations</span>
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Top Issues / Cringe List */}
          {report?.topIssues && report.topIssues.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="font-semibold text-red-900 mb-3 flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>The Cringe List - Top Issues</span>
              </h3>
              <ul className="space-y-3">
                {report.topIssues.map((issue, idx) => (
                  <li key={idx} className="text-sm">
                    <div className="flex items-start space-x-2">
                      <span className={`font-bold ${
                        issue.severity === 'high' ? 'text-red-700' :
                        issue.severity === 'medium' ? 'text-orange-700' : 'text-yellow-700'
                      }`}>
                        {issue.severity === 'high' ? '🚨' : issue.severity === 'medium' ? '⚠️' : '💡'}
                      </span>
                      <div className="flex-1">
                        <p className="text-red-900 font-medium">"{issue.managerStatement}"</p>
                        <p className="text-red-700 text-xs mt-1">{issue.issue}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-8 py-6 bg-gray-50 flex flex-col sm:flex-row items-center justify-center gap-3">
          {report && (
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="px-6 py-3 bg-[#1E2D3D] hover:bg-[#2E4057] text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              {downloading ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
              <span>{downloading ? 'Generating PDF...' : 'Download Report (PDF)'}</span>
            </button>
          )}
          <button
            onClick={onStartNew}
            className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2 text-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Start New Scenario</span>
          </button>
        </div>
      </div>
    </div>
  );
}
