import ULBFileUploader from '@components/Atoms/Form/FileUploader';
import {Storage} from '@aws-amplify/storage';
import FormInput from '@components/Atoms/Form/FormInput';
import MultipleSelector from '@components/Atoms/Form/MultipleSelector';
import Selector from '@components/Atoms/Form/Selector';
import Modal from '@components/Atoms/Modal';
import {useGlobalContext} from '@contexts/GlobalContext';
import useDictionary from '@customHooks/dictionary';
import {useQuery} from '@customHooks/urlParam';
import {
  languageList,
  lessonTypeList,
  periodOptions,
  targetAudienceForIconoclast,
} from '@utilities/staticData';
import React, {useEffect, useState} from 'react';
import ProgressBar from '@components/Lesson/UniversalLessonBuilder/UI/ProgressBar';
import Buttons from '@components/Atoms/Buttons';
import useGraphqlMutation from '@customHooks/useGraphqlMutation';
import {deleteImageFromS3, getImageFromS3Static} from '@utilities/services';
import File from '@components/Atoms/File';
import {truncate} from 'lodash';

const UploadLessonPlanModal = ({
  onClose,
  lessonId,
  lessonPlanAttachment,
}: {
  lessonId: string;
  onClose: () => void;
  lessonPlanAttachment?: any;
}) => {
  const [input, setInput] = useState({imageData: null, previewUrl: ''});
  console.log('🚀 ~ file: LessonDetails.tsx ~ line 34 ~ input', input);
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

  const [uploadProgress, setUploadProgress] = useState<string | number>(0);

  const uploadImageToS3 = async (file: any, id: string, type: string) => {
    // Upload file to s3 bucket

    return new Promise((resolve, reject) => {
      Storage.put(`ULB/${lessonId}/lesson_plan_${id}`, file, {
        contentType: type,
        acl: 'public-read',
        ContentEncoding: 'base64',
        progressCallback: ({loaded, total}: any) => {
          const progress = (loaded * 100) / total;
          setUploadProgress(progress.toFixed(0));
        },
      })
        .then((result: any) => {
          console.log('File successfully uploaded to s3', result);

          setUploadProgress('done');
          resolve(true);
        })
        .catch((err: any) => {
          setError('Unable to upload file. Please try again later');
          console.log('Error in uploading file to s3', err);
          reject(err);
        });
    });
  };

  const {mutate, isLoading: uploading, isSuccess} = useGraphqlMutation(
    'updateUniversalLesson',
    {
      custom: true,
    }
  );

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
      const extension = temp.pop();
      const fileName = `${Date.now()}_${temp
        .join(' ')
        .replace(new RegExp(/[ +!@#$%^&*().]/g), '_')}.${extension}`;

      await uploadImageToS3(input?.imageData, `${fileName}`, input.imageData.type);
      const key = `ULB/${lessonId}/lesson_plan_${fileName}`;

      mutate({
        input: {
          id: lessonId,
          lessonPlanAttachment: key,
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const [error, setError] = useState('');

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
        lessonPlanAttachment: null,
      },
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
          error={error}
          isEditingMode={isEditingMode}
          showPreview={true}
        />

        {isLoading && uploadProgress !== 'done' && (
          <ProgressBar
            status={uploadProgress < 99 ? `Uploading file` : 'Upload Done'}
            progress={uploadProgress}
          />
        )}

        {(!file || isUpdated) && (
          <div className="flex mt-8 justify-center px-6 pb-4">
            <div className="flex justify-end">
              <Buttons btnClass="py-1 px-4 text-xs mr-2" label={'Cancel'} transparent />
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
  onClose,
  showUploadModal,
  lessonPlanAttachment,
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

  const {clientKey, userLanguage} = useGlobalContext();

  const {AddNewLessonFormDict} = useDictionary(clientKey);

  return (
    <div className="px-3">
      {showUploadModal && (
        <UploadLessonPlanModal
          lessonPlanAttachment={lessonPlanAttachment}
          lessonId={lessonId}
          onClose={onClose}
        />
      )}

      <div className="px-0 py-4">
        <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
          {AddNewLessonFormDict[userLanguage]['NAME']}{' '}
          <span className="text-red-500"> * </span>
        </label>
        <FormInput
          value={name}
          inputRef={inputRef}
          id="name"
          onChange={onInputChange}
          name="name"
        />
        {validation.name && <p className="text-red-600 text-sm">{validation.name}</p>}
      </div>
      <div className="grid lg:grid-cols-2 gap-x-4">
        <div className="px-0 py-4">
          <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
            {AddNewLessonFormDict[userLanguage]['SELECTTYPE']}{' '}
            <span className="text-red-500"> * </span>
          </label>
          <Selector
            disabled={lessonId !== ''}
            selectedItem={type.name}
            placeholder={AddNewLessonFormDict[userLanguage]['TYPE']}
            list={lessonTypeList}
            onChange={(val, name, id) => onSelectOption(val, name, id, 'type')}
          />
          {validation.type && <p className="text-red-600 text-sm">{validation.type}</p>}
        </div>
        <div className="px-0 py-4">
          <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
            {AddNewLessonFormDict[userLanguage]['DURATION']}{' '}
          </label>
          <Selector
            selectedItem={duration.toString() || ''}
            placeholder={AddNewLessonFormDict[userLanguage]['DURATION']}
            list={periodOptions}
            onChange={onDurationSelect}
          />
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-x-4">
        <div className="px-0 py-4">
          <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
            {AddNewLessonFormDict[userLanguage]['TARGET_AUDIENCE']}{' '}
          </label>
          <Selector
            selectedItem={targetAudience}
            placeholder={AddNewLessonFormDict[userLanguage]['SELECT_TARGET_AUDIENCE']}
            list={targetAudienceForIconoclast}
            onChange={onSelectTargetAudience}
          />
        </div>
        <div className="px-0 py-4">
          <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
            {AddNewLessonFormDict[userLanguage]['SELECTLANG']}
            <span className="text-red-500"> * </span>
          </label>
          <MultipleSelector
            // disabled={lessonId !== ''}
            selectedItems={languages}
            placeholder={AddNewLessonFormDict[userLanguage]['LANGUAGE']}
            list={languageList}
            onChange={selectLanguage}
          />
        </div>
      </div>
      <div className="py-4 col-span-2">
        <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
          {AddNewLessonFormDict[userLanguage]['SELECTDESIGNER']}
        </label>
        <MultipleSelector
          selectedItems={selectedDesigners}
          placeholder={AddNewLessonFormDict[userLanguage]['DESIGNER']}
          list={designersList}
          onChange={selectDesigner}
          noOptionMessage={
            designerListLoading
              ? AddNewLessonFormDict[userLanguage]['MESSAGES']['LOADING']
              : AddNewLessonFormDict[userLanguage]['MESSAGES']['NODESIGNEROPTION']
          }
        />
      </div>
    </div>
  );
};

export default LessonDetails;
