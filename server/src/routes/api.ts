import { Router } from "express";
import multer from "multer";
import { analyzeImage } from "../controllers/analyzeController";

const router = Router();

// Config de multer (upload de fichiers temporaire dans le dossier 'uploads/')
const upload = multer({ dest: "uploads/" });

// L'utilisateur envoie une image sur 'http://.../api/analyze'
// 'image' est le nom du champ dans le formulaire
router.post("/analyze", upload.single("image"), analyzeImage);

export default router;
