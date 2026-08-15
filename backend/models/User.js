import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: [true, 'Password is required'], minlength: 6, select: false },
    phone: { type: String, trim: true, default: '' },
    birthday: { type: Date },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    walletBalance: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    lastBirthdayCouponYear: { type: Number, default: null },
    // Forgot/Reset Password: we only ever store a SHA-256 hash of the reset
    // token (never the raw token that goes out in the email), same idea as
    // how `password` is never stored in plaintext. select:false keeps these
    // out of any normal query result, matching the `password` field above.
    resetPasswordToken: { type: String, select: false, default: undefined },
    resetPasswordExpire: { type: Date, select: false, default: undefined },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model('User', userSchema);