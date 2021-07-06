import React from 'react';

const Title = ({text}: {text: string}) => {
  return <h5 className="text-white font-semibold text-lg">{text}</h5>;
};

const ActionLeft = ({toggleLessonPlanSlideOver}: any) => {
  return (
    <div className="relative h-full">
      <Title text="Page Actions" />
      <p className="mt-4 text-white text-center">🚧 Under development</p>
      <button
        onClick={toggleLessonPlanSlideOver}
        className="absolute bottom-0 text-white bg-indigo-500 h-auto py-2 my-2 w-full px-2 rounded-md shadow hover:shadow-lg text-base">
        Add page
      </button>
    </div>
  );
};

export default ActionLeft;
