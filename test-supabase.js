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

// Test: Lister les tables
const { data, error } = await supabase
    .from("events")
    .select("slug, title")
    .limit(5);

if (error) {
    console.log("Error : ", error.message);
} else {
    console.log("connexion réussie");
    console.log('Événements trouvés:', data.length);
    console.log(data);
    
};
// Test routes
// Events
// const { data: events } = await supabase.from("events").select("*").limit(1);
// console.log("Events: ", events);

// Profiles
// const { data: profiles } = await supabase.from("profiles").select("*").limit(1);
// console.log("People: ", profiles);

// Companies
const { data: companies } = await supabase.from("companies").select("*").limit(1);
console.log("Companies: ", companies);

// Insights
// const { data: insights } = await supabase.from('insights').select('*').limit(1);
// console.log('Insights:', insights);

// Institutions
// const { data: institutions } = await supabase.from('institutions').select('*').limit(1);
// console.log('Institutions:', institutions);


