import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "@/app/lib/models/User.model.js";
import connectToMongoDB from "@/app/lib/db.js";

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;
const PEPPER = process.env.PEPPER || "default_pepper";
const MASTER_DB_API_URL = process.env.MASTER_DB_API_URL || "";

const addSaltAndPepper = async (password) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password + PEPPER, salt);
  return hashedPassword;
};

export async function POST(request) {
  try {
    // Connect to MongoDB
    try {
      await connectToMongoDB();
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return NextResponse.json(
        { error: "Database connection failed. Please check your MONGO_URI." },
        { status: 500 }
      );
    }

    const { regNo, mail, name, role, password } = await request.json();

    // Validate required fields
    if (!regNo || !password || !role) {
      return NextResponse.json(
        { error: "Missing required fields: regNo, password, and role are required" },
        { status: 400 }
      );
    }

    if (role !== "Student") {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    if (password.search(/[a-z]/) < 0) {
      return NextResponse.json(
        { error: "Password must contain at least one lowercase letter" },
        { status: 400 }
      );
    }

    if (password.search(/[A-Z]/) < 0) {
      return NextResponse.json(
        { error: "Password must contain at least one uppercase letter" },
        { status: 400 }
      );
    }

    if (password.search(/[0-9]/) < 0) {
      return NextResponse.json(
        { error: "Password must contain at least one digit" },
        { status: 400 }
      );
    }

    if (password.search(/[^a-zA-Z0-9]/) < 0) {
      return NextResponse.json(
        { error: "Password must contain at least one special character" },
        { status: 400 }
      );
    }

    // Check if user already exists in local DB (using reg_no as code)
    const code = regNo;
    const checkUser = await User.findOne({ code });

    if (checkUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Call Master DB API to get student data
    if (!MASTER_DB_API_URL) {
      return NextResponse.json(
        { error: "Master DB API URL not configured" },
        { status: 500 }
      );
    }

    // Call Master DB API to get student data
    let masterDbData;
    try {
      const masterDbResponse = await fetch(`${MASTER_DB_API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          code: regNo,
          role,
          email: mail,
          hashed_password: password,
        }),
      });

      if (!masterDbResponse.ok) {
        const errorText = await masterDbResponse.text();
        console.error("Master DB API error:", errorText);
        return NextResponse.json(
          { 
            error: "Failed to register with Master Database",
            details: masterDbResponse.status === 404 ? "Student not found" : "Master DB API error"
          },
          { status: masterDbResponse.status || 500 }
        );
      }

      masterDbData = await masterDbResponse.json();
    } catch (fetchError) {
      console.error("Master DB API fetch error:", fetchError);
      return NextResponse.json(
        { 
          error: "Failed to connect to Master Database",
          details: fetchError.message 
        },
        { status: 500 }
      );
    }

    // Extract data from Master DB response
    const { email, full_name, reg_no, student_id } = masterDbData?.data || {};

    if (!student_id) {
      return NextResponse.json(
        { error: "Student ID not found in Master DB response", response: masterDbData },
        { status: 400 }
      );
    }

    // Hash password and create user in local DB
    const hashedPassword = await addSaltAndPepper(password);

    const user = new User({
      code: reg_no || regNo, // Use reg_no from Master DB or fallback to regNo
      role,
      password: hashedPassword,
      userId: student_id,
    });

    await user.save();

    // Check if JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { error: "JWT_SECRET is not configured in environment variables" },
        { status: 500 }
      );
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15d",
    });

    const response = NextResponse.json(
      {
        message: "User created successfully",
        data: {
          email,
          full_name,
          reg_no: reg_no || regNo,
          student_id,
        },
      },
      { status: 200 }
    );
    
    return response;
  } catch (error) {
    console.error("Student registration error:", error);
    return NextResponse.json(
      { 
        error: error.message || "Internal server error during registration",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
