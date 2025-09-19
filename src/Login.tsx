import React, { useEffect } from "react";

type LoginProps = {
  onSuccess?: () => void;
};

const Login: React.FC<LoginProps> = ({ onSuccess }) => {

  useEffect(() => {
  // notify shell, but still redirect
  if (onSuccess) {
    onSuccess();
  }
  window.location.href = `http://localhost:3000/api/auth/signin/forgerock`;
}, []);

  return (
    <div>
      <h1>Redirecting to ForgeRock login...</h1>
    </div>
  );
};

export default Login;
