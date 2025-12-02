import React, { useContext, useEffect, useMemo, useState } from "react";
import { Calendar, BookOpen, Users, FileText, Clock } from "lucide-react";
import TeacherLayout from "@/Layout/Teacher Layout";
import { sampleData } from "@/MockData/Data";
import GetContext from "@/Context/GetContext/GetContext";
import { useProfileStore } from "@/app/store/profileStore";

const DashboardPage = () => {
  const context = useContext(GetContext);
  const { getDataFromApi } = context;

  const [scheduleData, setScheduleData] = useState([]);
  const [strength, setStrength] = useState(0);

  const getCourses = async () => {
    const response = await getDataFromApi("/api/schedule/get-schedule");
    setScheduleData(response.data);
  };

  const getStudents = async () => {
    const response = await getDataFromApi(
      "/api/student/get-total-students"
    );
    setStrength(response.data.length);
  }

  useEffect(() => {
    getCourses();
    getStudents();
  }, []);

  const courses = useMemo(() => {
    return (
      scheduleData?.map((i) => ({
        code: i.courseCode,
        name: i.courseName,
        credits: i.credits,
        progTitle: i.program_title,
        semester: i.semester,
      })) || []
    );
  }, [scheduleData]);

  const profile = useProfileStore.getState().profile;

  const getTodaySchedule = () => {
    const today = new Date().toLocaleString("en-US", { weekday: "long" });

    return scheduleData
      .filter((item) => item.day === today)
      .map((item) => ({
        id: item._id,
        courseCode: item.courseCode,
        courseName: item.courseName,
        day: item.day,
        time: `${item.class_start_time} - ${item.class_end_time}`,
        room: item.room,
        semester: item.semester,
        session: item.session,
      }));
  };

  const schedule = useMemo(() => {
    return getTodaySchedule();
  }, [scheduleData]);

  const filterUniqueCourses = (array) => {
    const uniqueCourses = [];
    array.forEach((item) => {
      if (!uniqueCourses.includes(item)) {
        uniqueCourses.push(item);
      }
    });
    return uniqueCourses;
  };

  const coursesLength = useMemo(() => {
    return filterUniqueCourses(courses.map((i) => i.code)).length;
  }, [courses]);

  const classesPerWeekCount = (array) => {
    const uniqueClasses = [];

    array.forEach((item) => {
      const exists = uniqueClasses.some(
        (c) => c.courseCode === item.courseCode && c.day === item.day
      );
      if (!exists) {
        uniqueClasses.push(item);
      }
    });

    return uniqueClasses.length;
  };

  const classesPerWeek = useMemo(() => {
    return classesPerWeekCount(scheduleData);
  }, [scheduleData]);

  const stats = [
    {
      label: "Total Courses",
      value: coursesLength || 0,
      icon: BookOpen,
      color: "bg-blue-600",
    },
    {
      label: "Total Students",
      value: strength || 0,
      icon: Users,
      color: "bg-green-600",
    },
    {
      label: "Active Assignments",
      value: "3",
      icon: FileText,
      color: "bg-orange-600",
    },
    {
      label: "Classes This Week",
      value: classesPerWeek || 0,
      icon: Calendar,
      color: "bg-purple-600",
    },
  ];

  return (
    <TeacherLayout>
      {/* Main Content */}
      <div className="">
        {/* Welcome Banner and Dashboard Content */}
        <div className="space-y-6">
          <div className="bg-linear-to-r from-red-900 to-red-700 rounded-xl shadow-lg p-8 text-white">
            <h2 className="text-3xl font-bold mb-2">
              Welcome, {profile?.fullName || "Teacher"}
            </h2>
            <p className="text-red-100">
              Here's an overview of your teaching activities
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-800 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">
                        {stat.label}
                      </p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`${stat.color} p-4 rounded-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Today's Schedule */}
            <div className="bg-white rounded-xl shadow-md">
              <div className="bg-red-800 text-white px-6 py-4 rounded-t-xl">
                <h3 className="text-xl font-bold">Today's Schedule</h3>
              </div>
              <div className="p-6 space-y-3">
                {schedule.length > 0 ? (
                  schedule.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="bg-red-100 p-3 rounded-lg">
                        <Clock className="w-5 h-5 text-red-800" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">
                          {item.courseName}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {item.time}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {item.room} • {item.semester} Semester
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No schedule for today.</p>
                )}
              </div>
            </div>

            {/* Pending Submissions */}
            <div className="bg-white rounded-xl shadow-md">
              <div className="bg-red-800 text-white px-6 py-4 rounded-t-xl">
                <h3 className="text-xl font-bold">
                  Pending Assignment Reviews
                </h3>
              </div>
              <div className="p-6 space-y-3">
                {sampleData.submissions
                  .filter((s) => s.status === "pending")
                  .map((submission) => {
                    const assignment = sampleData.assignments.find(
                      (a) => a.id === submission.assignmentId
                    );
                    return (
                      <div
                        key={submission.id}
                        className="flex items-start gap-4 p-4 bg-orange-50 rounded-lg border border-orange-200"
                      >
                        <div className="bg-orange-100 p-3 rounded-lg">
                          <FileText className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">
                            {submission.studentName}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {assignment?.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Submitted: {submission.submittedDate}
                          </p>
                        </div>
                        <button className="px-3 py-1 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700">
                          Review
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Registered Courses */}
          <div className="bg-white rounded-xl shadow-md">
            <div className="bg-red-800 text-white px-6 py-4 rounded-t-xl">
              <h3 className="text-xl font-bold">Registered Courses</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-red-900 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      S/No
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Course Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Course Code
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Credits
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Program
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Semester
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {courses &&
                    courses.map((course, index) => (
                      <tr
                        key={course.code + index}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 text-sm text-gray-800">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-800">
                          {course.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {course.code}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {course.credits}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {course?.progTitle || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {course.semester}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
};

export default DashboardPage;
