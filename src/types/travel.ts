export type TravelStyle = '휴양' | '맛집' | '관광' | '자연' | '액티비티';
export type TravelDuration = '2박 3일' | '3박 4일' | '4박 5일' | '5박 이상';
export type TravelBudget = '50만원 이하' | '100만원 이하' | '150만원 이하' | '150만원 초과';
export type CompanionType = '혼자' | '친구' | '연인' | '가족';

export interface TravelSurveyInput {
  styles: TravelStyle[];
  duration: TravelDuration | null;
  budget: TravelBudget | null;
  companion: CompanionType | null;
}

export interface DayPlan {
  day: number;
  title: string;
  places: string[];
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  region: string;
  badge?: string;
  imageUrl: string;
  summary: string;
  description: string;
  suitableStyles: TravelStyle[];
  suitableCompanions: CompanionType[];
  suitableDurations: TravelDuration[];
  budgetLevel: TravelBudget;
  estimatedCostPerPerson: string;
  flightTimeOrDistance: string;
  bestSeason: string;
  highlightTags: string[];
  whyRecommendedReasons: {
    style?: Partial<Record<TravelStyle, string>>;
    companion?: Partial<Record<CompanionType, string>>;
    general: string;
  };
  sampleItinerary: DayPlan[];
  mustEat: string[];
  travelTips: string[];
}

export interface RecommendationScore {
  destination: Destination;
  score: number; // 0 to 100
  matchPercentage: number;
  matchedStyles: TravelStyle[];
  tailoredReason: string;
  matchHighlights: string[];
}

export interface BookmarkContextType {
  bookmarks: string[];
  bookmarkedDestinations: Destination[];
  isBookmarked: (id: string) => boolean;
  toggleBookmark: (id: string) => void;
  addBookmark: (id: string) => void;
  removeBookmark: (id: string) => void;
  clearBookmarks: () => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  isHydrated: boolean;
  selectedDestination: Destination | null;
  setSelectedDestination: (dest: Destination | null) => void;
}

