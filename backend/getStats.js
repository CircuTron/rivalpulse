const { API } = require('mrivals');

async function getStats() {
    try {
        const username = 'Tron47';
        // Options used: useCurl true to bypass potential cloudflare fetch blocks from TRNetwork.
        const user = await API.fetchUser(username, { useCurl: true });

        const overview = user.overview();
        const info = user.info();

        console.log(`-----------------------------------`);
        console.log(`   Marvel Rivals Stats`);
        console.log(`-----------------------------------`);
        console.log(`Username     : ${username}`);
        console.log(`Total Wins   : ${overview.matchesWon}`);
        console.log(`KDA          : ${overview.kdaRatio}`);
        console.log(`Current Rank : ${info.rank}`);
        console.log(`-----------------------------------`);

    } catch (err) {
        console.error("Error fetching stats:", err.message || err);
    }
}

getStats();
