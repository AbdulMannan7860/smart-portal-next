import React from 'react'

const QuizResult = () => {
    const quizList = [
        {
            title: 'User Research & Personas',
            obtained: 2,
            total: 3
        },
        {
            title: 'Visual Design & Branding',
            obtained: 1,
            total: 3
        },
        {
            title: 'Design System & Components',
            obtained: 0,
            total: 2.5
        },
    ]
    return (
        <main className='p-2 w-full flex flex-col gap-2 items-center'>
            <div className='grid grid-cols-3 bg-gray-200 text-center w-full text-gray-600 text-base font-semibold p-2 rounded'>
                <p>Quiz</p>
                <p>Total</p>
                <p>Obtained</p>
            </div>
            {quizList.length > 0 ?
                quizList.map((quiz, index) => (
                    <div key={index} className='grid grid-cols-3 items-center border border-gray-200 text-center w-full text-gray-400 text-base p-2 rounded cursor-pointer'>
                        <p className='truncate text-black'>{quiz.title}</p>
                        <p>{quiz.total}</p>
                        <p>{quiz.obtained}</p>
                    </div>
                ))
                :
                <div className='bg-gray-200 text-center w-full text-gray-600 text-base font-semibold p-2 rounded'>
                    <p>No Upcoming Quiz</p>
                </div>
            }
        </main>
    )
}

export default QuizResult