'use client';

import React from 'react';
import { Compass, Sparkles, RotateCcw, Heart } from 'lucide-react';
import { useBookmarks } from '@/context/BookmarkContext';

interface HeaderProps {
  currentStep: 'hero' | 'survey' | 'loading' | 'results';
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentStep, onReset }) => {
  const { bookmarks, openDrawer, isHydrated } = useBookmarks();
  const bookmarkCount = isHydrated ? bookmarks.length : 0;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 transition-all duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={onReset}
          className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-[#0cefd3] flex items-center justify-center text-[#222222] shadow-xs group-hover:scale-105 transition-transform font-black">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-lg text-[#222222] tracking-tight flex items-center gap-1.5">
              트립파인더
              <span className="text-xs font-bold px-2 py-0.5 bg-[#0cefd3]/20 text-[#008e7d] border border-[#0cefd3]/40 rounded-full inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#00a894]" />
                AI 추천
              </span>
            </span>
            <p className="text-[11px] text-[#6c6d6f] hidden sm:block">나만의 맞춤 여행지 큐레이션</p>
          </div>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Wishlist / Bookmark Drawer Toggle Button */}
          <button
            type="button"
            onClick={openDrawer}
            aria-label="찜한 여행지 목록 열기"
            className={`relative flex items-center gap-1.5 text-xs sm:text-sm font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              bookmarkCount > 0
                ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200 shadow-xs'
                : 'bg-[#f3f4f5] hover:bg-[#e7e8ea] text-[#232324] border-transparent'
            }`}
          >
            <Heart
              className={`w-4 h-4 transition-transform ${
                bookmarkCount > 0 ? 'fill-rose-500 text-rose-500' : 'text-[#6c6d6f]'
              }`}
            />
            <span className="hidden sm:inline">찜한 여행지</span>
            <span className="sm:hidden">찜</span>
            {bookmarkCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-[11px] font-extrabold leading-none text-white bg-rose-500 rounded-full animate-scale-in shadow-xs">
                {bookmarkCount}
              </span>
            )}
          </button>

          {currentStep !== 'hero' && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#232324] hover:text-[#000000] bg-[#f3f4f5] hover:bg-[#e7e8ea] px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
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
