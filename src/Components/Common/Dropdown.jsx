import React from 'react'
import { FaChevronDown } from "react-icons/fa";

const Dropdown = ({ text, dropDownValue, setDropDownValue, data }) => {
    return (
        <div>
            <div className='w-full relative'>
                <p className='font-primary text-md mb-1'>{text} </p>
                <div className="relative w-full">
                    <select
                        className='border border-primary pr-6 p-2 rounded-md focus:outline-primary w-full appearance-none bg-white cursor-pointer focus:ring-0 outline-none'
                        value={dropDownValue}
                        onChange={(e) => setDropDownValue(e.target.value)}
                    >
                        <option value="" disabled>Select Subject</option>
                        {data.map((subject, index) => (
                            <option className='cursor-pointer' key={index} value={subject}>{subject}</option>
                        ))}
                    </select>
                    <FaChevronDown className="absolute top-3 right-3 text-gray-500 pointer-events-none" />
                </div>
            </div>
        </div>
    )
}

export default Dropdown