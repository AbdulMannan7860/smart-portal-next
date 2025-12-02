import React, { useState } from "react";
import { sampleData } from "../../../MockData/Data";
import { Plus, Eye, Download, Trash2 } from "lucide-react";
import TeacherLayout from "@/Layout/Teacher Layout";

const LecturesPage = () => {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");

  const filteredLectures = selectedCourse
    ? sampleData.lectures.filter((l) => l.courseCode === selectedCourse)
    : sampleData.lectures;

  return (
    <TeacherLayout>
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-md">
          <div className="bg-red-800 text-white px-6 py-4 rounded-t-xl flex items-center justify-between z-[100]">
            <div>
              <h2 className="text-2xl font-bold">Lecture Materials</h2>
              <p className="text-red-100 text-sm mt-1">
                Upload and manage lecture materials
              </p>
            </div>
            <button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-white text-red-800 rounded-lg hover:bg-red-50 transition-colors font-semibold"
            >
              <Plus size={20} />
              Upload Lecture
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Upload Form */}
            {showUploadForm && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Upload New Lecture
                </h3>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Topic
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Graph Algorithms"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
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
                      Class Number
                    </label>
                    <input
                      type="number"
                      placeholder="e.g., 5"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload File
                  </label>
                  <input
                    type="file"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-3">
                  <button className="px-6 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors font-semibold">
                    Upload Lecture
                  </button>
                  <button
                    onClick={() => setShowUploadForm(false)}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Filter */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">
                Filter by Course:
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              >
                <option value="">All Courses</option>
                {sampleData.courses.map((course) => (
                  <option key={course.code} value={course.code}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Lectures List */}
            <div className="space-y-4">
              {filteredLectures.map((lecture) => {
                const course = sampleData.courses.find(
                  (c) => c.code === lecture.courseCode
                );
                return (
                  <div
                    key={lecture.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-lg">
                          {lecture.topic}
                        </h4>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span className="font-medium">
                            Course: {course?.name}
                          </span>
                          <span>Class: {lecture.class}</span>
                          <span>Uploaded: {lecture.uploadDate}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download size={18} />
                        </button>
                        <button
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
};

export default LecturesPage;
