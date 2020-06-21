import React, { useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';

const InstructionsBlock = () => {
    const { state } = useContext(LessonContext);
    const { text, video, link } = state.data.warmUp.instructions ;
    return (
        <div className="bg-dark-blue h-72 px-8 py-4 mb-4 flex flex-col text-gray-200 shadow-2 rounded-sm">
            <h3 className="text-xl font-open font-bold mb-3 border-b border-gray-700">Instructions</h3>
            <div className="text-sm px-2">
                {
                    text.map((inst: string, key: number) => (
                        <p key={key} className="mb-4">
                            { inst }
                        </p>
                    ))
                }
            </div>
        </div>
    )
}

export default InstructionsBlock;