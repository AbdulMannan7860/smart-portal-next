import React from 'react'
import Cards from '../Common/Cards'

const CourseCard = () => {
    return (
        <div className='w-full gap-2 flex flex-col md:flex-row justify-between'>
            <Cards count="03" title="Semesters Assigments Conducted" />
            <Cards count="01" title="Assignments to be Submitted" />
            <Cards count="01" title="Assignments Closed" />
        </div>
    )
}

export default CourseCard