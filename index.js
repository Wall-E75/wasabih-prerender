import express from 'express';
import dotenv from 'dotenv';
import eventsRouter from './routes/events.js';
import peopleRouter from './routes/people.js';
import companiesRouter from './routes/companies.js';
import { isBot } from './utils/botDetection.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// ROUTES DE TEST
// ==========================================

app.get('/', (req, res) => {
  res.json({
    message: 'Wasabih Prerender Server',
    status: 'running',
    version: '2.0.0',
    architecture: 'modular',
    endpoints: {
      events: '/events/:slug',
      people: '/people/:slug',
      companies: '/companies/:slug',
      debug: '/debug',
      test_bot: '/test-bot'
    }
  });
});

app.get('/debug', (req, res) => {
  const userAgent = req.headers['user-agent'] || '';

  res.json({
    userAgent: userAgent,
    isBot: isBot(userAgent),
    allHeaders: req.headers
  });
});

app.get('/test-bot', (req, res) => {
  const botType = req.query.bot || 'facebook';
  
  const testBots = {
    facebook: 'facebookexternalhit/1.1',
    linkedin: 'LinkedInBot/1.0',
    twitter: 'Twitterbot/1.0',
    whatsapp: 'WhatsApp/2.0'
  };
  
  const testUserAgent = testBots[botType] || testBots.facebook;
  
  res.json({
    testBot: botType,
    userAgent: testUserAgent,
    isDetected: isBot(testUserAgent),
    message: `Ce User-Agent ${isBot(testUserAgent) ? 'SERAIT' : 'NE SERAIT PAS'} détecté comme bot`
  });
});

// ==========================================
// ROUTES PRINCIPALES
// ==========================================

app.use('/events', eventsRouter);
app.use('/people', peopleRouter);
app.use('/companies', companiesRouter);

// ==========================================
// DÉMARRAGE SERVEUR
// ==========================================

app.listen(PORT, () => {
  console.log('');
  console.log('Wasabih Prerender Server v2.0');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Running on: http://localhost:${PORT}`);
  console.log('');
  console.log('Architecture: Modular (routes séparées)');
  console.log('');
  console.log('Test endpoints:');
  console.log(`   • Homepage:     http://localhost:${PORT}/`);
  console.log(`   • Debug:        http://localhost:${PORT}/debug`);
  console.log(`   • Test bot:     http://localhost:${PORT}/test-bot`);
  console.log('');
  console.log('Main routes:');
  console.log(`   • Events:       http://localhost:${PORT}/events/:slug`);
  console.log(`   • People:       http://localhost:${PORT}/people/:slug`);
  console.log(`   • Companies:    http://localhost:${PORT}/companies/:slug`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
});