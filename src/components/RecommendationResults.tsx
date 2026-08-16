'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  RotateCcw,
  SlidersHorizontal,
  Share2,
  Check,
  Compass,
  ChevronDown,
  ChevronUp,
  MapPin
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RecommendationScore, TravelSurveyInput } from '@/types/travel';
import { DestinationCard } from './DestinationCard';
import { DestinationDetailModal } from './DestinationDetailModal';

interface RecommendationResultsProps {
  input: TravelSurveyInput;
  results: RecommendationScore[];
  onEditFilters: () => void;
  onRestart: () => void;
}

export const RecommendationResults: React.FC<RecommendationResultsProps> = ({
  input,
  results,
  onEditFilters,
  onRestart,
}) => {
  const [selectedDestination, setSelectedDestination] = useState<RecommendationScore | null>(null);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  }, []);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const top3 = results.slice(0, 3);
  const otherDestinations = results.slice(3);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-fade-in space-y-8">
      {/* Top Banner & Control Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg shadow-slate-200/50 border border-slate-200/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left Title & Selected Badges */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/60">
              <Sparkles className="w-3.5 h-3.5" />
              <span>맞춤 분석 완료</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              고객님께 가장 잘 어울리는 <br className="sm:hidden" />
              <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
                추천 여행지 Top 3
              </span>
            </h1>

            {/* User Selected Conditions Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs text-slate-600 font-medium mr-1">선택 조건:</span>
              {input.styles.map((s) => (
                <span
                  key={s}
                  className="text-xs bg-sky-50 text-sky-700 font-bold px-2.5 py-1 rounded-lg border border-sky-200/60"
                >
                  #{s}
                </span>
              ))}
              {input.duration && (
                <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-lg border border-indigo-200/60">
                  #{input.duration}
                </span>
              )}
              {input.budget && (
                <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-lg border border-emerald-200/60">
                  #{input.budget}
                </span>
              )}
              {input.companion && (
                <span className="text-xs bg-amber-50 text-amber-700 font-bold px-2.5 py-1 rounded-lg border border-amber-200/60">
                  #{input.companion} 동행
                </span>
              )}
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={onEditFilters}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>조건 수정</span>
            </button>

            <button
              onClick={onRestart}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>다시 추천</span>
            </button>

            <button
              onClick={handleShare}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold text-xs sm:text-sm transition-colors border border-sky-200/70 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">링크 복사됨!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>결과 공유하기</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Top 3 Featured Destination Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {top3.map((item, idx) => (
          <DestinationCard
            key={item.destination.id}
            scoreItem={item}
            rank={idx + 1}
            onSelect={(dest) => setSelectedDestination(dest)}
          />
        ))}
      </div>

      {/* Bottom Option to view other destinations */}
      {otherDestinations.length > 0 && (
        <div className="pt-6">
          <div className="text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-slate-200/80 text-slate-700 font-bold text-sm shadow-xs hover:bg-slate-50 hover:shadow-md transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4 text-sky-600" />
              <span>
                {showAll ? '기타 추천 여행지 접기' : `다른 추천 여행지 ${otherDestinations.length}곳 더보기`}
              </span>
              {showAll ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {showAll && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 animate-fade-in">
              {otherDestinations.map((item, idx) => (
                <DestinationCard
                  key={item.destination.id}
                  scoreItem={item}
                  rank={idx + 4}
                  onSelect={(dest) => setSelectedDestination(dest)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Detail Modal */}
      <DestinationDetailModal
        scoreItem={selectedDestination}
        onClose={() => setSelectedDestination(null)}
      />
    </div>
  );
};
