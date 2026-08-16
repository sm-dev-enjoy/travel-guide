'use client';

import React from 'react';
import { Compass, Sparkles, RotateCcw } from 'lucide-react';

interface HeaderProps {
  currentStep: 'hero' | 'survey' | 'loading' | 'results';
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentStep, onReset }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-md border-b border-slate-200/80 transition-all duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={onReset}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
              트립파인더
              <span className="text-xs font-semibold px-2 py-0.5 bg-sky-100 text-sky-700 rounded-full inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-sky-600" />
                AI 추천
              </span>
            </span>
            <p className="text-[11px] text-slate-500 hidden sm:block">나만의 맞춤 여행지 큐레이션</p>
          </div>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {currentStep !== 'hero' && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">처음으로</span>
              <span className="sm:hidden">리셋</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
