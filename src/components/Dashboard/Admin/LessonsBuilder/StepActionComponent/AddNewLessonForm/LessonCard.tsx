import React, {useContext} from 'react';
import {IoCamera} from 'react-icons/io5';
import {GlobalContext} from '../../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../../customHooks/dictionary';
import FormInput from '../../../../../Atoms/Form/FormInput';
import TextArea from '../../../../../Atoms/Form/TextArea';
import {
  Tabs2,
  useTabs,
} from '../../../../../Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/Tabs';
import StandardLessonCard from '../../../../Classroom/LessonCards/StandardLessonCard';
import {v4 as uuidv4} from 'uuid';
import {getLocalStorageData} from '../../../../../../utilities/localStorage';
import AnimatedContainer from '../../../../../Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';

interface ILessonCard {
  validation: any;
  imagePreviewUrl: string;
  studentSummary: string;
  imageCaption: string;
  cropSelecetedImage: (e: any) => void;
  onInputChange: (e: any) => void;
  totalEstTime?: number;
  lessonType: string;
  cardCaption: string;
}

const LessonCard = ({
  validation,
  imagePreviewUrl,
  cropSelecetedImage,
  imageCaption,
  studentSummary,
  onInputChange,
  totalEstTime,
  lessonType,
  cardCaption = '',
}: ILessonCard) => {
  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {AddNewLessonFormDict} = useDictionary(clientKey);
  const getRoomData = getLocalStorageData('room_info');

  const tabs = [
    {name: 'Setup', current: true},
    {name: 'Preview', current: false},
  ];

  const previewCard = {
    id: uuidv4(),
    open: true,
    lesson: {
      summary: studentSummary,
      cardImage: imagePreviewUrl,
      totalEstTime,
      cardCaption,
    },
  };
  const imageRef = React.useRef(null);
  const handleImage = () => imageRef?.current?.click();

  const {curTab, setCurTab, helpers} = useTabs(tabs);

  const [onSetupTab, onPreviewTab] = helpers;

  return (
    <div className="flex  flex-col w-auto">
      <Tabs2 curTab={curTab} setCurTab={setCurTab} tabs={tabs} />
      <div className="">
        <AnimatedContainer
          duration="500"
          animationType="translateY"
          className="flex items-center w-auto justify-start"
          show={onSetupTab}>
          {onSetupTab && (
            <>
              <div className="pr-3 py-5 w-auto mr-4">
                <button className="group hover:opacity-80 focus:outline-none focus:opacity-95 flex flex-col items-center">
                  <div className="cursor-pointer flex justify-center">
                    {imagePreviewUrl ? (
                      <img
                        onClick={handleImage}
                        className={`profile w-50 bg-center bg-cover h-60 md:w-60 md:h-60 border-0 border-gray-400 rounded-lg customShadow`}
                        src={imagePreviewUrl}
                      />
                    ) : (
                      <div
                        onClick={handleImage}
                        className={`profile justify-center align-center items-center content-center w-50 h-60 md:w-50 md:h-60 bg-gray-100 border flex-shrink-0 flex border-gray-400`}>
                        <IoCamera className="fill-current text-gray-80" size={32} />
                      </div>
                    )}
                    <input
                      type="file"
                      ref={imageRef}
                      className="hidden"
                      onChange={cropSelecetedImage}
                      onClick={(e: any) => (e.target.value = '')}
                      accept="image/*"
                      multiple={false}
                    />
                  </div>
                </button>
              </div>
              <div className="col-span-2">
                <div className="pr-8 pt-5">
                  <label className="block text-m font-medium leading-5 text-gray-700 mb-1 text-left">
                    {AddNewLessonFormDict[userLanguage]['IMAGE_CAPTION']}{' '}
                    <span className="text-red-500"> * </span>
                  </label>
                  <FormInput
                    value={imageCaption}
                    id="imageCaption"
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
                {/* </div> */}
                {/* <div className="col-span-3"> */}
                <div className="pr-8 pt-1">
                  <label className="block text-m font-medium leading-5 text-gray-700 mb-3">
                    {AddNewLessonFormDict[userLanguage]['SUMMARY']}
                    <span className="text-red-500"> *</span>
                  </label>
                  <TextArea
                    rows={5}
                    id="studentSummary"
                    value={studentSummary}
                    onChange={onInputChange}
                    name="studentSummary"
                    maxLength={500}
                    showCharacterUsage
                    error={validation.studentSummary}
                  />
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
