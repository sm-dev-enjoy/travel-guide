'use client';

import React, { useState } from 'react';
import {
  Palmtree,
  Utensils,
  Landmark,
  Trees,
  Flame,
  Calendar,
  Wallet,
  User,
  Users,
  Heart,
  Home,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Check
} from 'lucide-react';
import {
  CompanionType,
  TravelBudget,
  TravelDuration,
  TravelStyle,
  TravelSurveyInput,
} from '@/types/travel';

interface TravelSurveyProps {
  initialValues?: TravelSurveyInput;
  onSubmit: (input: TravelSurveyInput) => void;
  onCancel: () => void;
}

const STYLE_OPTIONS: {
  value: TravelStyle;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}[] = [
  {
    value: '휴양',
    label: '휴양 & 힐링',
    icon: Palmtree,
    description: '오션뷰 숙소와 스파, 평화로운 휴식',
  },
  {
    value: '맛집',
    label: '맛집 & 미식',
    icon: Utensils,
    description: '현지 로컬 맛집과 카페 투어',
  },
  {
    value: '관광',
    label: '관광 & 문화',
    icon: Landmark,
    description: '랜드마크, 박물관, 역사 명소 탐방',
  },
  {
    value: '자연',
    label: '자연 & 풍경',
    icon: Trees,
    description: '청정한 숲, 산, 호수와 절경 감상',
  },
  {
    value: '액티비티',
    label: '액티비티',
    icon: Flame,
    description: '서핑, 테마파크, 레포츠와 체험',
  },
];

const DURATION_OPTIONS: {
  value: TravelDuration;
  label: string;
  subtitle: string;
  tag: string;
}[] = [
  {
    value: '2박 3일',
    label: '2박 3일',
    subtitle: '주말 & 연차를 활용한 알찬 숏트립',
    tag: '가벼운 힐링',
  },
  {
    value: '3박 4일',
    label: '3박 4일',
    subtitle: '가장 인기 있는 표준 밸런스 코스',
    tag: '가장 인기',
  },
  {
    value: '4박 5일',
    label: '4박 5일',
    subtitle: '여유로운 휴양과 주요 명소 완전 정복',
    tag: '여유로운 일정',
  },
  {
    value: '5박 이상',
    label: '5박 이상',
    subtitle: '중장거리 또는 한 도시 깊이 있게 즐기기',
    tag: '롱스테이',
  },
];

const BUDGET_OPTIONS: {
  value: TravelBudget;
  label: string;
  subtitle: string;
  badge: string;
}[] = [
  {
    value: '50만원 이하',
    label: '50만원 이하',
    subtitle: '1인 기준 (국내/근교 초가성비 알뜰 여행)',
    badge: '알뜰 실속',
  },
  {
    value: '100만원 이하',
    label: '100만원 이하',
    subtitle: '1인 기준 (일본, 동남아 등 인기 해외 가성비)',
    badge: '가성비 최고',
  },
  {
    value: '150만원 이하',
    label: '150만원 이하',
    subtitle: '1인 기준 (특급 호텔, 휴양지 리조트 & 스파)',
    badge: '여유로운 힐링',
  },
  {
    value: '150만원 초과',
    label: '150만원 초과',
    subtitle: '1인 기준 (미주, 유럽 등 프리미엄 럭셔리)',
    badge: '프리미엄 낭만',
  },
];

const COMPANION_OPTIONS: {
  value: CompanionType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}[] = [
  {
    value: '혼자',
    label: '혼자 (나홀로 여행)',
    icon: User,
    description: '남 눈치 안 보고 즐기는 자유로운 사색과 힐링',
  },
  {
    value: '친구',
    label: '친구와 함께',
    icon: Users,
    description: '인생샷 스팟, 핫플 맛집 탐방, 활기찬 추억',
  },
  {
    value: '연인',
    label: '연인 / 커플',
    icon: Heart,
    description: '로맨틱한 야경과 감성 숙소, 둘만의 데이트',
  },
  {
    value: '가족',
    label: '가족과 함께',
    icon: Home,
    description: '부모님 효도 또는 아이들과 함께하는 편안한 코스',
  },
];

