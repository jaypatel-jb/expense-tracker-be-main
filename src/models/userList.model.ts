import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUserList extends Document {
  _id: string;
  name: string;
  mobileNumber: string;
  coins: number;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  password: string;
  isVerified: boolean;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const userListSchema = new Schema<IUserList>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
    },
    coins: {
      type: Number,
      required: [true, "Coins are required"],
      default: 0,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Add text index for search functionality
userListSchema.index({ name: "text", email: "text", mobileNumber: "text" });
// Hash password before saving
userListSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userListSchema.methods.matchPassword = async function (
  enteredPassword: string
) {
  return await bcrypt.compare(enteredPassword, this.password);
};
const UserList = mongoose.model<IUserList>("UserList", userListSchema);

export default UserList;
