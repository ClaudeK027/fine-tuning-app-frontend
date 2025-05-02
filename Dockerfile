# Utiliser une image Node.js officielle (version LTS Alpine recommandée)
FROM node:20-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier package.json et package-lock.json (ou yarn.lock)
COPY package*.json ./
# Si vous utilisez yarn, décommentez la ligne suivante et commentez celle d'après
# COPY yarn.lock ./

# Installer les dépendances
# Si vous utilisez yarn, remplacez "npm install" par "yarn install --frozen-lockfile"
RUN npm install

# Copier le reste du code de l'application
COPY . .

# Exposer le port sur lequel l'application React va tourner (port par défaut de create-react-app/Vite)
EXPOSE 3000

# Commande par défaut pour lancer l'application en mode développement
# Si vous utilisez yarn, remplacez "npm start" par "yarn start"
CMD ["npm", "run", "dev"]
