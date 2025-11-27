import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.push('/game');
  }, [router]);

  return (
    <>
      <link rel="stylesheet" href="/styles/style.css" />
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        color: '#00d4ff',
        fontSize: '24px'
      }}>
        Lade Sortiermeister...
      </div>
    </>
  );
}
