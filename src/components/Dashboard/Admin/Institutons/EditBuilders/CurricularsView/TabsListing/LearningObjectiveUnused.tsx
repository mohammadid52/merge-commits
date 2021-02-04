import React from 'react';
import PageWrapper from '../../../../../../Atoms/PageWrapper';
import DragableAccordian from '../../../../../../Atoms/DragableAccordion';



// IN PROGRESS NOTES: **Component is in progress
// Pendings:

// 1. Improve mutations
// 2. Set list sequence
// 3. Remove redundant things



const LearningObjective = () => {
  const dummyData = [
    { id: '1', title: 'Lo One', content: <p>Hello</p> },
    { id: '2', title: 'Lo One', content: <p>Hello</p> },
    { id: '3', title: 'Lo One ', content: <p>Hello</p> },
    { id: '4', title: 'Lo One', content: <p>Hello</p> },
  ]
  return (
    <div className="p-8 flex m-auto justify-center">
      <div className="">
        <PageWrapper>
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">LEARNING OBJECTIVES</h3>
          {
            <DragableAccordian titleList={dummyData} showSequence />
          }
        </PageWrapper>
      </div>
    </div>
  )
}

export default LearningObjective
