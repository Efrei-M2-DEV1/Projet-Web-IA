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
    //     const prompt = `Tu es un expert en nutrition et sécurité alimentaire. Analyse cette image d'étiquette alimentaire.

    // INSTRUCTIONS STRICTES :
    // 1. Lis attentivement TOUT le texte visible sur l'étiquette
    // 2. Extrais la liste complète des ingrédients
    // 3. Pour CHAQUE ingrédient, fournis :
    //    - Le nom exact
    //    - La catégorie (allergen/preservative/additive/irritant/beneficial/other)
    //    - Le niveau de risque (none/low/medium/high)
    //    - Une explication claire (1-2 phrases)

    // 4. Calcule un score santé réaliste (0-100) basé sur :
    //    - Présence d'additifs : -5 à -20 points
    //    - Allergènes : -10 à -30 points
    //    - Sucres/graisses : -5 à -15 points
    //    - Ingrédients naturels : +5 à +20 points

    // 5. Grade basé sur le score : A(90-100), B(75-89), C(60-74), D(40-59), E(0-39)

    // RÉPONDS UNIQUEMENT AVEC CE JSON (sans markdown, sans \`\`\`) :
    // {
    //   "extractedText": "Tous les ingrédients lus sur l'étiquette",
    //   "ingredients": [
    //     {
    //       "name": "Nom de l'ingrédient",
    //       "category": "allergen",
    //       "explanation": "Explication détaillée",
    //       "riskLevel": "high"
    //     }
    //   ],
    //   "score": 75,
    //   "grade": "B",
    //   "positives": ["Point positif 1", "Point positif 2"],
    //   "warnings": ["Avertissement 1", "Avertissement 2"],
    //   "recommendations": ["Recommandation 1", "Recommandation 2"]
    // }`;

    // console.log("🤖 Envoi à Mistral AI...");
    const prompt = `Tu es un expert en nutrition certifié, formé aux standards de l'OMS, de l'EFSA et du Nutri-Score. Analyse cette étiquette alimentaire avec RIGUEUR et OBJECTIVITÉ.

📋 MÉTHODOLOGIE D'ANALYSE (inspirée de Yuka, Open Food Facts, ANSES) :

1️⃣ EXTRACTION DES DONNÉES
- Lis TOUT le texte visible sur l'étiquette
- Identifie TOUS les ingrédients dans l'ordre de la liste
- Note les additifs avec leur code E (ex: E330, E621)
- Repère les allergènes majeurs (gluten, lactose, fruits à coque, etc.)

2️⃣ SYSTÈME DE NOTATION STRICT (0-100)

DÉDUCTIONS IMPORTANTES :
🔴 Additifs controversés (E621, E330, E951, colorants azoïques) : -8 à -15 points CHACUN
🔴 Huile de palme / graisses hydrogénées : -12 points
🔴 Sucres ajoutés >10g/100g : -15 points | >15g/100g : -25 points | >25g/100g : -35 points
🔴 Sel >1.5g/100g : -10 points | >2g/100g : -20 points
🔴 Allergènes majeurs (gluten, lactose, arachides) : -5 points chacun
🔴 Édulcorants artificiels (aspartame, acésulfame-K) : -10 points chacun
🔴 Sirop de glucose-fructose : -18 points
🔴 Arômes artificiels : -8 points
🔴 Plus de 5 additifs au total : -15 points supplémentaires

BONUS POSITIFS :
🟢 Bio certifié : +15 points
🟢 Sans additifs : +10 points
🟢 Fibres >5g/100g : +8 points
🟢 Protéines >10g/100g : +5 points
🟢 Ingrédients 100% naturels : +12 points
🟢 Faible en sel (<0.3g/100g) : +5 points

3️⃣ GRADING RIGOUREUX (type Nutri-Score/Yuka)
- A (90-100) : EXCELLENT - Produit sain, recommandé
- B (75-89)  : BON - Qualité correcte, consommation modérée OK
- C (50-74)  : MOYEN - Attention aux excès, limiter la fréquence
- D (25-49)  : MÉDIOCRE - À éviter régulièrement, risques santé
- E (0-24)   : MAUVAIS - Déconseillé, nombreux additifs/sucres/sel

4️⃣ CATÉGORISATION DES INGRÉDIENTS

Pour CHAQUE ingrédient détecté, précise :
- name: Nom exact tel qu'écrit sur l'étiquette
- category: 
  * "ultra_processed" (sirop glucose-fructose, maltodextrine, protéines hydrolysées)
  * "additive_harmful" (E621, E951, E150, colorants azoïques)
  * "additive_safe" (E330 citrate, E440 pectine)
  * "allergen_major" (gluten, lait, œufs, arachides, soja, fruits à coque)
  * "allergen_minor" (sulfites, céleri, moutarde)
  * "sugar_added" (sucre, sirop, dextrose, fructose)
  * "fat_saturated" (huile palme, graisse hydrogénée, beurre)
  * "preservative" (E200-E299, benzoate, sorbate)
  * "sweetener_artificial" (aspartame, acésulfame-K, sucralose)
  * "natural" (fruits, légumes, céréales complètes)
  * "beneficial" (fibres, protéines, vitamines, minéraux)

- riskLevel:
  * "critical" : Danger santé (E621, huile palme, >30g sucre/100g)
  * "high" : Risque important (additifs controversés, >20g sucre/100g)
  * "medium" : Attention requise (>10g sucre/100g, additifs courants)
  * "low" : Risque faible (additifs naturels, faible dose)
  * "none" : Aucun risque (ingrédients naturels)

- explanation: Explication CONCRÈTE et PÉDAGOGIQUE
  * Mentionne l'impact santé réel (diabète, hypertension, allergies)
  * Cite les recommandations OMS si pertinent
  * Évite le jargon, sois accessible au grand public

5️⃣ VERDICT ET RECOMMANDATIONS

positives: Liste 2-4 points forts CONCRETS (si existants)
warnings: Liste TOUS les risques santé identifiés
recommendations: Conseils pratiques et alternatifs

⚠️ RÈGLES CRITIQUES :
- Un produit avec >20g sucre/100g NE PEUT PAS dépasser 50/100
- Un produit avec >3 additifs controversés NE PEUT PAS dépasser 40/100
- Un produit ultra-transformé (>5 additifs) démarre à 60/100 MAX
- Huile de palme ou graisses hydrogénées = MAX 45/100
- Présence de E621 (glutamate) = MAX 35/100

📤 RÉPONDS UNIQUEMENT AVEC CE JSON (sans markdown, sans \`\`\`) :

{
  "extractedText": "Liste complète des ingrédients lus sur l'étiquette",
  "ingredients": [
    {
      "name": "Nom exact de l'ingrédient",
      "category": "ultra_processed",
      "explanation": "Impact santé concret et recommandations OMS",
      "riskLevel": "high"
    }
  ],
  "score": 25,
  "grade": "D",
  "positives": ["Point positif concret 1", "Point positif concret 2"],
  "warnings": [
    "⚠️ Forte teneur en sucres ajoutés (25g/100g) - Risque diabète type 2",
    "⚠️ Présence de E621 (glutamate monosodique) - Additif controversé"
  ],
  "recommendations": [
    "Limiter à 1 portion par semaine maximum",
    "Alternative : Café noir sans sucre ou café soluble bio sans additifs",
    "Personnes diabétiques : DÉCONSEILLÉ"
  ]
}

💡 EXEMPLES DE NOTATION :
- Nescafé café soluble sucré (>20g sucre, additifs) : 25-35/100 (Grade D/E)
- Nutella (huile palme, >50g sucre) : 15-25/100 (Grade E)
- Coca-Cola (>10g sucre/100ml, E150, acidifiants) : 10-20/100 (Grade E)
- Compote sans sucre ajouté : 75-85/100 (Grade B)
- Fruits frais, légumes : 95-100/100 (Grade A)

Sois IMPLACABLE sur les produits ultra-transformés. La santé publique est en jeu.`;

    console.log("🤖 Envoi à Mistral AI avec prompt renforcé...");

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
