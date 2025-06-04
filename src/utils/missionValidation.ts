
import { MissionValidation, MissionFormData } from '@/types/mission';

export const MINIMUM_SCORE = 160;
export const MINIMUM_ELEMENTS = 4;

export const validateMissionSubmission = (data: MissionFormData): MissionValidation => {
  const hasMinimumScore = data.score !== undefined && data.score >= MINIMUM_SCORE;
  const hasMinimumElements = data.elementsCount !== undefined && data.elementsCount >= MINIMUM_ELEMENTS;
  const hasResponse = data.response.trim().length > 0;
  
  return {
    isValid: data.isEvaluated && hasResponse,
    hasMinimumElements,
    hasMinimumScore,
    canSubmit: data.isEvaluated && hasResponse && hasMinimumScore && hasMinimumElements
  };
};

export const getValidationMessage = (validation: MissionValidation): string | null => {
  if (!validation.isValid) {
    return "Você precisa avaliar sua proposta com o especialista antes de continuar.";
  }
  
  if (!validation.hasMinimumElements || !validation.hasMinimumScore) {
    return `Sua proposta precisa conter pelo menos ${MINIMUM_ELEMENTS} elementos válidos para avançar.`;
  }
  
  return null;
};
