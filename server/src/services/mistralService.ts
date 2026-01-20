import { Mistral } from "@mistralai/mistralai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.MISTRAL_API_KEY;
const model = process.env.MISTRAL_MODEL || "pixtral-12b-2409";

if (!apiKey) {
  throw new Error(
    "ERREUR FATALE: La clé API MISTRAL_API_KEY est manquante dans le .env",
  );
}

const client = new Mistral({ apiKey });

export const analyzeImageService = async (base64Image: string) => {
  try {
    // Le Prompt qui fait le travail
    // const prompt = `
    //         Tu es un expert scientifique et sanitaire. Analyse cette image (étiquette produit).

    //         Tâche :
    //         1. Détecte la catégorie : [Alimentaire, Cosmétique, Ménager, Autre].
    //         2. Liste les ingrédients clés (bons ou mauvais).
    //         3. Donne un "Score Santé" de 0 à 100.
    //         4. Rédige un verdict court, fun et pédagogique (tutoiement autorisé).

    //         Réponds UNIQUEMENT avec ce JSON strict :
    //         {
    //             "category": "string",
    //             "score": number,
    //             "verdict_title": "string (ex: Excellent choix !)",
    //             "verdict_color": "string (green, orange, red)",
    //             "explanation": "string",
    //             "ingredients_detected": ["string"]
    //         }
    //     `;
    const prompt = `Tu es un expert en nutrition et sécurité alimentaire. Analyse cette image d'étiquette alimentaire.

INSTRUCTIONS STRICTES :
1. Lis attentivement TOUT le texte visible sur l'étiquette
2. Extrais la liste complète des ingrédients
3. Pour CHAQUE ingrédient, fournis :
   - Le nom exact
   - La catégorie (allergen/preservative/additive/irritant/beneficial/other)
   - Le niveau de risque (none/low/medium/high)
   - Une explication claire (1-2 phrases)

4. Calcule un score santé réaliste (0-100) basé sur :
   - Présence d'additifs : -5 à -20 points
   - Allergènes : -10 à -30 points
   - Sucres/graisses : -5 à -15 points
   - Ingrédients naturels : +5 à +20 points

5. Grade basé sur le score : A(90-100), B(75-89), C(60-74), D(40-59), E(0-39)

RÉPONDS UNIQUEMENT AVEC CE JSON (sans markdown, sans \`\`\`) :
{
  "extractedText": "Tous les ingrédients lus sur l'étiquette",
  "ingredients": [
    {
      "name": "Nom de l'ingrédient",
      "category": "allergen",
      "explanation": "Explication détaillée",
      "riskLevel": "high"
    }
  ],
  "score": 75,
  "grade": "B",
  "positives": ["Point positif 1", "Point positif 2"],
  "warnings": ["Avertissement 1", "Avertissement 2"],
  "recommendations": ["Recommandation 1", "Recommandation 2"]
}`;

    console.log("🤖 Envoi à Mistral AI...");

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
      temperature: 0.3, // - de créativité pour plus de précision
    });

    //Parse la réponse JSON
    const rawContent = chatResponse.choices![0].message.content;
    console.log("📦 Réponse brute de Mistral:", rawContent);

    if (!rawContent) {
      throw new Error("Réponse vide de l'IA");
    }
    let parsed: any;

    if (typeof rawContent === "string") {
      //Nettoie les éventuels backticks ou texte superflu
      const cleanedContent = rawContent
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      console.log("🧹 Contenu nettoyé:", cleanedContent);
      parsed = JSON.parse(cleanedContent);
    } else {
      parsed = rawContent;
    }
    console.log("✅ JSON parsé:", JSON.stringify(parsed, null, 2));

    // Vérifier que les données essentielles sont présentes
    if (!parsed.ingredients || parsed.ingredients.length === 0) {
      console.warn(
        "⚠️ Aucun ingrédient trouvé, création de données par défaut",
      );
      parsed.ingredients = [
        {
          name: "Ingrédients non détectés",
          category: "other",
          explanation:
            "L'IA n'a pas pu extraire les ingrédients de l'image. Vérifiez que l'étiquette est lisible.",
          riskLevel: "none",
        },
      ];
    }

    if (!parsed.extractedText || parsed.extractedText === "") {
      console.warn("⚠️ Texte extrait vide");
      parsed.extractedText = "Texte non lisible sur l'image";
    }

    // Transformer au format attendu
    const result = {
      extractedText: parsed.extractedText || "Texte non disponible",
      analysis: {
        ingredients: parsed.ingredients.map((ing: any) => ({
          name: ing.name || "Inconnu",
          category: ing.category || "other",
          explanation: ing.explanation || "Pas d'explication disponible",
          riskLevel: ing.riskLevel || "none",
        })),
        score: typeof parsed.score === "number" ? parsed.score : 50,
        grade: parsed.grade || "C",
        summary: {
          positives: Array.isArray(parsed.positives)
            ? parsed.positives
            : ["Aucun point positif identifié"],
          warnings: Array.isArray(parsed.warnings)
            ? parsed.warnings
            : ["Aucun avertissement"],
          recommendations: Array.isArray(parsed.recommendations)
            ? parsed.recommendations
            : ["Consultez un professionnel de santé"],
        },
      },
    };

    console.log("📤 Réponse finale envoyée:", JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error("❌ Erreur Mistral Service:", error);

    if (error instanceof SyntaxError) {
      console.error("❌ Erreur de parsing JSON");
    }

    throw new Error("L'analyse IA a échoué. Vérifiez l'image ou la clé API.");
  }
};
