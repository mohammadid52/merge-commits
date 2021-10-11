import Selector from '@atoms/Form/Selector';
import RichTextEditor from '@atoms/RichTextEditor';
import {GlobalContext} from '@contexts/GlobalContext';
import {useULBContext} from '@contexts/UniversalLessonBuilderContext';
import * as customMutations from '@customGraphql/customMutations';
import useDictionary from '@customHooks/dictionary';
import {useQuery} from '@customHooks/urlParam';
import {XIcon} from '@heroicons/react/outline';
import {UniversalLessonPage} from '@interfaces/UniversalLessonInterfaces';
import ModalPopUp from '@molecules/ModalPopUp';
import '@pathofdev/react-tag-input/build/index.css';
import Input from '@uiComponents/Input';
import {estimatedTimeList} from '@utilities/staticData';
import {updateLessonPageToDB} from '@utilities/updateLessonPageToDB';
import {getAsset} from 'assets';
import {API, graphqlOperation} from 'aws-amplify';
import {findIndex, isEmpty, remove, update} from 'lodash';
import React, {useContext, useEffect, useState} from 'react';
import {useHistory} from 'react-router';
import {v4 as uuidV4} from 'uuid';

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
            className={`block w-full dark:bg-gray-800 shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-700 border-gray-300 rounded-md`}
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

  classwork: boolean;
}

interface NewLessonPlanSOInterface {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  editMode: boolean;
  pageDetails: any;
  activePageData: UniversalLessonPage;
}

interface ErrorInterface {
  empty: string;
  title: string;
  label: string;
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
};

const ERROR_INITIAL_STATE: ErrorInterface = {
  empty: '',
  title: '',
  label: '',
};

