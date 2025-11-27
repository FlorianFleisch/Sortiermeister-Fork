import type { Player, GameResult, LeaderboardEntry, Difficulty, Algorithm } from '@/types';

// Base URL comes from env for flexibility; fallback to Next.js rewrite '/api/player'
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') || '/api/player';

const json = async (res: Response) => {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API error ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
};

export const playerApi = {
  async login(name: string, algorithm: Algorithm, difficulty: Difficulty): Promise<Player> {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, algorithm, difficulty }),
    });
    return json(res);
  },

  async logout(): Promise<void> {
    await fetch(`${API_BASE}/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  },

  async getCurrentPlayer(): Promise<Player | null> {
    const res = await fetch(`${API_BASE}/current`, { credentials: 'include' });
    if (!res.ok) return null;
    return res.json();
  },

  async saveResult(result: GameResult): Promise<void> {
    const res = await fetch(`${API_BASE}/result`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(result),
    });
    if (!res.ok) throw new Error(`API error ${res.status}`);
  },

  async getLeaderboard(todayOnly = false): Promise<LeaderboardEntry[]> {
    const res = await fetch(`${API_BASE}/leaderboard?todayOnly=${todayOnly}`, {
      method: 'GET',
      credentials: 'include',
    });
    return json(res);
  },
};
