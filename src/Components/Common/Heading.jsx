import React from 'react'

const Heading = ({ text }) => {
    return (
        <div className='p-1 pl-6 w-full bg-primary'>
            <h1 className='text-white font-semibold font-primary text-2xl'>{text}</h1>

        </div>
    )
}

export default Heading