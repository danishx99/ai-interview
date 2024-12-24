import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import logo from "@/assets/mini-logo-purple.png";
import axios from "axios";
import Alert from "@mui/material/Alert";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

function Verification() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", severity: "" });

  // Handle resend verification email logic
  async function handleResendEmail(e) {
    e.preventDefault();

    console.log("Resending verification email...");

    // Reset previous alerts
    setAlert({ message: "", severity: "" });

    // Set loading to true to show spinner and disable button
    setLoading(true);
    e.target.disabled = true;

    // Proceed with resending the verification email
    try {
      const response = await axios.get("/api/auth/resend-verification-email", {
        withCredentials: true, // To include cookies if the backend sets them
      });

      // Show success alert if the email is resent successfully
      if (response.status === 200) {
        setAlert({
          message:
            "Verification email resent successfully. Please check your inbox.",
          severity: "success",
        });
      }
    } catch (error) {
      // Handle errors based on the response or request
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
      setLoading(false);
      e.target.disabled = false;
    }
  }

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <img src={logo} className="h-8 w-8 text-purple-600" />
          </div>
          <CardTitle className="text-2xl text-center font-bold">
            Email Verification Required
          </CardTitle>
          <CardDescription className="text-center">
            To complete your account setup, please verify your email address by
            clicking the link we sent to your inbox.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {alert.message && (
            <Alert severity={alert.severity} sx={{ marginBottom: "16px" }}>
              {alert.message}
            </Alert>
          )}
          <CardDescription className="text-center">
            Didn't receive the email? Check your spam folder or click the button
            below to resend it.
          </CardDescription>
          <Button
            className="w-full bg-purple-600 hover:bg-purple-700"
            onClick={(e) => handleResendEmail(e)} // Pass the event to the function
          >
            Resend email
            {loading ? (
              <ClipLoader color="white" loading={loading} size={15} />
            ) : (
              ""
            )}
          </Button>
        </CardContent>

        <CardFooter>
          <p className="text-xs text-center text-gray-700 w-full">
            Or, you can
            <button
              className="ml-1 hover:underline text-purple-600 hover:text-purple-800"
              onClick={() => navigate("/dashboard")}
            >
              proceed
            </button>{" "}
            without verification for now.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Verification;
