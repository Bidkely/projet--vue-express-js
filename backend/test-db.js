
const db = require('./config/db');
async function test() {
    try {
        const [rows] = await db.query('SELECT * FROM clients_bancaires');
        console.log('✅ Connexion réussie !');
        console.table(rows);
    } catch(err) {
        console.error('❌ Erreur:', err.message);
    }
}
test();