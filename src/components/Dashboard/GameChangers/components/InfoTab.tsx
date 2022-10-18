import {useGameChangers} from 'components/Dashboard/GameChangers/context/GameChangersContext';
import {classNames} from 'components/Lesson/UniversalLessonBuilder/UI/FormElements/TextInput';
import {map} from 'lodash';
import React from 'react';

const InfoTab = ({
  howToList,

  infoText
}: {
  howToList: string[];
  infoText: string;
}) => {
  const isImmersiveMode = true;
  const {showHowTo, showInfo} = useGameChangers();
  return (
    <div
      className={`absolute overflow-hidden transition-all right-0 flex-col top-2 items-end justify-center w-auto hidden xl:flex gap-y-12`}>
      <div
        id="breathing_exercise-how_it_works"
        className={`${
          isImmersiveMode
            ? `${
                showHowTo ? 'translate-x-0' : 'translate-x-full'
              } lg:max-w-72 xl:max-w-96 2xl:max-w-156 bg-black bg-opacity-10  border-0 border-white`
            : ` max-w-96 ${showHowTo ? 'translate-x-0' : 'translate-x-200'} bg-white`
        } rounded-l-xl p-4 px-6 transform   transition-all shadow-lg`}>
        <ul className="w-auto mx-1 transition-all space-y-4 list-disc px-4 py-6 ">
          {map(howToList, (text) => (
            <li
              key={text}
              className={classNames(
                isImmersiveMode
                  ? 'text-left text-gray-400 font-medium italic text-base'
                  : 'text-gray-800 ',
                ` duration-500  transition-all`
              )}>
              {text}
            </li>
          ))}
        </ul>
      </div>
      <div
        id="breathing_exercise-info"
        className={`${
          isImmersiveMode
            ? `${
                showInfo ? 'translate-x-0' : 'translate-x-full'
              } lg:max-w-72 xl:max-w-96 2xl:max-w-156 text-gray-400 font-medium italic text-base  bg-black bg-opacity-10  border-0 border-white`
            : `${
                showInfo ? 'translate-x-0' : 'translate-x-200'
              }  text-gray-100 bg-white  max-w-96`
        } rounded-l-xl  p-4 px-6 transition-all transform  shadow-lg`}>
        {infoText}
      </div>
    </div>
  );
};

export default InfoTab;
