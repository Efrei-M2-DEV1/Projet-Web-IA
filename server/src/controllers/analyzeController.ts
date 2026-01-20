import { Request, Response } from "express";
import fs from "fs";
import { analyzeImageService } from "../services/mistralService";

export const analyzeImage = async (req: Request, res: Response) => {
  try {
    console.log("📥 Requête d'analyse reçue");
    console.log("📎 Fichiers joints:", req.file ? "Oui" : "Non");
    //1. Validation : Fichier reçu ?
    if (!req.file) {
      console.error("❌ Aucun fichier image fourni");
      return res.status(400).json({ error: "Aucun fichier image reçu." });
    }
    console.log("📸 Fichier reçu:", {
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
    });
    //2.Conversion de l'image (Fichier temp -> Base64 pour Mistral)
    const imageBuffer = fs.readFileSync(req.file.path);
    const base64Image = `data:${req.file.mimetype};base64,${imageBuffer.toString("base64")}`;

    //3.Appel du service d'analyse
    console.log("🔍 Analyse en cours pour :", req.file.originalname);
    const analyzeResult = await analyzeImageService(base64Image);
    console.log("✅ Analyse terminée");
    console.log("📊 Résultat:", {
      textLength: analyzeResult.extractedText.length,
      ingredientsCount: analyzeResult.analysis.ingredients.length,
      score: analyzeResult.analysis.score,
      grade: analyzeResult.analysis.grade,
    });
    //4. Nettoyage : Suppression du fichier temporaire
    fs.unlinkSync(req.file.path);
    console.log("🗑️ Fichier temporaire supprimé");
    //5. Réponse au client
    console.log("📤 Envoi de la réponse au client");
    res.status(200).json(analyzeResult);
  } catch (error) {
    console.error("Erreur dans analyzeController:", error);
    // Si le fichier temporaire existe, le supprimer
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

    return res.status(500).json({
      error: "Erreur lors de l'analyse de l'image.",
      details: error instanceof Error ? error.message : "Erreur inconnue",
    });
  }
};
