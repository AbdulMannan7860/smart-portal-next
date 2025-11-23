import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "@/app/lib/models/User.model.js";
import connectToMongoDB from "@/app/lib/db.js";

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;
const PEPPER = process.env.PEPPER || "default_pepper";
const MASTER_DB_API_URL = process.env.MASTER_DB_API_URL || "";

export async function POST(request) {
  try {
    await connectToMongoDB();
    const { code, password, isTrue } = await request.json();

    const user = await User.findOne({ code });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password + PEPPER, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    let responseData = { success: "User logged in" };

    // Master DB Check
    if (!code.includes("@")) {
      const formData = new URLSearchParams();
      formData.append("reg_no", code);
      formData.append("hashed_password", password);

      const masterDbResponse = await fetch(`${MASTER_DB_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      const masterDbData = await masterDbResponse.json();

      if (masterDbData.error) {
        return NextResponse.json(
          { error: masterDbData.error },
          { status: 500 }
        );
      }

      responseData.data = masterDbData;
    } else {
      responseData.data = user;
    }

    // JWT creation
    let token;
    if (isTrue) {
      token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "15d",
      });
    } else {
      token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "3h",
      });
      responseData.tempToken = token; // send token in JSON
    }

    // Send cookie only when isTrue = true
    const response = NextResponse.json(responseData, { status: 200 });

    if (isTrue) {
      response.cookies.set("jwt", token, {
        maxAge: 15 * 24 * 60 * 60,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });
    }

    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
