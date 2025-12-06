interface MetricCardProps {
  title: string;
  value: number;
  description: string;
  color: 'green' | 'yellow' | 'red';
  inverse?: boolean;
}

export default function MetricCard({ title, value, description, color, inverse = false }: MetricCardProps) {
  const getColorClasses = () => {
    switch (color) {
      case 'green':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'yellow':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'red':
        return 'bg-red-50 border-red-200 text-red-700';
    }
  };

  const getProgressColor = () => {
    switch (color) {
      case 'green':
        return 'bg-green-500';
      case 'yellow':
        return 'bg-yellow-500';
      case 'red':
        return 'bg-red-500';
    }
  };

  const getStatusIcon = () => {
    switch (color) {
      case 'green':
        return (
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'yellow':
        return (
          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'red':
        return (
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className={`metric-card border-2 ${getColorClasses()}`}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="text-sm font-medium text-gray-700">{title}</h4>
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        </div>
        {getStatusIcon()}
      </div>

      <div className="mt-3">
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold">{Math.round(value)}</span>
          <span className="text-sm text-gray-600">/100</span>
        </div>

        {/* Progress Bar */}
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${getProgressColor()}`}
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
    </div>
  );
}
