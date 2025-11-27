'use client';

import { playerApi } from '@/services/api';

interface PlayerInfoProps {
  playerName: string;
  onLogout: () => void;
  onShowLeaderboard: () => void;
}

export default function PlayerInfo({
  playerName,
  onLogout,
  onShowLeaderboard,
}: PlayerInfoProps) {
  const handleLogout = async () => {
    try {
      await playerApi.logout();
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
      onLogout();
    }
  };

  return (
    <div id="playerInfo" style={{ display: 'block' }}>
      <p>
        Angemeldet als: <strong>{playerName}</strong>
      </p>
      <button
        onClick={handleLogout}
        style={{
          background: 'linear-gradient(135deg, #ff0055 0%, #cc0033 100%)',
          color: '#fff',
        }}
      >
        ABMELDEN
      </button>
      <button
        onClick={onShowLeaderboard}
        style={{
          background: 'linear-gradient(135deg, #ffd700 0%, #ffaa00 100%)',
          color: '#000',
        }}
      >
        RANGLISTE
      </button>
    </div>
  );
}