export const TravelSurvey: React.FC<TravelSurveyProps> = ({
  initialValues,
  onSubmit,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedStyles, setSelectedStyles] = useState<TravelStyle[]>(
    initialValues?.styles || ['휴양']
  );
  const [selectedDuration, setSelectedDuration] = useState<TravelDuration | null>(
    initialValues?.duration || '3박 4일'
  );
  const [selectedBudget, setSelectedBudget] = useState<TravelBudget | null>(
    initialValues?.budget || '100만원 이하'
  );
  const [selectedCompanion, setSelectedCompanion] = useState<CompanionType | null>(
    initialValues?.companion || '연인'
  );

  const toggleStyle = (style: TravelStyle) => {
    if (selectedStyles.includes(style)) {
      if (selectedStyles.length > 1) {
        setSelectedStyles(selectedStyles.filter((s) => s !== style));
      }
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Step 4 Submit
      onSubmit({
        styles: selectedStyles,
        duration: selectedDuration,
        budget: selectedBudget,
        companion: selectedCompanion,
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onCancel();
    }
  };

  const progressPercent = (currentStep / 4) * 100;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 animate-fade-in">
      {/* Step Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-[#6c6d6f] mb-2">
          <span>단계 {currentStep} / 4</span>
          <span className="text-[#008e7d] font-extrabold">{Math.round(progressPercent)}% 완성</span>
        </div>
        <div className="w-full bg-[#f3f4f5] h-2 rounded-full overflow-hidden border border-gray-200/50">
          <div
            className="bg-[#0cefd3] h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Step Indicator Chips */}
        <div className="grid grid-cols-4 gap-2 mt-4 text-center">
          {[
            { step: 1, title: '여행 스타일' },
            { step: 2, title: '여행 기간' },
            { step: 3, title: '1인 예산' },
            { step: 4, title: '동행자' },
          ].map((item) => (
            <button
              key={item.step}
              onClick={() => setCurrentStep(item.step)}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentStep === item.step
                  ? 'bg-[#0cefd3] text-[#222222] font-black shadow-xs'
                  : currentStep > item.step
                  ? 'bg-[#0cefd3]/15 text-[#008e7d] hover:bg-[#0cefd3]/25'
                  : 'text-[#6c6d6f] hover:text-[#222222]'
              }`}
            >
              {item.step}. {item.title}
            </button>
          ))}
        </div>
      </div>

      {/* Wizard Card Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg shadow-gray-200/50 border border-gray-200/90">
        {/* STEP 1: Travel Style */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <span className="text-xs font-extrabold text-[#008e7d] tracking-wider uppercase bg-[#0cefd3]/15 px-2.5 py-1 rounded-full border border-[#0cefd3]/40">
                Step 1 of 4
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#222222] mt-3 mb-1">
                어떤 스타일의 여행을 선호하시나요?
              </h2>
              <p className="text-sm text-[#6c6d6f]">
                원하는 여행 스타일을 1개 이상 자유롭게 선택해 주세요. (복수 선택 가능)
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {STYLE_OPTIONS.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedStyles.includes(item.value);
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => toggleStyle(item.value)}
                    className={`flex items-start gap-4 p-4.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#0cefd3] bg-[#0cefd3]/10 shadow-xs ring-2 ring-[#0cefd3]/25'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-[#f3f4f5]'
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-[#0cefd3] text-[#222222]'
                          : 'bg-[#f3f4f5] text-[#222222]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-[#222222] text-base">
                          {item.label}
                        </span>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-[#0cefd3] text-[#222222] flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-[#6c6d6f] mt-1 leading-snug">
                        {item.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Travel Duration */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <span className="text-xs font-extrabold text-[#008e7d] tracking-wider uppercase bg-[#0cefd3]/15 px-2.5 py-1 rounded-full border border-[#0cefd3]/40">
                Step 2 of 4
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#222222] mt-3 mb-1">
                예상하시는 여행 기간은 얼마인가요?
              </h2>
              <p className="text-sm text-[#6c6d6f]">
                일정에 맞춰 이동 시간과 핵심 명소 코스를 최적화해 드립니다.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {DURATION_OPTIONS.map((item) => {
                const isSelected = selectedDuration === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setSelectedDuration(item.value)}
                    className={`flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#0cefd3] bg-[#0cefd3]/10 shadow-xs ring-2 ring-[#0cefd3]/25'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-[#f3f4f5]'
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-[#0cefd3] text-[#222222]'
                          : 'bg-[#f3f4f5] text-[#222222]'
                      }`}
                    >
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-[#222222] text-base">
                          {item.label}
                        </span>
                        <span className="text-[11px] font-bold text-[#008e7d] bg-[#0cefd3]/20 px-2 py-0.5 rounded-full">
                          {item.tag}
                        </span>
                      </div>
                      <p className="text-xs text-[#6c6d6f] mt-1 leading-snug">
                        {item.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Travel Budget */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <span className="text-xs font-extrabold text-[#008e7d] tracking-wider uppercase bg-[#0cefd3]/15 px-2.5 py-1 rounded-full border border-[#0cefd3]/40">
                Step 3 of 4
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#222222] mt-3 mb-1">
                1인당 생각하시는 예산 범위는?
              </h2>
              <p className="text-sm text-[#6c6d6f]">
                교통비/항공권, 숙박비, 식비 및 액티비티를 종합적으로 고려한 기준입니다.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {BUDGET_OPTIONS.map((item) => {
                const isSelected = selectedBudget === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setSelectedBudget(item.value)}
                    className={`flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#0cefd3] bg-[#0cefd3]/10 shadow-xs ring-2 ring-[#0cefd3]/25'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-[#f3f4f5]'
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-[#0cefd3] text-[#222222]'
                          : 'bg-[#f3f4f5] text-[#222222]'
                      }`}
                    >
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-[#222222] text-base">
                          {item.label}
                        </span>
                        <span className="text-[11px] font-bold text-[#008e7d] bg-[#0cefd3]/20 px-2 py-0.5 rounded-full border border-[#0cefd3]/30">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-xs text-[#6c6d6f] mt-1 leading-snug">
                        {item.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: Companion Type */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <span className="text-xs font-extrabold text-[#008e7d] tracking-wider uppercase bg-[#0cefd3]/15 px-2.5 py-1 rounded-full border border-[#0cefd3]/40">
                Step 4 of 4
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#222222] mt-3 mb-1">
                이번 여행은 누구와 함께 떠나시나요?
              </h2>
              <p className="text-sm text-[#6c6d6f]">
                동행자의 성격과 분위기에 가장 잘 어울리는 맞춤 장소를 추천해 드립니다.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {COMPANION_OPTIONS.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedCompanion === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setSelectedCompanion(item.value)}
                    className={`flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#0cefd3] bg-[#0cefd3]/10 shadow-xs ring-2 ring-[#0cefd3]/25'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-[#f3f4f5]'
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-[#0cefd3] text-[#222222]'
                          : 'bg-[#f3f4f5] text-[#222222]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-[#222222] text-base">
                          {item.label}
                        </span>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-[#0cefd3] text-[#222222] flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-[#6c6d6f] mt-1 leading-snug">
                        {item.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-100 gap-4">
          <button
            type="button"
            onClick={handleBack}
            className="px-5 py-3 rounded-xl bg-[#f3f4f5] hover:bg-[#e7e8ea] text-[#232324] font-bold text-sm transition-colors flex items-center gap-2 cursor-pointer border border-transparent"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{currentStep === 1 ? '처음으로' : '이전 단계'}</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="px-7 py-3.5 rounded-xl bg-[#0cefd3] hover:bg-[#0bdac0] text-[#222222] font-black text-sm sm:text-base shadow-md shadow-[#0cefd3]/30 hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer group"
          >
            {currentStep === 4 ? (
              <>
                <Sparkles className="w-4 h-4 text-[#222222]" />
                <span>맞춤 여행지 추천받기</span>
              </>
            ) : (
              <>
                <span>다음 단계</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
