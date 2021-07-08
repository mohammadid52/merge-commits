import React from 'react';
import Accordion from '../../../../Atoms/Accordion';
import Buttons from '../../../../Atoms/Buttons';
import PageWrapper from '../../../../Atoms/PageWrapper';

const LessonCourse = () => {
  return (
    <div className="flex m-auto justify-center">
      <div className="">
        <PageWrapper defaultClass="px-8 border-0 border-gray-200">
          <div className="flex justify-end w-full m-auto ">
            <Buttons
              btnClass="mx-4"
              label={
                'Add Lesson to Course'
                // LessonBuilderDict[userLanguage]['LESSON_CLASSROOM_ACTIVITY_TABLE'][
                //   'ADD_NEW_ACTIVITY'
                // ]
              }
              // onClick={addNewLessonPlan}
            />
          </div>
          <div className="w-full flex justify-between border-b-0 border-gray-200 mt-8">
            <Accordion
              titleList={[
                {
                  id: '1',
                  title: 'Introduction to ICONOCLAST Artist',
                  content: <>Hello</>,
                },
                {
                  id: '2',
                  title: 'ICONOCLAST Artist Summer Program',
                  content: <>Hello</>,
                },
              ]}
            />
          </div>
        </PageWrapper>
      </div>
    </div>
  );
};

export default LessonCourse;
