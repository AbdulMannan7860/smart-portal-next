import React from 'react'
// import clock from '@assets/Icon/Clock.svg'
// import form from '@assets/Icon/Form.svg'
// import download from '@./assets/Icon/Download.svg'
import { Clock, Download, FormInputIcon } from 'lucide-react'

const LectureCards = ({ week, hours, lesson }) => {
    return (
        <div className='w-full flex md:flex-col flex-row gap-3 p-2 md:items-start items-end justify-between shadow-md shadow-black/20 rounded-lg border border-gray-200'>
            <div className=''>
                <h1 className='font-semibold text-lg font-primary'>Week - {week}</h1>
                <div className="text-sm font-primary flex flex-col gap-2">
                    <div className="flex flex-col md:flex-row items-start md:items-center md:gap-0 gap-2">
                        <span className="flex items-center text-gray-700 font-medium">
                            {/* <img src={clock} alt="" className="w-5 h-5" /> */}
                            <Clock />
                            <p>{hours} hrs</p>
                        </span>
                        <span className="flex items-center text-gray-700 font-medium">
                            {/* <img src={form} alt="" className='w-5 h-5' /> */}
                            <FormInputIcon />
                            <p>{lesson} Lessons</p>
                        </span>
                    </div>
                </div>
            </div>

            <button className='bg-[#259800] text-white px-3 py-1 rounded-md flex items-center gap-1 justify-between w-fit h-fit md:w-[55%]'>
                {/* <img src={download} alt="" className='w-5 h-5' /> */}
                <Download />
                Download
            </button>
        </div>
    )
}

export default LectureCards