'use client';

import React from 'react';
import { Sparkles, ArrowRight, MapPin, Calendar, Wallet, Users, Compass, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

interface HeroSectionProps {
  onStart: () => void;
}

const FEATURE_POINTS = [
  {
    icon: Sparkles,
    title: '스마트 취향 매칭',
    desc: '휴양, 맛집, 관광, 액티비티 맞춤 추천',
  },
  {
    icon: Wallet,
    title: '현실적인 예산 맞춤',
    desc: '50만원 미만부터 럭셔리 여행까지',
  },
  {
    icon: Calendar,
    title: '핵심 일정 & 코스',
    desc: '일자별 추천 명소 및 필수 맛집 리스트',
  },
];

const PREVIEW_CARDS = [
  {
    name: '제주도',
    country: '대한민국',
    tag: '#힐링 #에메랄드바다',
    image: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: '후쿠오카',
    country: '일본',
    tag: '#미식 #온천힐링',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: '다낭 & 호이안',
    country: '베트남',
    tag: '#가성비휴양 #풀빌라',
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: '발리',
    country: '인도네시아',
    tag: '#요가 #정글선셋',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onStart }) => {
  return (
    <div className="relative overflow-hidden pt-6 pb-16 sm:py-20 lg:py-24">
      {/* Background Decorative Gradient Blobs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-sky-200/40 via-indigo-100/30 to-rose-100/30 blur-3xl -z-10 rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Main Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200/80 text-sky-700 text-xs sm:text-sm font-medium shadow-xs">
            <Sparkles className="w-4 h-4 text-sky-600 animate-pulse" />
            <span>어디로 떠날지 고민될 때, 30초 맞춤 여행지 큐레이션</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.18]">
            나의 취향과 일정에 딱 맞는 <br />
            <span className="bg-gradient-to-r from-sky-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
              최적의 여행지
            </span>
            를 찾아보세요
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            여행 스타일, 일정, 예산, 동행자만 가볍게 선택해 보세요. <br className="hidden sm:inline" />
            스마트 추천 엔진이 조건에 부합하는 최고의 여행지와 상세 추천 이유를 안내합니다.
          </p>

          {/* CTA Button */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={onStart}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white font-bold text-base sm:text-lg shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2.5 group cursor-pointer"
            >
              <span>맞춤 여행지 추천 시작하기</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Quick trust metrics */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>국내외 10대 명소 분석</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>로그인 없이 100% 무료</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>예상 비용 & 일정 포함</span>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-14 sm:mt-16">
          {FEATURE_POINTS.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="bg-white/80 backdrop-blur-sm border border-slate-200/70 p-5 sm:p-6 rounded-2xl shadow-xs hover:shadow-md transition-shadow flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-1">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Popular Destinations Preview Gallery */}
        <div className="mt-14 sm:mt-20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <Compass className="w-5 h-5 text-sky-600" />
                추천 대기 중인 대표 여행지
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">선택한 취향에 맞춰 이런 멋진 곳들이 매칭됩니다</p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {PREVIEW_CARDS.map((card, idx) => (
              <div
                key={idx}
                onClick={onStart}
                className="group relative h-48 sm:h-56 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer border border-slate-200/60"
              >
                {/* Image */}
                <img
                  src={card.image}
                  alt={card.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-3.5 sm:p-4 text-white">
                  <span className="text-[11px] font-medium text-sky-300 block mb-0.5">
                    {card.country}
                  </span>
                  <h3 className="font-bold text-base sm:text-lg tracking-tight mb-1">
                    {card.name}
                  </h3>
                  <span className="text-[11px] text-white/80 inline-block bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full">
                    {card.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
