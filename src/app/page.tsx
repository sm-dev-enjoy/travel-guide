'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { TravelSurvey } from '@/components/TravelSurvey';
import { LoadingAnalysis } from '@/components/LoadingAnalysis';
import { RecommendationResults } from '@/components/RecommendationResults';
import { BookmarkDrawer } from '@/components/BookmarkDrawer';
import { Footer } from '@/components/Footer';
import { RecommendationScore, TravelSurveyInput } from '@/types/travel';
import { calculateRecommendations } from '@/utils/recommendationEngine';

type AppStep = 'hero' | 'survey' | 'loading' | 'results';

const DEFAULT_INPUT: TravelSurveyInput = {
  styles: ['휴양', '맛집'],
  duration: '3박 4일',
  budget: '100만원 이하',
  companion: '연인',
};

export default function Home() {
  const [currentStep, setCurrentStep] = useState<AppStep>('hero');
  const [surveyInput, setSurveyInput] = useState<TravelSurveyInput>(DEFAULT_INPUT);
  const [results, setResults] = useState<RecommendationScore[]>([]);

  const handleStart = () => {
    setCurrentStep('survey');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSurveySubmit = (input: TravelSurveyInput) => {
    setSurveyInput(input);
    const calculated = calculateRecommendations(input);
    setResults(calculated);
    setCurrentStep('loading');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadingFinish = () => {
    setCurrentStep('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditFilters = () => {
    setCurrentStep('survey');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setCurrentStep('hero');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f6f6] text-[#222222]">
      {/* Navigation Header */}
      <Header currentStep={currentStep} onReset={handleReset} />

      {/* Main Interactive Views */}
      <main className="flex-1">
        {currentStep === 'hero' && <HeroSection onStart={handleStart} />}

        {currentStep === 'survey' && (
          <TravelSurvey
            initialValues={surveyInput}
            onSubmit={handleSurveySubmit}
            onCancel={handleReset}
          />
        )}

        {currentStep === 'loading' && (
          <LoadingAnalysis input={surveyInput} onFinish={handleLoadingFinish} />
        )}

        {currentStep === 'results' && (
          <RecommendationResults
            input={surveyInput}
            results={results}
            onEditFilters={handleEditFilters}
            onRestart={handleReset}
          />
        )}
      </main>

      {/* Bookmark Wishlist Drawer */}
      <BookmarkDrawer onExplore={handleStart} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
