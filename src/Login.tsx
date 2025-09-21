import React, { useEffect } from "react";

const Login = () => {
  useEffect(() => {
    // Redirect to NextAuth with callbackUrl set to shell app
    window.location.href = "http://localhost:3000/api/auth/signin/okta";
  }, []);

  return (
    <div>
      <h1>Redirecting to Okta login...</h1>
    </div>
  );
};

export default Login;
