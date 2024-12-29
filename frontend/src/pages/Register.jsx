import { useEffect, useState } from "react";
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
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import logo from "@/assets/mini-logo-purple.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Alert from "@mui/material/Alert";
import { ClipLoader } from "react-spinners";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // State to store form data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [alert, setAlert] = useState({ message: "", severity: "" });
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  // Handle registration logic
  async function handleRegister(e) {
    e.preventDefault();

    console.log("Registering...");

    // Reset previous alerts
    //setAlert({ message: "", severity: "" });

    // Check all fields are filled
    if (!email || !password || !confirmPassword) {
      setAlert({ message: "Please fill all fields", severity: "error" });
      return;
    }

    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setAlert({ message: "Invalid email", severity: "error" });
      return;
    }

    // Check if passwords match
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

    // Set loading to true to show spinner
    setLoading(true);
    //disable the button while loading
    e.target.disabled = true;

    // If all checks pass, proceed with registration
    try {
      const response = await axios.post(
        "/api/auth/register",
        {
          email,
          password,
        },
        {
          withCredentials: true, // To include cookies if the backend sets them
        }
      );
      // redirect to main page if response is 201
      if (response.status === 201) navigate("/verify");
    } catch (error) {
      // Handle errors
      if (error.response) {
        // Server responded with a status other than 2xx
        setAlert({
          message: `Error: ${error.response.data.message}`,
          severity: "error",
        });
      } else if (error.request) {
        // Request was made but no response received
        console.error("No response received:", error.request);
        setAlert({
          message: "No response from server. Please try again later.",
          severity: "error",
        });
      } else {
        // Something else happened
        console.error("Error:", error.message);
        setAlert({
          message: "An error occurred. Please try again later.",
          severity: "error",
        });
      }
    } finally {
      // Set loading to false to hide spinner and enable the button
      e.target.disabled = false;
      setLoading(false);
    }
  }

  //error during Google OAuth
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get("error");
    if (error) {
      setAlert({
        message:
          "An error occurred during Google authentication. Please try again later.",
        severity: "error",
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <img src={logo} className="h-8 w-8 text-purple-600" />
          </div>
          <CardTitle className="text-2xl text-center font-bold">
            Create an account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email below to create your account
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
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
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
            onClick={(e) => handleRegister(e)} // Pass the event to the function
          >
            Create account
            {loading ? (
              <ClipLoader color="white" loading={loading} size={15} />
            ) : (
              ""
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-purple-50 px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => (window.location.href = "/api/auth/google")}
          >
            <svg
              className="mr-2 h-4 w-4"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="google"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path
                fill="purple"
                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
              ></path>
            </svg>
            Google
          </Button>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-center text-gray-700 w-full ">
            Already have an account?{""}
            <button
              className="ml-2 hover:underline text-purple-600 hover:text-purple-800"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
