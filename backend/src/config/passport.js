import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
      proxy: true,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ 
          $or: [
            { googleId: profile.id },
            { email: profile.emails[0].value }
          ]
        });

        if (user) {
          // If user exists but doesn't have googleId, update it
          if (!user.googleId) {
            user.googleId = profile.id;
            user.isVerified = true; // Google accounts are pre-verified
            await user.save();
          }

          // ⚠️ SECURITY CHECK: If an account exists, it must match the requested role (if one was specified)
          const requestedRole = req.query.state;
          if (requestedRole && requestedRole !== "" && user.role !== requestedRole) {
            return done(null, false, { 
              message: `This email is already registered as a ${user.role.toUpperCase()}. You cannot use it for the ${requestedRole.toUpperCase()} panel.` 
            });
          }

          return done(null, user);
        }

        // If not, create a new user
        const role = req.query.state || "user";
        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          avatar: profile.photos[0]?.value,
          role: role,
          isVerified: true, // Google accounts are pre-verified
        });

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
