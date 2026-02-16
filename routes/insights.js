import express from "express";
import { isBot } from "../utils/botDetection.js";
import { generateOgHtml } from "../utils/ogGenerator.js";
import { supabase } from "../config/supabase.js";

const router = express.Router();
/**
 * Route for insights
 * GET /event/:slug
 */
router.get('/:slug', async (req, res)=> {
    const userAgent = req.headers['user-agent'] || '';
    const originalHost = req.headers['x-original-host'] || process.env.MAIN_SITE_URL || 'wasabih.com';
    const { slug } = req.params;

    console.log('Request for /insights/' + slug);
    console.log('Original host:', originalHost);
    console.log('User-Agent:', userAgent);

    // Si humain → rediriger vers Wasabih
    if (!isBot(userAgent)) {
        console.log('Human detected → redirect to Wasabih');
        const redirectUrl = `${originalHost.startsWith('http') ? originalHost : 'https://' + originalHost}/insights/${slug}`;
        return res.redirect(302, redirectUrl);
    }

    console.log('Bot detected → generate OG HTML');

    try {
        // Fetch depuis supabase
        const { data: insight, error } = await supabase
            .from("insights")
            .select('slug, title, summary, featured_image_url, category, author, publish_date')
            .eq("slug", slug)
            .single();

        if (error) {
            console.log("Supabase error: ", error.message);
            return res.status(500).send("Error fetching insights");
        }

        if (!insight) {
            console.log('Insight not found');
            return res.status(404).send('Insight not found');
        }

        console.log('Insight found:', insight.title);

        // Construire la description enrichie
        let insightDescription = insight.summary || 'Insight on Wasabih';
        
        // Enrichir avec l'auteur si disponible
        if (insight.author) {
            insightDescription = `By ${insight.author} | ${insightDescription}`;
        }
        
        // Enrichir avec la catégorie si disponible
        if (insight.category) {
            insightDescription = `${insightDescription} | ${insight.category}`;
        }

         //Générer le html Open Graph

        const html = generateOgHtml({
            type: 'insights',
            slug: insight.slug,
            title: insight.title,
            description: insightDescription,
            image: insight.featured_image_url || process.env.DEFAULT_OG_IMAGE,
            url: `${originalHost.startsWith("http") ? originalHost : "https://" + originalHost}/insights/${slug}`
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