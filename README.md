# # Fine-Tuning Application - Frontend

## 📖 Description

Ce projet est l'interface utilisateur (UI) de l'application de fine-tuning. Développée avec React, Vite, et TypeScript, elle offre une expérience utilisateur moderne et réactive pour interagir avec l'API backend.

L'application permet de visualiser les modèles et datasets, de gérer les jobs d'affinage, et de lancer de nouvelles tâches d'entraînement via un formulaire intuitif. Elle est conçue pour être entièrement conteneurisée avec Docker pour un développement et un déploiement simplifiés.

---

## ✨ Fonctionnalités

- **Tableaux de Bord :** Listes dynamiques et consultables pour les modèles, datasets et jobs.
- **Création de Jobs :** Un formulaire complet pour lancer un nouveau job de fine-tuning, avec sélection de modèle, de dataset et configuration des hyperparamètres.
- **Recherche et Filtrage :** Composants de recherche performants pour naviguer facilement dans les listes.
- **Notifications :** Système de notifications (toasts) pour informer l'utilisateur des succès et des erreurs.
- **Design System :** Utilisation de **Shadcn UI** et **Tailwind CSS** pour une interface élégante et cohérente.
- **Conteneurisation :** Entièrement fonctionnel via Docker et Docker Compose.

---

## 🛠️ Stack Technique

- **Framework :** React 18+
- **Build Tool :** Vite
- **Langage :** TypeScript
- **UI Components :** Shadcn UI
- **Styling :** Tailwind CSS
- **Routing :** React Router DOM
- **Appels API :** Axios
- **Notifications :** Sonner
- **Conteneurisation :** Docker, Docker Compose

---

## 🚀 Installation et Lancement

### Prérequis

- [Node.js](https://nodejs.org/) (pour l'autocomplétion de l'IDE)
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Étapes

1.  **Clonez le dépôt :**
    ```bash
    git clone https://github.com/votre-utilisateur/fine-tuning-app-frontend.git
    cd fine-tuning-app-frontend
    ```

2.  **Lancez l'application avec Docker Compose :**
    Assurez-vous que le backend est également en cours d'exécution. La configuration `docker-compose.yml` à la racine du projet global gère les deux services.
    ```bash
    # Depuis la racine du projet complet
    docker-compose up --build -d
    ```

3.  **L'application est maintenant accessible** à l'adresse `http://localhost:5173/`.

---

## 📂 Structure du Projet

```
fine-tuning-app-frontend/
├── public/                # Fichiers statiques
├── src/
│   ├── components/        # Composants React réutilisables (ex: ui/ de Shadcn)
│   ├── pages/             # Composants représentant les pages de l'application
│   ├── services/          # Logique d'appel à l'API (api.ts)
│   ├── lib/               # Utilitaires (ex: Shadcn utils)
│   ├── App.tsx            # Composant racine et routage
│   └── main.tsx           # Point d'entrée de l'application
├── Dockerfile             # Instructions pour construire l'image du frontend
├── package.json           # Dépendances et scripts du projet
├── tsconfig.json          # Configuration TypeScript
└── vite.config.ts         # Configuration de Vite
```

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
