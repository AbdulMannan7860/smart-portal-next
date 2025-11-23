import React, { useContext, useEffect, useMemo, useState } from "react";
import GetContext from "@/Context/GetContext/GetContext";
import { sampleData } from "@/MockData/Data";
import TeacherLayout from "@/Layout/Teacher Layout";
import format24hto12hAMPM from "@/utils/format24hto12hAMPM";

const SchedulePage = () => {
  const context = useContext(GetContext);
  const { getDataFromApi } = context;

  const [scheduleData, setScheduleData] = useState([]);

  const getData = async () => {
    const response = await getDataFromApi("/api/schedule/get-schedule");
    setScheduleData(response.data);
  };

  useEffect(() => {
    getData();
  }, []);

  const [selectedDay, setSelectedDay] = useState("All");
  const days = [
    "All",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

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
          time,
          room: item.room,
          session: item.session,
          semester: [item.semester],
        });
      }
    });

    return merged;
  };

  const schedules = useMemo(
    () => transformSchedule(scheduleData),
    [scheduleData]
  );
  
  const filteredSchedule =
    selectedDay === "All"
      ? schedules
      : schedules.filter((s) => s.day === selectedDay);
  return (
    <TeacherLayout>
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-md">
          <div className="bg-red-800 text-white px-6 py-4 rounded-t-xl">
            <h2 className="text-2xl font-bold">Class Schedule</h2>
            <p className="text-red-100 text-sm mt-1">
              View your weekly teaching schedule
            </p>
          </div>

          <div className="p-6">
            <div className="flex flex-wrap gap-2 mb-6">
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedDay === day
                      ? "bg-red-800 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-red-900 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Day
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Course
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Time
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Room
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Semester
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Session
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredSchedule.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm font-medium text-gray-800">
                        {item.day}
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {item.courseName}
                          </p>
                          <p className="text-xs text-gray-600">
                            {item.courseCode}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {item.time}
                      </td>
                      <td className="px-4 py-4">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                          {item.room}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {item.semester.join(", ")}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            item.session === "Morning"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {item.session}
                        </span>
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

export default SchedulePage;
