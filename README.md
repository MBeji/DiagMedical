# Med-AI App

Application Web d’Assistance Médicale par Intelligence Artificielle.

**Objectif :**
Développer une application web permettant de recueillir les données médicales d’un utilisateur, de poser des questions complémentaires intelligemment, de formuler un diagnostic médical probable, de suggérer des analyses complémentaires, et de proposer une prescription de traitement médicamenteux, le tout de façon sécurisée et structurée.

---

## 🔧 Stack Technique

*   **Frontend**: Next.js (TypeScript)
*   **Backend**: API Routes Next.js / Edge Functions
*   **IA**: OpenAI GPT-4 API (ou LLM open-source via LangChain)
*   **Base de données**: Planetscale / Supabase (Optionnel, pour historique)
*   **Authentification**: Clerk / NextAuth (Optionnel)
*   **Déploiement**: Vercel via GitHub Actions (CI/CD)
*   **Stockage temporaire**: localStorage / Supabase

---

## 📂 Structure du Projet (Simplifiée)

```
/med-ai-app
├── .vercel/              # Configuration Vercel
├── .github/workflows/    # CI pour déploiement auto
│   └── deploy.yml
├── public/               # Assets publics
├── src/
│   ├── app/              # Routes UI Next.js (App Router)
│   │   ├── page.tsx      # Page d'accueil (exemple)
│   │   └── layout.tsx    # Layout principal (exemple)
│   ├── pages/            # Routes Next.js (principalement pour les API Routes)
│   │   └── api/
│   │       └── diagnose.ts # Endpoint d’IA (à créer)
│   ├── components/       # Composants UI React
│   ├── lib/              # Fonctions métier (IA, parsing, etc.)
│   ├── types/            # Interfaces et types TypeScript
│   └── styles/           # Styles globaux (ex: globals.css)
├── .env.local.example    # Exemple de configuration des variables d'environnement
├── README.md             # Documentation du projet
├── vercel.json           # Configuration de build/déploiement Vercel
├── next.config.ts        # Configuration de Next.js
├── package.json          # Dépendances et scripts NPM
└── tsconfig.json         # Configuration TypeScript
```
*Note: La structure de `src/` utilise l'App Router de Next.js pour l'interface utilisateur et le dossier `pages/api` pour les fonctions backend.*

---

## 🚀 Démarrage Rapide

1.  **Cloner le dépôt :**
    ```bash
    git clone https://github.com/VOTRE_NOM_UTILISATEUR/med-ai-app.git
    cd med-ai-app
    ```

2.  **Installer les dépendances :**
    ```bash
    npm install
    # ou
    # yarn install
    ```

3.  **Configurer les variables d'environnement :**
    Copiez `.env.local.example` vers `.env.local` et remplissez les valeurs nécessaires.
    ```bash
    cp .env.local.example .env.local
    ```
    Vous aurez besoin au minimum de :
    *   `OPENAI_API_KEY`

4.  **Lancer le serveur de développement :**
    ```bash
    npm run dev
    # ou
    # yarn dev
    ```
    Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## ⚙️ Configuration

### Variables d'environnement

Les variables d'environnement sont gérées via le fichier `.env.local`. Copiez `.env.local.example` vers `.env.local` et remplissez les valeurs.

*   `OPENAI_API_KEY`: **Requis**. Votre clé API OpenAI. Elle est essentielle pour que la fonctionnalité de diagnostic par IA fonctionne.
*   `VERCEL_TOKEN`: (Pour la CI/CD) Token d'accès Vercel. À configurer dans les secrets GitHub de votre dépôt.
*   `VERCEL_ORG_ID`: (Pour la CI/CD, si Vercel CLI en a besoin) ID de votre organisation Vercel.
*   `VERCEL_PROJECT_ID`: (Pour la CI/CD, si Vercel CLI en a besoin) ID de votre projet Vercel.

---

## 🌐 Déploiement

Le déploiement est automatisé via GitHub Actions et Vercel. Chaque `push` sur la branche `main` (configurable dans `.github/workflows/deploy.yml`) déclenchera un nouveau déploiement.

Assurez-vous d'avoir configuré les secrets suivants dans votre dépôt GitHub :
*   `VERCEL_TOKEN`

---

## API Endpoints

### `/api/diagnose`

*   **Méthode**: `POST`
*   **Description**: Reçoit les données médicales de l'utilisateur et interagit avec l'API OpenAI (GPT-4 par défaut) pour générer un diagnostic probable, des questions complémentaires, des suggestions d'analyses, et une proposition de traitement.
*   **Corps de la requête (exemple)**:
    ```json
    {
      "age": 30,
      "sex": "male",
      "symptoms": ["fièvre", "toux", "fatigue"],
      "history": ["hypertension"]
    }
    ```
*   **Réponse (exemple de structure)**:
    ```json
    {
      "diagnosis": "Possible infection virale mineure.",
      "further_questions": [
        "Avez-vous noté une éruption cutanée ?",
        "Votre température a-t-elle dépassé 38.5°C ?"
      ],
      "recommended_analyses": [
        "Repos et hydratation",
        "Surveillance des symptômes pendant 48h"
      ],
      "suggested_treatment": [
        "Paracétamol en cas de fièvre ou de douleur, selon la posologie habituelle."
      ],
      "risks_and_warnings": "Si les symptômes s'aggravent ou si de nouveaux symptômes apparaissent, consultez un médecin sans tarder. Ce diagnostic est une suggestion basée sur des informations limitées.",
      "disclaimer": "Ce service est un outil d'assistance et ne remplace pas une consultation médicale professionnelle. Consultez toujours un médecin pour un diagnostic officiel et un traitement."
    }
    ```

---

## 📄 Clause de non-responsabilité

Cette application fournit des informations à titre indicatif et ne doit pas être considérée comme un avis médical professionnel, un diagnostic, ou un traitement. Consultez toujours un professionnel de santé qualifié pour toute question relative à une condition médicale. Ne négligez jamais un avis médical professionnel et ne tardez pas à en chercher un à cause de quelque chose que vous avez lu ou obtenu via cette application.

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez ouvrir une issue ou une pull request.

---

*Ce README a été généré et sera complété au fur et à mesure du développement du projet.*
