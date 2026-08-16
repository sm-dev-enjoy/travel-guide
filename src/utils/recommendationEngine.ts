import { MOCK_DESTINATIONS } from '@/data/destinations';
import { Destination, RecommendationScore, TravelBudget, TravelSurveyInput } from '@/types/travel';

// Budget hierarchy for matching calculation
const BUDGET_ORDER: TravelBudget[] = [
  '50만원 이하',
  '100만원 이하',
  '150만원 이하',
  '150만원 초과',
];

export function calculateRecommendations(input: TravelSurveyInput): RecommendationScore[] {
  const { styles, duration, budget, companion } = input;

  const scoredDestinations: RecommendationScore[] = MOCK_DESTINATIONS.map((dest: Destination) => {
    let score = 0;
    const matchHighlights: string[] = [];
    const matchedStyles = styles.filter((s) => dest.suitableStyles.includes(s));

    // 1. Style matching (Max 40 pts)
    if (styles.length > 0) {
      const styleRatio = matchedStyles.length / styles.length;
      const styleScore = styleRatio * 40;
      score += styleScore;

      if (matchedStyles.length > 0) {
        matchHighlights.push(`선택하신 '${matchedStyles.join(', ')}' 스타일에 잘 부합합니다.`);
      }
    } else {
      score += 30; // Default baseline if empty
    }

    // 2. Budget matching (Max 25 pts)
    if (budget) {
      const userBudgetIdx = BUDGET_ORDER.indexOf(budget);
      const destBudgetIdx = BUDGET_ORDER.indexOf(dest.budgetLevel);

      if (userBudgetIdx === destBudgetIdx) {
        score += 25;
        matchHighlights.push(`희망 예산(${budget})에 최적화된 여행지입니다.`);
      } else if (userBudgetIdx > destBudgetIdx) {
        // User has more budget than required -> very safe match
        score += 22;
        matchHighlights.push(`예산(${budget}) 내에서 더욱 여유롭게 즐길 수 있습니다.`);
      } else if (userBudgetIdx === destBudgetIdx - 1) {
        // Just one step higher -> small penalty
        score += 12;
      } else {
        score += 5;
      }
    } else {
      score += 18;
    }

    // 3. Duration matching (Max 20 pts)
    if (duration) {
      if (dest.suitableDurations.includes(duration)) {
        score += 20;
        matchHighlights.push(`추천 일정(${duration})으로 핵심 코스를 알차게 즐길 수 있습니다.`);
      } else {
        // Partial score for nearby duration
        score += 10;
      }
    } else {
      score += 15;
    }

    // 4. Companion matching (Max 15 pts)
    if (companion) {
      if (dest.suitableCompanions.includes(companion)) {
        score += 15;
        matchHighlights.push(`'${companion}' 여행에 알맞은 분위기와 편의시설을 갖추고 있습니다.`);
      } else {
        score += 8;
      }
    } else {
      score += 10;
    }

    // Dynamic tailored reason generator
    const primaryStyle = matchedStyles[0] || styles[0] || dest.suitableStyles[0];
    const styleReason =
      (primaryStyle && dest.whyRecommendedReasons.style?.[primaryStyle]) ||
      dest.summary;

    const companionReason =
      (companion && dest.whyRecommendedReasons.companion?.[companion]) || '';

    let tailoredReason = '';
    if (companion && companionReason) {
      tailoredReason = `${styleReason} 특히 ${companionReason}`;
    } else {
      tailoredReason = `${styleReason} ${dest.whyRecommendedReasons.general}`;
    }

    // Convert raw score (approx 20-100) to human-friendly percentage (e.g. 78% ~ 99%)
    const rawScore = Math.min(100, Math.max(30, Math.round(score)));
    // Scale curve for high satisfaction appearance
    const matchPercentage = Math.min(99, Math.max(70, Math.round(70 + (rawScore / 100) * 29)));

    return {
      destination: dest,
      score: rawScore,
      matchPercentage,
      matchedStyles,
      tailoredReason,
      matchHighlights,
    };
  });

  // Sort descending by score
  scoredDestinations.sort((a, b) => b.score - a.score || b.matchPercentage - a.matchPercentage);

  return scoredDestinations;
}
