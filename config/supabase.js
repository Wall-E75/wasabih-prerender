import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Client Supabase
export const supabase = createClient(
  process.env.SUPABASE_URL || '',
  // SERVICE_ROLE_KEY si disponible, sinon ANON_KEY
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''
);

// Données mockées temporaires
export const mockData = {
  events: {
    'halal-expo-2025': {
      slug: 'halal-expo-2025',
      title: 'Halal Expo 2025 - London',
      description: 'Join us at the largest Halal economy event in Europe. Network with 500+ professionals.',
      image_url: 'https://wasabih.com/images/events/halal-expo-2025.jpg'
    },
    'mihas-2025': {
      slug: 'mihas-2025',
      title: 'MIHAS 2025 - Malaysia International Halal Showcase',
      description: 'The premier halal trade fair in Asia. Discover innovations in halal products and services.',
      image_url: 'https://wasabih.com/images/events/mihas-2025.jpg'
    }
  }
};