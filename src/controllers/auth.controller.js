import User from "../models/User.js";
import { signAccessToken, signRefreshToken } from "../utils/jwt.js";

/**
 * USER SIGNUP
 */
export const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    const err = new Error("Name, email and password are required");
    err.statusCode = 400;
    throw err;
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const err = new Error("Email already registered");
    err.statusCode = 409;
    throw err;
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  res.status(201).json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

/**
 * USER LOGIN
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const err = new Error("Email and password are required");
    err.statusCode = 400;
    throw err;
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }

  if (!user.isActive || user.deletedAt) {
    const err = new Error("Account is disabled");
    err.statusCode = 403;
    throw err;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }

  const accessToken = signAccessToken({
    id: user._id,
    role: user.role,
  });

  const refreshToken = signRefreshToken({
    id: user._id,
  });

  /**
   * SECURITY:
   * Keep refresh tokens bounded (max 5)
   */
  user.refresh_tokens = user.refresh_tokens
    ?.slice(-4)
    ?.concat(refreshToken) || [refreshToken];

  user.lastLoginAt = new Date();
  await user.save();

  res.status(200).json({
    success: true,
    data: {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
};
