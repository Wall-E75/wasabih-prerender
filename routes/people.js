import express from 'express';
import { isBot } from '../utils/botDetection.js';
import { generateOgHtml } from '../utils/ogGenerator.js';

const router = express.Router();

/**
 * Route pour les profils personnes
 * GET /people/:slug
 */
router.get('/:slug', async (req, res) => {
    const userAgent = req.headers['user-agent'] || '';
    const originalHost = req.headers['x-original-host'] || 'wasabih.com';
    const { slug } = req.params;
  
    console.log('Request for /people/' + slug);
  
    if (!isBot(userAgent)) {
            console.log('👤 Human detected → redirect');
            return res.redirect(302, `https://${originalHost}/people/${slug}`);
    }
  
    console.log('Bot detected → generate OG HTML');
  
    // TODO: Remplacer par Supabase
    const mockPerson = {
        slug: slug,
        name: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        title: 'Halal Business Professional',
        description: 'Professional in the halal economy sector',
        image_url: `https://${originalHost}/images/people/${slug}.jpg`
    };
  
    const html = generateOgHtml({
        type: 'people',
        slug: mockPerson.slug,
        title: `${mockPerson.name} - ${mockPerson.title}`,
        description: mockPerson.description,
        image: mockPerson.image_url,
        url: `https://${originalHost}/people/${slug}`
    });
  
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(html);
});

export default router;