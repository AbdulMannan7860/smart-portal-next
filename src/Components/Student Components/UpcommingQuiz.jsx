import React from 'react'

const UpcommingQuiz = () => {
    const quizList = [
        {
            title: 'User Research and Personas',
        },
        {
            title: 'Visual Design and Branding',
        },
        {
            title: 'Design System and Components',
        },
    ]
    return (
        <main className='p-2 w-full flex flex-col gap-2 items-center'>
            <div className='bg-gray-200 text-center w-full text-gray-600 text-base font-semibold p-2 rounded'>
                <p>Upcoming Quiz..</p>
            </div>
            {quizList.length > 0 ?
                quizList.map((quiz, index) => (
                    <div key={index} className='border border-gray-200 text-center w-full text-gray-400 text-base p-2 rounded cursor-pointer'>
                        <p>{quiz.title}</p>
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

export default UpcommingQuiz