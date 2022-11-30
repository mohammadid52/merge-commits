import {Storage} from '@aws-amplify/storage';
import Buttons from 'atoms/Buttons';
import {downloadBlob} from 'components/Lesson/UniversalLessonBuilder/UI/UIComponents/Downloadables';
import {GlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import React, {useContext, useState} from 'react';
import {AiFillEye} from 'react-icons/ai';
import {BiCloudDownload} from 'react-icons/bi';
import {getLocalStorageData} from 'utilities/localStorage';
interface ILessonDetailProps {
  hidden?: boolean;
  theme?: any;
  themeColor?: any;
  rightView?: {view: string; option?: string};
  setRightView?: any;
  handleToggleRightView?: any;
}

// ##################################################################### //
// ############################# COMPONENT ############################# //
// ##################################################################### //
const LessonDetails = ({
  hidden,
  handleToggleRightView,
  rightView
}: ILessonDetailProps) => {
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

  async function download(key: string, cb: any) {
    if (key) {
      const result = await Storage.get(key, {download: true});
      // @ts-ignore
      downloadBlob(result.Body, 'lesson_plan', cb);
    } else {
      console.error('@download lesson plan key missing');
    }
  }

  // ##################################################################### //
  // ############################### OUTPUT ############################## //
  // ##################################################################### //

  const [isDownloading, setIsDownloading] = useState(false);

  const {title, lessonPlanAttachment, duration} = lessonState?.lessonData;

  return (
    <div
      className={`${
        hidden ? 'hidden' : 'block'
      } min-h-30 flex flex-col justify-between px-4 pt-2`}>
      <div
        title={title}
        className="align-middle mb-2 text-gray-600 text-sm leading-8  relative w-full h-auto flex flex-row items-center">
        <div>
          <span className="font-bold">{classRoomDict[userLanguage]['LESSON']}: </span>
          <span>{title}</span>
        </div>
      </div>

      <div className="relative w-full flex flex-col my-auto bg-gray-200 p-2 text-gray-600 text-sm shadow-sm rounded">
        <p className="">
          {lessonPlannerDict[userLanguage]['OTHER_LABELS']['STUDDENT_ONLINE']}:{' '}
          <span className="font-medium">{studentsOnline()} students</span>
        </p>
        <p className="">
          {lessonPlannerDict[userLanguage]['OTHER_LABELS']['ROOM_NAME']}:{' '}
          <span className="font-medium">{`${
            getRoomData.name ? getRoomData.name : ''
          }`}</span>
        </p>
        <p className="">
          {lessonPlannerDict[userLanguage]['OTHER_LABELS']['EST_TIME']}: {duration}{' '}
          <span className="font-medium">{`${duration > 1 ? 'weeks' : 'week'}`}</span>
        </p>
      </div>
      <div className="flex items-center justify-between mt-4 mb-2">
        <Buttons
          size="small"
          Icon={AiFillEye}
          transparent={rightView?.view !== 'lessonInfo'}
          title="see student sentiments"
          label="Sentiments"
          onClick={() => handleToggleRightView({view: 'lessonInfo', option: ''})}
        />
        <Buttons
          size="small"
          Icon={BiCloudDownload}
          transparent
          title="download lesson plan"
          label={isDownloading ? 'Downloading' : 'Lesson plan'}
          disabled={!lessonPlanAttachment || isDownloading}
          insideElement={
            <a id="download-lesson-plan-file" target="_blank" className={`hidden`}>
              Download
            </a>
          }
          onClick={() => {
            setIsDownloading(true);
            download(lessonPlanAttachment, () => setIsDownloading(false));
          }}
        />
      </div>
    </div>
  );
};

export default LessonDetails;
