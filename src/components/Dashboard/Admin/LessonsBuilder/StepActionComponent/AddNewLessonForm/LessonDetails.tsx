import {RoomStatusList} from '@components/Dashboard/Admin/Institutons/EditBuilders/CurricularsView/TabsActions/CourseBuilder/CourseFormComponent';
import {uploadImageToS3} from '@graphql/functions';
import Buttons from 'atoms/Buttons';
import File from 'atoms/File';
import ULBFileUploader from 'atoms/Form/FileUploader';
import FormInput from 'atoms/Form/FormInput';
import MultipleSelector from 'atoms/Form/MultipleSelector';
import Selector from 'atoms/Form/Selector';
import Modal from 'atoms/Modal';
import ProgressBar from 'components/Lesson/UniversalLessonBuilder/UI/ProgressBar';
import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import {useQuery} from 'customHooks/urlParam';
import useGraphqlMutation from 'customHooks/useGraphqlMutation';
import {truncate} from 'lodash';
import React, {useEffect, useState} from 'react';
import {deleteImageFromS3, getImageFromS3Static} from 'utilities/services';
import {
  languageList,
  lessonTypeList,
  periodOptions,
  targetAudienceForIconoclast
} from 'utilities/staticData';

const UploadLessonPlanModal = ({
  onClose,
  lessonId,
  lessonPlanAttachment
}: {
  lessonId: string;
  onClose: () => void;
  lessonPlanAttachment?: any;
}) => {
  const [input, setInput] = useState<{
    imageData: File | null;
    previewUrl: string;
  }>({imageData: null, previewUrl: ''});

  const updateFileUrl = (previewUrl: string, imageData: File | null) => {
    setIsUpdated(true);

    setInput({imageData, previewUrl});
  };

  const [isEditingMode, setIsEditingMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (lessonPlanAttachment) {
      setIsEditingMode(true);
      setInput((prev) => ({...prev, previewUrl: lessonPlanAttachment}));
    }
  }, [lessonPlanAttachment]);

  const uploadProgress = 0;

  const {
    mutate,

    isSuccess
  } = useGraphqlMutation('updateUniversalLesson', {
    custom: true
  });

  const getFile = (fileUrl: any) =>
    isEditingMode
      ? fileUrl.includes('blob')
        ? fileUrl
        : getImageFromS3Static(fileUrl)
      : fileUrl;

  const onUpload = async () => {
    setIsLoading(true);

    try {
      let temp = input?.imageData?.name.split('.');
      if (temp) {
        const extension = temp.pop();
        const fileName = `${Date.now()}_${temp
          .join(' ')
          .replace(new RegExp(/[ +!@#$%^&*().]/g), '_')}.${extension}`;

        const key = `ULB/${lessonId}/lesson_plan_${fileName}`;
        input.imageData &&
          (await uploadImageToS3(input?.imageData, key, input.imageData.type));

        mutate({
          input: {
            id: lessonId,
            lessonPlanAttachment: key
          }
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = '';

  const file = getFile(input.previewUrl);

  const [isUpdated, setIsUpdated] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);

  const deleteFile = async () => {
    setIsDeleting(true);
    await deleteImageFromS3(lessonPlanAttachment);

    mutate({
      input: {
        id: lessonId,
        lessonPlanAttachment: null
      }
    });
    setIsDeleting(false);
  };

  return (
    <Modal
      title={'Upload Lesson Plan'}
      showHeaderBorder
      closeAction={onClose}
      showHeader
      scrollHidden
      showFooter={false}>
      <div className="min-w-132 max-w-256">
        <>
          {file && (
            <File
              file={file}
              fileName={
                !isUpdated
                  ? truncate(file.toString(), {length: 75})
                  : input?.imageData?.name || ''
              }
              progress={null}
              _status="other"
            />
          )}

          {file && !isUpdated && (
            <>
              <button
                onClick={() => {
                  deleteFile();
                }}
                disabled={isDeleting}
                className={`cursor-pointer text-red-500 hover:text-red-600`}>
                Delete file
              </button>
              {isDeleting && (
                <p className="mb-4 mt-2 text-green-500 text-center text-sm">
                  File deleted successfully
                </p>
              )}
              <p className="mb-4 mt-2 text-gray-500 text-center text-sm">
                ----- Or upload new file -----
              </p>
            </>
          )}
        </>

        {isSuccess && (
          <p className="mb-4 mt-2 text-green-500 text-center text-sm">
            File Upload successfully
          </p>
        )}

        <ULBFileUploader
          acceptedFilesFormat={'.pdf, .docx'}
          updateFileUrl={updateFileUrl}
          fileUrl={value}
          isEditingMode={isEditingMode}
          showPreview={true}
        />

        {isLoading && (
          <ProgressBar
            status={uploadProgress < 99 ? `Uploading file` : 'Upload Done'}
            progress={uploadProgress}
          />
        )}

        {(!file || isUpdated) && (
          <div className="flex mt-8 justify-center px-6 pb-4">
            <div className="flex justify-end">
              <Buttons
                btnClass="py-1 px-4 text-xs mr-2"
                disabled={isLoading}
                onClick={onClose}
                label={'Cancel'}
                transparent
              />
              <Buttons
                btnClass="py-1 px-8 text-xs ml-2"
                label={isLoading ? 'Uploading' : 'Upload'}
                type="submit"
                onClick={onUpload}
                disabled={isLoading}
              />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

const LessonDetails = ({
  name,
  onInputChange,
  validation,
  lessonId,
  targetAudience,
  type,
  duration,
  selectedDesigners,
  languages,
  designerListLoading,
  onDurationSelect,
  onSelectOption,
  onSelectTargetAudience,
  selectLanguage,
  designersList,
  selectDesigner,
  status,
  updateStatus,
  onClose,
  showUploadModal,
  lessonPlanAttachment
}: any) => {
  const params = useQuery(location.search);
  const refName = params.get('refName');

  const inputRef = React.useRef();

  useEffect(() => {
    if (refName && refName === 'name') {
      if (inputRef && inputRef?.current) {
        // @ts-ignore
        inputRef?.current?.focus();
      }
    }
  }, [refName, inputRef]);

  const {userLanguage} = useGlobalContext();

  const {AddNewLessonFormDict, UserEditDict} = useDictionary();

  return (
    <div className="px-3">
      {showUploadModal && (
        <UploadLessonPlanModal
          lessonPlanAttachment={lessonPlanAttachment}
          lessonId={lessonId}
          onClose={onClose}
        />
      )}
      <div className="grid grid-cols-2 gap-4 gap-y-8">
        <div className="col-span-2">
          <FormInput
            value={name}
            label={AddNewLessonFormDict[userLanguage]['NAME']}
            inputRef={inputRef}
            id="name"
            error={validation.name}
            onChange={onInputChange}
            name="name"
          />
        </div>

        <div className="">
          <Selector
            disabled={lessonId !== ''}
            isRequired
            label={AddNewLessonFormDict[userLanguage]['SELECTTYPE']}
            selectedItem={type.label}
            error={validation.type}
            placeholder={AddNewLessonFormDict[userLanguage]['TYPE']}
            list={lessonTypeList}
            onChange={(val, option: any) => onSelectOption(val, val, option.id, 'type')}
          />
        </div>
        <div className="">
          <Selector
            label={AddNewLessonFormDict[userLanguage]['DURATION']}
            selectedItem={duration.toString() || ''}
            placeholder={AddNewLessonFormDict[userLanguage]['DURATION']}
            list={periodOptions}
            onChange={onDurationSelect}
          />
        </div>

        <div className="">
          <Selector
            label={AddNewLessonFormDict[userLanguage]['TARGET_AUDIENCE']}
            selectedItem={targetAudience}
            placeholder={AddNewLessonFormDict[userLanguage]['SELECT_TARGET_AUDIENCE']}
            list={targetAudienceForIconoclast}
            onChange={onSelectTargetAudience}
          />
        </div>
        <div className="">
          <MultipleSelector
            isRequired
            label={AddNewLessonFormDict[userLanguage]['SELECTLANG']}
            placeholder={AddNewLessonFormDict[userLanguage]['LANGUAGE']}
            list={languageList}
            width="100%"
            selectedItems={languages}
            onChange={selectLanguage}
          />
        </div>

        <div className="">
          <MultipleSelector
            label={AddNewLessonFormDict[userLanguage]['SELECTDESIGNER']}
            selectedItems={selectedDesigners}
            width="100%"
            placeholder={AddNewLessonFormDict[userLanguage]['DESIGNER']}
            list={designersList}
            onChange={selectDesigner}
            noOptionMessage={
              AddNewLessonFormDict[userLanguage]['MESSAGES'][
                designerListLoading ? 'LOADING' : 'NODESIGNEROPTION'
              ]
            }
          />
        </div>
        <div className="">
          <Selector
            label={UserEditDict[userLanguage]['status']}
            placeholder={UserEditDict[userLanguage]['status']}
            list={RoomStatusList}
            noSpace
            onChange={updateStatus}
            dropdownWidth="w-56"
            selectedItem={status || UserEditDict[userLanguage]['status']}
          />
        </div>
      </div>
    </div>
  );
};

export default LessonDetails;
