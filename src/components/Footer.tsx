'use client';

import React from 'react';
import { Compass, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto bg-white border-t border-gray-200 py-10 text-[#6c6d6f] text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-[#222222] font-extrabold text-sm">
            <Compass className="w-4 h-4 text-[#00bda7]" />
            <span>트립파인더 (TripFinder)</span>
          </div>
          <p className="text-[#6c6d6f]">
            당신의 다음 여정을 더욱 설레게 만드는 스마트 맞춤 여행지 큐레이터
          </p>
          <p className="text-[11px] text-[#6c6d6f]">
            * 본 서비스의 추천 데이터는 로컬 Mock Data로 구현되었으며, 향후 Gemini API 연동을 통해 실시간 생성형 AI 추천으로 확장될 예정입니다.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 text-[#6c6d6f]">
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for Travelers</span>
          </div>
          <span className="hidden sm:inline text-gray-300">|</span>
          <span>© 2026 TripFinder. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};
