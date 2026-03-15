import { useState, useRef, useEffect } from 'react';
import type { Message } from '../types';
import { VoiceControls } from './VoiceControls';
import { useGeminiVoice } from '../hooks/useGeminiVoice';
import { config } from '../config';

// Full portrait photos — realistic professional headshots from Unsplash
const avatarPhotos: Record<string, string> = {
  'Alex Chen': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=faces',
  'Jordan Martinez': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=faces',
  'Priya Sharma': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop&crop=faces',
};

function getAvatar(name: string): string {
  return avatarPhotos[name] || avatarPhotos['Alex Chen'];
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  onEndScenario: () => void;
  onViewStats: () => void;
  isLoading: boolean;
  characterName?: string;
  characterRole?: string;
  scenarioName?: string;
}

export default function ChatInterface({
  messages,
  onSendMessage,
  onEndScenario,
  onViewStats,
  isLoading,
  characterName = 'Alex',
  characterRole = 'Employee',
  scenarioName = 'Performance Review Simulation'
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Voice integration
  const {
    isRecording,
    isPaused,
    startVoiceSession,
    stopVoiceSession,
    pauseVoiceSession,
    resumeVoiceSession,
  } = useGeminiVoice({
    apiKey: config.geminiApiKey,
    systemInstruction: `You are ${characterName}, a ${characterRole}. This is a real conversation in a workplace setting.

CRITICAL RULES:
- You are NOT aware this is a simulation or practice scenario
- NEVER mention "scenario", "simulation", "practice", "training", or "exercise"
- Respond as if this is a genuine, real-world workplace conversation
- Stay completely in character as ${characterName}
- React naturally and authentically to what the manager says
- You are simply having a conversation with your manager
- Do not break the fourth wall under any circumstances`,
    onTranscriptUpdate: (transcript) => {
      if (transcript.role === 'user') {
        onSendMessage(transcript.text);
      }
    },
    onError: (error) => {
      console.error('Voice error:', error);
    },
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Chat Header */}
      <div className="bg-white border-b border-[#E8E4DE] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img src={getAvatar(characterName)} alt={characterName} className="w-10 h-10 rounded-full object-cover ring-2 ring-[#EEF2FF]" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#1E2D3D]">{characterName} <span className="text-xs font-normal text-slate-400">· {characterRole}</span></h2>
              <p className="text-xs text-slate-400">{scenarioName}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={onViewStats}
              className="px-3 py-1.5 bg-[#F0EDE8] hover:bg-[#E8E4DE] text-[#1E2D3D] rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>My Stats</span>
            </button>
            <button
              onClick={onEndScenario}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>End</span>
            </button>
          </div>
        </div>
      </div>

      {/* Video call portrait — always visible at top */}
      <div className="relative bg-[#1E2D3D] overflow-hidden" style={{ height: '220px' }}>
        <img
          src={getAvatar(characterName)}
          alt={characterName}
          className="w-full h-full object-cover object-top opacity-90"
        />
        {/* Gradient overlay at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E2D3D] via-transparent to-transparent" />
        {/* Name tag bottom-left */}
        <div className="absolute bottom-3 left-4 flex items-center space-x-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-white text-sm font-semibold drop-shadow">{characterName}</span>
          <span className="text-slate-300 text-xs">{characterRole}</span>
        </div>
        {/* Mic icon bottom-right */}
        <div className="absolute bottom-3 right-4 bg-black/40 rounded-full p-1.5">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-[#F8F7F4]">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-xs mx-auto">
              <div className="bg-[#EEF2FF] rounded-xl p-4 text-left">
                <p className="text-xs font-semibold text-[#4F46E5] mb-1">💡 Quick Tip</p>
                <p className="text-xs text-slate-600 leading-relaxed">Open with a greeting and set a positive tone. Be specific with examples, focus on behaviors — not personality.</p>
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`flex items-end space-x-2 ${message.role === 'manager' ? 'justify-end' : 'justify-start'}`}>
              {message.role === 'employee' && (
                <img src={getAvatar(characterName)} alt={characterName} className="w-6 h-6 rounded-full object-cover object-top flex-shrink-0 mb-5" />
              )}
              <div className="flex flex-col max-w-[75%]">
                <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  message.role === 'manager'
                    ? 'bg-[#6366F1] text-white rounded-br-sm'
                    : 'bg-white text-[#1E2D3D] border border-[#E8E4DE] rounded-bl-sm shadow-sm'
                }`}>
                  {message.content}
                </div>
                <span className="text-xs text-slate-400 mt-1 px-1">
                  {message.role === 'manager' ? 'You' : characterName} · {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-[#E8E4DE] rounded-2xl rounded-bl-sm px-4 py-3 flex items-center space-x-2 shadow-sm">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="text-xs text-slate-500">{characterName} is typing…</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-[#E8E4DE] px-6 py-4 bg-white">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isRecording ? "Listening…" : "Type your message…"}
            disabled={isLoading || isRecording}
            className="flex-1 px-4 py-2.5 border border-[#E8E4DE] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1]/30 focus:border-[#6366F1] disabled:bg-[#F8F7F4] disabled:cursor-not-allowed bg-[#F8F7F4] text-[#1E2D3D] placeholder-slate-400"
          />
          <VoiceControls
            isRecording={isRecording}
            isPaused={isPaused}
            onStartRecording={startVoiceSession}
            onStopRecording={stopVoiceSession}
            onPauseRecording={pauseVoiceSession}
            onResumeRecording={resumeVoiceSession}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading || isRecording}
            className="px-5 py-2.5 bg-[#6366F1] text-white rounded-xl text-sm font-medium hover:bg-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-2 disabled:bg-slate-200 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </form>
        <p className="text-xs text-slate-400 mt-2">
          {isRecording ? isPaused ? "⏸ Paused" : "🎤 Listening…" : "Tip: Be specific with examples, focus on behaviors not personality"}
        </p>
      </div>
    </div>
  );
}
