import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lock, Eye, EyeOff } from "lucide-react";
import Alert from "@mui/material/Alert";
import { ClipLoader } from "react-spinners";
import axios from "axios";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alert, setAlert] = useState({ message: "", severity: "" });
  const [verificationAlert, setVerificationAlert] = useState({
    message: "",
    severity: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setVerificationAlert({
          message: "Invalid or missing token.",
          severity: "error",
        });
        return;
      }
      try {
        const response = await axios.get(
          `/api/auth/verify-reset-token?token=${token}`
        );
        if (response.status === 200) {
          //   setVerificationAlert({
          //     message: "Token verified successfully.",
          //     severity: "success",
          //   });
        } else {
          setVerificationAlert({
            message: response.data.message,
            severity: "error",
          });
        }
      } catch (error) {
        console.log(error);
        setVerificationAlert({
          message:
            error.response?.data?.message ||
            "An error occurred during verification.",
          severity: "error",
        });
      }
    };
    verifyToken();
  }, [token]);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    console.log("Resetting password...");

    if (!password || !confirmPassword) {
      setAlert({ message: "Please fill in all fields", severity: "error" });
      return;
    }

    if (password !== confirmPassword) {
      setAlert({ message: "Passwords do not match", severity: "error" });
      return;
    }

    // Check for password complexity
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setAlert({
        message:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
        severity: "error",
      });
      return;
    }

    setLoading(true);
    e.target.disabled = true;

    try {
      const response = await axios.post("/api/auth/reset-password", {
        token,
        password,
      });

      if (response.status === 200) {
        setAlert({
          message: "Password reset successful! Redirecting to login...",
          severity: "success",
        });
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      setAlert({
        message:
          error.response?.data?.message ||
          "An error occurred. Please try again.",
        severity: "error",
      });
    } finally {
      e.target.disabled = false;
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center font-bold">
            Reset Password
          </CardTitle>
          <CardDescription className="text-center">
            Enter a new password for your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {" "}
          {verificationAlert.message && (
            <Alert
              severity={verificationAlert.severity}
              sx={{ marginBottom: "16px" }}
            >
              {verificationAlert.message}
            </Alert>
          )}
        </CardContent>
        {!verificationAlert.message ? (
          <div>
            <CardContent className="space-y-4">
              {alert.message && (
                <Alert severity={alert.severity} sx={{ marginBottom: "16px" }}>
                  {alert.message}
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="pl-9 pr-9"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    className="pl-9 pr-9"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={(e) => handleResetPassword(e)}
              >
                Reset Password
                {loading ? (
                  <ClipLoader color="white" loading={loading} size={15} />
                ) : (
                  ""
                )}
              </Button>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-center text-gray-700 w-full">
                Remembered your password?{" "}
                <button
                  className="ml-2 hover:underline text-purple-600 hover:text-purple-800"
                  onClick={() => navigate("/login")}
                >
                  Log in
                </button>
              </p>
            </CardFooter>
          </div>
        ) : (
          <CardContent>
            <Button
              className="w-full bg-purple-600 hover:bg-purple-700"
              onClick={() => navigate("/forgot-password")}
            >
              Reset Password
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
