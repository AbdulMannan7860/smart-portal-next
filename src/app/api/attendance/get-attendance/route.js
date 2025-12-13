import { NextResponse } from "next/server";
import Attendance from "../../../lib/models/Attendance.model.js";
import User from "../../../lib/models/User.model.js";
import connectToMongoDB from "../../../lib/db.js";
import fetchUser from "../../middleware/fetchUser";;
import Teacher from "../../../lib/models/Teacher.model";
import Schedule from "../../../lib/models/Schedule.model";

export async function GET(request) {
  try {
    await connectToMongoDB();

    const authResult = await fetchUser(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const user = authResult.user;

    const validateUser = await User.findById(user._id);

    const checkTeacher = await Teacher.findOne({ email: validateUser.code });
    if (!validateUser || validateUser.role !== "Teacher" || !checkTeacher) {
      return NextResponse.json({ error: "Not Authorized" }, { status: 400 });
    }

    const findSchedules = await Schedule.find({ teacherCode: checkTeacher.teacherID, status: "Active" });

    const scheduleCourses = findSchedules.map(schedule => schedule.courseCode);

    const attendances = await Attendance.find({ courseId: { $in: scheduleCourses } });

    console.log("Attendances fetched:", attendances.length);

    return NextResponse.json({ attendances }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
