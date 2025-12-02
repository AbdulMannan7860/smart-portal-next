import React from 'react';
import StudentLayout from '../../../Layout/Student Layout';

function Transcript() {
  const studentData = {
    registrationNo: "BCS-M/SP-23/01",
    studentName: "Muhammad Abdul Rafay",
    program: "Bachelor Of Science In Computer Science (BSCS)",
    fatherName: "Aftab Mateen",
    dateOfBirth: "05-09-2001",
  };

  const courses = [
    { code: "CS1103", title: "Computer Programming", hours: 4, grade: "A+" },
    { code: "CS1113", title: "Introduction to Computer Science", hours: 4, grade: "C+" },
    { code: "GSA1003", title: "English", hours: 3, grade: "D+" },
    { code: "SS1420", title: "Islamic Studies", hours: 2, grade: "C" },
    { code: "MT1110", title: "Calculus-I", hours: 3, grade: "B+" },
    { code: "CS1420", title: "Object Oriented Programming", hours: 4, grade: "B" },
    { code: "CS1421", title: "Object Oriented Programming Lab", hours: 1, grade: "D" },
    { code: "MT1111", title: "Calculus-II", hours: 3, grade: "A" },
    { code: "SS2120", title: "Oral Communications", hours: 4, grade: "A+" },
    { code: "CS1230", title: "Digital Logic Design", hours: 4, grade: "C" },
    { code: "CS2511", title: "Data Structure and Algorithms", hours: 4, grade: "A+" },
    { code: "CS1103", title: "Computer Programming", hours: 4, grade: "A+" },
    { code: "CS1113", title: "Introduction to Computer Science", hours: 4, grade: "C+" },
    { code: "GSA1003", title: "English", hours: 3, grade: "D+" },
    { code: "SS1420", title: "Islamic Studies", hours: 2, grade: "C" },
    { code: "MT1110", title: "Calculus-I", hours: 3, grade: "B+" },
    { code: "CS1420", title: "Object Oriented Programming", hours: 4, grade: "B" },
    { code: "CS1421", title: "Object Oriented Programming Lab", hours: 1, grade: "D" },
    { code: "MT1111", title: "Calculus-II", hours: 3, grade: "A" },
    { code: "SS2120", title: "Oral Communications", hours: 4, grade: "A+" },
  ];

  return (
    <StudentLayout>
      <div className="container mx-auto p-4">
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Official Transcript</h2>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Student Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
            <p><strong>Registration No :</strong> {studentData.registrationNo}</p>
            <p><strong>Student Name :</strong> {studentData.studentName}</p>
            <p><strong>Program :</strong> {studentData.program}</p>
            <p><strong>Father Name :</strong> {studentData.fatherName}</p>
            <p><strong>Date Of Birth :</strong> {studentData.dateOfBirth}</p>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Course Details</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Course Code</th>
                  <th className="py-3 px-6 text-left">Course Title</th>
                  <th className="py-3 px-6 text-left">Course Hours</th>
                  <th className="py-3 px-6 text-left">Grade</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {courses.map((course, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">{course.code}</td>
                    <td className="py-3 px-6 text-left">{course.title}</td>
                    <td className="py-3 px-6 text-left">{course.hours}</td>
                    <td className="py-3 px-6 text-left">{course.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}

export default Transcript;
