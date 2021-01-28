import React from 'react'
import Buttons from '../../../../Atoms/Buttons'

const QuestionBuilder = () => {

  const getPreviousQuestions = () => {

  }
  return (
    <div className='bg-white shadow-5 overflow-hidden sm:rounded-lg mb-4'>

      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900"> Assessment Questions </h3>
      </div>

      <div className="p-4">
        <div className="flex justify-end">
          <Buttons label="Previously used Questions" onClick={getPreviousQuestions} btnClass="mr-4 w-1/4" />
        </div>
        <div>
          <p className="p-20 text-center">Questions list in progress...</p>
        </div>
      </div>
    </div>
  )
}

export default QuestionBuilder
