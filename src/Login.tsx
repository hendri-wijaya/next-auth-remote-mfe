import React, { useEffect } from "react";

type LoginProps = {
  onSuccess?: () => void;
};

const Login: React.FC<LoginProps> = ({ onSuccess }) => {
  const AUTH_BASE_URL = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  useEffect(() => {
    // call the callback instead of redirecting directly
    if (onSuccess) {
      onSuccess();
    } else {
      window.location.href = `${AUTH_BASE_URL}/api/auth/signin/forgerock`;
    }
  }, [onSuccess, AUTH_BASE_URL]);

  return (
    <div>
      <h1>Redirecting to ForgeRock login...</h1>
    </div>
  );
};

export default Login;
