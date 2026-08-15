import crypto from 'crypto';
import User from '../models/User.js';
import Cart from '../models/Cart.js';
import Wishlist from '../models/Wishlist.js';
import generateToken from '../utils/generateToken.js';
import { notifyUser } from '../utils/notify.js';
import sendEmail from '../utils/sendEmail.js';

// @desc  Register a new customer
// @route POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, birthday } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }
    const user = await User.create({ name, email, password, phone, birthday });
    await Cart.create({ user: user._id, items: [] });
    await Wishlist.create({ user: user._id, products: [] });

    notifyUser({
      userId: user._id,
      title: 'Welcome to Utsaah! 🎉',
      message: `Hi ${user.name}, thank you for joining Utsaah — your home for handcrafted love. Explore our collection of crochet, custom gifts and decor made just for you.`,
      type: 'registration',
    });

    res.status(201).json({
      user: user.toSafeObject(),
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Login
// @route POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (!user.isActive) {
      return res.status(403).json({ message: 'This account has been deactivated' });
    }
    res.json({
      user: user.toSafeObject(),
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Admin login (same table, requires role admin)
// @route POST /api/auth/admin-login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'This account does not have admin access' });
    }
    res.json({
      user: user.toSafeObject(),
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get current logged-in user
// @route GET /api/auth/me
export const getMe = async (req, res) => {
  res.json(req.user.toSafeObject());
};

// ---------------------------------------------------------------------------
// Forgot / Reset Password
//
// Flow:
//   1. User submits their email to POST /forgot-password.
//   2. We generate a random 32-byte token, email the RAW token as a link,
//      but only ever save its SHA-256 HASH (+ a 30-min expiry) on the user
//      document — same principle as never storing plaintext passwords, so a
//      leaked database still can't be used to reset anyone's password.
//   3. User clicks the link -> frontend collects a new password -> POST
//      /reset-password/:token with the RAW token from the URL.
//   4. We hash the incoming token the same way and look for a user whose
//      stored hash matches AND whose expiry hasn't passed.
//
// We always return the same generic message from forgotPassword regardless
// of whether that email is registered, so this endpoint can't be used to
// find out who has an account (email enumeration).
// ---------------------------------------------------------------------------

// Very small in-memory throttle (per running process) so the same address
// can't be used to spam-trigger emails. Fine for this app's scale; it simply
// resets on a server restart, which is an acceptable trade-off here — no
// paid rate-limiting service or extra dependency needed for 100-500 users.
const recentResetRequests = new Map(); // email -> last request timestamp (ms)
const RESET_REQUEST_COOLDOWN_MS = 60 * 1000; // 1 minute
const RESET_TOKEN_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

const GENERIC_FORGOT_MESSAGE =
  "If an account exists for that email, we've sent a link to reset the password.";

// @desc  Request a password reset email
// @route POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase().trim();
    if (!email) {
      return res.status(400).json({ message: 'Please provide your email address' });
    }

    const lastRequestAt = recentResetRequests.get(email);
    const isThrottled = lastRequestAt && Date.now() - lastRequestAt < RESET_REQUEST_COOLDOWN_MS;

    const user = isThrottled ? null : await User.findOne({ email });

    if (user) {
      recentResetRequests.set(email, Date.now());

      const rawToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpire = new Date(Date.now() + RESET_TOKEN_EXPIRY_MS);
      await user.save({ validateBeforeSave: false });

      const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${rawToken}`;

      // Always logged server-side (not just when email is "skipped") so you
      // can test the full flow locally without needing real SMTP creds yet
      // — copy this URL straight into your browser during development.
      console.log(`[Password Reset] Link for ${user.email}: ${resetUrl}`);

      // Best-effort, matching the rest of the app: if SMTP isn't configured,
      // sendEmail() logs the email to the console instead of throwing, so
      // this endpoint keeps working during local development/testing.
      await sendEmail({
        to: user.email,
        subject: 'Reset your Utsaah password',
        html: `
          <div style="font-family:sans-serif;padding:24px;color:#3A2A24;max-width:480px;margin:0 auto;">
            <h2 style="color:#D6336C;margin-bottom:4px;">Reset your password</h2>
            <p>Hi ${user.name},</p>
            <p>We received a request to reset the password for your Utsaah account. Click the button below to choose a new one — this link expires in 30 minutes.</p>
            <p style="margin:28px 0;">
              <a href="${resetUrl}" style="background:#D6336C;color:#fff;text-decoration:none;padding:12px 28px;border-radius:999px;font-weight:600;display:inline-block;">Reset Password</a>
            </p>
            <p style="font-size:13px;color:#8A7A72;">If the button doesn't work, copy and paste this link into your browser:<br/>${resetUrl}</p>
            <p style="font-size:13px;color:#8A7A72;">If you didn't request this, you can safely ignore this email — your password will remain unchanged.</p>
            <p style="margin-top:24px;font-size:12px;color:#999;">— Team Utsaah</p>
          </div>
        `,
      });
    }

    // Same response whether or not the user/email exists, or was throttled.
    res.json({ message: GENERIC_FORGOT_MESSAGE });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Set a new password using a valid reset token
// @route POST /api/auth/reset-password/:token
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    if (!token) {
      return res.status(400).json({ message: 'Reset token is missing' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: 'This reset link is invalid or has expired. Please request a new one.' });
    }

    user.password = password; // the existing pre('save') hook re-hashes this automatically
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    notifyUser({
      userId: user._id,
      title: 'Your password was changed',
      message: `Hi ${user.name}, this confirms your Utsaah account password was just reset. If this wasn't you, please contact us immediately.`,
      type: 'general',
      sendEmailToo: true,
    });

    // Log them straight in, same response shape as register/login, so they
    // land back in the app immediately instead of having to log in again.
    res.json({
      message: 'Password reset successful!',
      user: user.toSafeObject(),
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};