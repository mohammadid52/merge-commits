import React, {useContext, useState} from 'react';
import {GlobalContext} from '@contexts/GlobalContext';
import Storage from '@aws-amplify/storage';
import useDictionary from '@customHooks/dictionary';
import {getLocalStorageData} from '@utilities/localStorage';
import Buttons from '@components/Atoms/Buttons';
import {getAsset} from 'assets';
import {downloadBlob} from '@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Downloadables';

interface ILessonDetailProps {
  hidden?: boolean;
  theme?: any;
  themeColor?: any;
  rightView?: {view: string; option?: string};
  setRightView?: any;
}

// ##################################################################### //
// ############################# COMPONENT ############################# //
// ##################################################################### //
const LessonDetails = ({hidden}: ILessonDetailProps) => {
  const gContext = useContext(GlobalContext);
  const lessonState = gContext.lessonState;
  const theme = gContext.theme;

  const controlState = gContext.controlState;
  const clientKey = gContext.clientKey;
  const userLanguage = gContext.userLanguage;
  const {classRoomDict} = useDictionary(clientKey);

  const {lessonPlannerDict} = useDictionary(clientKey);
  const themeColor = getAsset(clientKey, 'themeClassName');

  const getRoomData = getLocalStorageData('room_info');

  const studentsOnline = () => {
    if (controlState.roster) {
      return controlState.roster.length;
    } else {
      return 0;
    }
  };

  async function download() {
    console.log('downloading');
    // const result = await Storage.get(`${UPLOAD_KEY}${fileKey}`, {download: true});
    // @ts-ignore
    downloadBlob();
  }

  // ##################################################################### //
  // ############################### OUTPUT ############################## //
  // ##################################################################### //

  const [isLessonPlanDownloaded, setIsLessonPlanDownloaded] = useState(false);
  return (
    <div
      className={`${
        hidden ? 'hidden' : 'block'
      } min-h-30 flex flex-col justify-between px-4 pt-2`}>
      <div
        title={lessonState.lessonData.title}
        className="align-middle mb-2 text-gray-600 text-sm leading-8  relative w-full h-auto flex flex-row items-center">
        <div>
          <span className="font-bold">{classRoomDict[userLanguage]['LESSON']}: </span>
          <span>{lessonState.lessonData.title}</span>
        </div>
        <div>
          {/* <span className="relative mr-0 flex justify-end">
            <Buttons
              overrideClass
              btnClass={`${theme.btn[themeColor]} h-8 font-bold uppercase text-xs rounded items-center w-auto`}
              label={isLessonPlanDownloaded ? 'Downloaded' : 'Lesson plan'}
              disabled={isLessonPlanDownloaded}
              onClick={() => {
                download();
              }}
              insideElement={
                <a id="download-lesson-plan-file" target="_blank" className={`hidden`}>
                  Download
                </a>
              }
            />
          </span> */}
        </div>
      </div>

      <div className="relative w-full flex flex-col my-auto bg-gray-200 p-2 text-gray-600 text-sm shadow-sm rounded">
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
