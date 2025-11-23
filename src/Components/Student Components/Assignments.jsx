import React from "react";
import Heading from "../Common/Heading";
import { assignments } from "../../MockData/Data";

const Assignments = ({ dropDownValue }) => {
    const filteredAssignments = dropDownValue
        ? assignments.filter((assignment) => assignment.course === dropDownValue)
        : assignments;

    return (
        <div className="w-full flex flex-col gap-2 shadow-[6px_6px_10px_rgba(0,0,0,0.3),-2px_0px_5px_rgba(0,0,0,0.1)] overflow-hidden">
            <Heading text="Assignments" />
            <div className="w-full p-4 max-h-[40vh] overflow-y-auto customScroll">
                <div className="hidden gap-1 md:gap-0 md:grid bg-secondary grid-cols-6 p-3 text-center shadow-md rounded">
                    <p className="font-semibold text-gray-700">Assignment Title</p>
                    <p className="font-semibold text-gray-700">Course</p>
                    <p className="font-semibold text-gray-700">Topic</p>
                    <p className="font-semibold text-gray-700">Due Date</p>
                    <p className="font-semibold text-gray-700">Status</p>
                    <p className="font-semibold text-gray-700">Submit</p>
                </div>

                <div className="w-full flex flex-col gap-2 mt-2">
                    {filteredAssignments.map((assignment, index) => (
                        <div
                            key={index}
                            className="bg-white grid grid-cols-3 md:grid-cols-6 p-1
                             border border-gray-200 text-center rounded"
                        >
                            <p className="text-gray-500 text-sm">
                                {assignment.title.length > 10
                                    ? assignment.title.substring(0, 10) + "..."
                                    : assignment.title}
                            </p>
                            <p className="text-gray-500 text-sm">
                                {assignment.course.length > 10
                                    ? assignment.course.substring(0, 10) + "..."
                                    : assignment.course}
                            </p>
                            <p className="text-gray-500 text-sm">
                                {assignment.topic.length > 10
                                    ? assignment.topic.substring(0, 10) + "..."
                                    : assignment.topic}
                            </p>
                            <p className="text-gray-500 text-sm">{assignment.dueDate}</p>
                            <p className="text-center text-sm text-gray-500 ">
                                <span className={`flex flex-row items-center rounded-lg w-full md:w-fit gap-1 px-2 ${assignment.status === "Overdue"
                                    ? "text-red-600 bg-red-100"
                                    : assignment.status === "Submitted"
                                        ? "text-green-600 bg-green-100"
                                        : "text-blue-600 bg-blue-100"
                                    }`}>
                                    <span className={`size-[10px] rounded-full ${assignment.status === "Overdue"
                                        ? "bg-red-600"
                                        : assignment.status === "Submitted"
                                            ? "bg-green-600"
                                            : "bg-blue-600 "
                                        }`} />
                                    {assignment.status}
                                </span>
                            </p>
                            <button className="bg-primaryBlue text-secondary hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer px-3 rounded-md">
                                Submit
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Assignments;
