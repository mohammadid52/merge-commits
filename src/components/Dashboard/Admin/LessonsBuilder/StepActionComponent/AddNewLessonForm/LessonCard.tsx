import FormInput from 'atoms/Form/FormInput';
import {GlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import DroppableMedia from 'molecules/DroppableMedia';
import React, {useContext} from 'react';
import {IoCamera} from 'react-icons/io5';
import {getLocalStorageData} from 'utilities/localStorage';
import {v4 as uuidv4} from 'uuid';
import AnimatedContainer from '../../../../../Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import {
  Tabs2,
  useTabs
} from '../../../../../Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/Tabs';
import StandardLessonCard from '../../../../Classroom/LessonCards/StandardLessonCard';

interface ILessonCard {
  validation: any;
  imagePreviewUrl: string;
  studentSummary: string;
  imageCaption: string;

  onInputChange: (e: any) => void;
  totalEstTime?: number;
  lessonType: string;
  cardCaption: string;
  toggleCropper?: () => void;
  setImage?: any;
  setFileObj: any;
}

const LessonCard = ({
  validation,
  imagePreviewUrl,

  imageCaption,
  studentSummary,
  toggleCropper,
  setImage,
  onInputChange,
  totalEstTime,
  setFileObj,
  lessonType,
  cardCaption = ''
}: ILessonCard) => {
  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {AddNewLessonFormDict} = useDictionary(clientKey);
  const getRoomData = getLocalStorageData('room_info');

  const tabs = [
    {name: 'Setup', current: true},
    {name: 'Preview', current: false}
  ];

  const previewCard = {
    id: uuidv4(),
    open: true,
    lesson: {
      summary: studentSummary,
      cardImage: imagePreviewUrl,
      totalEstTime,
      cardCaption
    }
  };

  const imageRef = React.useRef(null);
  const handleImage = () => imageRef?.current?.click();

  const {curTab, setCurTab, helpers} = useTabs(tabs);

  const [onSetupTab, onPreviewTab] = helpers;

  return (
    <div className="flex flex-col w-auto">
      <Tabs2 curTab={curTab} setCurTab={setCurTab} tabs={tabs} />
      <div className="">
        <AnimatedContainer
          duration="500"
          animationType="translateY"
          className="flex items-center w-full justify-start"
          show={onSetupTab}>
          {onSetupTab && (
            <>
              <div
                className={`relative bg-white shadow items-center rounded-lg flex flex-col md:flex-row mb-8 p-4`}>
                {/**
                 *  LEFT SECTION IMAGE
                 */}
                <DroppableMedia
                  className="w-full md:h-56 h-48 lg:w-2.5/10 md:w-4/12  rounded-tl rounded-bl shadow cursor-pointer"
                  mediaRef={imageRef}
                  setImage={(img: any, file: any) => {
                    setImage(img);
                    setFileObj(file);
                  }}
                  toggleCropper={toggleCropper}>
                  {imagePreviewUrl ? (
                    <div
                      onClick={handleImage}
                      className={`w-full md:h-56 h-48 rounded-tl rounded-bl shadow`}
                      style={{
                        /* stylelint-disable */
                        backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.52), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)),url(${imagePreviewUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}></div>
                  ) : (
                    <div
                      onClick={handleImage}
                      className={`profile justify-center align-center items-center content-center w-50 h-60 md:w-50 md:h-60 bg-gray-100 border flex-shrink-0 flex border-gray-400`}>
                      <IoCamera className="fill-current text-gray-80" size={32} />
                    </div>
                  )}
                </DroppableMedia>
                {/**
                 *  RIGHT SECTION
                 */}
                <div
                  className={`w-full md:w-8/12 lg:w-7.5/10 ml-4 flex flex-col rounded-b`}>
                  <div className="">
                    <FormInput
                      isRequired
                      dataCy="lesson-image-caption"
                      value={imageCaption}
                      id="imageCaption"
                      label={AddNewLessonFormDict[userLanguage]['IMAGE_CAPTION']}
                      onChange={onInputChange}
                      name="imageCaption"
                      maxLength={25}
                    />
                    {validation.imageCaption && (
                      <p className="text-red-600 text-sm">{validation.imageCaption}</p>
                    )}
                    <div className="text-right text-gray-400">
                      {imageCaption.length} of 25
                    </div>
                  </div>

                  <div className="">
                    <FormInput
                      textarea
                      isRequired
                      dataCy="lesson-summary"
                      rows={5}
                      id="studentSummary"
                      label={AddNewLessonFormDict[userLanguage]['SUMMARY']}
                      value={studentSummary}
                      onChange={onInputChange}
                      name="studentSummary"
                      maxLength={500}
                      showCharacterUsage
                      error={validation.studentSummary}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </AnimatedContainer>
        <AnimatedContainer
          duration="500"
          animationType="translateY"
          className="flex items-center w-auto justify-start"
          show={onPreviewTab}>
          {onPreviewTab && (
            <div className="py-5">
              <StandardLessonCard
                lessonType={lessonType}
                getImageFromS3={false}
                lessonProps={previewCard}
                accessible
                preview
                activeRoomInfo={getRoomData}
              />
            </div>
          )}
        </AnimatedContainer>
      </div>
    </div>
  );
};

export default LessonCard;
