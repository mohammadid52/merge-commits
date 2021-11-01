import FormInput from '@atoms/Form/FormInput';
import Label from '@atoms/Form/Label';
import Selector from '@atoms/Form/Selector';
import Modal from '@atoms/Modal';
import RichTextEditor from '@atoms/RichTextEditor';
import {UPLOAD_KEYS} from '@components/Lesson/constants';
import {REGEX} from '@components/Lesson/UniversalLessonBuilder/UI/common/constants';
import {GlobalContext} from '@contexts/GlobalContext';
import {useULBContext} from '@contexts/UniversalLessonBuilderContext';
import * as customMutations from '@customGraphql/customMutations';
import useDictionary from '@customHooks/dictionary';
import {useQuery} from '@customHooks/urlParam';
import {XIcon} from '@heroicons/react/outline';
import {IFile} from '@interfaces/UniversalLessonInterfaces';
import ModalPopUp from '@molecules/ModalPopUp';
import UploadMedia from '@molecules/UploadMedia';
import '@pathofdev/react-tag-input/build/index.css';
import {getImageFromS3Static} from '@utilities/services';
import {estimatedTimeList} from '@utilities/staticData';
import {updateLessonPageToDB} from '@utilities/updateLessonPageToDB';
import {getAsset} from 'assets';
import {API, graphqlOperation} from 'aws-amplify';
import {findIndex, isEmpty, remove, update} from 'lodash';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {useHistory, useRouteMatch} from 'react-router';
import {v4 as uuidV4} from 'uuid';

const VideoUploadComponent = ({
  customRef,
  closeAction,
  file,
  setFile,
  setFields,
}: {
  customRef: any;
  closeAction: () => void;
  file: IFile;
  setFields: any;
  setFile: React.Dispatch<React.SetStateAction<IFile>>;
}) => {
  const [error, setError] = useState('');
  const showCloseButton = isEmpty(file) || (!isEmpty(file) && file._status === 'success');

  return (
    <Modal
      closeAction={showCloseButton && closeAction}
      showHeader={showCloseButton}
      showFooter={false}>
      <div>
        <UploadMedia
          file={file}
          onSuccess={() => {
            setFields((prev: any) => ({...prev, videoLink: ''}));
          }}
          uploadKey={UPLOAD_KEYS.ULB}
          setFile={setFile}
          accept="video/mp4,video/x-m4v,video/*"
          setError={setError}
          customRef={customRef}
        />

        {error && <p>{error}</p>}
      </div>
    </Modal>
  );
};

const InputTag = ({
  tags,
  setTags,
}: {
  tags: string[];
  // setTags: React.Dispatch<React.SetStateAction<string[]>>;
  setTags: any;
}) => {
  const removeTag = (i: any) => {
    const newTags = [...tags];
    newTags.splice(i, 1);
    setTags(newTags);
  };

  let tagInput: any = React.useRef(null).current;

  const inputKeyDown = (e: any) => {
    const val = e.target.value;
    if (e.key === 'Enter' && val) {
      if (tags.find((tag) => tag.toLowerCase() === val.toLowerCase())) {
        return;
      }
      setTags([...tags, val]);
      tagInput.value = null;
    } else if (e.key === 'Backspace' && !val) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-md flex-wrap">
      <ul className="inline-flex flex-wrap m-0 p-1 w-full" style={{maxWidth: '36rem'}}>
        {tags.map((tag, i) => (
          <li
            className={
              'items-center bg-indigo-600 rounded-md text-white font-light list-none mb-1.5 mr-1.5 py-1.5 px-2.5 w-auto'
            }
            key={tag}>
            {tag}
            <button
              className={
                'items-center appearance-none bg-gray-700 border-none text-white rounded-full cursor-pointer inline-flex text-xs h-4 justify-center ml-2 p-0 transform rotate-45 w-4'
              }
              type="button"
              onClick={() => {
                removeTag(i);
              }}>
              +
            </button>
          </li>
        ))}
        <li className="bg-transparent flex-grow-1 p-0">
          <input
            className={`block dark:text-white w-full dark:bg-gray-800 shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-700 border-gray-300 rounded-md`}
            type="text"
            placeholder="Add tags here..."
            onKeyDown={inputKeyDown}
            ref={(c) => {
              tagInput = c;
            }}
          />
        </li>
      </ul>
    </div>
  );
};

