import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await fetch("/api/auth/validate-token", {
          credentials: "include", // Ensure cookies are sent
        });
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error validating token:", error);
        setIsAuthenticated(false);
      }
    };
    checkToken();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Add a loading state while the token is checked
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
