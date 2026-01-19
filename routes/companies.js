import express from "express";
import { isBot } from "../utils/botDetection.js";
import { generateOgHtml } from "../utils/ogGenerator.js";
import { supabase } from "../config/supabase.js";

const router = express.Router();
/**
 * Route for companies
 * GET /companies/:slug
 */
router.get('/:slug', async (req, res)=> {
    const userAgent = req.headers['user-agent'] || '';
    const originalHost = req.headers['x-original-host'] || process.env.MAIN_SITE_UR || 'wasabih.com';
    const { slug } = req.params;

    console.log('Request for /companies/' + slug);
    console.log('Original host:', originalHost);
    console.log('User-Agent:', userAgent);

    // Si humain → rediriger vers Wasabih
    if (!isBot(userAgent)) {
        console.log('Human detected → redirect to Wasabih');
        const redirectUrl = `${originalHost.startsWith('http') ? originalHost : 'https://' + originalHost}/companies/${slug}`;
        return res.redirect(302, redirectUrl);
    }

    console.log('Bot detected → generate OG HTML');

    try {
        // Fetch depuis supabase
        const { data: companie, error } = await supabase
            .from("companies")
            .select("*")
            .eq("slug", slug)
            .single();

        if (error) {
            console.log("Supabase error: ", error.message);
            return res.status(500).send("Error fetching companie");
        }

        if (!companie) {
            console.log('Companie not found');
            return res.status(404).send('Companie not found');
        }

        console.log('✅ Companies found:', companie.title || companie.name);

         //Générer le html Open Graph

        const html = generateOgHtml({
            type: 'companies',
            slug: companie.slug,
            title: companie.title || companie.name,
            description: companie.description || "Companie on Wasabih",
            image: companie.image_url || companie.cover_image || process.env.DEFAULT_OG_IMAGE,
            url: `${originalHost.startsWith("http") ? originalHost : "https://" + originalHost}/companies/${slug}`
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