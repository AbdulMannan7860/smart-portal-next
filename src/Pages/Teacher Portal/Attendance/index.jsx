import React, { useState } from "react";
import { sampleData } from "../../../MockData/Data";
import { Plus, Eye, Download, Trash2 } from "lucide-react";
import TeacherLayout from "../../../Layout/Teacher Layout";

const AttendancePage = () => {
  const [activeTab, setActiveTab] = useState("mark");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState({});

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const filteredStudents = sampleData.students.filter((student) => {
    if (selectedCourse && !student.courses.includes(selectedCourse))
      return false;
    if (selectedSemester && student.semester !== selectedSemester) return false;
    return true;
  });

  const handleStatusChange = (studentId, status) => {
    setAttendanceStatus((prev) => ({
      ...prev,
      [studentId]: status,
    }));
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
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === "mark"
                  ? "text-red-800 border-b-2 border-red-800 bg-red-50"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              Mark Attendance
            </button>
            <button
              onClick={() => setActiveTab("view")}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === "view"
                  ? "text-red-800 border-b-2 border-red-800 bg-red-50"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              View Attendance
            </button>
          </div>

          <div className="p-6">
            {/* Mark Attendance Tab */}
            {activeTab === "mark" && (
              <div className="space-y-6">
                {/* Filters */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course
                    </label>
                    <select
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Select Course</option>
                      {sampleData.courses.map((course) => (
                        <option key={course.code} value={course.code}>
                          {course.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Semester
                    </label>
                    <select
                      value={selectedSemester}
                      onChange={(e) => setSelectedSemester(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Select Semester</option>
                      <option value="1st">1st</option>
                      <option value="3rd">3rd</option>
                      <option value="5th">5th</option>
                      <option value="6th">6th</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={getCurrentDate()}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      readOnly
                    />
                  </div>
                </div>

                {/* Attendance Table */}
                {selectedCourse && selectedSemester && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-red-900 text-white">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold">
                            Student ID
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">
                            Reg No
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">
                            Student Name
                          </th>
                          <th className="px-4 py-3 text-center text-sm font-semibold">
                            Present
                          </th>
                          <th className="px-4 py-3 text-center text-sm font-semibold">
                            Leave
                          </th>
                          <th className="px-4 py-3 text-center text-sm font-semibold">
                            Absent
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredStudents.map((student) => (
                          <tr key={student.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-800">
                              {student.id}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {student.regNo}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-800">
                              {student.name}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <input
                                type="radio"
                                name={`attendance-${student.id}`}
                                checked={
                                  attendanceStatus[student.id] === "present"
                                }
                                onChange={() =>
                                  handleStatusChange(student.id, "present")
                                }
                                className="w-4 h-4 text-green-600 focus:ring-green-500"
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <input
                                type="radio"
                                name={`attendance-${student.id}`}
                                checked={
                                  attendanceStatus[student.id] === "leave"
                                }
                                onChange={() =>
                                  handleStatusChange(student.id, "leave")
                                }
                                className="w-4 h-4 text-yellow-600 focus:ring-yellow-500"
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <input
                                type="radio"
                                name={`attendance-${student.id}`}
                                checked={
                                  attendanceStatus[student.id] === "absent" ||
                                  !attendanceStatus[student.id]
                                }
                                onChange={() =>
                                  handleStatusChange(student.id, "absent")
                                }
                                className="w-4 h-4 text-red-600 focus:ring-red-500"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="mt-6 flex justify-end">
                      <button className="px-6 py-3 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors font-semibold">
                        Submit Attendance
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* View Attendance Tab */}
            {activeTab === "view" && (
              <div className="space-y-6">
                {/* Filters */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course
                    </label>
                    <select
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">All Courses</option>
                      {sampleData.courses.map((course) => (
                        <option key={course.code} value={course.code}>
                          {course.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search Student ID
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Student ID"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                {/* Attendance Records */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-red-900 text-white">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          Student ID
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          Reg No
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          Student Name
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          Course
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {sampleData.attendance.map((record) => {
                        const student = sampleData.students.find(
                          (s) => s.id === record.studentId
                        );
                        const course = sampleData.courses.find(
                          (c) => c.code === record.courseCode
                        );

                        return (
                          <tr key={record.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-800">
                              {record.studentId}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {student?.regNo}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-800">
                              {record.studentName}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {course?.name}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {record.date}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  record.status === "present"
                                    ? "bg-green-100 text-green-700"
                                    : record.status === "leave"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {record.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
};

export default AttendancePage;
