'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, Compass } from 'lucide-react';
import { TravelSurveyInput } from '@/types/travel';

interface LoadingAnalysisProps {
  input: TravelSurveyInput;
  onFinish: () => void;
}

const ANALYSIS_STEPS = [
  '선택하신 여행 스타일과 취향 키워드 분석 중...',
  '예산 및 일정 조건에 가장 적합한 국내외 여행지 필터링 중...',
  '동행자 맞춤 분위기와 대표 명소 스코어링 중...',
  '최고의 여행지 Top 3 및 맞춤 일정 완성!',
];

export const LoadingAnalysis: React.FC<LoadingAnalysisProps> = ({ input, onFinish }) => {
  const [progress, setProgress] = useState(10);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onFinish, 300);
          return 100;
        }
        const next = prev + 15;
        if (next >= 75) setStepIndex(3);
        else if (next >= 50) setStepIndex(2);
        else if (next >= 25) setStepIndex(1);
        return next > 100 ? 100 : next;
      });
    }, 220);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-200/60 border border-slate-200/80 text-center space-y-6 animate-fade-in">
        {/* Animated Glow Icon */}
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-500 opacity-30 animate-ping" />
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/30">
            <Compass className="w-10 h-10 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
        </div>

        {/* Status Texts */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold border border-sky-200/60">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>AI 맞춤 분석 엔진 가동 중</span>
          </div>

          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            나에게 딱 맞는 여행지를 찾고 있어요
          </h3>

          <p className="text-xs sm:text-sm text-slate-500 h-10 flex items-center justify-center transition-all duration-300">
            {ANALYSIS_STEPS[stepIndex]}
          </p>
        </div>

        {/* Selected Conditions Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
          {input.styles.map((s) => (
            <span key={s} className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium">
              #{s}
            </span>
          ))}
          {input.duration && (
            <span className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium">
              #{input.duration}
            </span>
          )}
          {input.budget && (
            <span className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium">
              #{input.budget}
            </span>
          )}
          {input.companion && (
            <span className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium">
              #{input.companion}
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
            <div
              className="bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600 h-full rounded-full transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 font-medium px-1">
            <span>데이터 스코어링</span>
            <span className="font-bold text-sky-600">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
