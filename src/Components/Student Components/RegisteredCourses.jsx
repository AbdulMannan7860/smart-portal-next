import React, { useContext, useEffect, useState } from "react";
import Heading from "../Common/Heading";
import DataTable from "../Common/DataTable";
import GetContext from "../../Context/GetContext/GetContext";

const RegisteredCourses = () => {
  const conntext = useContext(GetContext);
  const { getDataFromApi } = conntext;

  const [studentData, setStudentData] = useState({});

  // const getLatestSemesterData = (data) => {
  //   if (!Array.isArray(data) || data.length === 0) return [];

  //   const parsed = data.map((item) => {
  //     const [season, year] = item.FKSems_Name.split(" ");
  //     return {
  //       ...item,
  //       year: parseInt(year, 10),
  //       season,
  //       seasonRank: season.toUpperCase() === "SPRING" ? 1 : 2,
  //     };
  //   });

  //   const latestYear = Math.max(...parsed.map((item) => item.year));

  //   const latestYearData = parsed.filter((item) => item.year === latestYear);

  //   const latestSeasonRank = Math.max(
  //     ...latestYearData.map((item) => item.seasonRank)
  //   );

  //   return latestYearData.filter(
  //     (item) => item.seasonRank === latestSeasonRank
  //   );
  // };

  const getData = async () => {
    const data = await getDataFromApi(`/api/auth/student-schedule`);

    setStudentData(data?.data);
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      header: "S/No",
      accessorKey: "id",
      id: "id",
    },
    {
      header: "Course Name",
      accessorKey: "name",
      id: "name",
    },
    {
      header: "Course Code",
      accessorKey: "code",
      id: "code",
    },
    {
      header: "Instructor",
      accessorKey: "instructor",
      id: "instructor",
    },
  ];
  return (
    <div className="shadow-[6px_6px_10px_rgba(0,0,0,0.3),-2px_0px_5px_rgba(0,0,0,0.1)] overflow-hidden">
      <Heading text="Registered Courses" />
      <div className="p-2 pb-6 min-h-[40vh] overflow-y-auto customScroll">
        <DataTable columns={columns} data={studentData} />
      </div>
    </div>
  );
};

export default RegisteredCourses;
