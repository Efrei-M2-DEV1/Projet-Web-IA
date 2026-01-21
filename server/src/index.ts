import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import apiRoutes from "./routes/api";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Creation du dossier 'uploads' s'il n'existe pas
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Middlewares
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

//Routes API
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.send("Bienvenue sur l'Appli Ingre-Scan!");
});

app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
  console.log(`🔑 Modele IA actif : ${process.env.MISTRAL_MODEL}`);
});