interface FieldsInterface {
  description: string;
  title: string;
  label: string;
  instructions: string;
  instructionsHtml: any;
  interactionType: string[];
  tags?: string[];
  estTime: string;
  videoLink?: string;
  classwork: boolean;
}

interface NewLessonPlanSOInterface {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  pageDetails: any;
  instId: string;

  dark?: boolean;
}

interface ErrorInterface {
  empty: string;
  title: string;
  label: string;
  videoLink?: string;
}

const INITIAL_STATE: FieldsInterface = {
  title: '',
  label: '',
  instructions: '',
  instructionsHtml: '',
  description: '', // ignore this field
  interactionType: [],
  tags: [],
  estTime: '1 min',
  classwork: true,
  videoLink: '',
};

const ERROR_INITIAL_STATE: ErrorInterface = {
  empty: '',
  title: '',
  label: '',
  videoLink: '',
};

const Block = ({children}: {children: React.ReactNode}) => {
  return <div>{children}</div>;
};

const Container = ({children}: {children: React.ReactNode}) => {
  return <div className="flex flex-col space-y-6 p-6">{children}</div>;
};

const NewLessonPlanSO = ({
  instId,
  open,
  setOpen,
  pageDetails,
  dark,
}: NewLessonPlanSOInterface) => {
  const {clientKey, userLanguage} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');

  const {BUTTONS} = useDictionary(clientKey);

  const [fields, setFields] = useState<FieldsInterface>(INITIAL_STATE);

  const history = useHistory();
  const {
    editMode,
    setEditMode,
    universalLessonDetails,
    setSelectedPageID,
    newLessonPlanShow,
    setNewLessonPlanShow,
    setUniversalLessonDetails,
  } = useULBContext();

  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // fill the fields if edit mode
  useEffect(() => {
    if (!isEmpty(pageDetails) && editMode) {
      setFields({
        ...pageDetails,
        tags: pageDetails.tags || [],
        instructions: pageDetails.description,
        instructionsHtml: pageDetails.description,
        estTime: `${pageDetails.estTime} min`, //
        interactionType: pageDetails.interactionType || [],
        classwork: true,
        videoLink: pageDetails?.videoLink || '',
      });
    } else {
      setFields(INITIAL_STATE);
    }
  }, [pageDetails, editMode]);

  const params = useQuery(location.search);

  const pageId = params.get('pageId');
  const hideCloseButtons = pageId === 'open-overlay';

  const handleAddTags = (tags: string[]) => {
    setUnsavedChanges(true);
    setFields((prevInputs) => ({...prevInputs, tags}));
  };

  const onFieldChange = (e: any) => {
    const {id, value} = e.target;
    setUnsavedChanges(true);

    setFields((prevInputs: any) => ({
      ...prevInputs,
      [id]: value,
    }));
  };

  const onVideoLinkChange = (e: any) => {
    const {id, value = ''} = e.target;
    setUnsavedChanges(true);

    setFields((prevInputs: any) => ({
      ...prevInputs,
      [id]: value,
    }));
    const isValidUrl = REGEX.Youtube.test(value);
    if (isValidUrl) {
      setErrors((prev) => ({...prev, videoLink: ''}));
    } else {
      setErrors((prev) => ({...prev, videoLink: 'Invalid url'}));
    }
  };

  const onSelectOption = (_: any, name: string) => {
    setUnsavedChanges(true);

    setFields((prevInputs: any) => ({
      ...prevInputs,
      estTime: name,
    }));
  };

  const handleInteractionType = (e: any) => {
    const {id} = e.target;

    if (!interactionType.includes(id)) {
      interactionType.push(id);
    } else {
      remove(interactionType, (type) => type === id);
    }
    setUnsavedChanges(true);

    setFields({...fields});
  };

  const onEditorStateChange = (
    html: string,
    text: string,
    fieldHtml: string,
    field: string
  ) => {
    setUnsavedChanges(true);

    setFields({
      ...fields,
      [fieldHtml]: html,
      [field]: text,
    });
  };

  const [errors, setErrors] = useState(ERROR_INITIAL_STATE);

  const [file, setFile] = useState<IFile>();

  const uploadedVideoLink =
    !isEmpty(file) && file._status === 'success'
      ? getImageFromS3Static(UPLOAD_KEYS.ULB + file.fileKey)
      : null;
  const isUploadedFromPC = Boolean(uploadedVideoLink);

  const validate = () => {
    let trimmedLen = (field: any) => field.trim().length;
    const isValidUrl = REGEX.Youtube.test(fields.videoLink);
    let isValid = true;

    if (trimmedLen(title) <= 0) {
      errors.title = 'Title is mandatory';
      isValid = false;
    } else {
      errors.title = '';
      // isValid = true;
    }
    if (trimmedLen(label) <= 0) {
      errors.label = 'Label is mandatory';
      isValid = false;
    } else {
      errors.label = '';
      // isValid = true;
    }

    // if (trimmedLen(fields.videoLink) <= 0 && !isUploadedFromPC) {
    //   errors.videoLink = 'Video Link is mandatory';
    //   isValid = false;
    // } else {
    //   errors.videoLink = '';
    // }

    // if (!isValidUrl && !isUploadedFromPC) {
    //   errors.videoLink = 'Invalid video link';
    //   isValid = false;
    // } else {
    //   errors.videoLink = '';
    // }

    setErrors({...errors});
    return isValid;
  };

  // //@ts-ignore
  // const empty = Object.keys(fields).reduce((truthy: boolean, val: string) => {
  //   if (truthy) {
  //     //@ts-ignore
  //     if (fields[val] === INITIAL_STATE[val]) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   } else {
  //     return truthy;
  //   }
  // }, true);

  const route: any = useRouteMatch();

  const lessonId = route.params.lessonId;
  const classworkPages = universalLessonDetails?.lessonPlan;
  const homeworkPages = universalLessonDetails?.homework || [];

  const [loading, setLoading] = useState(false); // loader for creating lesson

  const onUnload = () => {
    if (unsavedChanges) {
      onTopRightButtonClick();
      return 'You have unsaved changes on this page.';
    }
  };

  useEffect(() => {
    if (unsavedChanges) {
      window.addEventListener('beforeunload', () => {
        onUnload();
      });
    }
  }, [unsavedChanges]);

  const onSave = async (e: any) => {
    e?.preventDefault();
    const isValid = validate();
    if (isValid) {
      try {
        setLoading(true);
        if (editMode) {
          const PAGECONTENT_ID = pageId;

          const pageIdx = findIndex(
            universalLessonDetails.lessonPlan,
            (item: any) => item.id === PAGECONTENT_ID
          );

          const PATH_TO_PAGECONTENT = `lessonPlan[${pageIdx}]`;
          const updatedObject = {
            ...universalLessonDetails.lessonPlan[pageIdx],
            title: fields.title,
            description: fields.instructionsHtml,
            label: fields.label,
            estTime: Number(fields.estTime?.split(' ')[0]),
            tags: fields.tags,
            videoLink: uploadedVideoLink || fields.videoLink,
            interactionType: fields.interactionType || [],
            activityType: classwork ? 'classwork' : 'homework',
          };

          update(universalLessonDetails, PATH_TO_PAGECONTENT, () => {
            return updatedObject;
          });

          setUniversalLessonDetails({...universalLessonDetails});

          const input = {
            id: lessonId,
            lessonPlan: [...universalLessonDetails.lessonPlan],
          };

          await updateLessonPageToDB(input);
        } else {
          const prevPages = classwork ? [...classworkPages] : [...homeworkPages];
          const pageId = uuidV4().toString();
          const input = {
            id: lessonId,
            lessonPlan: [
              ...prevPages,
              {
                id: pageId,
                title: fields.title,
                tags: fields.tags,
                label: fields.label,
                description: fields.instructions,
                estTime: Number(fields.estTime?.split(' ')[0]),
                interactionType: fields.interactionType || [],
                activityType: classwork ? 'classwork' : 'homework',
                pageContent: [],
                videoLink: uploadedVideoLink || fields.videoLink,
                disabled: false,
                open: true,
              },
            ],
          };

          const res: any = await API.graphql(
            graphqlOperation(customMutations.updateUniversalLesson, {
              input,
            })
          );

          const data = res.data.updateUniversalLesson;

          setUniversalLessonDetails({...data});

          setSelectedPageID(pageId);
          setEditMode(true);

          if (data.id && !editMode) {
            history.push(
              `/dashboard/manage-institutions/institution/${instId}/lessons/${lessonId}/page-builder?pageId=${pageId}`
            );
          }
        }

        setOpen(false);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
        setUnsavedChanges(false);
      }
    }
  };

  const {
    tags,
    label,
    title,
    instructions,
    classwork,

    interactionType,
    estTime,
  } = fields;

  const Checkbox = ({title, label, id}: {title: string; label: string; id: string}) => {
    return (
      <div className="relative flex items-start mb-4">
        <div className="flex items-center h-5 w-auto">
          <input
            id={id}
            name={id}
            type="checkbox"
            checked={interactionType?.includes(id)}
            onChange={handleInteractionType}
            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-400 rounded"
          />
        </div>
        <div className="ml-3 text-sm">
          <label
            htmlFor="group"
            className="whitespace-pre-line font-medium dark:text-gray-300 text-gray-700">
            {title}
          </label>
          <p className="text-sm whitespace-pre-line text-gray-500">{label}</p>
        </div>
      </div>
    );
  };

  const [showModal, setShowModal] = useState({show: false, msg: ''});

  useEffect(() => {
    if (!open) {
      // explicitly
      setUnsavedChanges(false);
    }
    return () => {
      setUnsavedChanges(false);
    };
  }, [open]);

  const onTopRightButtonClick = () => {
    if (unsavedChanges) {
      setShowModal({show: true, msg: 'Do you want to save changes?'});
    } else {
      setShowModal({show: false, msg: ''});
      setOpen(false);
      setErrors(ERROR_INITIAL_STATE);
      setNewLessonPlanShow(false);
    }
  };

  // Validation only needs to be on save
  const onSaveClick = (e: any) => {
    setUnsavedChanges(false);
    e?.preventDefault();
    const valid = validate();
    if (valid) {
      onSave(e);
      setFields(INITIAL_STATE);
      setNewLessonPlanShow(false);
    }
  };

  const onModalCancelClick = () => {
    // reset everything
    setUnsavedChanges(false);
    if (!editMode) {
      setFields(INITIAL_STATE);
      setErrors(ERROR_INITIAL_STATE);
    } else {
      if (!isEmpty(pageDetails)) {
        setFields({
          ...pageDetails,
          tags: pageDetails.tags || [],
          instructions: pageDetails.description,
          instructionsHtml: pageDetails.description,
          estTime: `${pageDetails.estTime} min`,
          interactionType: pageDetails.interactionType || [],
          classwork: true,
        });
        setErrors({...errors});
      }
    }
    setShowModal({show: false, msg: ''});
    setOpen(false);
    setNewLessonPlanShow(false);
  };

  const [videoUploadModal, setVideoUploadModal] = useState(false);

  const customRef = useRef();
  const closeVideoUploadModal = () => setVideoUploadModal(false);

  const onModalYesClick = () => {
    setUnsavedChanges(false);
    onSaveClick(undefined);
  };

  return (
    <>
      {showModal.show && (
        <div className={`${showModal.show ? 'z-1000' : ''}`}>
          <ModalPopUp
            noButton="No"
            noTooltip="Continue Activity"
            cancelLabel="Yes"
            className=""
            cancelTooltip="Discard changes and go back"
            noButtonAction={onModalCancelClick}
            message={showModal.msg}
            closeAction={() => {
              setShowModal({show: false, msg: ''});
            }}
            cancelAction={onModalYesClick}
          />
        </div>
      )}
      {videoUploadModal && (
        <VideoUploadComponent
          setFields={setFields}
          closeAction={() => closeVideoUploadModal()}
          file={file}
          setFile={setFile}
          customRef={customRef}
        />
      )}
      <div className="flex-1">
        {/* Header */}
        <div className="px-2 2xl:px-4 py-6 dark:bg-gray-800 bg-gray-50 sm:px-6">
          <div className="flex items-start justify-between space-x-3">
            <div className="space-y-1 dark:text-white">
              Activity Details
              <p className="text-sm my-2 text-gray-500">
                Get started by filling in the information below to create your new lesson
                plan.
              </p>
              <div
                style={{height: 1}}
                className={`mt-2 w-full bg-${
                  themeColor === 'iconoclastIndigo' ? 'indigo' : 'blue'
                }-500`}
              />
            </div>

            <div className="h-7 w-auto flex items-center">
              <button
                type="button"
                className="w-auto bg-white dark:bg-gray-800 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onClick={() => {
                  onTopRightButtonClick();
                }}>
                <span className="sr-only">Close panel</span>
                <XIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <Container>
          {/* Activity name */}
          <Block>
            <FormInput
              placeHolder="eg. What is Javascript?"
              value={title}
              label="Activity name"
              isRequired
              onChange={onFieldChange}
              dark={true}
              id="title"
              error={errors?.title}
            />
          </Block>
          {/* Activity label */}
          <Block>
            <FormInput
              showCharacterUsage
              label="Activity label"
              maxLength={12}
              dark={true}
              isRequired
              placeHolder="eg. Let's learn what is javascript"
              value={label}
              error={errors?.label}
              onChange={onFieldChange}
              id="label"
            />
          </Block>
          {/* Video Instructions */}
          <Block>
            <FormInput
              placeHolder="eg. https://www.youtube.com/watch?v=MiebCHmiszs"
              value={fields.videoLink}
              label="Add video instructions"
              disabled={isUploadedFromPC}
              onChange={onVideoLinkChange}
              dark={true}
              id="videoLink"
              error={errors?.videoLink}
            />
            {!isUploadedFromPC ? (
              <div
                className="text-gray-200 cursor-pointer hover:underline mt-1 text-sm"
                onClick={() => setVideoUploadModal(true)}>
                Or upload from your pc
              </div>
            ) : (
              <div>
                <div
                  className="text-gray-200 cursor-pointer hover:underline mt-1 text-sm"
                  onClick={() => {
                    const imageUrl = getImageFromS3Static(UPLOAD_KEYS.ULB + file.fileKey);
                    window.open(imageUrl, '_blank');
                  }}>
                  See video
                </div>
                <div
                  className="text-gray-200 cursor-pointer hover:underline mt-1 text-sm"
                  onClick={() => {
                    setFile(null);
                  }}>
                  Clear
                </div>
              </div>
            )}
          </Block>
          {/* Activity Instructions */}

          <Block>
            <Label className="mb-1" label={'Activity instructions'} />
            <RichTextEditor
              initialValue={instructions}
              onChange={(htmlContent, plainText) =>
                onEditorStateChange(
                  htmlContent,
                  plainText,
                  'instructionsHtml',
                  'instructions'
                )
              }
            />
          </Block>

          {/* Interaction Type */}
          <Block>
            <Label className="mb-1" label={'Interaction type'} />

            <div className="w-48">
              <Checkbox
                title={'Group'}
                label={'Working as a class to complete activity'}
                id={'group'}
              />
              <Checkbox
                title={'Small Group'}
                label={'Working in small groups to complete activity'}
                id={'smallGroup'}
              />
              <Checkbox
                title={'Individual'}
                label={'Working individually to complete activity'}
                id={'individual'}
              />

              <hr className="border-gray-200 dark:border-gray-700" />
            </div>
          </Block>

          {/* Estimated time */}

          <Block>
            <Label className="mb-1" isRequired label={'Estimated time'} />

            <div className="">
              <Selector
                placeholder={'Select estimate time'}
                list={estimatedTimeList}
                selectedItem={estTime}
                onChange={onSelectOption}
              />
            </div>
          </Block>
          {/* Tags */}

          <Block>
            <Label className="mb-1" label={'Tags'} />

            <div className="sm:col-span-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}>
                <InputTag tags={tags} setTags={handleAddTags} />
              </form>
            </div>
          </Block>
        </Container>

        {/* <hr className="my-2 dark:text-gray-700 text-gray-500" /> */}

        {/* Action buttons */}
        {open && (
          <div className="flex-shrink-0 px-4 border-t-0 dark:border-gray-700 border-gray-200 py-5 sm:px-6">
            <div className="space-x-3 flex justify-end">
              {!hideCloseButtons && (
                <button
                  type="button"
                  className="w-auto bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => onTopRightButtonClick()}>
                  Cancel
                </button>
              )}
              <button
                disabled={loading}
                onClick={(e) => onSaveClick(e)}
                className="w-auto inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                {loading
                  ? BUTTONS[userLanguage][editMode ? 'SAVING' : 'CREATING']
                  : BUTTONS[userLanguage][editMode ? 'SAVE' : 'CREATE']}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default NewLessonPlanSO;
