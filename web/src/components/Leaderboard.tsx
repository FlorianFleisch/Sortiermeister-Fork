'use client';

import { useState, useEffect } from 'react';
import { playerApi } from '@/services/api';
import type { LeaderboardEntry } from '@/types';

interface LeaderboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Leaderboard({ isOpen, onClose }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadLeaderboard();
    }
  }, [isOpen]);

  const loadLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await playerApi.getLeaderboard();
      setEntries(data);
    } catch (err) {
      setError('Fehler beim Laden der Rangliste');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="overlay" onClick={onClose}></div>
      <div className="containers" style={{ display: 'block', width: 900, maxWidth: '95vw' }}>
        <div>
          <h2>RANGLISTE</h2>
          <p>Die besten Sortiermeister aller Zeiten</p>

          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>PLATZ</th>
                <th>NAME</th>
                <th>ZEIT</th>
                <th>SCHWIERIGKEIT</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} style={{ padding: 40, textAlign: 'center', color: '#00d4ff' }}>
                    Lade Rangliste...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} style={{ padding: 40, textAlign: 'center' }}>
                    {error}
                  </td>
                </tr>
              ) : entries.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '60px 20px', textAlign: 'center' }}>
                    Noch keine Einträge
                  </td>
                </tr>
              ) : (
                entries.map((entry, index) => {
                  const timeInSeconds = (entry.bestTimeInMs / 1000).toFixed(2);
                  const rankText = index < 3 ? String(index + 1) : String(entry.rank);

                  return (
                    <tr key={`${entry.playerName}-${index}`}>
                      <td style={{ fontWeight: 800 }}>{rankText}</td>
                      <td>
                        <strong>{entry.playerName}</strong>
                      </td>
                      <td>
                        <span className="time-display">{timeInSeconds}s</span>
                      </td>
                      <td>
                        <span className={`difficulty-badge ${entry.difficulty}`}>
                          {entry.difficulty}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          <button onClick={onClose}>SCHLIESSEN</button>
        </div>
      </div>
    </>
  );
}
