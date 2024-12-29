//set this up as a controller file
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const axios = require("axios");
require("dotenv").config();

// Register a new user
// Register a new user
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists. Please sign in." });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      email,
      password: hashedPassword,
      isVerified: false,
    });

    // Save the new user to the database
    await newUser.save();

    // Create an authentication JWT
    const authToken = jwt.sign(
      { userId: newUser._id, isVerified: newUser.isVerified },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    // Store JWT in HttpOnly cookie
    res.cookie("token", authToken, {
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 12 * 60 * 60 * 1000, // 12 hours
    });

    // Create a verification token for verification email
    const verificationToken = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Construct verification URL
    const verificationUrl = `${process.env.DOMAIN_NAME}/verify-email?token=${verificationToken}`;

    // Send verification email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "NextGen Interviews: Confirm Your Email Address",
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <div style="text-align: center;">
        <img src="https://i.ibb.co/YWg2FLG/mini-logo-purple.png" alt="NextGen Interviews" style="max-width: 100px; margin-bottom: 10px;" />
      </div>
      <p>Dear user,</p>
      <p>Thank you for registering with <strong>NextGen Interviews</strong>. To complete your registration, please verify your email address by clicking the button below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" style="background-color: #007bff; color: #ffffff; padding: 15px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email Address</a>
      </div>
      <p>If the button above doesn't work, please copy and paste the following link into your web browser:</p>
      <p><a href="${verificationUrl}">${verificationUrl}</a></p>
      <p>If you did not create an account with us, please disregard this email or contact our support team.</p>
      <p>Best regards,</p>
      <p>The NextGen Interviews Team</p>
      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 40px 0;" />
      <p style="font-size: 12px; color: #888888; text-align: center;">
        Need help? Contact us at <a href="saleemdf99@gmail.com">saleemdf99@gmail.com</a><br />
        © ${new Date().getFullYear()} NextGen Interviews. All rights reserved.<br />
      </p>
    </div>
  `,
    };

    await transporter.sendMail(mailOptions);

    // Respond with a success message
    res.status(201).json({
      message:
        "User registered successfully. Please check your email to verify your account.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Login an existing user and set JWT
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    // Store JWT in HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true, // Ensures the cookie is only accessible by the server
      sameSite: "Strict", // Prevent CSRF attacks
      maxAge: 12 * 60 * 60 * 1000, // 12 hours in milliseconds
    });

    res.status(200).json({ message: "Logged in successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const token = req.query.token;
    if (!token) {
      return res.status(400).json({ message: "Invalid token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.verified = true;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

exports.resendVerificationEmail = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized, please log in" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userID = decoded.userId;

    const user = await User.findById(userID);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    const userEmail = user.email;

    const verificationToken = jwt.sign(
      { userId: userID },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const verificationUrl = `${process.env.DOMAIN_NAME}/verify-email?token=${verificationToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "NextGen Interviews: Resend Email Verification",
      html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
    <div style="text-align: center;">
      <img src="https://i.ibb.co/YWg2FLG/mini-logo-purple.png" alt="NextGen Interviews" style="max-width: 100px; margin-bottom: 10px;" />
    </div>
    <p>Dear user,</p>
    <p>We received a request to resend the verification email for your account with <strong>NextGen Interviews</strong>. To complete your registration, please verify your email address by clicking the button below:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${verificationUrl}" style="background-color: #007bff; color: #ffffff; padding: 15px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email Address</a>
    </div>
    <p>If the button above doesn't work, please copy and paste the following link into your web browser:</p>
    <p><a href="${verificationUrl}">${verificationUrl}</a></p>
    <p>If you did not request this verification email, please disregard this message or contact our support team.</p>
    <p>Best regards,</p>
    <p>The NextGen Interviews Team</p>
    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 40px 0;" />
    <p style="font-size: 12px; color: #888888; text-align: center;">
      Need help? Contact us at <a href="mailto:saleemdf99@gmail.com">saleemdf99@gmail.com</a><br />
      © ${new Date().getFullYear()} NextGen Interviews. All rights reserved.<br />
    </p>
  </div>
`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Verification email resent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

exports.validateToken = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized, please log in" });
    }
    jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ message: "Token is valid" });
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Invalid token" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const resetUrl = `${process.env.DOMAIN_NAME}/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "NextGen Interviews: Password Reset Request",
      html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
    <div style="text-align: center;">
      <img src="https://i.ibb.co/YWg2FLG/mini-logo-purple.png" alt="NextGen Interviews" style="max-width: 100px; margin-bottom: 10px;" />
    </div>
    <p>Dear user,</p>
    <p>We received a request to reset the password for your account with <strong>NextGen Interviews</strong>. To reset your password, please click the button below:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" style="background-color: #007bff; color: #ffffff; padding: 15px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
    </div>
    <p>If the button above doesn't work, you can copy and paste the following link into your web browser:</p>
    <p><a href="${resetUrl}">${resetUrl}</a></p>
    <p>If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
    <p>Best regards,</p>
    <p>The NextGen Interviews Team</p>
    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 40px 0;" />
    <p style="font-size: 12px; color: #888888; text-align: center;">
      Need help? Contact us at <a href="mailto:saleemdf99@gmail.com">saleemdf99@gmail.com</a><br />
      © ${new Date().getFullYear()} NextGen Interviews. All rights reserved.<br />
    </p>
  </div>
`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Verification email resent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

exports.verifyToken = async (req, res) => {
  try {
    const token = req.query.token;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ message: "Token is valid" });
  } catch (err) {
    console.error("Token verification error:", err.message);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token has expired. Please request a new reset link",
      });
    } else if (err.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ message: "Invalid token. Please request a new reset link" });
    }

    res.status(500).json({ message: "Internal server error" });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the new password is the same as the old password
    const isSamePassword = await bcrypt.compare(password, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        message: "New password cannot be the same as the old password",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Error resetting password:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.googleAuth = async (req, res) => {
  req.session.referer =
    req.get("Referer") || `${process.env.DOMAIN_NAME}/login`; // default to login page

  const redirectUri = "https://accounts.google.com/o/oauth2/v2/auth";
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: `${process.env.DOMAIN_NAME}/api/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
  });
  res.redirect(`${redirectUri}?${params.toString()}`);
};

