import { API } from 'mrivals';
import fs from 'fs';

async function testHeroes() {
    try {
        const user = await API.fetchUser('Tron47', { useCurl: true });
        fs.writeFileSync('heroes.json', JSON.stringify(user.heroes(), null, 2));
        console.log("Saved to heroes.json");
    } catch (e) {
        console.error("Error formatting heroes:", e);
    }
}
testHeroes();
