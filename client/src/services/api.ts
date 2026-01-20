import type { ApiResponse, AnalysisResult } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const analyzeImage = async (imageFile: File): Promise<AnalysisResult> => {
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data: ApiResponse = await response.json();

    // Créer un résultat avec un ID unique
    const result: AnalysisResult = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      extractedText: data.extractedText,
      ingredients: data.analysis.ingredients,
      score: data.analysis.score,
      grade: data.analysis.grade,
      summary: data.analysis.summary,
    };

    return result;
  } catch (error) {
    console.error('Erreur lors de l\'analyse:', error);
    throw error;
  }
};

// Fonction pour générer une URL de prévisualisation d'image
export const createImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Impossible de lire le fichier'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
