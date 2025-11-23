import React from 'react'
import Heading from '../Common/Heading'
import CustomCalendar from '../Common/CustomCalendar'

const Calendar = () => {
  return (
    <div className='w-full flex flex-col gap-4'>
        <Heading text={'Quiz Details'} />

        <CustomCalendar />
    </div>
  )
}

export default Calendar

