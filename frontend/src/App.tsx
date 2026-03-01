import React, { useState, useMemo } from 'react';
import { Target, Trophy, Swords, Shield, HeartPulse, Activity, Medal, Crosshair, BarChart3, Terminal, Search } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const HeroCard = React.memo(({ name, role, winRate, kda }: any) => {
  const getRoleIcon = () => {
    switch (role) {
      case 'Vanguard': return <Shield size={12} className="mr-2" />;
      case 'Strategist': return <HeartPulse size={12} className="mr-2" />;
      case 'Duelist': return <Swords size={12} className="mr-2" />;
      default: return <Target size={12} className="mr-2" />;
    }
  };

  return (
    <div className="group relative bg-black border border-cyan-900 p-3 h-full flex flex-col justify-between transition-all hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]">
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-500"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500"></div>

      <div className="mb-4">
        <h2 className="text-lg font-mono font-bold uppercase text-white tracking-widest truncate">{name}</h2>
        <div className="flex items-center text-[10px] font-mono uppercase tracking-widest text-cyan-500 mt-1">
          {getRoleIcon()} <span className="opacity-70">CLASS://{role}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-auto">
        <div className="bg-cyan-950/30 p-2 border-l-2 border-emerald-500">
          <p className="text-[9px] text-emerald-500/70 font-mono tracking-widest mb-1">WIN_RATE</p>
          <p className="text-base font-mono font-bold text-emerald-400">{winRate}%</p>
        </div>
        <div className="bg-cyan-950/30 p-2 border-l-2 border-red-500">
          <p className="text-[9px] text-red-500/70 font-mono tracking-widest mb-1">K.D.A</p>
          <p className="text-base font-mono font-bold text-red-400">{kda}</p>
        </div>
      </div>
    </div>
  );
});

const RosterDatabank = React.memo(({ allHeroes }: { allHeroes: any[] }) => {
  const [heroQuery, setHeroQuery] = useState("");

  const filteredHeroes = useMemo(() => {
    if (!allHeroes) return [];
    if (!heroQuery) return allHeroes;
    return allHeroes.filter((h: any) => h.name.toLowerCase().includes(heroQuery.toLowerCase()));
  }, [allHeroes, heroQuery]);

  return (
    <div className="col-span-1 lg:col-span-12 mt-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4 flex-1">
          <h2 className="text-sm font-bold uppercase text-amber-500 tracking-widest border-b-2 border-amber-500 pb-1">FULL_ROSTER_DATABANK</h2>
          <div className="flex-1 h-px bg-amber-900"></div>
        </div>
        <div className="relative w-full md:w-[300px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-600" />
          <input
            type="text"
            value={heroQuery}
            onChange={(e) => setHeroQuery(e.target.value)}
            placeholder="QUERY_OPERATIVE..."
            className="bg-black border border-cyan-900 text-cyan-300 pl-9 pr-4 py-2 w-full text-xs uppercase tracking-widest outline-none transition-colors focus:border-cyan-400 placeholder-cyan-900"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {filteredHeroes.map((hero: any, idx: number) => (
          <div key={hero.name} className="animate-in fade-in zoom-in-95 duration-200 fill-mode-both" style={{ animationDelay: `${(idx % 12) * 50}ms` }}>
            <div className="bg-black border border-cyan-900/50 p-3 h-full flex flex-col justify-between hover:border-cyan-500 transition-colors">
              <div>
                <h3 className="text-xs font-bold text-white uppercase truncate" title={hero.name}>{hero.name}</h3>
                <p className="text-[9px] text-cyan-600 uppercase tracking-widest mt-1">{hero.role}</p>
              </div>
              <div className="mt-4 flex justify-between items-end">
                <div>
                  <p className="text-[8px] text-emerald-700 tracking-widest">WIN_RT</p>
                  <p className="text-sm font-bold text-emerald-500">{hero.winRate}%</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] text-red-700 tracking-widest">KDA</p>
                  <p className="text-sm font-bold text-red-500">{hero.kda}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredHeroes.length === 0 && (
          <div className="col-span-full py-8 text-center border border-dashed border-cyan-900">
            <p className="text-cyan-700 text-xs font-bold tracking-widest uppercase">NO_TARGETS_FOUND</p>
          </div>
        )}
      </div>
    </div>
  );
});

// Custom tooltip for the Recharts graph
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-black border border-cyan-500 p-2 text-xs font-mono shadow-[0_0_10px_rgba(34,211,238,0.2)]">
        <p className="text-cyan-400 uppercase font-bold mb-1">&gt; {data.name}</p>
        <p className="text-emerald-400">WIN_RATE: {data.winRate}%</p>
      </div>
    );
  }
  return null;
};

