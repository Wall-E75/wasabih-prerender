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
    const originalHost = req.headers['x-original-host'] || process.env.MAIN_SITE_URL || 'wasabih.com';
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
        const { data: company, error } = await supabase
            .from("companies")
            .select("slug, name, description, logo_url, country, city")
            .eq("slug", slug)
            .single();

        if (error) {
            console.log("Supabase error: ", error.message);
            return res.status(500).send("Error fetching company");
        }

        if (!company) {
            console.log('Company not found');
            return res.status(404).send('Company not found');
        }

        console.log('✅ Company found:', company.name);
        // Construire la description enrichie
        let companyDescription = company.description || 'Company in the halal economy sector';

        // Enrichir avec la localisation si disponible
        if (company.city && company.country) {
            companyDescription = `${companyDescription} | Based in ${company.city}, ${company.country}`;
        } else if (company.country) {
            companyDescription = `${companyDescription} | Based in ${company.country}`;
        }

         //Générer le html Open Graph

        const html = generateOgHtml({
            type: 'companies',
            slug: company.slug,
            title: company.name,
            description: companyDescription,
            image: company.logo_url || process.env.DEFAULT_OG_IMAGE,
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