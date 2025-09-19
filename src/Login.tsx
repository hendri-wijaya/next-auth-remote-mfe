import React, { useEffect } from "react";

const Login = () => {
  useEffect(() => {
    // Redirect to NextAuth with callbackUrl set to shell app
    window.location.href = "http://localhost:3000/api/auth/signin/forgerock?callbackUrl=http://localhost:8080/mfe/";
  }, []);

  return (
    <div>
      <h1>Redirecting to ForgeRock login...</h1>
    </div>
  );
};

export default Login;
