"use client";
import { useEffect, useState } from "react";
import { signIn, getSession } from "next-auth/react";

export default function SignInPage() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    getSession().then((sess) => {
      setSession(sess);
      setLoading(false);
      if (!sess) {
        signIn("okta");
      }
    });
  }, []);

  useEffect(() => {
    if (session) {
      // Try to get callbackUrl from query params
      const params = new URLSearchParams(window.location.search);
      const callbackUrl = "http://localhost:8080/mfe/?isLoggedIn=true&target=homepage"; // Default to shell app
      window.location.href = callbackUrl;
    }
  }, [session]);

  if (loading) {
    return <div><h1>Checking authentication...</h1></div>;
  }
  if (session) {
    return <div><h1>Login successful! Redirecting...</h1></div>;
  }
  return <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 100 }}><h1>Redirecting to Okta login...</h1></div>;
}
