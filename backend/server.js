import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import { API } from 'mrivals';
import NodeCache from 'node-cache';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

// Restrict CORS to the frontend domain
app.use(cors({
    origin: ['http://localhost:5001', 'http://192.168.1.97:5001', 'http://127.0.0.1:5001']
}));

// Initialize cache with a simple 5-minute TTL (Time to Live)
const statsCache = new NodeCache({ stdTTL: 300 });

// Simple hash to consistently color heroes
const getHeroColor = (name) => {
    const defaultColors = ['#E63946', '#7B2CBF', '#A8DADC', '#457B9D', '#1D3557', '#F4A261', '#E76F51', '#2A9D8F'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return defaultColors[Math.abs(hash) % defaultColors.length];
};

app.get('/api/stats/:uid', async (req, res) => {
    try {
        const uid = req.params.uid;

        // Input Validation: Ensure uid only contains alphanumeric characters, dashes or underscores
        // This prevents potential injection attacks down the line if useCurl executes a shell command.
        if (!/^[a-zA-Z0-9_-]+$/.test(uid)) {
            return res.status(400).json({ error: "Invalid User ID format." });
        }

        // The default app UID is a numeric ID, but mrivals uses text usernames (e.g. Tron47)
        // If the query is the numeric UID from App.tsx, we mock the real mapping here: 
        const username = uid === "453160654" ? "Tron47" : uid;

        // 1. Check if the player stats are already in the cache
        const cachedData = statsCache.get(username);
        if (cachedData) {
            console.log(`[CACHE HIT] Returning cached stats for ${username}`);
            return res.json(cachedData);
        }

        console.log(`[CACHE MISS] Fetching fresh stats for ${username} from TRNetwork...`);
        // Fetch using mrivals without curl to prevent native exec crashes in cloud environments
        const user = await API.fetchUser(username);
        const info = user.info();
        const heroesObj = user.heroes();

        const heroRolesMap = {
            "Captain America": "Vanguard", "Doctor Strange": "Vanguard", "Groot": "Vanguard",
            "Hulk": "Vanguard", "Magneto": "Vanguard", "Peni Parker": "Vanguard",
            "Thor": "Vanguard", "Venom": "Vanguard", "Angela": "Vanguard",
            "Black Panther": "Duelist", "Black Widow": "Duelist", "Blade": "Duelist",
            "Hawkeye": "Duelist", "Hela": "Duelist", "Iron Fist": "Duelist",
            "Iron Man": "Duelist", "Magik": "Duelist", "Moon Knight": "Duelist",
            "Namor": "Duelist", "Psylocke": "Duelist", "Scarlet Witch": "Duelist",
            "Spider-Man": "Duelist", "Squirrel Girl": "Duelist", "Star-Lord": "Duelist",
            "Storm": "Duelist", "The Punisher": "Duelist", "Winter Soldier": "Duelist",
            "Wolverine": "Duelist", "Elsa Bloodstone": "Duelist", "Mister Fantastic": "Vanguard",
            "The Thing": "Vanguard", "Emma Frost": "Vanguard", "Rogue": "Duelist", "Gambit": "Duelist",
            "Adam Warlock": "Strategist", "Cloak & Dagger": "Strategist", "Jeff The Land Shark": "Strategist",
            "Loki": "Strategist", "Luna Snow": "Strategist", "Mantis": "Strategist",
            "Rocket Raccoon": "Strategist", "Invisible Woman": "Strategist"
        };

        const allHeroes = Object.entries(heroesObj)
            .sort((a, b) => b[1].timePlayed - a[1].timePlayed)
            .map(([name, stats]) => {
                let role = heroRolesMap[name] || "Hero";

                // If mrivals appends (Strategist) etc to a name, extract it and use it
                if (name.includes('(Strategist)')) role = 'Strategist';
                else if (name.includes('(Vanguard)')) role = 'Vanguard';
                else if (name.includes('(Duelist)')) role = 'Duelist';

                return {
                    name: name, // Keep the suffix so we don't cause duplicate keys
                    role: role,
                    winRate: (stats.matchesWinPct || 0).toFixed(1),
                    kda: (stats.kdaRatio || 0).toFixed(2),
                    color: getHeroColor(name)
                };
            });

        const overview = user.overview();

        const responseData = {
            uid: uid,
            rank: info.rank || "Unranked",
            overview: {
                matchesPlayed: overview.matchesPlayed,
                winRate: overview.matchesWinPct.toFixed(1),
                kda: overview.kdaRatio.toFixed(2),
                kills: overview.kills,
                assists: overview.assists,
                deaths: overview.deaths,
                damagePerMin: overview.totalHeroDamagePerMinute,
                healPerMin: overview.totalHeroHealPerMinute,
                damageAbsorbedPerMin: overview.totalDamageTakenPerMinute,
                headshots: overview.headKills,
                soloKills: overview.soloKills,
                killstreak: overview.maxContinueKills,
                accuracy: overview.mainAttacks > 0 ? ((overview.mainAttackHits / overview.mainAttacks) * 100).toFixed(1) : "0.0",
                mvpRate: overview.totalMvpPct.toFixed(1),
                svpRate: overview.totalSvpPct.toFixed(1)
            },
            topHeroes: allHeroes.slice(0, 4),
            allHeroes: allHeroes
        };

        // 2. Save the mapped response in memory cache
        statsCache.set(username, responseData);

        res.json(responseData);
    } catch (err) {
        console.error("Error fetching for UID:", req.params.uid, err.message || err);
        res.status(500).json({ error: "Failed to fetch Marvel Rivals live data" });
    }
});

// Serve frontend static files in production
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Catch-all route for SPA client-side routing
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

app.listen(PORT, HOST, () => {
    console.log(`Backend server listening at http://${HOST}:${PORT}`);
});
