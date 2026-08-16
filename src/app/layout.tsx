import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '트립파인더 (TripFinder) - AI 맞춤 여행지 추천 서비스',
  description: '나의 여행 스타일, 기간, 예산, 동행자에 맞춘 최적의 국내/해외 여행지를 스마트하게 추천받아보세요.',
  keywords: ['여행지추천', '맞춤여행', '국내여행', '해외여행', '여행일정', '여행경비'],
  openGraph: {
    title: '트립파인더 - 나에게 꼭 맞는 여행지 찾기',
    description: '여행 스타일, 일정, 예산만 선택하면 딱 맞는 최적의 여행지를 추천해 드립니다.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col antialiased text-slate-800 bg-slate-50 selection:bg-sky-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
