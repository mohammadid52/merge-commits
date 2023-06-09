import {Storage} from '@aws-amplify/storage';
import Buttons from 'atoms/Buttons';
import {downloadBlob} from 'components/Lesson/UniversalLessonBuilder/UI/UIComponents/Downloadables';
import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import {useState} from 'react';
import {AiFillEye, AiOutlineLink} from 'react-icons/ai';
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
  const gContext = useGlobalContext();
  const lessonState = gContext.lessonState;

  const controlState = gContext.controlState;

  const userLanguage = gContext.userLanguage;
  const {classRoomDict} = useDictionary();

  const {lessonPlannerDict} = useDictionary();

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

  const pageBuilderUrl = `/dashboard/manage-institutions/institution/${
    getRoomData.institutionID || lessonState.lessonData.institutionID
  }/lessons/${lessonState.lessonData.id}/page-builder`;

  return (
    <div
      className={`${
        hidden ? 'hidden' : 'block'
      } min-h-30 flex flex-col justify-between px-4 pt-2`}>
      <div
        title={title}
        className="align-middle mb-2 text-medium  text-sm leading-8  relative w-full h-auto flex flex-row items-center">
        <div className="w-auto flex items-center">
          <span className="font-bold w-auto mr-1">
            {classRoomDict[userLanguage]['LESSON']}:{' '}
          </span>
          <span
            className="flex items-center hover:theme-text transition-all"
            title="Open page builder on new tab">
            <a className="w-auto" target="_blank" href={pageBuilderUrl}>
              {title}
            </a>

            <span className="w-auto">
              <AiOutlineLink className="w-auto theme-text" size={'1rem'} />
            </span>
          </span>
        </div>
      </div>

      <div className="relative w-full flex flex-col my-auto bg-lightest p-2 text-medium  text-sm shadow-sm rounded">
        <p className="">
          <span className="font-medium">
            {lessonPlannerDict[userLanguage]['OTHER_LABELS']['STUDDENT_ONLINE']}:{' '}
          </span>
          <span className="">{studentsOnline()} students</span>
        </p>
        <p className="">
          <span className="font-medium">
            {lessonPlannerDict[userLanguage]['OTHER_LABELS']['ROOM_NAME']}:{' '}
          </span>
          {`${getRoomData.name ? getRoomData.name : ''}`}
        </p>
        <p className="">
          <span className="font-medium">
            {lessonPlannerDict[userLanguage]['OTHER_LABELS']['EST_TIME']}: {duration}{' '}
          </span>
          {`${duration > 1 ? 'weeks' : 'week'}`}
        </p>
      </div>
      <div className="flex items-center justify-between mt-4 mb-2">
        <Buttons
          size="small"
          Icon={AiFillEye}
          transparent={rightView?.view !== 'lessonInfo'}
          label="Sentiments"
          onClick={() => handleToggleRightView({view: 'lessonInfo', option: ''})}
        />
        <Buttons
          size="small"
          Icon={BiCloudDownload}
          transparent
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