export default function App() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState("Tron47");

  const fetchMyStats = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const safeUsername = encodeURIComponent(username.trim());
      // In development, the Vite server proxies or hits port 5000 directly.
      // In production, the Node backend serves both the API and the React files from the same origin.
      const baseUrl = import.meta.env.DEV ? 'http://127.0.0.1:5000' : '';
      const response = await fetch(`${baseUrl}/api/stats/${safeUsername}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch player stats.");
      }
      setStats(data);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Target not found.");
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black p-4 md:p-6 font-mono text-cyan-500 selection:bg-cyan-500/30 overflow-x-hidden relative antialiased leading-relaxed">

      {/* Scanline Overlay */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-50 mix-blend-overlay opacity-15"></div>

      <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col gap-4">

        {/* Header HUD */}
        <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b-2 border-cyan-900 pb-4">
          <div className="flex items-end gap-4 w-full md:w-auto">
            <div className="h-12 w-12 border-2 border-cyan-500 flex items-center justify-center bg-cyan-950/20 text-cyan-400 shrink-0">
              <Terminal size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold uppercase tracking-widest text-cyan-400 leading-none mb-1">
                Rivals_Pulse
              </h1>
              <p className="text-cyan-500 text-[10px] tracking-[0.4em] uppercase">SYSTEM.ANALYSIS.TERMINAL // V.1.0.4</p>
            </div>
          </div>

          <form onSubmit={fetchMyStats} className="flex w-full md:w-auto gap-2">
            <div className="relative w-full sm:w-[300px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-600 text-sm">&gt;</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="INPUT_TARGET_ID"
                className="bg-black border border-cyan-900 text-cyan-300 pl-8 pr-4 py-2 w-full text-sm uppercase tracking-widest outline-none transition-colors focus:border-cyan-400 placeholder-cyan-900"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-cyan-950/50 border border-cyan-700 text-cyan-300 px-6 font-bold text-sm uppercase tracking-widest hover:bg-cyan-900 hover:text-cyan-100 transition-colors disabled:opacity-50"
            >
              {loading ? "EXE..." : "EXE"}
            </button>
          </form>
        </header>

        {error && (
          <div className="p-3 border border-red-500 bg-red-950/20 text-red-400 text-xs tracking-widest flex items-center gap-2 uppercase">
            <span className="bg-red-500 text-black px-1 font-bold">ERR</span> {error}
          </div>
        )}

        {/* Dashboard Content */}
        {stats && !error ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 animate-in fade-in zoom-in-95 duration-300">

            {/* Top Row: Account Overview */}
            <div className="col-span-1 lg:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-black border border-cyan-900 p-4 relative group hover:border-cyan-500 transition-colors">
                <div className="absolute top-0 right-0 p-1 bg-cyan-900/50 text-cyan-300 text-[8px] font-bold tracking-widest">R.01</div>
                <p className="text-[10px] text-cyan-500 uppercase tracking-widest mb-1">CRNT_RANK</p>
                <p className="text-2xl font-bold text-cyan-300">{stats.rank}</p>
              </div>

              <div className="bg-black border border-cyan-900 p-4 relative group hover:border-cyan-500 transition-colors">
                <div className="absolute top-0 right-0 p-1 bg-cyan-900/50 text-cyan-300 text-[8px] font-bold tracking-widest">M.02</div>
                <p className="text-[10px] text-cyan-500 uppercase tracking-widest mb-1">MATCHES_PLAYED</p>
                <p className="text-2xl font-bold text-cyan-300">{stats.overview.matchesPlayed}</p>
              </div>

              <div className="bg-black border border-emerald-900 p-4 relative group hover:border-emerald-500 transition-colors">
                <div className="absolute top-0 right-0 p-1 bg-emerald-900/50 text-emerald-300 text-[8px] font-bold tracking-widest">W.03</div>
                <p className="text-[10px] text-emerald-500 uppercase tracking-widest mb-1">GLOBAL_WIN_RT</p>
                <p className="text-2xl font-bold text-emerald-400">{stats.overview.winRate}%</p>
              </div>

              <div className="bg-black border border-red-900 p-4 relative group hover:border-red-500 transition-colors">
                <div className="absolute top-0 right-0 p-1 bg-red-900/50 text-red-300 text-[8px] font-bold tracking-widest">K.04</div>
                <p className="text-[10px] text-red-500 uppercase tracking-widest mb-1">GLOBAL_K.D.A</p>
                <p className="text-2xl font-bold text-red-400">{stats.overview.kda}</p>
              </div>
            </div>

            {/* Middle Row Left: Graphical Chart */}
            <div className="col-span-1 lg:col-span-8 bg-black border border-cyan-900 p-4 flex flex-col min-h-[350px] relative">
              <div className="absolute top-0 left-0 p-1 bg-cyan-900/50 text-cyan-300 text-[8px] font-bold tracking-widest">VIZ_MODULE_A</div>
              <div className="flex items-center justify-between mb-6 mt-2 border-b border-cyan-900/50 pb-2">
                <h2 className="text-xs font-bold text-cyan-500 uppercase tracking-widest flex items-center gap-2">
                  <BarChart3 size={14} /> OPERATIVE_WIN_MATRIX
                </h2>
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-cyan-500 animate-pulse"></span>
                  <span className="w-1.5 h-1.5 bg-cyan-700 group-hover:bg-cyan-400 transition-colors"></span>
                </div>
              </div>

              <div className="w-full flex-1">
                <ResponsiveContainer width="99%" height="100%">
                  <BarChart data={stats.topHeroes} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <XAxis
                      dataKey="name"
                      stroke="#0e7490"
                      tick={{ fill: '#0891b2', fontSize: 9, fontFamily: 'monospace' }}
                      axisLine={{ stroke: '#164e63' }}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(6,182,212,0.1)' }} />
                    <Bar dataKey="winRate" maxBarSize={40}>
                      {stats.topHeroes.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color || '#06b6d4'} stroke={entry.color || '#06b6d4'} fillOpacity={0.5} strokeWidth={1} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Middle Row Right: Combat Telemetry */}
            <div className="col-span-1 lg:col-span-4 bg-black border border-cyan-900 p-4 flex flex-col relative">
              <div className="absolute top-0 left-0 p-1 bg-cyan-900/50 text-cyan-300 text-[8px] font-bold tracking-widest">DAT_MODULE_B</div>
              <h2 className="text-xs font-bold text-cyan-500 uppercase tracking-widest flex items-center gap-2 mb-4 mt-2 border-b border-cyan-900/50 pb-2">
                <Activity size={14} /> RAW_TELEMETRY
              </h2>

              <div className="flex-1 flex flex-col gap-2">
                <div className="bg-cyan-950/20 px-3 py-2 border-l border-cyan-700 flex justify-between items-center group hover:border-cyan-400 transition-colors">
                  <span className="text-[10px] uppercase text-cyan-600 tracking-widest">TTL_KILLS</span>
                  <span className="text-sm font-bold text-cyan-300">{stats.overview.kills}</span>
                </div>
                <div className="bg-cyan-950/20 px-3 py-2 border-l border-amber-700 flex justify-between items-center group hover:border-amber-400 transition-colors">
                  <span className="text-[10px] uppercase text-amber-600/70 tracking-widest">SOLO_KILLS</span>
                  <span className="text-sm font-bold text-amber-500">{stats.overview.soloKills}</span>
                </div>
                <div className="bg-cyan-950/20 px-3 py-2 border-l border-blue-700 flex justify-between items-center group hover:border-blue-400 transition-colors">
                  <span className="text-[10px] uppercase text-blue-600/70 tracking-widest">TTL_ASSISTS</span>
                  <span className="text-sm font-bold text-blue-400">{stats.overview.assists}</span>
                </div>
                <div className="bg-cyan-950/20 px-3 py-2 border-l border-red-700 flex justify-between items-center group hover:border-red-400 transition-colors">
                  <span className="text-[10px] uppercase text-red-600/70 tracking-widest">TTL_DEATHS</span>
                  <span className="text-sm font-bold text-red-400">{stats.overview.deaths}</span>
                </div>
              </div>
            </div>

            {/* Role Performance Matrix (Dense Horizontal) */}
            <div className="col-span-1 lg:col-span-12 bg-black border border-cyan-900 p-4 relative">
              <div className="absolute top-0 left-0 p-1 bg-cyan-900/50 text-cyan-300 text-[8px] font-bold tracking-widest">DAT_MODULE_C</div>
              <h2 className="text-xs font-bold text-cyan-500 uppercase tracking-widest flex items-center gap-2 mb-4 mt-2 border-b border-cyan-900/50 pb-2">
                <Crosshair size={14} /> ROLE_UTILITY_MATRIX
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-950/10 p-4 border border-red-900 flex items-center gap-4 hover:border-red-500 transition-colors">
                  <div className="p-2 bg-red-900/30 text-red-500"><Swords size={20} /></div>
                  <div>
                    <p className="text-[9px] text-red-700 tracking-widest mb-1">DMG_OUTPUT/MIN</p>
                    <p className="text-2xl font-bold text-red-400">{stats.overview.damagePerMin}</p>
                  </div>
                </div>
                <div className="bg-emerald-950/10 p-4 border border-emerald-900 flex items-center gap-4 hover:border-emerald-500 transition-colors">
                  <div className="p-2 bg-emerald-900/30 text-emerald-500"><HeartPulse size={20} /></div>
                  <div>
                    <p className="text-[9px] text-emerald-700 tracking-widest mb-1">HLG_OUPUT/MIN</p>
                    <p className="text-2xl font-bold text-emerald-400">{stats.overview.healPerMin}</p>
                  </div>
                </div>
                <div className="bg-blue-950/10 p-4 border border-blue-900 flex items-center gap-4 hover:border-blue-500 transition-colors">
                  <div className="p-2 bg-blue-900/30 text-blue-500"><Shield size={20} /></div>
                  <div>
                    <p className="text-[9px] text-blue-700 tracking-widest mb-1">DMG_ABSORBED/MIN</p>
                    <p className="text-2xl font-bold text-blue-400">{stats.overview.damageAbsorbedPerMin}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Combat Effectiveness & Match Awards Row */}
            <div className="col-span-1 lg:col-span-8 bg-black border border-cyan-900 p-4 relative">
              <div className="absolute top-0 left-0 p-1 bg-cyan-900/50 text-cyan-300 text-[8px] font-bold tracking-widest">DAT_MODULE_D</div>
              <h2 className="text-xs font-bold text-cyan-500 uppercase tracking-widest flex items-center gap-2 mb-4 mt-2 border-b border-cyan-900/50 pb-2">
                <Target size={14} /> COMBAT_EFFICACY
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-cyan-950/20 p-4 border-t-2 border-cyan-600 flex flex-col justify-center items-center">
                  <span className="text-[9px] text-cyan-600 uppercase tracking-widest mb-2 flex items-center gap-1"><Crosshair size={10} /> GLBL_ACCURACY</span>
                  <span className="text-xl font-bold text-cyan-300">{stats.overview.accuracy}%</span>
                </div>
                <div className="bg-red-950/20 p-4 border-t-2 border-red-600 flex flex-col justify-center items-center">
                  <span className="text-[9px] text-red-600 uppercase tracking-widest mb-2 flex items-center gap-1"><Target size={10} /> HEADSHOT_ELIMS</span>
                  <span className="text-xl font-bold text-red-400">{stats.overview.headshots}</span>
                </div>
                <div className="col-span-2 md:col-span-1 bg-orange-950/20 p-4 border-t-2 border-orange-600 flex flex-col justify-center items-center">
                  <span className="text-[9px] text-orange-600 uppercase tracking-widest mb-2">STREAK_MAX</span>
                  <span className="text-3xl font-bold text-orange-400">{stats.overview.killstreak}</span>
                </div>
              </div>
            </div>

            <div className="col-span-1 lg:col-span-4 bg-black border border-cyan-900 p-4 flex flex-col relative">
              <div className="absolute top-0 left-0 p-1 bg-cyan-900/50 text-cyan-300 text-[8px] font-bold tracking-widest">DAT_MODULE_E</div>
              <h2 className="text-xs font-bold text-cyan-500 uppercase tracking-widest flex items-center gap-2 mb-4 mt-2 border-b border-cyan-900/50 pb-2">
                <Trophy size={14} /> LOBBY_DOMINANCE
              </h2>
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex-1 bg-amber-950/20 px-4 py-2 border border-amber-900/50 flex justify-between items-center group hover:border-amber-500 transition-colors">
                  <span className="text-[10px] font-bold uppercase text-amber-700 tracking-widest flex items-center gap-2"><Trophy size={12} /> MVP_RT</span>
                  <span className="text-xl font-bold text-amber-400">{stats.overview.mvpRate}%</span>
                </div>
                <div className="flex-1 bg-slate-900/50 px-4 py-2 border border-slate-700/50 flex justify-between items-center group hover:border-slate-400 transition-colors">
                  <span className="text-[10px] font-bold uppercase text-slate-500 tracking-widest flex items-center gap-2"><Medal size={12} /> SVP_RT</span>
                  <span className="text-xl font-bold text-slate-300">{stats.overview.svpRate}%</span>
                </div>
              </div>
            </div>

            {/* Bottom Row: Top Heroes Cards (Spans full width) */}
            <div className="col-span-1 lg:col-span-12 mt-4">
              <div className="flex items-center gap-4 mb-4">
                <h2 className="text-sm font-bold uppercase text-cyan-400 tracking-widest border-b-2 border-cyan-500 pb-1">OP_ROSTER_ANALYSIS</h2>
                <div className="flex-1 h-px bg-cyan-900"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.topHeroes.map((hero: any, idx: number) => (
                  <div key={hero.name} className="animate-in fade-in zoom-in-95 duration-200 fill-mode-both" style={{ animationDelay: `${idx * 50}ms` }}>
                    <HeroCard {...hero} />
                  </div>
                ))}
              </div>
            </div>

            {/* Extended Roster Database (Searchable) */}
            <RosterDatabank allHeroes={stats.allHeroes} />

          </div>
        ) : (
          !loading && !error && (
            <div className="border border-cyan-900 bg-cyan-950/10 p-8 flex flex-col items-center justify-center min-h-[400px]">
              <Terminal size={48} className="text-cyan-800 mb-6 animate-pulse" />
              <p className="text-cyan-500 font-bold text-lg uppercase tracking-widest">[ AWAITING_INPUT ]</p>
              <p className="text-cyan-700 text-[10px] mt-2 tracking-widest uppercase">INITIALIZE SCAN SECURE LINK TO M.C.P.</p>
            </div>
          )
        )}

        {/* Global Footer */}
        <footer className="mt-8 pt-4 pb-2 text-center border-t-2 border-dashed border-cyan-900/50">
          <p className="text-[10px] text-cyan-800 tracking-widest uppercase flex items-center justify-center gap-2">
            <span>Built by CircuTron</span>
            <span className="text-cyan-900">|</span>
            <a href="https://ko-fi.com/" target="_blank" rel="noreferrer" className="text-amber-600 hover:text-amber-400 font-bold transition-colors">
              Support the Terminal: Buy me an Energy Drink
            </a>
          </p>
        </footer>

      </div>
    </div>
  );
}