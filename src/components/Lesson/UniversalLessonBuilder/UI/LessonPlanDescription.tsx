import React, { useContext } from "react";
import { GlobalContext } from "../../../../contexts/GlobalContext";
import useDictionary from "../../../../customHooks/dictionary";

const LessonPlanDescription = () => {
    const {clientKey, userLanguage} = useContext(GlobalContext);
    const {LessonBuilderDict} = useDictionary(
      clientKey
    );
  return (
    <div>
      <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-4 ">
        Page Overview
      </h3>
      <div className="rounded-lg bg-light-gray border-light-gray">
        <p className="text-base leading-5 font-medium text-gray-500 my-3 flex">
          <span className="text-gray-900 mr-2 w-3/10">
            {' '}
            {LessonBuilderDict[userLanguage]['NAME']}:
          </span>
          <span className="w-auto">{"title"}</span>
        </p>
        <p className="text-base leading-5 font-medium text-gray-500 my-3 flex">
          <span className="text-gray-900 mr-2 w-3/10">
            {' '}
            {LessonBuilderDict[userLanguage]['NAME']}:
          </span>
          <span className="w-auto">{"title"}</span>
        </p>
        <p className="text-base leading-5 font-medium text-gray-500 my-3 flex">
          <span className="text-gray-900 mr-2 w-3/10">
            {' '}
            {LessonBuilderDict[userLanguage]['NAME']}:
          </span>
          <span className="w-auto">{"title"}</span>
        </p>
        <p className="text-base leading-5 font-medium text-gray-500 my-3 flex">
          <span className="text-gray-900 mr-2 w-3/10">
            {' '}
            {LessonBuilderDict[userLanguage]['NAME']}:
          </span>
          <span className="w-auto">{"title"}</span>
        </p>
      </div>
    </div>
  );
}

export default LessonPlanDescription;