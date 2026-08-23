'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Heart,
  Trash2,
  MapPin,
  Wallet,
  ArrowRight,
  Compass
} from 'lucide-react';
import { useBookmarks } from '@/context/BookmarkContext';
import { Destination } from '@/types/travel';
import { DestinationDetailModal } from './DestinationDetailModal';

interface BookmarkDrawerProps {
  onExplore?: () => void;
}

export const BookmarkDrawer: React.FC<BookmarkDrawerProps> = ({ onExplore }) => {
  const {
    isDrawerOpen,
    closeDrawer,
    bookmarkedDestinations,
    removeBookmark,
    clearBookmarks,
    isHydrated,
  } = useBookmarks();

  const [activeDetailDest, setActiveDetailDest] = useState<Destination | null>(null);

  // Close on Escape key press (only if no child detail modal is active)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen && !activeDetailDest) {
        closeDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, closeDrawer, activeDetailDest]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (!isDrawerOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  const count = isHydrated ? bookmarkedDestinations.length : 0;

  const handleExploreClick = () => {
    closeDrawer();
    if (onExplore) {
      onExplore();
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 overflow-hidden animate-fade-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bookmark-drawer-title"
      >
        {/* Backdrop Overlay */}
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
          onClick={closeDrawer}
          aria-hidden="true"
        />

        {/* Slide-in Drawer Container */}
        <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
          <div className="w-screen max-w-md sm:max-w-lg bg-white shadow-2xl flex flex-col animate-slide-in-right">
            {/* Drawer Header */}
            <div className="p-5 sm:p-6 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-xs">
                  <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
                </div>
                <div>
                  <h2 id="bookmark-drawer-title" className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    찜한 여행지
                    <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-rose-500 text-white shadow-xs">
                      {count}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500">나만의 여행 위시리스트 컬렉션</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {count > 0 && (
                  <button
                    type="button"
                    onClick={clearBookmarks}
                    className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer"
                    title="전체 위시리스트 비우기"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>전체 삭제</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={closeDrawer}
                  aria-label="닫기"
                  className="min-w-[36px] min-h-[36px] rounded-lg hover:bg-slate-200/70 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {count === 0 ? (
                /* Empty State */
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 my-auto">
                  <div className="w-20 h-20 rounded-3xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-400 shadow-inner">
                    <Heart className="w-10 h-10 text-rose-300 stroke-[1.5]" />
                  </div>
                  <div className="space-y-1.5 max-w-xs">
                    <h3 className="font-bold text-base text-slate-900">
                      아직 찜한 여행지가 없습니다
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      여행지 카드의 하트(🤍) 버튼을 눌러 마음에 드는 여행지를 위시리스트에 담아보세요.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleExploreClick}
                    className="mt-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Compass className="w-4 h-4 text-sky-400" />
                    <span>추천 여행지 둘러보기</span>
                  </button>
                </div>
              ) : (
                /* Bookmarked List */
                <div className="space-y-3">
                  {bookmarkedDestinations.map((dest) => (
                    <div
                      key={dest.id}
                      className="group relative bg-white border border-slate-200/80 hover:border-sky-300 rounded-2xl p-3 sm:p-3.5 shadow-xs hover:shadow-md transition-all duration-200 flex gap-3 sm:gap-4 items-start"
                    >
                      {/* Thumbnail Image */}
                      <div
                        role="button"
                        tabIndex={0}
                        aria-label={`${dest.name} 상세보기`}
                        className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500"
                        onClick={() => setActiveDetailDest(dest)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setActiveDetailDest(dest);
                          }
                        }}
                      >
                        <img
                          src={dest.imageUrl}
                          alt={dest.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        {dest.badge && (
                          <div className="absolute top-1.5 left-1.5 z-10">
                            <span className="text-[9px] font-bold bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded shadow-xs">
                              {dest.badge}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content Info */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[11px] font-semibold text-sky-600 flex items-center gap-1 truncate">
                            <MapPin className="w-3 h-3 shrink-0" />
                            {dest.country} · {dest.region}
                          </span>

                          {/* Remove Item Button */}
                          <button
                            type="button"
                            onClick={() => removeBookmark(dest.id)}
                            className="min-w-[36px] min-h-[36px] flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            aria-label={`${dest.name} 찜 해제`}
                            title="찜 해제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <h4
                          role="button"
                          tabIndex={0}
                          onClick={() => setActiveDetailDest(dest)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setActiveDetailDest(dest);
                            }
                          }}
                          className="font-bold text-slate-900 text-sm sm:text-base tracking-tight truncate hover:text-sky-600 transition-colors cursor-pointer focus:outline-none focus:text-sky-600"
                        >
                          {dest.name}
                        </h4>

                        <div className="flex items-center gap-1 text-xs text-slate-600 truncate">
                          <Wallet className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{dest.estimatedCostPerPerson.split('(')[0]}</span>
                        </div>

                        {/* Highlight Tags and Action */}
                        <div className="pt-1.5 flex items-center justify-between gap-2">
                          <div className="flex flex-wrap gap-1">
                            {dest.highlightTags.slice(0, 2).map((tag, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium truncate"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          <button
                            type="button"
                            onClick={() => setActiveDetailDest(dest)}
                            className="text-[11px] font-bold text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 shrink-0 cursor-pointer min-h-[32px]"
                          >
                            <span>상세보기</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            {count > 0 && (
              <div className="p-4 sm:p-5 border-t border-slate-200/80 bg-slate-50/80 flex items-center justify-between gap-3">
                <span className="text-xs text-slate-600 font-medium">
                  총 <strong className="text-slate-900 font-bold">{count}개</strong>의 여행지 저장됨
                </span>
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  닫기
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Destination Detail Modal opened from Drawer */}
      {activeDetailDest && (
        <DestinationDetailModal
          destination={activeDetailDest}
          onClose={() => setActiveDetailDest(null)}
        />
      )}
    </>
  );
};
