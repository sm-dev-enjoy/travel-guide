'use client';

import React, { useEffect } from 'react';
import {
  X,
  MapPin,
  Calendar,
  Wallet,
  Clock,
  Sparkles,
  Utensils,
  Lightbulb,
  CheckCircle2,
  Heart
} from 'lucide-react';
import { Destination, RecommendationScore } from '@/types/travel';
import { useBookmarks } from '@/context/BookmarkContext';

interface DestinationDetailModalProps {
  scoreItem?: RecommendationScore | null;
  destination?: Destination | null;
  onClose: () => void;
}

export const DestinationDetailModal: React.FC<DestinationDetailModalProps> = ({
  scoreItem,
  destination,
  onClose,
}) => {
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const activeDest: Destination | null = scoreItem ? scoreItem.destination : destination || null;

  // Close on Escape key press
  useEffect(() => {
    if (!activeDest) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        e.stopImmediatePropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDest, onClose]);

  // Lock body scroll with original style restoration
  useEffect(() => {
    if (!activeDest) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [activeDest]);

  if (!activeDest) return null;

  const dest = activeDest;
  const matchPercentage = scoreItem ? scoreItem.matchPercentage : 95;
  const tailoredReason = scoreItem
    ? scoreItem.tailoredReason
    : dest.whyRecommendedReasons.general;
  const matchHighlights = scoreItem
    ? scoreItem.matchHighlights
    : [`'${dest.suitableStyles.join(', ')}' 스타일에 잘 부합합니다.`];

  const isFav = isBookmarked(dest.id);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="destination-detail-title"
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Image Banner */}
        <div className="relative h-60 sm:h-72 w-full shrink-0">
          <img
            src={dest.imageUrl}
            alt={dest.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          {/* Top Actions: Bookmark & Close button */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleBookmark(dest.id)}
              aria-label={isFav ? `${dest.name} 찜 해제` : `${dest.name} 찜하기`}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer ${
                isFav
                  ? 'bg-rose-500 text-white shadow-rose-500/30 scale-105'
                  : 'bg-black/50 hover:bg-black/70 text-white hover:text-rose-400'
              }`}
            >
              <Heart
                className={`w-4.5 h-4.5 transition-transform duration-200 ${
                  isFav ? 'fill-current text-white animate-heart-pop' : ''
                }`}
              />
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Destination Header Texts */}
          <div className="absolute bottom-4 left-5 right-5 text-white">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="bg-[#0cefd3] text-[#222222] text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs">
                매칭 일치도 {matchPercentage}%
              </span>
              {dest.badge && (
                <span className="bg-[#0cefd3] text-[#222222] text-xs font-black px-2.5 py-0.5 rounded-full">
                  {dest.badge}
                </span>
              )}
              <span className="text-xs text-white/90 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#0cefd3]" />
                {dest.country} · {dest.region}
              </span>
            </div>

            <h2 id="destination-detail-title" className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {dest.name}
            </h2>
            <p className="text-xs sm:text-sm text-white/90 mt-1 line-clamp-1">
              {dest.summary}
            </p>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-[#222222]">
          {/* Why Recommended Highlight Box */}
          <div className="p-4 rounded-2xl bg-[#f3f4f5] border border-gray-200/80 space-y-2">
            <div className="flex items-center gap-2 text-[#008e7d] font-bold text-sm">
              <Sparkles className="w-4 h-4 text-[#00a894]" />
              <span>AI 맞춤 추천 사유</span>
            </div>
            <p className="text-sm text-[#222222] leading-relaxed">
              {tailoredReason}
            </p>

            {matchHighlights.length > 0 && (
              <div className="pt-2 border-t border-gray-200/60 space-y-1">
                {matchHighlights.map((hl, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-[#222222]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00bda7] shrink-0" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-[#f3f4f5] border border-gray-200/50 p-3 rounded-xl">
              <div className="flex items-center gap-1.5 text-xs text-[#6c6d6f] font-medium mb-1">
                <Wallet className="w-3.5 h-3.5 text-[#00bda7]" />
                <span>1인 예상 경비</span>
              </div>
              <p className="text-xs sm:text-sm font-extrabold text-[#222222] leading-tight">
                {dest.estimatedCostPerPerson}
              </p>
            </div>

            <div className="bg-[#f3f4f5] border border-gray-200/50 p-3 rounded-xl">
              <div className="flex items-center gap-1.5 text-xs text-[#6c6d6f] font-medium mb-1">
                <Clock className="w-3.5 h-3.5 text-[#00bda7]" />
                <span>이동 & 소요 시간</span>
              </div>
              <p className="text-xs sm:text-sm font-extrabold text-[#222222] leading-tight">
                {dest.flightTimeOrDistance}
              </p>
            </div>

            <div className="bg-[#f3f4f5] border border-gray-200/50 p-3 rounded-xl col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1.5 text-xs text-[#6c6d6f] font-medium mb-1">
                <Calendar className="w-3.5 h-3.5 text-[#00bda7]" />
                <span>추천 여행 시기</span>
              </div>
              <p className="text-xs sm:text-sm font-extrabold text-[#222222] leading-tight">
                {dest.bestSeason}
              </p>
            </div>
          </div>

          {/* Section 1: Sample Itinerary */}
          <div className="space-y-3">
            <h3 className="text-base font-extrabold text-[#222222] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#00a894]" />
              추천 일자별 핵심 코스
            </h3>

            <div className="space-y-2.5">
              {dest.sampleItinerary.map((plan) => (
                <div
                  key={plan.day}
                  className="bg-[#f3f4f5] border border-gray-200/80 rounded-2xl p-3.5 sm:p-4 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#0cefd3]/25 text-[#008e7d] text-xs font-black flex items-center justify-center shrink-0">
                      D{plan.day}
                    </span>
                    <span className="font-extrabold text-sm text-[#222222]">
                      {plan.title}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pl-8">
                    {plan.places.map((place, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-white text-[#222222] border border-gray-200 px-2.5 py-1 rounded-md font-medium"
                      >
                        {place}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Must Eat Foods */}
          <div className="space-y-3">
            <h3 className="text-base font-extrabold text-[#222222] flex items-center gap-2">
              <Utensils className="w-4 h-4 text-rose-500" />
              현지 필수 미식 & 맛집 추천
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {dest.mustEat.map((food, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-[#f3f4f5] border border-gray-200/60 text-xs font-bold text-[#222222]"
                >
                  <span className="w-2 h-2 rounded-full bg-[#00bda7] shrink-0" />
                  <span>{food}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Travel Tips */}
          <div className="space-y-3">
            <h3 className="text-base font-extrabold text-[#222222] flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              여행 꿀팁 & 준비사항
            </h3>
            <div className="space-y-2">
              {dest.travelTips.map((tip, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#f3f4f5] border border-gray-200/60 text-xs text-[#222222] leading-relaxed flex items-start gap-2"
                >
                  <span className="font-extrabold text-[#008e7d] shrink-0">Tip {idx + 1}.</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-[#f3f4f5] border-t border-gray-200/80 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => toggleBookmark(dest.id)}
            aria-label={isFav ? `${dest.name} 찜 해제` : `${dest.name} 찜하기`}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer border ${
              isFav
                ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100 shadow-xs'
                : 'bg-white border-gray-300 text-[#222222] hover:bg-[#e7e8ea]'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : 'text-[#6c6d6f]'}`} />
            <span>{isFav ? '찜 완료 (위시리스트)' : '위시리스트 찜하기'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#232324] hover:bg-[#000000] text-white text-sm font-bold transition-colors cursor-pointer"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
