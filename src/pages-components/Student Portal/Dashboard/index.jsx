import React from 'react'
import StudentLayout from '../../../Layout/Student Layout'
import StudentProfile from '../../../Components/Student Components/Student Profile'
import RegisteredCourses from '../../../Components/Student Components/RegisteredCourses'
import MySchedule from '../../../Components/Student Components/MySchedule'

const Index = () => {
    return (
        <StudentLayout>
            <div className='flex flex-col md:flex-row justify-around h-full'>
                <div className='w-full md:w-[30%] h-full flex mb-4 md:mb-0'>
                    <StudentProfile className="h-full w-full" />
                </div>
                <div className='flex flex-col w-full md:w-[65%] gap-4 h-full'>
                    <RegisteredCourses />
                    <MySchedule />
                </div>
            </div>
        </StudentLayout>
    )
}


export default Index
