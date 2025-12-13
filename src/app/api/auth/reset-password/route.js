import connectToMongoDB from "../../../lib/db";
import User from "../../../lib/models/User.model";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;
const PEPPER = process.env.PEPPER || "default_pepper";

const addSaltAndPepper = async (password) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password + PEPPER, salt);
  return hashedPassword;
};
// Need to create a route to reset the password of the user

export async function POST(request) {
  try {
    await connectToMongoDB();
    const { code, password } = await request.json();

    if (!code || !password || password.length < 8) {
      return NextResponse.json(
        { error: "Code and password are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ code });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.password = await addSaltAndPepper(password);
    await user.save();

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
