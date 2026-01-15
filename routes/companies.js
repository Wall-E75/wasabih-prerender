import express from 'express';
import { isBot } from '../utils/botDetection.js';
import { generateOgHtml } from '../utils/ogGenerator.js';

const router = express.Router();

/**
 * Route pour les entreprises
 * GET /companies/:slug
 */
router.get('/:slug', async (req, res) => {
    const userAgent = req.headers['user-agent'] || '';
    const originalHost = req.headers['x-original-host'] || 'wasabih.com';
    const { slug } = req.params;

    console.log('Request for /companies/' + slug);

    if (!isBot(userAgent)) {
        console.log('Human detected → redirect');
        return res.redirect(302, `https://${originalHost}/companies/${slug}`);
    }
  
    console.log('Bot detected → generate OG HTML');
  
    // TODO: Remplacer par Supabase
    const mockCompany = {
        slug: slug,
        name: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        description: 'Company in the halal economy sector',
        image_url: `https://${originalHost}/images/companies/${slug}.jpg`
    };
  
    const html = generateOgHtml({
        type: 'companies',
        slug: mockCompany.slug,
        title: mockCompany.name,
        description: mockCompany.description,
        image: mockCompany.image_url,
        url: `https://${originalHost}/companies/${slug}`
    });
  
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(html);
});

export default router;