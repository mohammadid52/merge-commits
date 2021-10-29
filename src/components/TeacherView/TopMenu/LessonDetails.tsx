import React, {useContext} from 'react';
import {GlobalContext} from '@contexts/GlobalContext';
import useDictionary from '@customHooks/dictionary';
import {getLocalStorageData} from '@utilities/localStorage';

interface ILessonDetailProps {
  hidden?: boolean;
  theme?: any;
  themeColor?: any;
  rightView?: string;
  setRightView?: any;
}

// ##################################################################### //
// ############################# COMPONENT ############################# //
// ##################################################################### //
const LessonDetails = ({hidden}: ILessonDetailProps) => {
  const gContext = useContext(GlobalContext);
  const lessonState = gContext.lessonState;
  const controlState = gContext.controlState;
  const clientKey = gContext.clientKey;
  const userLanguage = gContext.userLanguage;
  const {classRoomDict} = useDictionary(clientKey);

  const {lessonPlannerDict} = useDictionary(clientKey);

  const getRoomData = getLocalStorageData('room_info');

  const studentsOnline = () => {
    if (controlState.roster) {
      return controlState.roster.length;
    } else {
      return 0;
    }
  };

  // ##################################################################### //
  // ############################### OUTPUT ############################## //
  // ##################################################################### //
  return (
    <div
      className={`${
        hidden ? 'hidden' : 'block'
      } min-h-30 flex flex-col justify-between px-4 pt-2 rounded`}>
      <div title="title" className="align-middle text-gray-600 text-sm leading-8 ">
        <span className="font-bold">{classRoomDict[userLanguage]['LESSON']}: </span>
        <span>{lessonState.lessonData.title}</span>
      </div>

      <div className="relative w-full flex flex-col my-auto bg-gray-200 p-2 text-gray-600 text-sm shadow-sm">
        {/* <ButtonsRound
          Icon={AiOutlineInfoCircle}
          onClick={() => handleSentimentToggle()}
          iconSizePX={24}
          buttonWHClass={``}
          containerBgClass={`bg-transparent p-2`}
          containerWHClass={`absolute h-auto w-auto top-0 right-0`}
          buttonBgClass={`bg-transparent`}
          iconTxtColorClass={theme.textColor[themeColor]}
        /> */}
        <p className="">
          {lessonPlannerDict[userLanguage]['OTHER_LABELS']['STUDDENT_ONLINE']}:{' '}
          {studentsOnline()}
        </p>
        <p className="">
          {lessonPlannerDict[userLanguage]['OTHER_LABELS']['ROOM_NAME']}:{' '}
          {`${getRoomData.name ? getRoomData.name : ''}`}
        </p>
        <p className="">
          {lessonPlannerDict[userLanguage]['OTHER_LABELS']['EST_TIME']}:{' '}
          {lessonState.lessonData?.duration}{' '}
          {`${lessonState.lessonData?.duration > 1 ? 'weeks' : 'week'}`}
        </p>
      </div>
    </div>
  );
};

export default LessonDetails;
