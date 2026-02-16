/**
 * Génère le HTML Open Graph pour les réseaux sociaux
 * @param {Object} params - Paramètres de la page
 * @returns {string} - HTML complet avec balises OG
 */
export function generateOgHtml({ type, slug, title, description, image, url }) {
    // Échapper les caractères spéciaux pour éviter les injections
    const escapeHtml = (str) => {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    };

    const safeTitle = escapeHtml(title);
    const safeDescription = escapeHtml(description);
    const safeImage = escapeHtml(image);
    const safeUrl = escapeHtml(url);

    return `<!DOCTYPE html>
        <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                
                <!-- Open Graph / Facebook -->
                <meta property="og:type" content="website">
                <meta property="og:url" content="${safeUrl}">
                <meta property="og:title" content="${safeTitle}">
                <meta property="og:description" content="${safeDescription}">
                <meta property="og:image" content="${safeImage}">
                <meta property="og:image:type" content="${safeImage.match(/\\.jpe?g/i) ? 'image/jpeg' : safeImage.match(/\\.webp/i) ? 'image/webp' : 'image/png'}">
                
                <!-- Twitter -->
                <meta name="twitter:card" content="summary_large_image">
                <meta name="twitter:url" content="${safeUrl}">
                <meta name="twitter:title" content="${safeTitle}">
                <meta name="twitter:description" content="${safeDescription}">
                <meta name="twitter:image" content="${safeImage}">
                
                <!-- Telegram -->
                <meta name="telegram:card" content="summary_large_image">
                <meta property="og:image:width" content="1200">
                <meta property="og:image:height" content="630">

                <!-- WhatsApp -->
                <meta property="og:site_name" content="Wasabih">
                <meta property="og:locale" content="fr_FR">
                
                <title>${safeTitle}</title>
                
                <!-- Redirection automatique vers l'app -->
                <meta http-equiv="refresh" content="2; url=${safeUrl}">
            </head>
            <body>
                <h1>${safeTitle}</h1>
                <p>${safeDescription}</p>
                <p>Redirecting to Wasabih...</p>
            </body>
        </html>`;
}