interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#293241] flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-10 py-6">
        <div className="flex items-center space-x-3">
          <img src="/pathwiseicon_square.png" alt="Pathwise" className="w-10 h-10 rounded-xl" />
          <img src="/pathwise_wordmark_white.png" alt="Pathwise" className="h-8" />
        </div>
        <button
          onClick={onGetStarted}
          className="px-5 py-2.5 bg-[#EE6C4D] hover:bg-[#d85c3f] text-white rounded-lg font-semibold text-sm transition-colors"
        >
          Try a Scenario
        </button>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 bg-[#3D5A80] border border-[#98C1D9] rounded-full px-4 py-1.5 mb-8">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          <span className="text-[#E0FBFC] text-sm font-medium">AI-Powered Leadership Training</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight max-w-3xl mb-6">
          Practice the conversations that{' '}
          <span className="text-[#EE6C4D]">make or break</span>{' '}
          careers
        </h1>

        <p className="text-lg text-[#98C1D9] max-w-2xl mb-12 leading-relaxed">
          Pathwise puts you in high-stakes leadership conversations with AI employees — and shows you exactly what they're thinking while you talk. Real-time coaching. No embarrassing mistakes in real life.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-20">
          <button
            onClick={onGetStarted}
            className="px-8 py-4 bg-[#EE6C4D] hover:bg-[#d85c3f] text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Start Practicing — It's Free
          </button>
          <button
            onClick={onGetStarted}
            className="px-8 py-4 bg-transparent border-2 border-[#98C1D9] text-[#E0FBFC] hover:bg-[#3D5A80] rounded-xl font-bold text-lg transition-all"
          >
            Watch Demo
          </button>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-20">
          {[
            { icon: '🎙️', label: 'Voice-first conversations' },
            { icon: '🧠', label: 'See hidden employee thoughts' },
            { icon: '⚖️', label: 'Live legal risk scoring' },
            { icon: '📊', label: 'Real-time coaching feedback' },
          ].map((f) => (
            <div
              key={f.label}
              className="flex items-center space-x-2 bg-[#3D5A80] border border-[#4a6d96] rounded-full px-4 py-2"
            >
              <span>{f.icon}</span>
              <span className="text-[#E0FBFC] text-sm font-medium">{f.label}</span>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="w-full max-w-4xl">
          <p className="text-[#98C1D9] text-sm font-semibold uppercase tracking-widest mb-8">How it works</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Pick a scenario',
                description: 'Choose from real-world leadership challenges — performance reviews, bias complaints, disengaged employees.',
                color: 'from-[#3D5A80] to-[#4a6d96]',
              },
              {
                step: '02',
                title: 'Have the conversation',
                description: 'Speak or type to an AI employee. Watch their hidden thoughts appear in real-time as an HR observer scores your every word.',
                color: 'from-[#EE6C4D] to-[#f07d5f]',
              },
              {
                step: '03',
                title: 'Get your debrief',
                description: 'Receive a detailed coaching report — including "The Cringe List" of your worst moments — so you never make them in real life.',
                color: 'from-[#98C1D9] to-[#7aadc7]',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-[#3D5A80] border border-[#4a6d96] rounded-2xl p-6 text-left"
              >
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} text-white font-bold text-sm mb-4`}>
                  {item.step}
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-[#98C1D9] text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* The Shadow Channel callout */}
        <div className="w-full max-w-4xl mt-12 bg-gradient-to-r from-[#1a2030] to-[#293241] border border-purple-800 rounded-2xl p-8 text-left">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-purple-900 rounded-xl flex items-center justify-center text-2xl">
              👁️
            </div>
            <div>
              <div className="inline-flex items-center space-x-2 bg-purple-900 border border-purple-700 rounded-full px-3 py-1 mb-3">
                <span className="text-purple-300 text-xs font-semibold uppercase tracking-wide">Unique Feature</span>
              </div>
              <h3 className="text-white text-xl font-bold mb-2">The Shadow Channel</h3>
              <p className="text-[#98C1D9] text-sm leading-relaxed max-w-2xl">
                While you're speaking, a hidden AI agent streams the employee's real internal thoughts — what they're actually feeling but not saying. You'll also see an HR Observer flagging legal risks and bias in real time. It's like having X-ray vision into the conversation.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16">
          <button
            onClick={onGetStarted}
            className="px-10 py-4 bg-[#EE6C4D] hover:bg-[#d85c3f] text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Start a Scenario Now →
          </button>
          <p className="text-[#98C1D9] text-sm mt-4">No signup required. Takes 60 seconds to get started.</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#3D5A80] px-10 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src="/pathwiseicon_square.png" alt="Pathwise" className="w-7 h-7 rounded-lg" />
          <span className="text-[#98C1D9] text-sm">Pathwise — Built for leaders who want to get better</span>
        </div>
        <span className="text-[#98C1D9] text-xs">Powered by Gemini Live AI</span>
      </footer>
    </div>
  );
}
