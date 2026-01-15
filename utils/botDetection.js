/**
 * Detects whether the User-Agent matches a social network bot
 * @param {string} userAgent - Le User-Agent de la requête
 * @returns {boolean} - true si c'est un bot false sinon
 */
export function isBot(userAgent) {
    if (!userAgent) return false

    const botPatterns = [
    'facebookexternalhit',
    'facebookcatalog',
    'linkedinbot',
    'twitterbot',
    'whatsapp',
    'slackbot',
    'telegrambot',
    'discordbot',
    'pinterest',
    'redditbot',
    'skypeuripreview',
    'outbrain',
    'quora link preview',
    'rogerbot',
    'showyoubot',
    'embedly',
    'tumblr',
    'bingpreview',
    'applebot',
    'googlebot'
  ];

  const lowerUserAgent = userAgent.toLowerCase();
  return botPatterns.some(pattern => lowerUserAgent.includes(pattern));
}