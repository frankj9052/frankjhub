'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div
      style={{
        backgroundColor: 'lightgray',
        padding: '1rem',
        display: 'flex',
        boxSizing: 'border-box',
        outline: '3px solid red',
        gap: '1rem',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <h3 style={{ color: 'red' }}>Wow, find a runtime error in this component!!!</h3>
      <button
        onClick={() => reset()}
        style={{
          cursor: 'pointer',
          backgroundColor: 'red',
          fontSize: '1rem',
          padding: '0.5rem',
        }}
      >
        Try again
      </button>
    </div>
  );
}
