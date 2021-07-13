import React, {Fragment, useContext, useEffect, useState} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import {XIcon} from '@heroicons/react/outline';
import Selector from '../../../../Atoms/Form/Selector';
import {estimatedTimeList} from '../../../../../utilities/staticData';
import {findIndex, isEmpty, remove, update} from 'lodash';
import RichTextEditor from '../../../../Atoms/RichTextEditor';
import {useQuery} from '../../../../../customHooks/urlParam';
import {v4 as uuidV4} from 'uuid';
import * as customMutations from '../../../../../customGraphql/customMutations';
import {graphqlOperation, API} from 'aws-amplify';
import {useULBContext} from '../../../../../contexts/UniversalLessonBuilderContext';
import {useHistory} from 'react-router';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../customHooks/dictionary';
import Input from './Input';
import {updateLessonPageToDB} from '../../../../../utilities/updateLessonPageToDB';
import ModalPopUp from '../../../../Molecules/ModalPopUp';
import {UniversalLessonPage} from '../../../../../interfaces/UniversalLessonInterfaces';

const InputTag = ({
  tags,
  setTags,
}: {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
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
    <div className="bg-white border-1 border-gray-400 rounded-md flex-wrap">
      <ul className="inline-flex flex-wrap m-0 p-0 w-full max-w-132">
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
            className={`block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md`}
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
  fields: FieldsInterface;
  setFields: React.Dispatch<React.SetStateAction<FieldsInterface>>;
  activePageData: UniversalLessonPage;
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
interface ErrorInterface {
  title: string;
  label: string;
  instructions: string;
  interactionType: string;
}

const ERROR_INITIAL_STATE: ErrorInterface = {
  title: '',
  label: '',
  instructions: '',
  interactionType: '',
};

const NewLessonPlanSO = ({open, setOpen, pageDetails}: NewLessonPlanSOInterface) => {
  const {clientKey, userLanguage} = useContext(GlobalContext);

  const {BUTTONS} = useDictionary(clientKey);

  const [fields, setFields] = useState<FieldsInterface>(INITIAL_STATE);

  const history = useHistory();
  const {
    previewMode,
    setPreviewMode,
    selectedLessonID,
    editMode,
    setEditMode,
    setSelectedLessonID,
    newBlockSeqId,
    setNewBlockSeqId,
    getCurrentPageIdx,
    universalLessonDetails,
    selectedPageID,
    activeTab,
    setActiveTab,
    setSelectedPageID,
    getCurrentPage,
    theme,
    newLessonPlanShow,
    setNewLessonPlanShow,
    setUniversalLessonDetails,
    setEnableDnD,
    addFromULBHandler: addULBHandler,
    addNewPageHandler,
    updateMovableList,
    getPartContent,
    getPageContent,
    enableDnD,
    fetchingLessonDetails,
    setFetchingLessonDetails,
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
    }
  }, [pageDetails, editMode]);

  const params = useQuery(location.search);

  const pageId = params.get('pageId');
  const hideCloseButtons = pageId === 'open-overlay';

  const handleAddTags = (tags: string[]) =>
    setFields((prevInputs) => ({...prevInputs, tags}));

  const onFieldChange = (e: any) => {
    const {id, value} = e.target;

    setFields((prevInputs: any) => ({
      ...prevInputs,
      [id]: value,
    }));
  };

  const onSelectOption = (_: any, name: string) => {
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

    setFields({...fields});
  };

  const onEditorStateChange = (
    html: string,
    text: string,
    fieldHtml: string,
    field: string
  ) => {
    setFields({
      ...fields,
      [fieldHtml]: html,
      [field]: text,
    });
  };

  const [errors, setErrors] = useState(ERROR_INITIAL_STATE);

  const validate = (pushErrors: boolean = true) => {
    let trimmedLen = (field: any) => field.trim().length;
    let isValid = true;
    if (trimmedLen(title) <= 0) {
      errors.title = 'Title is mandatory';
      isValid = false;
    } else {
      errors.title = '';
      isValid = true;
    }
    if (trimmedLen(label) <= 0) {
      errors.label = 'Label is mandatory';
      isValid = false;
    } else {
      errors.label = '';
      isValid = true;
    }
    if (trimmedLen(instructions) <= 0) {
      errors.instructions = 'Instructions is mandatory';
      isValid = false;
    } else {
      errors.instructions = '';
      isValid = true;
    }
    if (interactionType?.length === 0) {
      errors.interactionType = 'Please select at least one interaction type';
      isValid = false;
    } else {
      errors.interactionType = '';
      isValid = true;
    }
    if (pushErrors) setErrors({...errors});
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
        }

        setOpen(false);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
        // closeAction();
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

  const closeAction = () => {
    setOpen(false);
  };

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
          <label htmlFor="group" className="font-medium text-gray-700">
            {title}
          </label>
          <p className="text-sm whitespace-nowrap text-gray-500">{label}</p>
        </div>
      </div>
    );
  };

  useEffect(() => {
    // added safety check
    if (hideCloseButtons) {
      setErrors(ERROR_INITIAL_STATE);
      setFields(INITIAL_STATE);
    }
  }, []);

  const [showModal, setShowModal] = useState({
    show: false,
    msg: '',
    requireFields: false,
  });

  const clearErrors = () => setErrors(ERROR_INITIAL_STATE);

  const onCancel = () => {
    setOpen(false);
    if (!editMode) {
      setShowModal({...showModal, show: true, msg: 'Do you want to save information?'});
    }
  };

  const goToSteps = () =>
    hideCloseButtons && history.push(`edit?lessonId=${lessonId}&step=activities`);

  // Validation only needs to be on save
  const onModalSaveClick = (e: any) => {
    const isValid = validate(false);

    if (isValid) {
      if (!editMode) {
        onSave(e);
        onModalCancelClick();
      }
    } else {
      if (!editMode) {
        setShowModal({
          show: true,
          msg: 'Please fill all required fields.',
          requireFields: true,
        });
      }
    }
  };

  const onModalCancelClick = () => {
    if (!editMode) {
      if (!showModal.requireFields) {
        closeAction();
        clearErrors();
        setFields(INITIAL_STATE);
        goToSteps();
        setShowModal({requireFields: false, show: false, msg: ''});
        setOpen(false);
      } else {
        setShowModal({requireFields: false, show: false, msg: ''});

        setOpen(false);
      }
    } else {
      setOpen(false);
      setShowModal({requireFields: false, show: false, msg: ''});
    }
  };

  return (
    <>
      {showModal.show && (
        <ModalPopUp
          cancelLabel={'Discard'} // discard all changes and go back to activities page
          cancelTooltip="Discard changes"
          saveTooltip={'Save changes'} // first check if all required fields are filled if yes then save changes and go to activity page and if not show another modal
          saveLabel={'Save'}
          saveAction={onModalSaveClick}
          message={showModal.msg}
          closeAction={onModalCancelClick}
        />
      )}
      {showModal.show && showModal.requireFields && (
        <ModalPopUp
          cancelLabel="Discard"
          saveLabel="Continue"
          saveAction={() => {
            setShowModal({show: false, requireFields: false, msg: ''});
            setOpen(true);
          }}
          message={showModal.msg}
          closeAction={() => {
            setShowModal({show: false, requireFields: false, msg: ''});
            setOpen(false);
          }}
        />
      )}

      {/*{newLessonPlanShow && (*/}
      <Dialog
        as="div"
        static
        className={`
            fixed inset-0 transition-all ease-in-out duration-300 
            ${showModal.show ? '' : 'z-100'}
            ${
              newLessonPlanShow
                ? 'w-auto'
                : 'w-0 opacity-0 overflow-hidden bg-black bg-opacity-50'
            }
`}
        open={open}
        onClose={
          !hideCloseButtons
            ? () => {
                onCancel();
                return setOpen;
              }
            : () => {}
        }>
        <div className="absolute inset-0 overflow-hidden">
          <Dialog.Overlay className="absolute inset-0 w-auto" />

          <div
            className={` 
              fixed w-auto inset-y-0 right-0 pl-10 max-w-full flex sm:pl-16
              transform transition ease-in-out duration-500 sm:duration-700
              ${newLessonPlanShow ? 'translate-x-0' : 'translate-x-full'}
              `}>
            <div className="w-auto max-w-2xl">
              <form className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                <div className="flex-1">
                  {/* Header */}
                  <div className="px-4 py-6 bg-gray-50 sm:px-6">
                    <div className="flex items-start justify-between space-x-3">
                      <div className="space-y-1">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          Activity Details
                        </Dialog.Title>
                        <p className="text-sm text-gray-500">
                          Get started by filling in the information below to create your
                          new lesson plan.
                        </p>
                        <hr className="mt-2 text-gray-500" />
                      </div>

                      <div className="h-7 w-auto flex items-center">
                        <button
                          type="button"
                          className="w-auto bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          onClick={() => {
                            onCancel();
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
                    <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                      <div>
                        <label
                          htmlFor="project-name"
                          className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2">
                          Activity name <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <div className="sm:col-span-2">
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
                    <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                      <div>
                        <label
                          htmlFor="project-name"
                          className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2">
                          Activity label <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <div className="sm:col-span-2">
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
                    <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                      <div>
                        <label
                          htmlFor="project-description"
                          className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2">
                          Activity Instructions <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <div className="sm:col-span-2 max-w-132">
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
                        <p
                          hidden={errors.instructions.length === 0}
                          className="mt-2 whitespace-nowrap transition-all text-sm text-red-600"
                          id="instructions-error">
                          {errors.instructions}
                        </p>
                      </div>
                    </div>

                    {/* Interaction Type */}
                    <fieldset>
                      <div className="space-y-2 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:px-6 sm:py-5">
                        <div>
                          <legend className="text-sm font-medium text-gray-900">
                            Interaction type <span className="text-red-500">*</span>
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
                          <p
                            hidden={errors.interactionType.length === 0}
                            className="mt-2 whitespace-nowrap transition-all text-sm text-red-600"
                            id="interactionType-error">
                            {errors.interactionType}
                          </p>
                        </div>
                      </div>
                    </fieldset>
                    {/* Estimated time */}
                    <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                      <div>
                        <label
                          htmlFor="project-description"
                          className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2">
                          Estimated time <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <div className="sm:col-span-2">
                        <Selector
                          placeholder={'Select estimate time'}
                          list={estimatedTimeList}
                          selectedItem={estTime}
                          onChange={onSelectOption}
                        />
                      </div>
                    </div>
                    {/* Tags */}
                    <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                      <div>
                        <label
                          htmlFor="project-description"
                          className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2">
                          Tags
                        </label>
                      </div>
                      <div className="sm:col-span-2">
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                          }}>
                          <InputTag tags={tags} setTags={handleAddTags} />
                        </form>
                      </div>
                    </div>
                  </div>
                  <hr className="my-2 text-gray-500" />

                  {/* Action buttons */}
                  <div className="flex-shrink-0 px-4 border-t border-gray-200 py-5 sm:px-6">
                    <div className="space-x-3 flex justify-end">
                      {!hideCloseButtons && (
                        <button
                          type="button"
                          className="w-auto bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          onClick={closeAction}>
                          Cancel
                        </button>
                      )}
                      <button
                        disabled={loading}
                        onClick={onSave}
                        className="w-auto inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        {loading
                          ? BUTTONS[userLanguage][editMode ? 'SAVING' : 'CREATING']
                          : BUTTONS[userLanguage][editMode ? 'SAVE' : 'CREATE']}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Dialog>
      {/*)}*/}
    </>
  );
};

export default NewLessonPlanSO;
