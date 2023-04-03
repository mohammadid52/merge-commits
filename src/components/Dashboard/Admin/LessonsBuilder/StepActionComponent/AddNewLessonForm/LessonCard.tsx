import {Tabs, TabsProps} from 'antd';
import FormInput from 'atoms/Form/FormInput';
import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import DroppableMedia from 'molecules/DroppableMedia';
import React from 'react';
import {IoCamera} from 'react-icons/io5';
import {getLocalStorageData} from 'utilities/localStorage';
import {v4 as uuidv4} from 'uuid';
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
  const {userLanguage} = useGlobalContext();
  const {AddNewLessonFormDict} = useDictionary();
  const getRoomData = getLocalStorageData('room_info');

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

  const imageRef = React.useRef<any>(null);
  const handleImage = () => imageRef?.current?.click();

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `Setup`,
      children: (
        <div
          className={`relative w-full bg-white shadow items-center rounded-lg flex flex-col md:flex-row mb-8 p-4`}>
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
                className={`profile justify-center align-center items-center content-center w-50 h-60 md:w-50 md:h-60 bg-lightest  border flex-shrink-0 flex border-light `}>
                <IoCamera className="fill-current text-gray-80" size={32} />
              </div>
            )}
          </DroppableMedia>
          {/**
           *  RIGHT SECTION
           */}
          <div
            className={`w-full md:w-8/12 gap-4 lg:w-7.5/10 ml-4 flex flex-col rounded-b`}>
            <div className="">
              <FormInput
                isRequired
                dataCy="lesson-image-caption"
                value={imageCaption}
                id="imageCaption"
                error={validation.imageCaption}
                label={AddNewLessonFormDict[userLanguage]['IMAGE_CAPTION']}
                onChange={onInputChange}
                name="imageCaption"
                maxLength={25}
                showCharacterUsage
              />
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
      )
    },
    {
      key: '2',
      label: `Preview`,
      children: (
        <div className="py-5 w-full">
          <StandardLessonCard
            lessonType={lessonType}
            getImageFromS3={false}
            lessonProps={previewCard}
            accessible
            preview
            activeRoomInfo={getRoomData}
          />
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col w-auto">
      <Tabs animated defaultActiveKey="1" items={items} />
    </div>
  );
};

export default LessonCard;
