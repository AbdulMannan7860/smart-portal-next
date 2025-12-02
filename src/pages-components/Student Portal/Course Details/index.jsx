import React, { useState } from 'react';
import StudentLayout from '../../../Layout/Student Layout';
import Dropdown from '../../../Components/Common/Dropdown';
import Assignments from '../../../Components/Student Components/Assignments';
import CourseCard from '../../../Components/Student Components/CourseCard';
import LecturesDetails from '../../../Components/Student Components/LecturesDetails';
import { subjects } from '../../../MockData/Data';
import Calendar from '../../../Components/Student Components/Calendar';
import UpcommingQuiz from '../../../Components/Student Components/UpcommingQuiz';
import QuizResult from '../../../Components/Student Components/QuizResult';

const Index = () => {
    const [dropDownValue, setDropDownValue] = useState('');
    return (
        <StudentLayout>
            <div className='w-full h-full flex flex-col md:flex-row gap-2'>
                <div className='w-full md:w-[70%] flex flex-col gap-6 h-full'>
                    <div className='w-full md:w-fit'>
                        <Dropdown text="Subject *" dropDownValue={dropDownValue} setDropDownValue={setDropDownValue} data={subjects} />
                    </div>
                    <div className='w-full'>
                        <CourseCard />
                    </div>
                    <div className='w-full'>
                        <Assignments dropDownValue={dropDownValue} />
                    </div>
                    <div className='w-full'>
                        <LecturesDetails />
                    </div>
                </div>
                <div className='w-full md:w-[30%] shadow-[6px_6px_10px_rgba(0,0,0,0.3),-2px_0px_5px_rgba(0,0,0,0.1)] flex flex-col gap-2'>
                    <Calendar />
                    <UpcommingQuiz />
                    <QuizResult />
                </div>
            </div>
        </StudentLayout >
    );
}

export default Index;
