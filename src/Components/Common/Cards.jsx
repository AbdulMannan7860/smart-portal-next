import React from 'react'

const Cards = ({ count, title }) => {
    return (
        <div className='w-full bg-primary text-white p-4 flex flex-col gap-2 rounded-md'>
            <h1 className='font-semibold font-primary text-2xl'>{count}</h1>
            <p className='font-primary text-md'>{title}</p>
        </div>
    )
}

export default Cards