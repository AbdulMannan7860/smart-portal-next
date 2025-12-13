import React, { useContext, useEffect, useState } from "react";
import Heading from "../Common/Heading";
import DataTable from "../Common/DataTable";
import GetContext from "../../Context/GetContext/GetContext";

const MySchedule = () => {
  const context = useContext(GetContext);
  const { getDataFromApi } = context;

  const [scheduleData, setScheduleData] = useState([]);

  // const getLatestSemesterData = (data) => {
  //     if (!Array.isArray(data) || data.length === 0) return [];

  //     const parsed = data.map(item => {
  //         const [season, year] = item.FKSems_Name.split(" ");
  //         return {
  //             ...item,
  //             year: parseInt(year, 10),
  //             season,
  //             seasonRank: season.toUpperCase() === "SPRING" ? 1 : 2
  //         };
  //     });

  //     const latestYear = Math.max(...parsed.map(item => item.year));
  //     const latestYearData = parsed.filter(item => item.year === latestYear);
  //     const latestSeasonRank = Math.max(...latestYearData.map(item => item.seasonRank));

  //     return latestYearData.filter(item => item.seasonRank === latestSeasonRank);
  // };
  const buildSchedule = (latestData) => {
    const dayOrder = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    // Base schedule structure
    const schedule = dayOrder.map((day) => ({
      day,
      slot1: "-",
      slot2: "-",
    }));

    latestData.forEach((item) => {
      const row = schedule.find((s) => s.day === item.day);
      if (!row) return;

      const isMorning = item.session === "Morning";
      const isEvening = item.session === "Evening";

      const start = item.class_start_time;

      const courseLabel = item.courseName || item.courseCode;

      // ---------- MORNING ----------
      if (isMorning) {
        if (start === "09:00:00") {
          row.slot1 = courseLabel;
        } else {
          row.slot2 = courseLabel;
        }
      }

      // ---------- EVENING ----------
      else if (isEvening) {
        if (start === "06:00:00" || start === "18:00:00") {
          row.slot1 = courseLabel;
        } else {
          row.slot2 = courseLabel;
        }
      }
    });

    return schedule;
  };

  const getData = async () => {
    const data = await getDataFromApi("/api/schedule/get-schedule");

    const setData = buildSchedule(data?.data);
    setScheduleData(setData);
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      header: "",
      accessorKey: "day",
      id: "day",
      cell: (cell) => <p className="font-semibold">{cell.getValue()}</p>,
    },
    {
      header: "9:00 AM - 11:00 AM",
      accessorKey: "slot1",
      id: "slot1",
    },
    {
      header: "11:00 AM - 1:00 PM",
      accessorKey: "slot2",
      id: "slot2",
    },
  ];

  return (
    <div className="shadow-[6px_6px_10px_rgba(0,0,0,0.3),-2px_0px_5px_rgba(0,0,0,0.1)] overflow-hidden">
      <Heading text="My Schedule" />
      <div className="p-2 pb-6 min-h-[40vh] overflow-y-auto customScroll">
        <DataTable columns={columns} data={scheduleData} border={"day"} />
      </div>
    </div>
  );
};

export default MySchedule;
