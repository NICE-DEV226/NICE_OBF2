# NICE-OBF - Déploiement Netlify

![NICE-OBF](https://img.shields.io/badge/NICE--OBF-v1.0.0-purple)
![Netlify](https://img.shields.io/badge/Netlify-Ready-00C7B7)
![React](https://img.shields.io/badge/React-18+-blue)
![Serverless](https://img.shields.io/badge/Serverless-Functions-green)

**NICE-OBF** est une application fullstack d'obfuscation de code optimisée pour le déploiement sur Netlify avec des fonctions serverless.

## 🚀 Déploiement sur Netlify

### Méthode 1: Déploiement Direct

1. **Connecter votre repository Git à Netlify**
   - Allez sur [netlify.com](https://netlify.com)
   - Cliquez sur "New site from Git"
   - Connectez votre repository GitHub/GitLab

2. **Configuration de build**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **Variables d'environnement** (optionnel)
   ```
   NODE_VERSION=20
   ```

### Méthode 2: Netlify CLI

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Se connecter à Netlify
netlify login

# Déployer
netlify deploy --prod --dir=dist
```

### Méthode 3: Drag & Drop

1. Construire le projet localement:
   ```bash
   npm install
   npm run build
   ```

2. Glisser-déposer le dossier `dist` sur netlify.com

## 📁 Structure du Projet

```
nice-obf-netlify/
├── src/                        # Code source React
│   ├── components/             # Composants UI
│   ├── App.jsx                 # Application principale
│   └── main.jsx                # Point d'entrée
├── netlify/                    # Fonctions serverless
│   └── functions/
│       ├── obfuscate.js        # API d'obfuscation
│       └── health.js           # Health check
├── public/                     # Assets statiques
├── dist/                       # Build de production
├── netlify.toml                # Configuration Netlify
├── package.json                # Dépendances
└── README.md                   # Documentation
```

## ⚙️ Configuration Netlify

Le fichier `netlify.toml` configure automatiquement:

- **Build**: `npm run build` → `dist/`
- **Redirections**: `/api/*` → Fonctions serverless
- **SPA**: Toutes les routes → `index.html`
- **CORS**: Headers configurés pour l'API

## 🔌 API Endpoints

### Fonctions Serverless

- `POST /.netlify/functions/obfuscate` - Obfuscation de code
- `GET /.netlify/functions/health` - État de santé

### Utilisation

```javascript
// Obfuscation JavaScript
const response = await fetch('/api/obfuscate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    code: 'function hello() { console.log("Hello!"); }',
    type: 'javascript',
    options: {}
  })
});

const result = await response.json();
console.log(result.data.obfuscatedCode);
```

## 🛠️ Développement Local

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Tester les fonctions serverless localement
netlify dev
```

## 📦 Build de Production

```bash
# Construire pour la production
npm run build

# Prévisualiser le build
npm run preview
```

## 🔒 Sécurité

### Fonctions Serverless
- **CORS**: Configuré pour toutes les origines
- **Validation**: Vérification des entrées
- **Rate Limiting**: Géré par Netlify
- **HTTPS**: Automatique sur Netlify

### Limitations Netlify
- **Timeout**: 10 secondes par fonction
- **Payload**: 6MB maximum
- **Mémoire**: 1008MB par fonction
- **Exécutions**: 125,000/mois (plan gratuit)

## 🎨 Fonctionnalités

### ✨ Obfuscation
- **JavaScript**: Obfuscation avancée avec commentaire `// NICE-OBF`
- **CSS**: Minification avec commentaire `/* NICE-OBF */`
- **HTML**: Minification avec commentaire `<!-- NICE-OBF -->`

### 🎯 Interface
- **Responsive**: Mobile, tablette, desktop
- **Éditeurs Monaco**: Coloration syntaxique
- **Statistiques**: Temps, taille, ratio
- **Export**: Fichiers nommés `nice-obf.*`

## 🌐 URLs de Production

Après déploiement, votre application sera disponible sur:
- `https://your-site-name.netlify.app`
- Domaine personnalisé (optionnel)

## 📊 Monitoring

### Netlify Analytics
- Visites et pages vues
- Performances des fonctions
- Erreurs et logs

### Health Check
```bash
curl https://nice-obfs.netlify.app/api/health
```

## 🔄 CI/CD

Netlify déploie automatiquement à chaque push sur la branche principale:

1. **Build**: Installation des dépendances et build
2. **Deploy**: Déploiement des assets et fonctions
3. **DNS**: Mise à jour automatique
4. **CDN**: Distribution mondiale

## 🤝 Support

### Développeur
- **NICE-DEV**: +22603582906
- **Portfolio**: [https://nice-dev226.netlify.app/](https://nice-dev226.netlify.app/)

### Documentation
- [Netlify Docs](https://docs.netlify.com/)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)

## 📄 Licence

MIT License - Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

**Développé avec ❤️ par NICE-DEV**  
**Optimisé pour Netlify 🚀**

