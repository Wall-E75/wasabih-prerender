# Wasabih Prerender Server

Serveur de prerender pour générer des aperçus Open Graph dynamiques lors du partage de liens Wasabih sur les réseaux sociaux (Facebook, LinkedIn, WhatsApp, Twitter, etc.).

## 🎯 Objectif

Lorsqu'un bot de réseau social visite un lien Wasabih, il reçoit un HTML statique avec les métadonnées Open Graph appropriées, permettant un affichage optimisé de l'aperçu du lien.

Les utilisateurs humains sont automatiquement redirigés vers l'application Wasabih normale.

## 🏗️ Architecture
```
wasabih-prerender/
├── index.js              # Point d'entrée et configuration Express
├── routes/
│   ├── events.js         # Routes pour les événements
│   ├── people.js         # Routes pour les profils
│   └── companies.js      # Routes pour les entreprises
├── utils/
│   ├── botDetection.js   # Détection des bots de réseaux sociaux
│   └── ogGenerator.js    # Génération du HTML Open Graph
├── config/
│   └── supabase.js       # Configuration Supabase et données mockées
├── package.json
├── .env
└── .gitignore
```

## 🛠️ Stack Technique

- **Runtime** : Node.js v20+
- **Framework** : Express.js v5
- **Base de données** : Supabase
- **Modules** : ES6 (import/export)

## 📦 Installation

### Prérequis

- Node.js v20 ou supérieur
- npm
- Compte Supabase (credentials requis)

### Étapes
```bash
# Cloner le repository
git clone [URL_DU_REPO]
cd wasabih-prerender

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Puis éditer .env avec vos credentials Supabase

# Lancer en développement
npm run dev

# Lancer en production
npm start
```

## ⚙️ Configuration

Créez un fichier `.env` à la racine du projet :
```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Serveur
PORT=3000
NODE_ENV=development
```

## 🚀 Utilisation

### Démarrer le serveur
```bash
# Développement (avec auto-reload)
npm run dev

# Production
npm start
```

Le serveur démarre sur `http://localhost:3000`

### Routes disponibles

#### Routes principales

- **GET** `/events/:slug` - Prerender pour les événements
- **GET** `/people/:slug` - Prerender pour les profils
- **GET** `/companies/:slug` - Prerender pour les entreprises

#### Routes de test

- **GET** `/` - Informations sur le serveur
- **GET** `/debug` - Affiche les headers de la requête et détection bot
- **GET** `/test-bot?bot=facebook` - Teste la détection d'un bot spécifique

## 🧪 Tests

### Tester la détection de bots
```bash
# Simuler un bot Facebook
curl -A "facebookexternalhit/1.1" http://localhost:3000/events/halal-expo-2025

# Simuler un bot LinkedIn
curl -A "LinkedInBot/1.0" http://localhost:3000/people/john-doe

# Simuler un humain (sera redirigé)
curl -L http://localhost:3000/events/halal-expo-2025
```

### Tester avec les outils des réseaux sociaux

**Facebook Debugger :**
https://developers.facebook.com/tools/debug/

**LinkedIn Post Inspector :**
https://www.linkedin.com/post-inspector/

**Twitter Card Validator :**
https://cards-dev.twitter.com/validator

## 🤖 Bots détectés

Le serveur détecte automatiquement les bots suivants :

- Facebook (facebookexternalhit)
- LinkedIn (linkedinbot)
- Twitter/X (twitterbot)
- WhatsApp (whatsapp)
- Slack (slackbot)
- Telegram (telegrambot)
- Discord (discordbot)
- Pinterest (pinterest)
- Reddit (redditbot)
- Et 10+ autres...

## 🔐 Sécurité

- **Escape HTML** : Protection contre les injections XSS
- **Service Role Key** : Utilisée côté serveur uniquement (jamais exposée au client)
- **Cache Control** : Headers appropriés pour le cache des bots

## 📊 Fonctionnement

### Architecture complète
```
Internet
    ↓
Reverse Proxy / Edge Service
(détection bot vs humain)
    ↓
    ├─ Bot → prerender.wasabih.com (ce serveur)
    │         └─ Génère HTML Open Graph
    │
    └─ Humain → wasabih.com (React app)
              └─ Application normale
```

**Technologies possibles :**
- Nginx (reverse proxy)
- Alibaba Cloud ESA (edge computing)
- Cloudflare Workers (edge computing)
- Serveur Node.js custom


## 📝 Balises Open Graph générées

Le serveur génère automatiquement les balises suivantes :
```html
<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="[URL]">
<meta property="og:title" content="[TITRE]">
<meta property="og:description" content="[DESCRIPTION]">
<meta property="og:image" content="[IMAGE_URL]">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="[TITRE]">
<meta name="twitter:description" content="[DESCRIPTION]">
<meta name="twitter:image" content="[IMAGE_URL]">

<!-- WhatsApp -->
<meta property="og:site_name" content="Wasabih">
<meta property="og:locale" content="fr_FR">
```

## 🚧 TODO / Roadmap

- [x] Architecture modulaire
- [x] Détection de bots
- [x] Génération HTML Open Graph
- [x] Routes events, people, companies
- [x] Sécurité (escape HTML)
- [ ] Intégration Supabase (en attente credentials)
- [ ] Déploiement sur prerender.wasabih.com
- [ ] Tests avec Facebook/LinkedIn Debugger en production


## 🐛 Debugging

### Le serveur ne démarre pas
```bash
# Vérifier que Node.js est installé
node --version  # Doit être v20+

# Vérifier les dépendances
npm install

# Vérifier le .env
cat .env
```

### Les bots ne sont pas détectés
```bash
# Tester la détection
curl http://localhost:3000/debug -A "facebookexternalhit/1.1"

# Vérifier les logs du serveur
# Les logs affichent : 🤖 Bot detected ou 👤 Human detected
```

### HTML mal formaté

- Vérifier que les données Supabase contiennent bien `title`, `description`, `image_url`
- Les caractères spéciaux sont automatiquement échappés pour éviter les problèmes

## 📚 Documentation

- [Open Graph Protocol](https://ogp.me/)
- [Express.js](https://expressjs.com/)
- [Supabase](https://supabase.com/docs)

## 👤 Auteur

**Sylla Wali**  
Stagiaire Développeur Full-Stack chez Wasabih


## 🤝 Contribution

Ce projet fait partie du stage chez Wasabih. Pour toute question ou suggestion, contactez l'équipe technique.

---

**Version** : 2.0.0  
**Dernière mise à jour** : [16/01/2026]