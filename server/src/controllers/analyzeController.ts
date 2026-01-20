import { Request, Response } from "express";
import fs from "fs";
import { analyzeImageService } from "../services/mistralService";

export const analyzeImage = async (req: Request, res: Response) => {
  try {
    //1. Validation : Fichier reçu ?
    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier image reçu." });
    }
    //2.Conversion de l'image (Fichier temp -> Base64 pour Mistral)
    const imageBuffer = fs.readFileSync(req.file.path);
    const base64Image = `data:${req.file.mimetype};base64,${imageBuffer.toString("base64")}`;

    //3.Appel du service d'analyse
    console.log("🔍 Analyse en cours pour :", req.file.originalname);
    const analyzeResult = await analyzeImageService(base64Image);

    //4. Nettoyage : Suppression du fichier temporaire
    fs.unlinkSync(req.file.path);
    //5. Réponse au client
    return res.json(analyzeResult);
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
