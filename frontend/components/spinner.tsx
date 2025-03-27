'use client'

import { BeatLoader } from "react-spinners";

export default function Spinner() {
    return (
        <div className='fixed inset-0 flex justify-center items-center z-50'>
            <BeatLoader
                color="#000000"
                speedMultiplier={1}
            />
        </div>
    )
}