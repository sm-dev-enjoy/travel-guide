'use client';

import React from 'react';
import {
  MapPin,
  Wallet,
  Sparkles,
  ArrowRight,
  Clock,
  Award,
  Heart
} from 'lucide-react';
import { RecommendationScore } from '@/types/travel';
import { useBookmarks } from '@/context/BookmarkContext';

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
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const isFav = isBookmarked(dest.id);

  return (
    <div
      className={`group relative bg-white rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col ${
        isTopMatch
          ? 'border-[#0cefd3] shadow-xl shadow-[#0cefd3]/10 ring-2 ring-[#0cefd3]/25'
          : 'border-gray-200/90 shadow-sm hover:shadow-xl hover:border-gray-300'
      }`}
    >
      {/* Top Match Badge Ribbon */}
      {isTopMatch && (
        <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0cefd3] text-[#222222] text-xs font-black shadow-sm">
          <Award className="w-3.5 h-3.5 text-[#222222]" />
          <span>최고의 맞춤 여행지 1위</span>
        </div>
      )}

      {/* Image Container with Zoom Effect */}
      <div className="relative h-56 sm:h-64 w-full overflow-hidden shrink-0 bg-[#f3f4f5]">
        <img
          src={dest.imageUrl}
          alt={dest.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

        {/* Top Right Match Rate Pill & Bookmark Button */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <div className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#222222] text-xs font-black shadow-sm flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#0cefd3] animate-pulse"></span>
            <span>{matchPercentage}% 매칭</span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark(dest.id);
            }}
            aria-label={isFav ? `${dest.name} 찜 해제` : `${dest.name} 찜하기`}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer ${
              isFav
                ? 'bg-rose-500 text-white shadow-rose-500/30 scale-105'
                : 'bg-white/90 backdrop-blur-md text-[#6c6d6f] hover:text-rose-500 hover:bg-white hover:scale-105'
            }`}
          >
            <Heart
              className={`w-4 h-4 transition-transform duration-200 ${
                isFav ? 'fill-current text-white animate-heart-pop' : ''
              }`}
            />
          </button>
        </div>

        {/* Bottom Destination Name & Country in Image */}
        <div className="absolute bottom-4 left-5 right-5 text-white">
          <div className="flex items-center gap-1.5 text-xs text-[#0cefd3] font-semibold mb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{dest.country} · {dest.region}</span>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-black tracking-tight text-white">
              {dest.name}
            </h3>
            {dest.badge && (
              <span className="text-[11px] font-extrabold text-[#222222] bg-[#0cefd3] px-2 py-0.5 rounded-full shadow-xs">
                {dest.badge}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4 bg-white">
        {/* Destination Summary */}
        <p className="text-xs sm:text-sm text-[#6c6d6f] leading-relaxed line-clamp-2">
          {dest.summary}
        </p>

        {/* Tailored AI Reason Box */}
        <div className="p-3.5 rounded-2xl bg-[#f3f4f5] border border-gray-200/70 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[#008e7d] font-bold text-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#00a894]" />
            <span>추천 이유</span>
          </div>
          <p className="text-xs text-[#222222] leading-relaxed line-clamp-3">
            {tailoredReason}
          </p>
        </div>

        {/* Key Specs Breakdown */}
        <div className="grid grid-cols-2 gap-2 pt-1 text-xs text-[#6c6d6f]">
          <div className="bg-[#f3f4f5] p-2.5 rounded-xl border border-gray-200/50">
            <span className="text-[11px] text-[#6c6d6f] flex items-center gap-1 mb-0.5">
              <Wallet className="w-3 h-3 text-[#00bda7]" />
              예상 경비 (1인)
            </span>
            <p className="font-extrabold text-[#222222] truncate">
              {dest.estimatedCostPerPerson.split('(')[0]}
            </p>
          </div>

          <div className="bg-[#f3f4f5] p-2.5 rounded-xl border border-gray-200/50">
            <span className="text-[11px] text-[#6c6d6f] flex items-center gap-1 mb-0.5">
              <Clock className="w-3 h-3 text-[#00bda7]" />
              이동 소요
            </span>
            <p className="font-extrabold text-[#222222] truncate">
              {dest.flightTimeOrDistance.split('(')[0]}
            </p>
          </div>
        </div>

        {/* Highlight Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {dest.highlightTags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-[11px] bg-[#f3f4f5] hover:bg-[#e7e8ea] text-[#6c6d6f] px-2 py-0.5 rounded-md font-medium transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={() => onSelect(scoreItem)}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
              isTopMatch
                ? 'bg-[#0cefd3] hover:bg-[#0bdac0] text-[#222222] font-black shadow-sm'
                : 'bg-[#232324] hover:bg-[#000000] text-white font-bold'
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
