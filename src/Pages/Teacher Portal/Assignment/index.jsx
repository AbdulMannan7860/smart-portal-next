// Assignments Page
import React, { useState } from "react";
import { sampleData } from "../../../MockData/Data";
import { Plus, Edit2 } from "lucide-react";
import TeacherLayout from "../../../Layout/Teacher Layout";

const AssignmentsPage = () => {
  const [activeTab, setActiveTab] = useState("view");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  return (
    <TeacherLayout>
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-md">
          <div className="bg-red-800 text-white px-6 py-4 rounded-t-xl">
            <h2 className="text-2xl font-bold">Assignments</h2>
            <p className="text-red-100 text-sm mt-1">
              Create and manage course assignments
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("create")}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === "create"
                  ? "text-red-800 border-b-2 border-red-800 bg-red-50"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              Upload Assignment
            </button>
            <button
              onClick={() => setActiveTab("view")}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === "view"
                  ? "text-red-800 border-b-2 border-red-800 bg-red-50"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              Uploaded Assignments
            </button>
          </div>

          <div className="p-6">
            {/* Create Tab */}
            {activeTab === "create" && (
              <div className="space-y-4">
                <button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="flex items-center gap-2 px-6 py-3 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors font-semibold"
                >
                  <Plus size={20} />
                  Create New Assignment
                </button>

                {showCreateForm && (
                  <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 space-y-4">
                    <h3 className="text-lg font-bold text-gray-800">
                      New Assignment
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Course
                        </label>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500">
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
                          Title
                        </label>
                        <input
                          type="text"
                          placeholder="Assignment Title"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Due Date
                        </label>
                        <input
                          type="date"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Total Marks
                        </label>
                        <input
                          type="number"
                          placeholder="e.g., 20"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Semester
                        </label>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500">
                          <option value="">Select Semester</option>
                          <option value="1st">1st</option>
                          <option value="3rd">3rd</option>
                          <option value="5th">5th</option>
                          <option value="6th">6th</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Session
                        </label>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500">
                          <option value="">Select Session</option>
                          <option value="Morning">Morning</option>
                          <option value="Evening">Evening</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Instructions
                      </label>
                      <textarea
                        rows="4"
                        placeholder="Enter assignment instructions..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button className="px-6 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors font-semibold">
                        Create Assignment
                      </button>
                      <button
                        onClick={() => setShowCreateForm(false)}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* View Tab */}
            {activeTab === "view" && (
              <div className="space-y-6">
                {sampleData.assignments.map((assignment) => {
                  const course = sampleData.courses.find(
                    (c) => c.code === assignment.courseCode
                  );
                  const submissions = sampleData.submissions.filter(
                    (s) => s.assignmentId === assignment.id
                  );

                  return (
                    <div
                      key={assignment.id}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <div className="bg-gray-50 p-4 border-b border-gray-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-gray-800">
                              {assignment.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {course?.name} ({assignment.courseCode})
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                              <span className="font-medium">
                                Total Marks: {assignment.marks}
                              </span>
                              <span>Due: {assignment.dueDate}</span>
                              <span>Semester: {assignment.semester}</span>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  assignment.session === "Morning"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-purple-100 text-purple-700"
                                }`}
                              >
                                {assignment.session}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              setSelectedAssignment(
                                selectedAssignment === assignment.id
                                  ? null
                                  : assignment.id
                              )
                            }
                            className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors text-sm font-semibold"
                          >
                            {selectedAssignment === assignment.id
                              ? "Hide"
                              : "View"}{" "}
                            Submissions
                          </button>
                        </div>
                        <p className="text-sm text-gray-700 mt-3">
                          {assignment.description}
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">
                            Submissions:
                          </span>
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                            {submissions.length} / {assignment.submissions}
                          </span>
                        </div>
                      </div>

                      {/* Submissions Table */}
                      {selectedAssignment === assignment.id &&
                        submissions.length > 0 && (
                          <div className="p-4">
                            <h5 className="font-semibold text-gray-800 mb-3">
                              Student Submissions
                            </h5>
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead className="bg-gray-100">
                                  <tr>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                                      Student
                                    </th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                                      Reg No
                                    </th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                                      Submitted Date
                                    </th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                                      File
                                    </th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                                      Marks
                                    </th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                                      Status
                                    </th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                                      Action
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                  {submissions.map((sub) => {
                                    const student = sampleData.students.find(
                                      (s) => s.id === sub.studentId
                                    );
                                    return (
                                      <tr
                                        key={sub.id}
                                        className="hover:bg-gray-50"
                                      >
                                        <td className="px-4 py-3 text-sm text-gray-800">
                                          {sub.studentName}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                          {student?.regNo}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                          {sub.submittedDate}
                                        </td>
                                        <td className="px-4 py-3">
                                          <a
                                            href="#"
                                            className="text-blue-600 hover:underline text-sm"
                                          >
                                            {sub.file}
                                          </a>
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                          {sub.marks !== null ? (
                                            <span className="font-semibold text-gray-800">
                                              {sub.marks} / {sub.totalMarks}
                                            </span>
                                          ) : (
                                            <input
                                              type="number"
                                              placeholder="Enter"
                                              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                            />
                                          )}
                                        </td>
                                        <td className="px-4 py-3">
                                          <span
                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                              sub.status === "graded"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-orange-100 text-orange-700"
                                            }`}
                                          >
                                            {sub.status}
                                          </span>
                                        </td>
                                        <td className="px-4 py-3">
                                          {sub.status === "pending" ? (
                                            <button className="text-red-600 hover:text-red-800 font-semibold text-sm">
                                              Grade
                                            </button>
                                          ) : (
                                            <button className="text-blue-600 hover:text-blue-800 text-sm">
                                              <Edit2 size={16} />
                                            </button>
                                          )}
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
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
};

export default AssignmentsPage;
