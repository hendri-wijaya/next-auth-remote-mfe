"use client";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";

export default function MePage() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    getSession().then(setSession);
  }, []);

  return (
    <div style={{ margin: 40 }}>
      <h1>Session Info</h1>
      {session ? (
        <pre style={{ background: '#eee', padding: 20, borderRadius: 8 }}>
          {JSON.stringify(session, null, 2)}
        </pre>
      ) : (
        <p>No session found. Please sign in.</p>
      )}
    </div>
  );
}
