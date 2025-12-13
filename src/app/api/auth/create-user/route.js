import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import User from "../../../lib/models/User.model.js";
import Teacher from "../../../lib/models/Teacher.model.js";
import connectToMongoDB from "../../../lib/db.js";
import fetchUser from "../../middleware/fetchUser";;

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;
const PEPPER = process.env.PEPPER || "default_pepper";

const addSaltAndPepper = async (password) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password + PEPPER, salt);
  return hashedPassword;
};

export async function POST(request) {
  try {
    await connectToMongoDB();

    const authResult = await fetchUser(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { email, role, password } = await request.json();

    const checkUser = await User.findOne({ code: email });

    if (checkUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    if (role === "Teacher") {
      return NextResponse.json(
        { error: "Teacher cannot create a user" },
        { status: 400 }
      );
    }

    if (role === "Student") {
      return NextResponse.json(
        { error: "Student cannot create a user" },
        { status: 400 }
      );
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

    const hashedPassword = await addSaltAndPepper(password);

    const newUser = new User({ code: email, role, password: hashedPassword });

    if (role === "Teacher") {
      const findTeacher = await Teacher.findOne({ teacherID: code });

      if (!findTeacher) {
        return NextResponse.json(
          { error: "Teacher not found" },
          { status: 400 }
        );
      }

      if (findTeacher.user) {
        return NextResponse.json(
          { error: "Teacher already linked to a user" },
          { status: 400 }
        );
      }

      findTeacher.user = newUser._id;
      await findTeacher.save();
    }

    await newUser.save();

    return NextResponse.json(
      { message: "User created successfully", data: newUser },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
