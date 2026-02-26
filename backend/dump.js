import { API } from 'mrivals';
import fs from 'fs';

async function dumpStats() {
    try {
        const user = await API.fetchUser('Tron47', { useCurl: true });

        fs.writeFileSync('dev_dump.json', JSON.stringify({
            info: user.info(),
            overview: user.overview(),
            heroes: user.heroes()
        }, null, 2));
        console.log("Dumped to dev_dump.json");
    } catch (e) {
        console.error(e);
    }
}

dumpStats();
