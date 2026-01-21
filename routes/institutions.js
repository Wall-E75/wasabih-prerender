import express from "express";
import { isBot } from "../utils/botDetection.js";
import { generateOgHtml } from "../utils/ogGenerator.js";
import { supabase } from "../config/supabase.js";

const router = express.Router();
/**
 * Route for institutions
 * GET /institution/:slug
 */
router.get('/:slug', async (req, res)=> {
    const userAgent = req.headers['user-agent'] || '';
    const originalHost = req.headers['x-original-host'] || process.env.MAIN_SITE_UR || 'wasabih.com';
    const { slug } = req.params;

    console.log('Request for /institutions/' + slug);
    console.log('Original host:', originalHost);
    console.log('User-Agent:', userAgent);

    // Si humain → rediriger vers Wasabih
    if (!isBot(userAgent)) {
        console.log('Human detected → redirect to Wasabih');
        const redirectUrl = `${originalHost.startsWith('http') ? originalHost : 'https://' + originalHost}/institutions/${slug}`;
        return res.redirect(302, redirectUrl);
    }

    console.log('Bot detected → generate OG HTML');

    try {
        // Fetch depuis supabase
        const { data: institution, error } = await supabase
            .from("institutions")
            .select("slug, name, description, logo_url, type, country_region")
            .eq("slug", slug)
            .single();

        if (error) {
            console.log("Supabase error: ", error.message);
            return res.status(500).send("Error fetching institution");
        }

        if (!institution) {
            console.log('Institution not found');
            return res.status(404).send('Institution not found');
        }

        console.log('Institution found:', institution.name);

        // / Construire la description enrichie
        let institutionDescription = institution.description || 'Institution in the halal economy sector';
    
        // Enrichir avec le type si disponible
        if (institution.type) {
            institutionDescription = `${institution.type} | ${institutionDescription}`;
        }
    
        // Enrichir avec la localisation si disponible
        if (institution.country_region) {
            institutionDescription = `${institutionDescription} | ${institution.country_region}`;
        }

         //Générer le html Open Graph

        const html = generateOgHtml({
            type: 'institutions',
            slug: institution.slug,
            title: institution.name,
            description: institutionDescription,
            image: institution.logo_url || process.env.DEFAULT_OG_IMAGE,
            url: `${originalHost.startsWith("http") ? originalHost : "https://" + originalHost}/institutions/${slug}`
        });

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.send(html);
    } catch (err) {
        console.log('Catch error:', err);
        return res.status(500).send('Server error');
    }
    
});

export default router;