import React, { useState } from 'react'
import Heading from '../Common/Heading'

const QueryForm = () => {
    const [selectedProgram, setSelectedProgram] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("");
    return (
        <div className='md:w-11/12 mx-auto w-full flex flex-col gap-4 shadow-[6px_6px_10px_rgba(0,0,0,0.3),-2px_0px_5px_rgba(0,0,0,0.1)]'>
            <Heading text="Query Form" />
            <div className='w-full flex flex-col gap-4 p-4'>
                <div className='w-full flex flex-col md:flex-row justify-between'>
                    <div className='md:w-1/3 w-full relative'>
                        <p className='font-primary text-md mb-1'>Registration Number *</p>
                        <div className="relative w-full">
                            <input
                                className='border border-primary pr-6 p-2 rounded-md focus:outline-primary w-full bg-white focus:ring-0 outline-none'
                                type="text"
                                placeholder="XXX/X-XX/XX/XX"
                            />
                        </div>
                    </div>
                    <div className='md:w-1/3 w-full relative'>
                        <p className='font-primary text-md mb-1'>Contact Number *</p>
                        <div className="relative w-full">
                            <input
                                className='border border-primary pr-6 p-2 rounded-md focus:outline-primary w-full bg-white focus:ring-0 outline-none'
                                type="text"
                                placeholder="0000-0000000"
                            />
                        </div>
                    </div>
                </div>
                <div className='w-full flex flex-row justify-between'>
                    <div className='md:w-1/3 w-full relative'>
                        <p className='font-primary text-md mb-1'>Student Name *</p>
                        <div className="relative w-full">
                            <input
                                className='border border-primary pr-6 p-2 rounded-md focus:outline-primary w-full bg-white focus:ring-0 outline-none'
                                type="text"
                                placeholder="Enter Your Name"
                            />
                        </div>
                    </div>
                </div>
                <div className='w-full flex flex-row justify-between'>
                    <div className='md:w-1/3 w-full relative'>
                        <p className='font-primary text-md mb-1'>Father Name *</p>
                        <div className="relative w-full">
                            <input
                                className='border border-primary pr-6 p-2 rounded-md focus:outline-primary w-full bg-white focus:ring-0 outline-none'
                                type="text"
                                placeholder="Enter Your Father Name"
                            />
                        </div>
                    </div>
                </div>
                <div className='w-full border border-primary' />
                <div className="max-w-lg">
                    <div className="mb-4">
                        <label className="block text-gray-800 font-medium mb-2">Program *</label>
                        <div className="flex gap-6 text-gray-600">
                            {["ADP", "BSCS", "BBA"].map((program) => (
                                <label key={program} className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="program"
                                        value={program}
                                        checked={selectedProgram === program}
                                        onChange={(e) => setSelectedProgram(e.target.value)}
                                        className="w-4 h-4 accent-gray-700"
                                    />
                                    <span>{program}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-800 font-medium mb-2">Department *</label>
                        <div className="flex gap-6 text-gray-600">
                            {["Acc", "Exam"].map((department) => (
                                <label key={department} className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="department"
                                        value={department}
                                        checked={selectedDepartment === department}
                                        onChange={(e) => setSelectedDepartment(e.target.value)}
                                        className="w-4 h-4 accent-gray-700"
                                    />
                                    <span>{department}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
                <div className='w-full border border-primary' />
                <div className='w-full flex flex-row justify-between'>
                    <div className='w-full h-[15vh] relative'>
                        <p className='font-primary text-md mb-1'>Reason for Query *</p>
                        <div className="relative w-full">
                            <textarea
                                className='border p-2 border-primary rounded-md focus:outline-primary w-full h-full bg-white focus:ring-0 outline-none resize-none'
                                placeholder="Enter Reason for Query"
                            />
                        </div>
                    </div>
                </div>
                <div className='w-full text-right mt-2'>
                    <button className='bg-[#259800] text-white rounded-md md:w-1/4 w-full py-2 font-primary font-xl'>
                        Submit
                    </button>
                </div>
            </div>
        </div>
    )
}

export default QueryForm