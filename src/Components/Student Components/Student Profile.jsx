import React, { useContext, useEffect, useState } from "react";
import Heading from "../Common/Heading";
import GetContext from "../../Context/GetContext/GetContext";

const StudentProfile = () => {
  const conntext = useContext(GetContext);
  const { getDataFromApi } = conntext;

  const [studentData, setStudentData] = useState({});

  const [student, setStudent] = useState({});

  useEffect(() => {
    const student = JSON.parse(localStorage.getItem("student"));
    setStudent(student);
  }, []);

  const getData = async () => {
    const data = await getDataFromApi(`/api/auth/student-profile`);
    setStudentData(data?.data);
  };

  useEffect(() => {
    getData();
  }, []);
  
  return (
    <div className="shadow-[6px_6px_10px_rgba(0,0,0,0.3),-2px_0px_5px_rgba(0,0,0,0.1)] overflow-hidden w-full">
      <Heading text="Profile" />

      <div className="flex flex-col items-center p-2 gap-4">
        <img
          className="w-[229px] h-[229px] border-4 rounded-full object-cover"
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80"
          alt="User Profile"
        />
        <div>
          <h1 className="font-semibold font-primary text-xl">
            {student?.FirstName}
          </h1>
          <h1 className="font-primary text-gray-700 text-lg">
            {student?.Email_Primary || "N/A"}
          </h1>
        </div>
      </div>

      <div className="mt-4 flex-col flex gap-4 p-4">
        <div>
          <h1 className="font-semibold font-primary text-md">
            Registration Number:
          </h1>
          <p className="text-gray-700 text-sm">{studentData?.Reg_no}</p>
        </div>
        <div>
          <h1 className="font-semibold font-primary text-md">Semester:</h1>
          <p className="text-gray-700 text-sm">
            {studentData?.sems_Name +
              " (" +
              studentData?.Cur_Semester +
              (studentData?.Cur_Semester === 1
                ? "st "
                : studentData?.Cur_Semester === 2
                  ? "nd "
                  : studentData?.Cur_Semester === 3
                    ? "rd "
                    : "th ")}{" "}
            Semester)
          </p>
        </div>
        <div>
          <h1 className="font-semibold font-primary text-md">Program:</h1>
          <p className="text-gray-700 text-sm">{studentData?.Prog_Title}</p>
        </div>
        <div>
          <h1 className="font-semibold font-primary text-md">Status:</h1>
          <p className="text-white bg-[#4EF567] w-fit px-3 p-1 text-sm">
            {studentData?.Status}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
