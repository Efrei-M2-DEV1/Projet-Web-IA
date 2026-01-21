export interface IngredientAnalysis {
  name: string;
  category: 'allergen' | 'preservative' | 'additive' | 'irritant' | 'beneficial' | 'other';
  explanation: string;
  riskLevel: 'low' | 'medium' | 'high' | 'none';
}

export interface AnalysisResult {
  id: string;
  timestamp: number;
  imageUrl?: string;
  extractedText: string;
  ingredients: IngredientAnalysis[];
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'E';
  summary: {
    positives: string[];
    warnings: string[];
    recommendations: string[];
  };
}

export interface ApiResponse {
  extractedText: string;
  analysis: {
    ingredients: IngredientAnalysis[];
    score: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'E';
    summary: {
      positives: string[];
      warnings: string[];
      recommendations: string[];
    };
  };
}