const NewLessonPlanSO = ({open, setOpen, pageDetails}: NewLessonPlanSOInterface) => {
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

  const validate = () => {
    let trimmedLen = (field: any) => field.trim().length;
    let isValid = true;
    if (empty) {
      errors.empty = 'Please fill in all the details';
      isValid = false;
    } else {
      errors.empty = '';
      // isValid = true;
    }
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

    setErrors({...errors});
    return isValid;
  };

  //@ts-ignore
  const empty = Object.keys(fields).reduce((truthy: boolean, val: string) => {
    if (truthy) {
      //@ts-ignore
      if (fields[val] === INITIAL_STATE[val]) {
        return true;
      } else {
        return false;
      }
    } else {
      return truthy;
    }
  }, true);

  const lessonId = params.get('lessonId');
  const classworkPages = universalLessonDetails?.lessonPlan;
  const homeworkPages = universalLessonDetails?.homework || [];

  const [loading, setLoading] = useState(false); // loader for creating lesson

  const onSave = async (e: any) => {
    e.preventDefault();
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
              `/dashboard/manage-institutions/institution/${universalLessonDetails.institutionID}/lessons/${lessonId}/page-builder?pageId=${pageId}`
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
          <label htmlFor="group" className="font-medium dark:text-gray-300 text-gray-700">
            {title}
          </label>
          <p className="text-sm whitespace-nowrap text-gray-500">{label}</p>
        </div>
      </div>
    );
  };

  const [showModal, setShowModal] = useState({show: false, msg: ''});
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const onTopRightButtonClick = () => {
    if (unsavedChanges) {
      setShowModal({show: true, msg: 'Do you want to discard changes?'});
    } else {
      setShowModal({show: false, msg: ''});
      setOpen(false);
      setErrors(ERROR_INITIAL_STATE);
      setNewLessonPlanShow(false);
    }
  };

  // Validation only needs to be on save
  const onSaveClick = (e: any) => {
    e.preventDefault();
    const valid = validate();
    if (valid) {
      onSave(e);
      setFields(INITIAL_STATE);
      setNewLessonPlanShow(false);
    }
  };

  const onModalNoClick = () => {
    // continue work
    setShowModal({show: false, msg: ''});
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

  return (
    <>
      {showModal.show && (
        <div className={`${showModal.show ? 'z-1000' : ''}`}>
          <ModalPopUp
            noButton="No"
            noTooltip="Continue Activity"
            cancelLabel="Yes"
            cancelTooltip="Discard changes and go back"
            noButtonAction={onModalNoClick}
            message={showModal.msg}
            closeAction={onModalNoClick}
            cancelAction={onModalCancelClick}
          />
        </div>
      )}
      <div className="flex-1">
        {/* Header */}
        <div className="px-4 py-6 dark:bg-gray-800 bg-gray-50 sm:px-6">
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

        {/* Divider container */}
        <div className="py-6 space-y-6 sm:py-0 sm:space-y-0 sm:divide-y sm:divide-gray-200">
          {/* Activity name */}
          <div
            className={
              'space-y-1 px-6 sm:space-y-0 sm:grid sm:grid-cols-4 sm:px-10 sm:py-5'
            }>
            <div>
              <label
                htmlFor="project-name"
                className="block text-sm font-medium dark:text-white text-gray-900 sm:mt-px sm:pt-2">
                Activity name <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="sm:col-span-3">
              <Input
                placeholder="eg. What is Javascript?"
                value={title}
                onChange={onFieldChange}
                id="title"
                error={errors?.title}
              />
            </div>
          </div>
          {/* Activity label */}
          <div className="space-y-1 px-6 sm:space-y-0 sm:grid sm:grid-cols-4 sm:px-10 sm:py-5">
            <div>
              <label
                htmlFor="project-name"
                className="block text-sm font-medium text-gray-900 dark:text-white  sm:mt-px sm:pt-2">
                Activity label <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="sm:col-span-3">
              <Input
                showCharacterUsage
                maxLength={12}
                placeholder="eg. Let's learn what is javascript"
                value={label}
                error={errors?.label}
                onChange={onFieldChange}
                id="label"
              />
            </div>
          </div>

          {/* Activity Instructions */}
          <div className="space-y-1 px-6 sm:space-y-0 sm:grid sm:grid-cols-4 sm:px-10 sm:py-5">
            <div>
              <label
                htmlFor="project-description"
                className="block text-sm font-medium text-gray-900  dark:text-white  sm:mt-px sm:pt-2">
                Activity instructions
              </label>
            </div>
            <div className="sm:col-span-3 " style={{maxWidth: '36rem'}}>
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
            </div>
          </div>

          {/* Interaction Type */}
          <fieldset>
            <div className="space-y-2 px-6 sm:space-y-0 sm:grid sm:grid-cols-4 sm:items-start sm:px-10 sm:py-5">
              <div>
                <legend className="text-sm font-medium text-gray-900 dark:text-white ">
                  Interaction type
                </legend>
              </div>
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

                <hr className="border-gray-200" />
              </div>
            </div>
          </fieldset>
          {/* Estimated time */}
          <div className="space-y-1 px-6 sm:space-y-0 sm:grid sm:grid-cols-4 sm:px-10 sm:py-5">
            <div>
              <label
                htmlFor="project-description"
                className="block text-sm font-medium dark:text-white  text-gray-900 sm:mt-px sm:pt-2">
                Estimated time
              </label>
            </div>
            <div className="sm:col-span-3">
              <Selector
                placeholder={'Select estimate time'}
                list={estimatedTimeList}
                selectedItem={estTime}
                onChange={onSelectOption}
              />
            </div>
          </div>
          {/* Tags */}
          <div className="space-y-1 px-6 sm:space-y-0 sm:grid sm:grid-cols-4 sm:px-10 sm:py-5">
            <div>
              <label
                htmlFor="project-description"
                className="block text-sm font-medium dark:text-white  text-gray-900 sm:mt-px sm:pt-2">
                Tags
              </label>
            </div>
            <div className="sm:col-span-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}>
                <InputTag tags={tags} setTags={handleAddTags} />
              </form>
            </div>
          </div>
        </div>
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
