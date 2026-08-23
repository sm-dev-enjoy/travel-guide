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
  ChevronUp
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
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg shadow-gray-200/50 border border-gray-200/90">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left Title & Selected Badges */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0cefd3]/15 text-[#008e7d] text-xs font-bold border border-[#0cefd3]/40">
              <Sparkles className="w-3.5 h-3.5 text-[#00a894]" />
              <span>맞춤 분석 완료</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222222] tracking-tight">
              고객님께 가장 잘 어울리는 <br className="sm:hidden" />
              <span className="bg-gradient-to-r from-[#00bda7] to-[#08c5ad] bg-clip-text text-transparent">
                추천 여행지 Top 3
              </span>
            </h1>

            {/* User Selected Conditions Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs text-[#6c6d6f] font-medium mr-1">선택 조건:</span>
              {input.styles.map((s) => (
                <span
                  key={s}
                  className="text-xs bg-[#0cefd3]/15 text-[#008e7d] font-bold px-2.5 py-1 rounded-lg border border-[#0cefd3]/40"
                >
                  #{s}
                </span>
              ))}
              {input.duration && (
                <span className="text-xs bg-[#f3f4f5] text-[#232324] font-bold px-2.5 py-1 rounded-lg border border-gray-200">
                  #{input.duration}
                </span>
              )}
              {input.budget && (
                <span className="text-xs bg-[#f3f4f5] text-[#232324] font-bold px-2.5 py-1 rounded-lg border border-gray-200">
                  #{input.budget}
                </span>
              )}
              {input.companion && (
                <span className="text-xs bg-[#f3f4f5] text-[#232324] font-bold px-2.5 py-1 rounded-lg border border-gray-200">
                  #{input.companion} 동행
                </span>
              )}
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={onEditFilters}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#f3f4f5] hover:bg-[#e7e8ea] text-[#232324] font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-transparent"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>조건 수정</span>
            </button>

            <button
              onClick={onRestart}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#f3f4f5] hover:bg-[#e7e8ea] text-[#232324] font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-transparent"
            >
              <RotateCcw className="w-4 h-4" />
              <span>다시 추천</span>
            </button>

            <button
              onClick={handleShare}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#0cefd3] hover:bg-[#0bdac0] text-[#222222] font-black text-xs sm:text-sm transition-colors border border-transparent flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-[#222222] stroke-[3]" />
                  <span>링크 복사됨!</span>
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-gray-200 text-[#222222] font-extrabold text-sm shadow-xs hover:bg-[#f3f4f5] hover:shadow-md transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4 text-[#00bda7]" />
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
