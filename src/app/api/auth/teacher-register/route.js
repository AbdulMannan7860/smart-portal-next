import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "@/app/lib/models/User.model.js";
import connectToMongoDB from "@/app/lib/db.js";
import Teacher from "@/app/lib/models/Teacher.model.js";

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
    await connectToMongoDB();

    // Support both old format (name, code, email, hashed_password, role) and new format (regNo, role, password)
    const body = await request.json();
    const { name, password, role, email, department, status } = body;

    // Map old format to new format
    const userRole = role || "Teacher";
    const userPassword = password;

    if (userRole !== "Teacher") {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    if (!userPassword || userPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    if (userPassword.search(/[a-z]/) < 0) {
      return NextResponse.json(
        { error: "Password must contain at least one lowercase letter" },
        { status: 400 }
      );
    }

    if (userPassword.search(/[A-Z]/) < 0) {
      return NextResponse.json(
        { error: "Password must contain at least one uppercase letter" },
        { status: 400 }
      );
    }

    if (userPassword.search(/[0-9]/) < 0) {
      return NextResponse.json(
        { error: "Password must contain at least one digit" },
        { status: 400 }
      );
    }

    if (userPassword.search(/[^a-zA-Z0-9]/) < 0) {
      return NextResponse.json(
        { error: "Password must contain at least one special character" },
        { status: 400 }
      );
    }

    // Check if user already exists in local DB (using reg_no as code)
    const checkUser = await User.findOne({ code: email });

    if (checkUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Call Master DB API to get Teacher data
    if (!MASTER_DB_API_URL) {
      return NextResponse.json(
        { error: "Master DB API URL not configured" },
        { status: 500 }
      );
    }

    const masterDbResponse = await fetch(
      `${MASTER_DB_API_URL}/faculty-staff/list`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!masterDbResponse.ok) {
      return NextResponse.json(
        { error: "Teacher not found in Master Database" },
        { status: 404 }
      );
    }

    const masterDbData = await masterDbResponse.json();

    const filterTeacher = masterDbData?.data.filter(
      (t) => t.StaffName === name
    )[0];

    // Extract data from Master DB response
    const { StaffName, StaffCode, StaffID, Status } = filterTeacher;

    if (!StaffID) {
      return NextResponse.json(
        { error: "Teacher not found in Master DB response" },
        { status: 400 }
      );
    }

    const findTeacher = await Teacher.findOne({ teacherID: StaffCode });

    if (!findTeacher) {
      const createTeacher = await Teacher.create({
        fullName: StaffName,
        teacherID: StaffCode,
        email,
        department,
        jobStatus: Status !== "-" ? Status : "Visting",
        status: status || "Active",
      });

      await createTeacher.save();
    }

    // Hash password and create user in local DB
    const hashedPassword = await addSaltAndPepper(userPassword);

    const user = new User({
      code: email, // Use reg_no from Master DB or fallback to registrationNo
      role: userRole,
      password: hashedPassword,
      user_id: email,
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15d",
    });

    const response = NextResponse.json(
      {
        message: "User created successfully",
        data: {
          email,
          full_name: findTeacher ? findTeacher?.fullName : StaffName,
          StaffID,
        },
      },
      { status: 200 }
    );

    response.cookies.set("jwt", token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
