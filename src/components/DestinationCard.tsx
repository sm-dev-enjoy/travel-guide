'use client';

import React from 'react';
import {
  MapPin,
  Calendar,
  Wallet,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  Award
} from 'lucide-react';
import { RecommendationScore } from '@/types/travel';

interface DestinationCardProps {
  scoreItem: RecommendationScore;
  rank: number;
  onSelect: (item: RecommendationScore) => void;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  scoreItem,
  rank,
  onSelect,
}) => {
  const { destination: dest, matchPercentage, tailoredReason } = scoreItem;
  const isTopMatch = rank === 1;

  return (
    <div
      className={`group relative bg-white rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col ${
        isTopMatch
          ? 'border-sky-400/80 shadow-xl shadow-sky-500/10 ring-2 ring-sky-500/20'
          : 'border-slate-200/80 shadow-md hover:shadow-xl hover:border-slate-300'
      }`}
    >
      {/* Top Match Badge Ribbon */}
      {isTopMatch && (
        <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-xs font-bold shadow-md shadow-sky-500/30">
          <Award className="w-3.5 h-3.5" />
          <span>최고의 맞춤 여행지 1위</span>
        </div>
      )}

      {/* Image Container with Zoom Effect */}
      <div className="relative h-56 sm:h-64 w-full overflow-hidden shrink-0 bg-slate-100">
        <img
          src={dest.imageUrl}
          alt={dest.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent" />

        {/* Top Right Match Rate Pill */}
        <div className="absolute top-4 right-4 z-10">
          <div className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-slate-900 text-xs font-black shadow-md flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
            <span>{matchPercentage}% 매칭</span>
          </div>
        </div>

        {/* Bottom Destination Name & Country in Image */}
        <div className="absolute bottom-4 left-5 right-5 text-white">
          <div className="flex items-center gap-1.5 text-xs text-sky-200 font-medium mb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{dest.country} · {dest.region}</span>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-black tracking-tight text-white">
              {dest.name}
            </h3>
            {dest.badge && (
              <span className="text-[11px] font-bold text-amber-300 bg-amber-950/60 backdrop-blur-xs px-2 py-0.5 rounded-full">
                {dest.badge}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        {/* Destination Summary */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
          {dest.summary}
        </p>

        {/* Tailored AI Reason Box */}
        <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-1.5">
          <div className="flex items-center gap-1.5 text-sky-900 font-bold text-xs">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>추천 이유</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed line-clamp-3">
            {tailoredReason}
          </p>
        </div>

        {/* Key Specs Breakdown */}
        <div className="grid grid-cols-2 gap-2 pt-1 text-xs text-slate-600">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
            <span className="text-[11px] text-slate-600 flex items-center gap-1 mb-0.5">
              <Wallet className="w-3 h-3 text-emerald-600" />
              예상 경비 (1인)
            </span>
            <p className="font-bold text-slate-900 truncate">
              {dest.estimatedCostPerPerson.split('(')[0]}
            </p>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
            <span className="text-[11px] text-slate-600 flex items-center gap-1 mb-0.5">
              <Clock className="w-3 h-3 text-sky-600" />
              이동 소요
            </span>
            <p className="font-bold text-slate-900 truncate">
              {dest.flightTimeOrDistance.split('(')[0]}
            </p>
          </div>
        </div>

        {/* Highlight Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {dest.highlightTags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-[11px] bg-slate-100 hover:bg-slate-200/70 text-slate-600 px-2 py-0.5 rounded-md font-medium transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={() => onSelect(scoreItem)}
            className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
              isTopMatch
                ? 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white shadow-md shadow-sky-500/20'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            <span>상세 코스 & 추천 맛집 보기</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
