import '@pathofdev/react-tag-input/build/index.css';
import React, {Fragment, useContext, useEffect, useState} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import {XIcon} from '@heroicons/react/outline';

import FormTagInput from '../../../../Atoms/Form/FormTagInput';
import Selector from '../../../../Atoms/Form/Selector';
import {estimatedTimeList} from '../../../../../utilities/staticData';
import {findIndex, isEmpty, remove, update} from 'lodash';
import RichTextEditor from '../../../../Atoms/RichTextEditor';
import {useQuery} from '../../../../../customHooks/urlParam';
import {v4 as uuidV4} from 'uuid';
import * as customMutations from '../../../../../customGraphql/customMutations';
import {graphqlOperation, API} from 'aws-amplify';

import {Switch} from '@headlessui/react';
import {FaMoon, FaSun} from 'react-icons/fa';
import {useULBContext} from '../../../../../contexts/UniversalLessonBuilderContext';
import {useHistory} from 'react-router';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../customHooks/dictionary';
import Input from './Input';
import {updateLessonPageToDB} from '../../../../../utilities/updateLessonPageToDB';

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
interface FieldsInterface {
  description: string;
  title: string;
  label: string;
  instructions: string;
  interactionType: string[];
  tags?: string[];
  estTime: string;
  darkMode: boolean;
  classwork: boolean;
}

interface NewLessonPlanSOInterface {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  editMode: boolean;
  pageDetails: any;
}

const INITIAL_STATE: FieldsInterface = {
  title: '',
  label: '',
  instructions: '',
  description: '', // ignore this field
  interactionType: [],
  tags: [],
  estTime: '1 min',
  darkMode: true,
  classwork: true,
};

const Toggle = ({
  enabled,
  enabledColor,
  disabledColor,
  setEnabled,
  enableIcon,
  disableIcon,
  disabled,
}: any) => {
  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      disabled={disabled}
      className={classNames(
        enabled
          ? `${enabledColor || 'bg-gray-600'}`
          : `${disabledColor || 'bg-orange-200'}`,
        'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
      )}>
      <span className="sr-only">Use setting</span>
      <span
        className={classNames(
          enabled ? 'translate-x-5' : 'translate-x-0',
          'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
        )}>
        <span
          className={classNames(
            enabled
              ? 'opacity-0 ease-out duration-100'
              : 'opacity-100 ease-in duration-200',
            'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'
          )}
          aria-hidden="true">
          {disableIcon}
        </span>
        <span
          className={classNames(
            enabled
              ? 'opacity-100 ease-in duration-200'
              : 'opacity-0 ease-out duration-100',
            'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'
          )}
          aria-hidden="true">
          {enableIcon}
        </span>
      </span>
    </Switch>
  );
};

