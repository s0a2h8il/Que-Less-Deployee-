import jwt from "jsonwebtoken";

/**
 * Generate a JWT token with user ID and role
 * @param {string} userId - The user's MongoDB _id
 * @param {string} role - The user's role (user, admin, superadmin)
 * @returns {string} Signed JWT token
 */
const generateToken = (userId, role) => {
  const token = jwt.sign(
    { id: userId, role: role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "7d" }
  );

  console.log("🎫 JWT Token generated for user:", userId);
  return token;
};

export default generateToken;
