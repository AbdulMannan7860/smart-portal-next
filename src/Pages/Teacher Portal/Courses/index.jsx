import React, { useContext, useEffect, useMemo, useState } from "react";
import { Download, Upload } from "lucide-react";
import { sampleData } from "@/MockData/Data";
import TeacherLayout from "@/Layout/Teacher Layout";
import GetContext from "@/Context/GetContext/GetContext";
import format24hto12hAMPM from "@/utils/format24hto12hAMPM";
import PostContext from "@/Context/PostContext/PostContext";
import Modal from "@/Components/Common/Modal";

const CourseOutlinePage = () => {
  const context = useContext(GetContext);
  const { getDataFromApi } = context;

  const postContext = useContext(PostContext);
  const { postFormDataToApi } = postContext;

  const [scheduleData, setScheduleData] = useState([]);

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [modalData, setModalData] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (course) => {
    if (!selectedFile) {
      setModalData({
        isOpen: true,
        title: "No File Selected",
        message: "Please select a file to upload.",
      });
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("courseCode", course.courseCode);
      formData.append("teacherName", course.teacherName);
      formData.append("day", course.day);
      formData.append("session", course.session);
      formData.append("room", course.room);
      formData.append("startTime", course.class_start_time);

      const res = await postFormDataToApi(
        "/api/outline/upload-outline",
        formData
      );
      if (res?.success) {
        setModalData({
          isOpen: true,
          title: "Upload Successful",
          message: `Outline uploaded for course ${course.courseName} (${
            course.courseCode
          }) for semester(s): ${res.semesters.join(", ")}`,
        });
      } else {
        setModalData({
          isOpen: true,
          title: "Upload Failed",
          message: res.error || "Something went wrong",
        });
      }
    } catch (error) {
      setModalData({
        isOpen: true,
        title: "Upload Failed",
        message: error.message,
      });
    } finally {
      setUploading(false);
    }
  };

  const getData = async () => {
    const response = await getDataFromApi("/api/schedule/get-schedule");
    setScheduleData(response.data);
  };

  useEffect(() => {
    getData();
  }, []);

  const transformSchedule = (scheduleArray) => {
    const merged = [];

    scheduleArray.forEach((item) => {
      const time = `${format24hto12hAMPM(
        item.class_start_time
      )} - ${format24hto12hAMPM(item.class_end_time)}`;

      const existing = merged.find(
        (c) =>
          c.day === item.day &&
          c.courseCode === item.courseCode &&
          c.room === item.room &&
          c.time === time
      );

      if (existing) {
        if (!existing.semester.includes(item.semester)) {
          existing.semester.push(item.semester);
        }
      } else {
        merged.push({
          day: item.day,
          courseCode: item.courseCode,
          courseName: item.courseName,
          teacherName: item.teacherName,
          class_start_time: item.class_start_time,
          time,
          credits: item.credits,
          room: item.room,
          session: item.session,
          semester: [item.semester],
        });
      }
    });

    return merged;
  };

  const courses = useMemo(() => {
    return transformSchedule(scheduleData) || [];
  }, [scheduleData]);

  return (
    <>
      <TeacherLayout>
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md">
            <div className="bg-red-800 text-white px-6 py-4 rounded-t-xl">
              <h2 className="text-2xl font-bold">Course Outlines</h2>
              <p className="text-red-100 text-sm mt-1">
                Download and upload course outlines
              </p>
            </div>

            <div className="p-6 space-y-4">
              {courses.length > 0 ? (
                courses.map((course) => (
                  <div
                    key={course.courseCode}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800">
                          {course.courseName}
                        </h3>
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                          <span className="flex items-center gap-2">
                            <span className="font-medium text-gray-700">
                              Course Code:
                            </span>
                            {course.courseCode}
                          </span>
                          <span className="flex items-center gap-2">
                            <span className="font-medium text-gray-700">
                              Credits:
                            </span>
                            {course.credits}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-2">
                          {course.day + " " + course.session}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors">
                          <Download size={18} />
                          Download
                        </button>
                        <div className="flex gap-2">
                          <input
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                            id={`file-input-${course.courseCode}`}
                          />
                          <label
                            htmlFor={`file-input-${course.courseCode}`}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer"
                          >
                            <Upload size={18} />
                            Select File
                          </label>

                          <button
                            onClick={() => handleUpload(course)}
                            className={`flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors ${
                              uploading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            disabled={uploading}
                          >
                            <Upload size={18} />
                            {uploading ? "Uploading..." : "Upload"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-600">
                  No course outline found
                </div>
              )}
            </div>
          </div>
        </div>
      </TeacherLayout>
      <Modal
        isOpen={modalData.isOpen}
        onClose={() => setModalData({ ...modalData, isOpen: false })}
        title={modalData.title}
        message={modalData.message}
      />
    </>
  );
};

export default CourseOutlinePage;