const NewLessonPlanSO = ({
  open,
  setOpen,
  editMode,
  pageDetails,
}: NewLessonPlanSOInterface) => {
  // fill the fields if edit mode
  useEffect(() => {
    if (!isEmpty(pageDetails) && editMode) {
      setFields({
        ...pageDetails,
        tags: pageDetails.tags || [],
        instructions: pageDetails.description,
        estTime: `${pageDetails.estTime} min`, //
        interactionType: pageDetails.interactionType || [],
        darkMode: true,
        classwork: true,
      });
    } else {
      setFields(INITIAL_STATE);
    }
  }, [pageDetails, editMode]);

  const params = useQuery(location.search);

  const pageId = params.get('pageId');
  const hideCloseButtons = pageId === 'open-overlay';

  const handleAddTags = (tags: string[]) =>
    setFields((prevInputs) => ({...prevInputs, tags}));

  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {BUTTONS} = useDictionary(clientKey);

  const [fields, setFields] = useState<FieldsInterface>(INITIAL_STATE);

  const {universalLessonDetails, setUniversalLessonDetails} = useULBContext();
  const history = useHistory();
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

  const handleToggle = (field: string, val: boolean) => {
    setFields({...fields, [field]: val});
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
      // [fieldHtml]: html,
      [field]: text,
    });
  };

  const [errors, setErrors] = useState({
    title: '',
    label: '',
    instructions: '',
    interactionType: '',
  });

  const validate = () => {
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
    if (!interactionType && interactionType?.length <= 0) {
      errors.interactionType = 'Please select at least one interaction type';
      isValid = false;
    } else {
      errors.interactionType = '';
      isValid = true;
    }
    setErrors({...errors});
    return isValid;
  };

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
            description: fields.instructions,
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
          const input = {
            id: lessonId,
            lessonPlan: [
              ...prevPages,
              {
                id: uuidV4().toString(),
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
          if (data.id && !editMode) {
            history.push(`edit?lessonId=${lessonId}&step=courses`);
          }
        }

        setOpen(false);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const {
    tags,
    label,
    title,
    instructions,
    classwork,
    darkMode,
    interactionType,
    estTime,
  } = fields;

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        static
        className="w-auto fixed inset-0 overflow-hidden z-100"
        open={open}
        onClose={!hideCloseButtons ? setOpen : () => {}}>
        <div className="absolute inset-0 overflow-hidden">
          <Dialog.Overlay className="absolute inset-0 w-auto" />

          <div className=" fixed w-auto inset-y-0 right-0 pl-10 max-w-full flex sm:pl-16">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full">
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
                        </div>
                        {!hideCloseButtons && (
                          <div className="h-7 w-auto flex items-center">
                            <button
                              type="button"
                              className="w-auto bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              onClick={() => setOpen(false)}>
                              <span className="sr-only">Close panel</span>
                              <XIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        )}
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
                            defaultValue={title}
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
                            placeholder="eg. Let's learn what is javascript"
                            value={label}
                            defaultValue={label}
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
                                '',
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
                            <div className="relative flex items-start mb-4">
                              <div className="flex items-center h-5 w-auto">
                                <input
                                  id="group"
                                  name="group"
                                  type="checkbox"
                                  checked={interactionType?.includes('group')}
                                  onChange={handleInteractionType}
                                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-400 rounded"
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label
                                  htmlFor="group"
                                  className="font-medium text-gray-700">
                                  Group
                                </label>
                                <p className="text-sm whitespace-nowrap text-gray-500">
                                  Wokring with other teachers
                                </p>
                              </div>
                            </div>
                            <div className="relative flex items-start mb-4">
                              <div className="flex items-center h-5 w-auto">
                                <input
                                  id="smallGroup"
                                  name="smallGroup"
                                  checked={interactionType?.includes('smallGroup')}
                                  type="checkbox"
                                  onChange={handleInteractionType}
                                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-400 rounded"
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label
                                  htmlFor="smallGroup"
                                  className="font-medium text-gray-700">
                                  Small group
                                </label>
                                <p className="text-sm whitespace-nowrap text-gray-500">
                                  Working with small group of teachers
                                </p>
                              </div>
                            </div>
                            <div className="relative flex items-start mb-4">
                              <div className="flex items-center h-5 w-auto">
                                <input
                                  id="individual"
                                  name="individual"
                                  type="checkbox"
                                  checked={interactionType?.includes('individual')}
                                  onChange={handleInteractionType}
                                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-400 rounded"
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label
                                  htmlFor="indiviual"
                                  className="font-medium text-gray-700">
                                  Individual
                                </label>
                                <p className="text-sm whitespace-nowrap text-gray-500">
                                  Only you are working on this
                                </p>
                              </div>
                            </div>

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
                            <FormTagInput
                              className="max-w-132"
                              error=""
                              tags={tags}
                              handleChange={handleAddTags}
                            />
                          </form>
                        </div>
                      </div>
                      {/* Theme */}
                      <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                        <div>
                          <label
                            htmlFor="project-description"
                            className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2">
                            Theme
                          </label>
                        </div>
                        <div className="sm:col-span-2 flex items-center">
                          <Toggle
                            enabled={darkMode}
                            disableIcon={<FaSun className="h-3 w-3 text-orange-400" />}
                            enableIcon={<FaMoon className="h-3 w-3 text-gray-600" />}
                            setEnabled={() => handleToggle('darkMode', !darkMode)}
                          />
                          <span className="text-sm text-gray-500 ml-2">
                            ({darkMode ? 'dark' : 'light'})
                          </span>
                        </div>
                      </div>
                      {/* Classwork / Homework */}
                      <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                        <div>
                          <label
                            htmlFor="project-description"
                            className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2">
                            Classwork
                          </label>
                        </div>
                        <div className="sm:col-span-2 flex items-center">
                          <Toggle
                            disabled={true}
                            // disabled for now
                            enabled={classwork}
                            enabledColor={'bg-indigo-600'}
                            setEnabled={() => handleToggle('classwork', !classwork)}
                          />
                          <span className="text-sm text-gray-500 ml-2">
                            only classwork activities available now
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex-shrink-0 px-4 border-t border-gray-200 py-5 sm:px-6">
                    <div className="space-x-3 flex justify-end">
                      {!hideCloseButtons && (
                        <button
                          type="button"
                          className="w-auto bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          onClick={() => setOpen(false)}>
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
                </form>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default NewLessonPlanSO;
