
export interface MissionEvaluationResult {
  success: boolean;
  evaluation?: string;
  score?: number;
  elementsCount?: number;
  error?: string;
}

export interface MissionValidation {
  isValid: boolean;
  hasMinimumElements: boolean;
  hasMinimumScore: boolean;
  canSubmit: boolean;
}

export interface MissionFormData {
  response: string;
  isEvaluated: boolean;
  evaluation?: string;
  score?: number;
  elementsCount?: number;
}
