import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''
);

console.log('Tentative de connexion supabase ...');
console.log("URL: ", process.env.SUPABASE_URL);
console.log("Key Type: ", process.env.SUPABASE_SERVICE_ROLE_KEY ? "SERVICE_ROLE" : "ANON");
console.log('');

// ==========================
// TEST 1 :  EVENTS
// =========================
console.log("==== TABLE EVENTS ====");
try {
    const { data: events, error } = await supabase
        .from("events")
        .select("*")
        .limit(1)
        .single();

    if (error) {
        console.log('Erreur: ', error.message);
    } else if (events) {
        console.log('Connexion réussie !');
        console.log('Champs disponible: ', Object.keys(events));
        console.log('Exemple:', events);
        
    }
} catch (err) {
    console.error('Erreur: ', err.message);
}

console.log('\n');

// ==========================================
// TOUTES LES TABLES
// ==========================================
const tables = ['events', 'profiles', 'companies', 'insights', 'institutions'];

for (const table of tables) {
    console.log(`==== TABLE ${table.toUpperCase()} ====`);
    try {
        const { data, error } = await supabase
            .from(table)
            .select('*')
            .limit(1)
            .single()
    
        if (error) {
            console.log('Erreur : ', error)
        } else if (data) {
            console.log('Champs: ', Object.keys(data));
            console.log('Exemple: ', data);   
        }

    } catch (err) {
        console.error('Erreur: ', err);
        
    }
    console.log("");
};

console.log('Fin des tests');

// Après les tests des tables
console.log('\n📋 Slugs disponibles:');
const { data: profiles } = await supabase
  .from('profiles')
  .select('slug, full_name')
  .limit(5);

console.log(profiles);