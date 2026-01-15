/**
 * Génere le html Open Graph pour les réseaux sociaux
 * @param {Object} params - Paramètre de la page 
 * @returns {string} - HTML complet avec balises OG
 */
export function generateOgHtml({type, slug, title, description, image, url}) {
    return `<!DOCTYPE html>
        <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <!-- Open Graph / Facebook -->
                <meta property="og:type" content="website">
                <meta property="og:url" content="${url}">
                <meta property="og:title" content="${title}">
                <meta property="og:description" content="${description}">
                <meta property="og:image" content="${image}">

                <!-- Twitter -->
                <meta name="twitter:card" content="summary_large_image">
                <meta name="twitter:url" content="${url}">
                <meta name="twitter:title" content="${title}">
                <meta name="twitter:description" content="${description}">
                <meta name="twitter:image" content="${image}">
  
                <!-- WhatsApp -->
                <meta property="og:site_name" content="Wasabih">
                <meta property="og:locale" content="fr_FR">

                <title>${title}</title>
  
                <!-- Redirection automatique vers l'app -->
                <meta http-equiv="refresh" content="0; url=${url}">
            </head>
            <body>
                <h1>${title}</h1>
                <p>${description}</p>
                <p>Redirecting to Wasabih...</p>
            </body>        
        </html>`;
}