import React from 'react'
import Heading from '../Common/Heading'
import LectureCards from '../Common/LectureCards'

const LecturesDetails = () => {
    return (
        <div className='w-full p-4 flex flex-col gap-4 shadow-[6px_6px_10px_rgba(0,0,0,0.3),-2px_0px_5px_rgba(0,0,0,0.1)]'>
            <Heading text="Lectures Details" />

            <div className='w-full grid grid-col-1 md:grid-cols-3 gap-4 md:h-auto max-h-[60vh] overflow-y-auto customScroll'>
                <LectureCards week="01" hours="02" lesson="01" />
                <LectureCards week="02" hours="05" lesson="02" />
                <LectureCards week="03" hours="02" lesson="03" />
                <LectureCards week="03" hours="02" lesson="03" />
                <LectureCards week="03" hours="02" lesson="03" />
            </div>
        </div>
    )
}

export default LecturesDetails