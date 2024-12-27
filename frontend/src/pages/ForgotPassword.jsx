import { useState } from "react";
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
import { Mail } from "lucide-react";
import logo from "@/assets/mini-logo-purple.png";
import Alert from "@mui/material/Alert";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  // State to manage email input
  const [email, setEmail] = useState("");

  // State to manage alert messages
  const [alert, setAlert] = useState({ message: "", severity: "" });

  // State to manage loading spinner
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    console.log("Requesting password reset...");

    // Check if email field is filled
    if (!email) {
      setAlert({ message: "Please enter your email", severity: "error" });
      return;
    }

    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setAlert({ message: "Invalid email", severity: "error" });
      return;
    }

    setLoading(true);
    e.target.disabled = true;

    try {
      const response = await axios.post("/api/auth/forgot-password", {
        email,
      });

      // Handle success response
      if (response.status === 200) {
        setAlert({
          message: "Password reset link sent! Check your email.",
          severity: "success",
        });
      }
    } catch (error) {
      // Handle errors
      if (error.response) {
        setAlert({
          message: `Error: ${error.response.data.message}`,
          severity: "error",
        });
      } else if (error.request) {
        console.error("No response received:", error.request);
        setAlert({
          message: "No response from server. Please try again later.",
          severity: "error",
        });
      } else {
        console.error("Error:", error.message);
        setAlert({
          message: "An error occurred. Please try again later.",
          severity: "error",
        });
      }
    } finally {
      e.target.disabled = false;
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <img src={logo} className="h-8 w-8 text-purple-600" />
          </div>
          <CardTitle className="text-2xl text-center font-bold">
            Forgot your password?
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email below to receive a password reset link
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {alert.message && (
            <Alert severity={alert.severity} sx={{ marginBottom: "16px" }}>
              {alert.message}
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                className="pl-9"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <Button
            className="w-full bg-purple-600 hover:bg-purple-700"
            onClick={handleForgotPassword}
          >
            Send Reset Link
            {loading ? (
              <ClipLoader color="white" loading={loading} size={15} />
            ) : (
              ""
            )}
          </Button>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-center text-gray-700 w-full ">
            Remember your password?{""}
            <button
              className="ml-2 hover:underline text-purple-600 hover:text-purple-800"
              onClick={() => navigate("/login")}
            >
              Log in
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
