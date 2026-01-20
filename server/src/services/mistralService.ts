import { Mistral } from "@mistralai/mistralai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.MISTRAL_API_KEY;
const model = process.env.MISTRAL_MODEL || "mistral-7b-instruct-v0.1";

if (!apiKey) {
  throw new Error(
    "ERREUR FATALE: La clé API MISTRAL_API_KEY est manquante dans le .env",
  );
}

const client = new Mistral({ apiKey });

export const analyzeImageService = async (base64Image: string) => {
  try {
    // Le Prompt qui fait le travail
    const prompt = `
            Tu es un expert scientifique et sanitaire. Analyse cette image (étiquette produit).
            
            Tâche :
            1. Détecte la catégorie : [Alimentaire, Cosmétique, Ménager, Autre].
            2. Liste les ingrédients clés (bons ou mauvais).
            3. Donne un "Score Santé" de 0 à 100.
            4. Rédige un verdict court, fun et pédagogique (tutoiement autorisé).
            
            Réponds UNIQUEMENT avec ce JSON strict :
            {
                "category": "string",
                "score": number,
                "verdict_title": "string (ex: Excellent choix !)",
                "verdict_color": "string (green, orange, red)",
                "explanation": "string",
                "ingredients_detected": ["string"]
            }
        `;

    const chatResponse = await client.chat.complete({
      model,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", imageUrl: base64Image },
          ],
        },
      ],
      responseFormat: { type: "json_object" }, // Pour forcer la réponse en JSON
    });

    //Parse la réponse JSON
    const rawContent = chatResponse.choices![0].message.content;

    if (typeof rawContent === "string") {
      return JSON.parse(rawContent);
    }
    throw new Error("Réponse vide de l'IA");
  } catch (error) {
    console.error("Erreur Mistral Service:", error);
    throw new Error("L'analyse IA a échoué. Vérifiez l'image ou la clé API.");
  }
};