exports.googleAuthCallback = async (req, res) => {
  const code = req.query.code;

  if (!code) {
    const redirectUrl =
      req.session.referer || `${process.env.DOMAIN_NAME}/login`;
    return res.redirect(`${redirectUrl}?error=authorization-code-missing`);
  }

  try {
    // Exchange code for tokens
    const { data } = await axios.post(
      "https://oauth2.googleapis.com/token",
      null,
      {
        params: {
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: `${process.env.DOMAIN_NAME}/api/auth/google/callback`,
          grant_type: "authorization_code",
          code,
        },
      }
    );

    const { id_token, access_token } = data;

    // Decode the ID token to get user information
    const userInfo = jwt.decode(id_token);

    // Check if user exists in your database
    let user = await findOrCreateUser(userInfo);

    // Generate your own JWT for session management
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "12h",
    });

    // Set the token in a cookie
    res.cookie("token", token, { httpOnly: true, maxAge: 12 * 60 * 60 * 1000 });

    // Redirect to the frontend
    res.redirect(`${process.env.DOMAIN_NAME}/dashboard`);
  } catch (error) {
    console.error("Error during Google authentication", error);
    const redirectUrl =
      req.session.referer || `${process.env.DOMAIN_NAME}/login`;
    res.redirect(`${redirectUrl}?error=google-auth-error`);
  }
};

async function findOrCreateUser(userInfo) {
  let user = await User.findOne({ email: userInfo.email });

  if (!user) {
    user = await User.create({
      email: userInfo.email,
      googleId: userInfo.sub,
    });

    // Send a welcome email to the user
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userInfo.email,
      subject: "Welcome to NextGen Interviews",
      html: `
   <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
  <div style="text-align: center;">
    <img src="https://i.ibb.co/YWg2FLG/mini-logo-purple.png" alt="NextGen Interviews" style="max-width: 100px; margin-bottom: 10px;" />
  </div>
  <h2 style="text-align: center; color: #4CAF50;">Welcome to NextGen Interviews!</h2>
  <p>Dear user,</p>
  <p>Thank you for registering with <strong>NextGen Interviews</strong>! We're excited to have you on board.</p>
  <p>We're here to help you get ready for your next big interview. Stay tuned for upcoming features, tips, and more!</p>
  <p>If you have any questions, feel free to reach out to our support team.</p>
  <p>We look forward to helping you achieve your interview goals!</p>
  <p>Best regards,</p>
  <p>The NextGen Interviews Team</p>
  <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 40px 0;" />
  <p style="font-size: 12px; color: #888888; text-align: center;">
    Need help? Contact us at <a href="mailto:saleemdf99@gmail.com">saleemdf99@gmail.com</a><br />
    © ${new Date().getFullYear()} NextGen Interviews. All rights reserved.<br />
  </p>
</div>

  `,
    };

    await transporter.sendMail(mailOptions);
  }

  //set verified to true, and set google id
  user.verified = true;
  user.googleId = userInfo.sub;

  await user.save();

  return user;
}

// Protected Route
exports.getUserDetails = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized, please log in" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    res.status(200).json({ user: user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

exports.deleteAllUsers = async (req, res) => {
  try {
    await User.deleteMany();
    res.status(200).json({ message: "All users deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token").json({ message: "Logged out successfully" });
};
