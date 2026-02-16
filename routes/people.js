import express from 'express';
import { isBot } from '../utils/botDetection.js';
import { generateOgHtml } from '../utils/ogGenerator.js';
import { supabase } from '../config/supabase.js';

const router = express.Router();

/**
 * Route pour les profils personnes
 * GET /people/:slug
 * Table Supabase : profiles
 */
router.get('/:slug', async (req, res) => {
    const userAgent = req.headers['user-agent'] || '';
    const originalHost = req.headers['x-original-host'] || process.env.MAIN_SITE_URL || 'wasabih.com';
    const { slug } = req.params;

    console.log('Request for /people/' + slug);
    console.log('Original host:', originalHost);
    console.log('User-Agent:', userAgent);
  
    // Si humain → rediriger
    if (!isBot(userAgent)) {
        console.log('👤 Human detected → redirect');
        const redirectUrl = `${originalHost.startsWith('http') ? originalHost : 'https://' + originalHost}/people/${slug}`;
        return res.redirect(302, redirectUrl);
    }
    
    console.log('Bot detected → generate OG HTML');
  
    try {
        // Fetch depuis Supabase (table = profiles, pas people !)
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('slug, full_name, country, headline, bio, professional_role, organization, avatar_url')
            .eq('slug', slug)
            .single();
        
        if (error) {
            console.log('Supabase error:', error.message);
            return res.status(500).send('Error fetching profile');
        }
        
        if (!profile) {
            console.log('Profile not found');
            return res.status(404).send('Profile not found');
        }
        
        console.log('Profile found:', profile.full_name);
        
        // Construire le titre
        // Format: "Nom - Titre professionnel"
        const profileTitle = profile.full_name || 'Professional on Wasabih';
        const titleWithRole = profile.headline ? `${profileTitle} - ${profile.headline}` : profileTitle
        
        // Construire la description
        const profileDescription = 
            profile.bio || 
            profile.headline || 
            profile.professional_role || 
            profile.title ||
            (profile.organization ? `Professional at ${profile.organization}` : null ) || 
            'Professional in the halal economy sector'
        
        // Générer le HTML Open Graph
        const html = generateOgHtml({
        type: 'people',  
        slug: profile.slug,
        title: titleWithRole,
        description: profileDescription,
        image: profile.avatar_url || process.env.DEFAULT_OG_IMAGE,
        url: `${originalHost.startsWith('http') ? originalHost : 'https://' + originalHost}/people/${slug}`
        });
        
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.send(html);
        
    } catch (err) {
        console.log('❌ Catch error:', err);
        return res.status(500).send('Server error');
    }
});

export default router;