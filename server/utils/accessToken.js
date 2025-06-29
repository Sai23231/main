import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
  const jwtSecret = process.env.ACCESS_TOKEN_SECRET || 'your-fallback-access-token-secret-key-change-this-in-production';
  return jwt.sign(user, jwtSecret, { expiresIn: "31d" });
};
