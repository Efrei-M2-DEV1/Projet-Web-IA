# 🍎 Analyseur d'Ingrédients

> **Projet Web IA - Master 2**  
> Une application intelligente pour analyser les ingrédients de vos produits alimentaires en temps réel

![Version](https://img.shields.io/badge/version-1.0.0-orange)
![Status](https://img.shields.io/badge/status-en%20développement-yellow)
![Team](https://img.shields.io/badge/équipe-4%20personnes-blue)

---

## 📋 Table des matières

- [🎯 Le Projet](#-le-projet)
- [✨ Fonctionnalités](#-fonctionnalités)
- [🚀 Démarrage Rapide](#-démarrage-rapide)
- [⚙️ Configuration](#️-configuration)
- [🛠️ Technologies](#️-technologies)
- [👥 Équipe](#-équipe)

---

## 🎯 Le Projet

### 🌟 Notre Mission

Dans un monde où la transparence alimentaire devient cruciale, **Analyseur d'Ingrédients** se positionne comme votre allié santé du quotidien. Notre objectif ? Démocratiser l'accès à l'information nutritionnelle en rendant la lecture des étiquettes aussi simple qu'une photo !

### 💡 Pourquoi ce projet ?

- 🏥 **Santé publique** : Aider les consommateurs à faire des choix éclairés
- 🔬 **IA au service du bien-être** : Exploiter Mistral AI pour une analyse précise
- 📱 **Accessibilité** : Une app web responsive compatible desktop et mobile
- 🎓 **Apprentissage** : Projet académique Master 2 - Web & IA

### 🎯 Nos Ambitions

- ✅ Analyse instantanée des ingrédients via OCR et IA
- ✅ Notation rigoureuse inspirée de Yuka et du Nutri-Score
- ✅ Détection des allergènes et additifs controversés
- ✅ Recommandations personnalisées basées sur l'OMS
- 🚧 Historique des analyses et favoris
- 🚧 Mode hors ligne avec Progressive Web App (PWA)
- 🚧 Comparaison de produits similaires
- 🚧 Profils utilisateurs (diabète, allergies, régimes spéciaux)

---

## ✨ Fonctionnalités

### 🎥 Capture d'Image Multi-Plateforme

- **📸 Webcam en direct** : Capturez des étiquettes sur desktop avec votre webcam
- **📱 Caméra mobile** : Utilisez l'appareil photo de votre smartphone (iOS/Android)
- **🖼️ Import depuis galerie** : Sélectionnez des photos existantes
- **🖱️ Drag & Drop** : Glissez-déposez vos images (desktop)

### 🧠 Analyse Intelligente par IA

- **🔍 OCR Puissant** : Extraction de texte via Mistral AI (Pixtral)
- **🏷️ Catégorisation** : Classification automatique des ingrédients
  - Additifs controversés (E621, colorants, etc.)
  - Allergènes majeurs (gluten, lactose, fruits à coque)
  - Sucres ajoutés et édulcorants
  - Ultra-transformés (sirop glucose-fructose, maltodextrine)
  - Ingrédients naturels et bénéfiques

### 📊 Notation Rigoureuse

- **Score sur 100** : Évaluation objective basée sur :
  - Teneur en sucres, sel, graisses
  - Nombre et type d'additifs
  - Présence d'allergènes
  - Qualité nutritionnelle globale
- **Grades A-E** : Système inspiré du Nutri-Score
  - 🟢 **A (90-100)** : EXCELLENT - Produit sain recommandé
  - 🟢 **B (75-89)** : BON - Qualité correcte
  - 🟡 **C (50-74)** : MOYEN - Consommation modérée
  - 🟠 **D (25-49)** : MÉDIOCRE - À éviter régulièrement
  - 🔴 **E (0-24)** : MAUVAIS - Déconseillé

### 📱 Interface Moderne

- **🎨 Design responsive** : Adapté mobile, tablette, desktop
- **🌙 UX intuitive** : Navigation fluide et accessible
- **⚡ Temps réel** : Analyse en quelques secondes
- **📜 Historique** : Consultez vos analyses précédentes

---

## 🚀 Démarrage Rapide

### 📦 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** : Version 18+ ([Télécharger](https://nodejs.org/))
- **npm** : Inclus avec Node.js
- **Une clé API Mistral** : [Créer un compte](https://console.mistral.ai/)

### 🔧 Installation

```bash
# 1️⃣ Cloner le projet
git clone <votre-repo>
cd projet-web-ia

# 2️⃣ Installer les dépendances
npm install

# 3️⃣ Installer les dépendances du client
cd client
npm install

# 4️⃣ Installer les dépendances du serveur
cd ../server
npm install

# 5️⃣ Revenir à la racine
cd ..
```

---

## ⚙️ Configuration

### 🔑 Variables d'Environnement

#### **Backend (.env dans `/server`)**

Créez un fichier `.env` dans le dossier `server/` :

```env
# Port du serveur backend
PORT=3000

# Clé API Mistral (OBLIGATOIRE)
MISTRAL_API_KEY=votre_clé_api_mistral_ici

# Modèle Mistral à utiliser
MISTRAL_MODEL=pixtral-12b-2409
```

📌 **Comment obtenir votre clé API Mistral ?**

1. Rendez-vous sur [console.mistral.ai](https://console.mistral.ai/)
2. Créez un compte ou connectez-vous
3. Accédez à "API Keys"
4. Générez une nouvelle clé
5. Copiez-la dans votre fichier `.env`

#### **Frontend (.env.local dans `/client`)**

Créez un fichier `.env.local` dans le dossier `client/` :

```env
# URL du backend (ajustez si nécessaire)
VITE_API_URL=http://localhost:3000
```

---

## 🎮 Lancement de l'Application

### 🚀 Méthode Rapide (Recommandée)

Depuis la **racine du projet** (`projet-web-ia/`) :

```bash
npm run dev
```

Cette commande lance automatiquement :

- ✅ Le serveur backend sur `http://localhost:3000`
- ✅ Le client frontend sur `http://localhost:5173`

### 🔧 Méthode Manuelle (2 Terminaux)

Si vous préférez lancer séparément :

**Terminal 1 - Backend :**

```bash
cd server
npm run dev
```

> Le serveur démarre sur http://localhost:3000

**Terminal 2 - Frontend :**

```bash
cd client
npm run dev
```

> L'application s'ouvre sur http://localhost:5173

---

## 📱 Test sur Mobile

### 📶 Sur le même réseau WiFi

1. **Trouvez votre IP locale** :

   ```bash
   # Windows
   ipconfig

   # Cherchez "Adresse IPv4" (ex: 192.168.1.10)
   ```

2. **Lancez avec --host** :

   ```bash
   cd client
   npm run dev -- --host
   ```

3. **Accédez depuis votre mobile** :
   - Ouvrez le navigateur
   - Tapez `http://192.168.1.10:5173` (remplacez par votre IP)

### 🌐 Via Tunnel HTTPS (pour iOS)

⚠️ **Important** : La caméra iOS nécessite HTTPS

```bash
# Installez ngrok
npm install -g ngrok

# Lancez le tunnel
ngrok http 5173

# Utilisez l'URL HTTPS fournie (ex: https://abc123.ngrok.io)
```

---

## 🛠️ Technologies

### **Frontend**

- ⚛️ **React 18** + **TypeScript** : Framework UI moderne
- ⚡ **Vite** : Build tool ultra-rapide
- 🎨 **Tailwind CSS** : Styling utility-first
- 📷 **MediaDevices API** : Accès webcam/caméra

### **Backend**

- 🟢 **Node.js** + **Express** : Serveur API REST
- 🤖 **Mistral AI (Pixtral)** : Vision AI pour OCR
- 📤 **Multer** : Gestion upload d'images
- 🔒 **CORS** : Sécurisation des requêtes

### **DevOps**

- 📦 **npm workspaces** : Gestion monorepo
- 🔧 **TypeScript** : Typage statique
- 🐛 **ESLint** : Linting du code

---

## 📂 Structure du Projet

```
projet-web-ia/
├── 📁 client/                 # Application React (Frontend)
│   ├── src/
│   │   ├── components/        # Composants React
│   │   │   ├── ImageUpload.tsx      # Capture photo/upload
│   │   │   ├── AnalysisResults.tsx  # Affichage résultats
│   │   │   ├── History.tsx          # Historique analyses
│   │   │   └── Help.tsx             # Aide utilisateur
│   │   ├── services/          # Services API
│   │   │   ├── api.ts               # Communication backend
│   │   │   └── history.ts           # Gestion historique
│   │   ├── types/             # Types TypeScript
│   │   ├── App.tsx            # Composant principal
│   │   └── main.tsx           # Point d'entrée
│   ├── .env.local            # ⚙️ Config frontend
│   └── package.json
│
├── 📁 server/                 # API Express (Backend)
│   ├── src/
│   │   ├── controllers/       # Logique métier
│   │   │   └── analyzeController.ts
│   │   ├── services/          # Services externes
│   │   │   └── mistralService.ts    # Intégration Mistral AI
│   │   ├── routes/            # Routes API
│   │   │   └── api.ts
│   │   └── index.ts           # Serveur Express
│   ├── uploads/              # 📸 Images temporaires
│   ├── .env                  # ⚙️ Config backend (clé API)
│   └── package.json
│
├── package.json              # Scripts racine
└── README.md                 # 📖 Ce fichier
```

---

## 🧪 Commandes Utiles

```bash
# 🚀 Lancer l'app complète (racine)
npm run dev

# 🏗️ Build de production (client)
cd client && npm run build

# 🧹 Nettoyer les node_modules
rm -rf node_modules client/node_modules server/node_modules

# 📦 Réinstaller toutes les dépendances
npm install && cd client && npm install && cd ../server && npm install
```

---

## 🐛 Résolution de Problèmes

### ❌ Erreur "Failed to fetch"

**Problème** : Le frontend ne peut pas se connecter au backend

**Solutions** :

1. Vérifiez que le serveur backend est lancé (`http://localhost:3000`)
2. Vérifiez le fichier `.env.local` du client :
3. Dedans mettre bien la valeur à vide : `VITE_API_URL=`
4. Vérifiez que CORS est activé dans `server/src/index.ts`

### ❌ Erreur "MISTRAL_API_KEY manquante"

**Problème** : Clé API non configurée

**Solutions** :

1. Créez le fichier `.env` dans `server/`
2. Ajoutez `MISTRAL_API_KEY=votre_clé`
3. Ajoutez le model : `MISTRAL_MODEL=pixtral-12b-2409` et le PORT=`3000`
4. Redémarrez le serveur

### 📷 La caméra ne s'affiche pas

**Solutions** :

1. Autorisez l'accès à la caméra dans votre navigateur
2. Sur iOS & Android, utilisez HTTPS
3. Vérifiez que la caméra n'est pas utilisée par une autre app

### 🔍 Analyse qui retourne "Texte non disponible"

**Solutions** :

1. Utilisez une image nette et bien éclairée
2. Cadrez uniquement la liste des ingrédients
3. Évitez les reflets et ombres
4. Essayez avec une meilleure qualité d'image

---

## 👥 Équipe

Projet réalisé par **Farid, Mody, Loris, Redjane ** en Master 2 dans le cadre du cours **Projet Web & IA**. 🎓

---

## 📝 Licence

Projet académique - Master 2 - 2026

---

## 🙏 Remerciements

- **Mistral AI** pour l'API de vision
- **Open Food Facts** pour l'inspiration
- **Yuka** pour l'inspiration du système de notation
- **OMS** pour les recommandations nutritionnelles

---

## 🚀 Prochaines Étapes

- [ ] Amélioration de la précision OCR
- [ ] Ajout de profils utilisateurs
- [ ] Système de favoris
- [ ] Mode hors ligne (PWA)
- [ ] Base de données produits
- [ ] Comparaison de produits
- [ ] Export PDF des analyses

---

<div align="center">

**Fait avec ❤️ et beaucoup de ☕ par notre équipe en Master 2**

[🐛 Reporter un bug](../../issues) • [✨ Proposer une fonctionnalité](../../issues)

</div>
