import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const schema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: { type: String, select: false },
    role: { type: String, enum: ["admin", "customer"], default: "customer" },
    refresh_tokens: [String],
    isEmailVerified: Boolean,
    isActive: { type: Boolean, default: true },
    lastLoginAt: Date,
    deletedAt: Date,
  },
  { timestamps: true }
);

schema.pre("save", async function () {
  if (this.isModified("password"))
    this.password = await bcrypt.hash(this.password, 12);
});

schema.methods.comparePassword = function (pw) {
  return bcrypt.compare(pw, this.password);
};

export default mongoose.model("User", schema);
