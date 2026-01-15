import express from "express";
import { isBot } from "../utils/botDetection.js";
import { generateOgHtml } from "../utils/ogGenerator.js";
import { mockData } from "../config/supabase.js";

const router = express.Router();
/**
 * Route for events
 * GET /event/:slug
 */
router.get('/:slug', async (req, res)=> {
    const userAgent = req.headers['user-agent'] || '';
    const originalHost = req.headers['x-original-host'] || 'wasabih.com';
    const { slug } = req.params;

    console.log('Request for /events/' + slug);
    console.log('Original host:', originalHost);
    console.log('User-Agent:', userAgent);

    // Si humain → rediriger vers Wasabih
    if (!isBot(userAgent)) {
        console.log('Human detected → redirect to Wasabih');
        return res.redirect(302, `https://${originalHost}/events/${slug}`);
    }

    console.log('Bot detected → generate OG HTML');

    // Récupérer l'événement (mockData pour l'instant)
    const event = mockData.events[slug];
  
    if (!event) {
        console.log('Event not found');
        return res.status(404).send('Event not found');
    }
  
    console.log('✅ Event found:', event.title);

    //Générer le html Open Graph

    const html = generateOgHtml({
        type: 'events',
        slug: event.slug,
        title: event.title,
        description: event.description,
        image: event.image_url,
        url: `https://${originalHost}/events/${slug}`
    });

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(html);
});

export default router;