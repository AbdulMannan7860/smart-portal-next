"use client";

import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import PostContext from "../../../Context/PostContext/PostContext";
import GetContext from "../../../Context/GetContext/GetContext";
import TeacherLayout from "../../../Layout/Teacher Layout";

const AttendancePage = () => {
  const [activeTab, setActiveTab] = useState("mark");

  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");

  const [attendanceStatus, setAttendanceStatus] = useState({});

  const [students, setStudents] = useState([]);
  const [date, setDate] = useState("");

  const [uniqueCourses, setUniqueCourses] = useState([]);
  const [uniquePrograms, setUniquePrograms] = useState([]);
  const [uniqueSemesters, setUniqueSemesters] = useState([]);

  const context = useContext(GetContext);
  const { getDataFromApi } = context;

  const postContext = useContext(PostContext);
  const { postDataToApi } = postContext;

  const getStudents = async () => {
    const response = await getDataFromApi("/api/student/get-total-students");
    const data = response?.data || [];
    setStudents(data);
  };

  const getSchedule = async () => {
    const response = await getDataFromApi("/api/schedule/get-schedule");
    const data = response?.data || [];

    const courses = [...new Set(data.map((c) => c.courseName))];

    const uniqueCourses = courses.map((course) => {
      const unique = data.find((d) => d.courseName === course)
      return unique ? { courseName: unique.courseName, courseCode: unique.courseCode } : null;
    });

    setUniqueSemesters([...new Set(data.map((s) => s.semester))]);
    setUniquePrograms([...new Set(data.map((s) => s.program_title))]);
    setUniqueCourses(uniqueCourses);
  };

  useEffect(() => {
    getStudents();
    getSchedule();
  }, []);

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const filteredStudents = students.filter((s) => {
    if (selectedProgram && s.Prog_Title !== selectedProgram) return false;
    if (selectedSemester && s.Batch_Name !== selectedSemester) return false;
    return true;
  });

  useEffect(() => {
    if (filteredStudents.length === 0) return;

    const defaultStatus = {};
    filteredStudents.forEach((s) => {
      defaultStatus[s.fStudentID] = "absent";
    });
    setAttendanceStatus((prev) => {
      const keys = Object.keys(defaultStatus);
      const prevKeys = Object.keys(prev);
      if (keys.length !== prevKeys.length) return defaultStatus;
      return prev;
    });
  }, [filteredStudents.length]);

  const handleStatusChange = (studentId, status) => {
    setAttendanceStatus((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSubmitAttendance = async () => {
    // Prepare attendance data
    const attendanceArray = Object.entries(attendanceStatus).map(([studentId, status]) => ({
      studentId,
      status,
    }));
    // Submit to API
    const submitData = {
      courseId: selectedCourse,
      semester: selectedSemester,
      program: selectedProgram,
      date: getCurrentDate(),
      attendance: attendanceArray,
    };
    const response = await postDataToApi("/api/attendance/add-attendance", submitData);
    if (response.success) {
      toast.success("Attendance submitted successfully!");
    } else {
      toast.error("Failed to submit attendance.");
    }
  };

  return (
    <TeacherLayout>
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-md">
          <div className="bg-red-800 text-white px-6 py-4 rounded-t-xl">
            <h2 className="text-2xl font-bold">Attendance Management</h2>
            <p className="text-red-100 text-sm mt-1">
              Mark and view student attendance
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("mark")}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${activeTab === "mark"
                ? "text-red-800 border-b-2 border-red-800 bg-red-50"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
            >
              Mark Attendance
            </button>

            <button
              onClick={() => setActiveTab("view")}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${activeTab === "view"
                ? "text-red-800 border-b-2 border-red-800 bg-red-50"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
            >
              View Attendance
            </button>
          </div>

          <div className="p-6">
            {/* MARK ATTENDANCE TAB */}
            {activeTab === "mark" && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-4 gap-4">
                  {/* Course */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Course</label>
                    <select
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="">Select Course</option>
                      {uniqueCourses.map((course, index) => (
                        <option key={index} value={course.courseCode}>{course.courseName}</option>
                      ))}
                    </select>
                  </div>

                  {/* Semester */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Semester</label>
                    <select
                      value={selectedSemester}
                      onChange={(e) => setSelectedSemester(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="">Select Semester</option>
                      {uniqueSemesters.map((sem, i) => (
                        <option key={i} value={sem}>{sem}</option>
                      ))}
                    </select>
                  </div>

                  {/* Program */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Program</label>
                    <select
                      value={selectedProgram}
                      onChange={(e) => setSelectedProgram(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="">Select Program</option>
                      {uniquePrograms.map((prog, i) => (
                        <option key={i} value={prog}>{prog}</option>
                      ))}
                    </select>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Date</label>
                    <input
                      type="date"
                      name="date"
                      onChange={(e) => setDate(e.target.value)}
                      value={getCurrentDate()}
                      readOnly
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                </div>

                {/* Student Table */}
                {selectedCourse && selectedSemester && selectedProgram && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-red-900 text-white">
                        <tr>
                          <th className="px-4 py-3">ID</th>
                          <th className="px-4 py-3">Reg No</th>
                          <th className="px-4 py-3">Name</th>
                          <th className="px-4 py-3 text-center">Present</th>
                          <th className="px-4 py-3 text-center">Leave</th>
                          <th className="px-4 py-3 text-center">Absent</th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredStudents.map((s) => (
                          <tr key={s.fStudentID} className="border-b">
                            <td className="px-4 py-3">{s.fStudentID}</td>
                            <td className="px-4 py-3">{s.Reg_no}</td>
                            <td className="px-4 py-3">{s.FullName.split("  ")[0]}</td>

                            {/* Present */}
                            <td className="px-4 py-3 text-center">
                              <input
                                type="radio"
                                name={`att-${s.fStudentID}`}
                                checked={attendanceStatus[s.fStudentID] === "present"}
                                onChange={() => handleStatusChange(s.fStudentID, "present")}
                              />
                            </td>

                            {/* Leave */}
                            <td className="px-4 py-3 text-center">
                              <input
                                type="radio"
                                name={`att-${s.fStudentID}`}
                                checked={attendanceStatus[s.fStudentID] === "leave"}
                                onChange={() => handleStatusChange(s.fStudentID, "leave")}
                              />
                            </td>

                            {/* Absent */}
                            <td className="px-4 py-3 text-center">
                              <input
                                type="radio"
                                name={`att-${s.fStudentID}`}
                                checked={attendanceStatus[s.fStudentID] === "absent"}
                                onChange={() => handleStatusChange(s.fStudentID, "absent")}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Submit Button */}
                    <div className="mt-6 flex justify-end">
                      <button onClick={handleSubmitAttendance} className="px-6 py-3 bg-red-800 text-white rounded-lg hover:bg-red-900">
                        Submit Attendance
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* VIEW ATTENDANCE TAB */}
            {activeTab === "view" && (
              <div className="text-center text-gray-600 py-10">
                <p>View attendance module coming soon.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
};

export default AttendancePage;
