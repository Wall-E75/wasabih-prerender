#🚀 Wasabih Prerender - Guide de Déploiement

## 📋 Prérequis Serveur

- Node.js v20+
- npm v10+
- PM2 (process manager)
- NGINX (reverse proxy)
- Git

## 🔧 Installation

### 1. Clone du repository

\`\`\`bash
git clone https://github.com/wasabih/prerender.git /var/www/wasabih-prerender
cd /var/www/wasabih-prerender
\`\`\`

### 2. Installation des dépendances

\`\`\`bash
npm install --production
\`\`\`

### 3. Configuration des variables d'environnement

\`\`\`bash
cp .env.example .env
nano .env
\`\`\`

**Variables requises :**
- `SUPABASE_URL` : URL de l'instance Supabase production
- `SUPABASE_ANON_KEY` : Clé anonyme Supabase production
- `PORT` : Port du serveur (défaut: 3099)
- `MAIN_SITE_URL` : https://wasabih.com
- `DEFAULT_OG_IMAGE` : URL image par défaut

### 4. Test local

\`\`\`bash
node index.js
\`\`\`

Vérifier : `curl http://localhost:3099/`

### 5. Démarrage avec PM2

\`\`\`bash
pm2 start index.js --name wasabih-prerender
pm2 save
pm2 startup
\`\`\`

## 🌐 Configuration NGINX

**Fichier : `/etc/nginx/sites-available/share.wasabih.com`**

\`\`\`nginx
server {
    listen 80;
    server_name share.wasabih.com;

    location / {
        proxy_pass http://localhost:3099;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
\`\`\`

**Activer et recharger :**

\`\`\`bash
sudo ln -s /etc/nginx/sites-available/share.wasabih.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
\`\`\`

## 🔒 SSL avec Let's Encrypt

\`\`\`bash
sudo certbot --nginx -d share.wasabih.com
\`\`\`

## ✅ Tests de validation

### Test API locale

\`\`\`bash
curl http://localhost:3099/
\`\`\`

### Test bot detection

\`\`\`bash
curl -A "facebookexternalhit/1.1" http://localhost:3099/events/[SLUG]
\`\`\`

### Test production

\`\`\`bash
curl -A "facebookexternalhit/1.1" https://share.wasabih.com/events/[SLUG]
\`\`\`

## 📊 Gestion du serveur

### Logs

\`\`\`bash
# Logs PM2
pm2 logs wasabih-prerender

# Logs temps réel
pm2 logs wasabih-prerender --lines 100

# Logs erreurs uniquement
pm2 logs wasabih-prerender --err
\`\`\`

### Redémarrage

\`\`\`bash
# Redémarrer l'application
pm2 restart wasabih-prerender

# Recharger (sans downtime)
pm2 reload wasabih-prerender

# Arrêter
pm2 stop wasabih-prerender

# Démarrer
pm2 start wasabih-prerender
\`\`\`

### Statut

\`\`\`bash
pm2 status
pm2 monit
\`\`\`

## 🔄 Mise à jour du code

\`\`\`bash
cd /var/www/wasabih-prerender
git pull origin main
npm install --production
pm2 restart wasabih-prerender
\`\`\`

## 🏗️ Architecture

\`\`\`
Internet
    ↓
NGINX (port 80/443)
    ↓
Node.js/Express (port 3099)
    ↓
Supabase (PostgreSQL)
\`\`\`

## 📱 Routes disponibles

- `/` - Health check
- `/events/:slug` - Événements
- `/people/:slug` - Profils
- `/companies/:slug` - Entreprises
- `/insights/:slug` - Articles
- `/institutions/:slug` - Institutions

## 🆘 Troubleshooting

### Serveur ne démarre pas

\`\`\`bash
# Vérifier les logs
pm2 logs wasabih-prerender --err

# Vérifier le port
netstat -tulpn | grep 3099

# Tester manuellement
node index.js
\`\`\`

### NGINX erreur 502

\`\`\`bash
# Vérifier que Node.js tourne
pm2 status

# Vérifier les logs NGINX
sudo tail -f /var/log/nginx/error.log
\`\`\`

### Erreur Supabase

\`\`\`bash
# Vérifier les variables d'environnement
cat .env

# Tester la connexion Supabase
node -e "console.log(process.env.SUPABASE_URL)"
\`\`\`

## 👤 Contact

**Développeur :** Sylla Wali
**Email :** walisylla.esse@gmail.com
**Téléphone :** 06 60 27 89 40

---

**Dernière mise à jour :** Février 2026
\`\`\`
