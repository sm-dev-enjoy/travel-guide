'use client';

import React from 'react';
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
  Share2,
  Heart
} from 'lucide-react';
import { Destination, RecommendationScore } from '@/types/travel';

interface DestinationDetailModalProps {
  scoreItem: RecommendationScore | null;
  onClose: () => void;
}

export const DestinationDetailModal: React.FC<DestinationDetailModalProps> = ({
  scoreItem,
  onClose,
}) => {
  if (!scoreItem) return null;

  const { destination: dest, matchPercentage, tailoredReason, matchHighlights } = scoreItem;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs animate-fade-in">
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
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Destination Header Texts */}
          <div className="absolute bottom-4 left-5 right-5 text-white">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="bg-sky-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                매칭 일치도 {matchPercentage}%
              </span>
              {dest.badge && (
                <span className="bg-amber-400/90 text-slate-950 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {dest.badge}
                </span>
              )}
              <span className="text-xs text-white/80 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {dest.country} · {dest.region}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {dest.name}
            </h2>
            <p className="text-xs sm:text-sm text-white/90 mt-1 line-clamp-1">
              {dest.summary}
            </p>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700">
          {/* Why Recommended Highlight Box */}
          <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200/70 space-y-2">
            <div className="flex items-center gap-2 text-sky-900 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>AI 맞춤 추천 사유</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {tailoredReason}
            </p>

            {matchHighlights.length > 0 && (
              <div className="pt-2 border-t border-sky-200/50 space-y-1">
                {matchHighlights.map((hl, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-sky-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-xl">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
                <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                <span>1인 예상 경비</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                {dest.estimatedCostPerPerson}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-xl">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
                <Clock className="w-3.5 h-3.5 text-sky-600" />
                <span>이동 & 소요 시간</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                {dest.flightTimeOrDistance}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-xl col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                <span>추천 여행 시기</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                {dest.bestSeason}
              </p>
            </div>
          </div>

          {/* Section 1: Sample Itinerary */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              추천 일자별 핵심 코스
            </h3>

            <div className="space-y-2.5">
              {dest.sampleItinerary.map((plan) => (
                <div
                  key={plan.day}
                  className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 sm:p-4 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0">
                      D{plan.day}
                    </span>
                    <span className="font-bold text-sm text-slate-900">
                      {plan.title}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pl-8">
                    {plan.places.map((place, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-white text-slate-600 border border-slate-200 px-2.5 py-1 rounded-md"
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
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Utensils className="w-4 h-4 text-rose-500" />
              현지 필수 미식 & 맛집 추천
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {dest.mustEat.map((food, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50/60 border border-rose-100 text-xs font-medium text-slate-800"
                >
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                  <span>{food}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Travel Tips */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              여행 꿀팁 & 준비사항
            </h3>
            <div className="space-y-2">
              {dest.travelTips.map((tip, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/60 text-xs text-amber-900 leading-relaxed flex items-start gap-2"
                >
                  <span className="font-bold text-amber-600 shrink-0">Tip {idx + 1}.</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1">
            {dest.highlightTags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="text-xs text-slate-500 font-medium">
                {tag}
              </span>
            ))}
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
