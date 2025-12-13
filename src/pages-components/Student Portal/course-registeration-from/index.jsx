import React from "react";
import StudentLayout from "../../../Layout/Student Layout";

const student = {
  FullName: "Abdul Mannan Siddiqui",
  FatherName: "Nouman Ahmed Siddiqui",
  Reg_no: "BCS-M/SP-25/22",
  CNIC_BForm: "42501-1796044-1",
  Prog_Title: "BSCS(A) Computer Science",
  sems_Name: "SPRING 2025",
  phone1: "03164341642",
  Status: "Active",
};

const courses = [
  { Academic_Semester: "SPRING 2025", CourseCode: "CCM233", course_name: "Information Security", sGrade: "GRADE" },
  { Academic_Semester: "SPRING 2025", CourseCode: "CCM358", course_name: "Software Engineering", sGrade: "GRADE" },
  { Academic_Semester: "SPRING 2025", CourseCode: "UEC341", course_name: "Digital Marketing", sGrade: "GRADE" },
  { Academic_Semester: "SPRING 2025", CourseCode: "CCP366P", course_name: "Artificial Intelligence - PR", sGrade: "GRADE" },
  { Academic_Semester: "SPRING 2025", CourseCode: "CCP366", course_name: "Artificial Intelligence - TH", sGrade: "GRADE" },
  { Academic_Semester: "SPRING 2025", CourseCode: "MGT-124", course_name: "Principles of Management", sGrade: "GRADE" },
  { Academic_Semester: "SPRING 2025", CourseCode: "CCP232P", course_name: "COAL - PR", sGrade: "GRADE" },
  { Academic_Semester: "SPRING 2025", CourseCode: "CCP232", course_name: "COAL - TH", sGrade: "GRADE" },
  { Academic_Semester: "FALL 2025", CourseCode: "CCP244", course_name: "Theory of Automata", sGrade: "GRADE" },
  { Academic_Semester: "FALL 2025", CourseCode: "CCP231", course_name: "Design & Analysis of Algorithm", sGrade: "GRADE" },
  { Academic_Semester: "FALL 2025", CourseCode: "GEC233", course_name: "Professional Practices", sGrade: "GRADE" },
  { Academic_Semester: "FALL 2025", CourseCode: "MSF244", course_name: "Linear Algebra", sGrade: "GRADE" },
  { Academic_Semester: "FALL 2025", CourseCode: "MSF112", course_name: "Applied Physics", sGrade: "GRADE" },
];

/* ================= COMPONENT ================= */
const Index = () => {
  return (
    <StudentLayout>
      <div className="container mx-auto p-6 bg-white text-sm">

        {/* ========= STUDENT INFO ========= */}
        <h2 className="text-lg font-bold mb-4 border-b pb-2">
          Student Information
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p><strong>Student Name:</strong> {student.FullName}</p>
            <p><strong>Registration No:</strong> {student.Reg_no}</p>
            <p><strong>CNIC / B-Form:</strong> {student.CNIC_BForm}</p>
            <p><strong>Program:</strong> {student.Prog_Title}</p>
            <p><strong>Semester:</strong> Spring</p>
            <p><strong>Year:</strong> 2025</p>
          </div>

          <div>
            <p><strong>Father Name:</strong> {student.FatherName}</p>
            <p><strong>Batch / Session:</strong> Morning</p>
            <p><strong>Contact No:</strong> {student.phone1}</p>
            <p><strong>Status:</strong> {student.Status}</p>
          </div>
        </div>

        {/* ========= COURSE TABLE ========= */}
        <h2 className="text-lg font-bold mb-3 border-b pb-2">
          Course Registration & Grades Record
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Sr#</th>
                <th className="border p-2">Semester</th>
                <th className="border p-2">Pre Requiste</th>
                <th className="border p-2">Course Code</th>
                <th className="border p-2">Course Title</th>
                <th className="border p-2">Credit Hours</th>
                <th className="border p-2">Grade</th>
                <th className="border p-2">Grade Points</th>
                <th className="border p-2">Remarks</th>
              </tr>
            </thead>

            <tbody>
              {courses.map((c, i) => (
                <tr key={i}>
                  <td className="border p-2 text-center">{i + 1}</td>
                  <td className="border p-2">{c.Academic_Semester}</td>
                  <td className="border p-2">----</td>
                  <td className="border p-2">{c.CourseCode}</td>
                  <td className="border p-2">{c.course_name}</td>
                  <td className="border p-2 text-center">3</td>
                  <td className="border p-2 text-center">{c.sGrade}</td>
                  <td className="border p-2 text-center">—</td>
                  <td className="border p-2"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ========= SUMMARY ========= */}
        {/* <h2 className="text-lg font-bold mt-8 mb-4 border-b pb-2">
          Semester-wise Summary
        </h2> */}

        {/* <div className="grid grid-cols-2 gap-6">
          <p><strong>Total Credit Hours Registered:</strong> {courses.length * 3}</p>
          <p><strong>Total Credit Hours Earned:</strong> —</p>
          <p><strong>Semester GPA (SGPA):</strong> —</p>
          <p><strong>Cumulative GPA (CGPA):</strong> —</p>
        </div> */}

      </div>
    </StudentLayout>
  );
};

export default Index;
