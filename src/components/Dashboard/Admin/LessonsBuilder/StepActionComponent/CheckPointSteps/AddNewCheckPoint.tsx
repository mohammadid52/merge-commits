import React, { Fragment, useState, useEffect, useContext } from 'react'
import API, { graphqlOperation } from '@aws-amplify/api'
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { IoCaretDownCircleOutline, IoCaretUpCircleOutline, IoOptionsOutline } from 'react-icons/io5';
import { IoIosKeypad } from 'react-icons/io';
import { RiArrowRightLine } from 'react-icons/ri';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import * as customMutations from '../../../../../../customGraphql/customMutations';
import * as mutations from '../../../../../../graphql/mutations';

import MultipleSelector from '../../../../../Atoms/Form/MultipleSelector';
import Selector from '../../../../../Atoms/Form/Selector';
import FormInput from '../../../../../Atoms/Form/FormInput';
import Buttons from '../../../../../Atoms/Buttons';
import RichTextEditor from '../../../../../Atoms/RichTextEditor';
import CheckBox from '../../../../../Atoms/Form/CheckBox';
import { LessonPlansProps } from '../../LessonEdit';

import { getTypeString, reorder } from '../../../../../../utilities/strings';
import { getAsset } from '../../../../../../assets';
import { GlobalContext } from '../../../../../../contexts/GlobalContext';
export interface AddNewCheckPointProps {
  changeStep: (step: string) => void
  updateLessonPlan: (plan: LessonPlansProps[], newObj: any[]) => void
  designersList?: InputValueObject[]
  lessonID: string
  lessonPlans?: LessonPlansProps[] | null
  checkPointData: InitialData | null,
  setCheckPointData: (data: InitialData) => void,
  selectedDesigners: InputValueObject[],
  setSelectedDesigners: (arr: InputValueObject[]) => void
  checkpQuestions: any[]
  setCheckpQuestions: (val: any[]) => void
  previouslySelectedId?: string[]
}
export interface InitialData {
  id?: string
  title: string
  subtitle: string
  estTime: string
  language: InputValueObject
  label: string,
  instructionsTitle: string,
  purposeHtml: string,
  objectiveHtml: string,
  instructionHtml: string,
  checkpQuestions?: any[]
}
interface InputValueObject {
  id: string,
  name: string,
  value: string
}

const AddNewCheckPoint = (props: AddNewCheckPointProps) => {
  const {
    changeStep,
    updateLessonPlan,
    designersList,
    lessonID,
    lessonPlans,
    checkPointData,
    setCheckPointData,
    selectedDesigners,
    setSelectedDesigners,
    checkpQuestions,
    setCheckpQuestions
  } = props;

  const initialData = {
    title: '',
    subtitle: '',
    label: '',
    estTime: '',
    instructionsTitle: '',
    purposeHtml: '<p></p>',
    objectiveHtml: '<p></p>',
    instructionHtml: '<p></p>',
    language: { id: '1', name: "English", value: 'EN' }
  }
  const [selectedBlock, setSelectedBlock] = useState('');
  const [questionOptions, setQuestionOptions] = useState({ quesId: '', options: [] });
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState({
    title: '',
    label: '',
    message: '',
    estTime: '',
    isError: true
  });

  const { theme, clientKey } = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');

  const languageList = [
    { id: 1, name: 'English', value: 'EN' },
    { id: 2, name: 'Spanish', value: 'ES' },
  ];

  const accordionSteps = [
    {
      id: '1',
      header: 'Checkpoint Instructions',
      title: 'instructionsTitle',
      titleValue: checkPointData.instructionsTitle,
      titleLabel: 'Checkpoint Instructions Title',
      textEditorName: 'instructionHtml',
      textEditorValue: checkPointData.instructionHtml
    },
    {
      id: '2',
      header: 'Checkpoint Purpose',
      titleLabel: 'Checkpoint Purpose',
      textEditorName: 'purposeHtml',
      textEditorValue: checkPointData.purposeHtml
    },
    {
      id: '3',
      header: 'Checkpoint Objective',
      titleLabel: 'Checkpoint Objective',
      textEditorName: 'objectiveHtml',
      textEditorValue: checkPointData.objectiveHtml
    }
  ]

  const toggleView = (id: string) => {
    if (selectedBlock === id) {
      setSelectedBlock('')
    } else {
      setSelectedBlock(id)
    }
  }
  const onInputChange = (e: any) => {
    setCheckPointData({
      ...checkPointData,
      [e.target.name]: e.target.value
    })
    if (validation.title || validation.label || validation.estTime) {
      setValidation({
        ...validation,
        title: '',
        label: '',
        estTime: ''
      })
    }
  }

  const setEditorContent = (html: string, text: string, fieldHtml: string) => {
    setCheckPointData({
      ...checkPointData,
      [fieldHtml]: html,
    })
  }

  const selectLanguage = (value: string, name: string, id: string) => {
    setCheckPointData({
      ...checkPointData,
      language: {
        id,
        name,
        value
      }
    })
  }

  const onDragEnd = async (result: any) => {
    if (result.source.index !== result.destination.index) {
      const checkpointId = checkpQuestions.map(item => item.id);
      const list = reorder(checkpointId, result.source.index, result.destination.index)
      let questionsList = checkpQuestions.map((t: any) => {
        let index = list.indexOf(t.id)
        return { ...t, index }
      }).sort((a: any, b: any) => (a.index > b.index ? 1 : -1))
      setCheckpQuestions(questionsList)
    }
  }

  const selectDesigner = (id: string, name: string, value: string) => {
    let updatedList;
    const currentDesigners = selectedDesigners;
    const selectedItem = currentDesigners.find(item => item.id === id);
    if (!selectedItem) {
      updatedList = [...currentDesigners, { id, name, value }];
    } else {
      updatedList = currentDesigners.filter(item => item.id !== id);
    }
    setSelectedDesigners(updatedList)
  }
  const showOptions = (quesId: string, options: any[]) => {
    if (questionOptions.quesId !== quesId) {
      setQuestionOptions({ quesId, options })
    } else {
      setQuestionOptions({ quesId: '', options: [] })
    }
  }
  const gobackToPreviousStep = () => {
    setCheckPointData(initialData);
    setSelectedDesigners([]);
    setCheckpQuestions([]);
    changeStep('SelectedCheckPointsList')
  }
  const makeQuestionRequired = (id: string) => {
    const questionsList = [...checkpQuestions];
    const index = questionsList.findIndex((obj => obj.id === id));
    questionsList[index].required = !questionsList[index].required;
    setCheckpQuestions(questionsList);
  }

  const addCheckpointQuestions = async (quesId: string, checkpointID: string, required: boolean) => {
    try {
      const input = {
        checkpointID: checkpointID,
        questionID: quesId,
        required: required ? required : false,
      };
      const questions: any = await API.graphql(graphqlOperation(customMutations.createCheckpointQuestions, { input: input }));
    } catch {
      setValidation({
        title: '',
        label: '',
        estTime: '',
        message: 'Unable to save Checkpoint details, Please try again later.',
        isError: true
      });
    }
  }

  const validateForm = () => {
    let isValid = true
    const msgs = validation;
    if (!checkPointData.title?.trim().length) {
      isValid = false;
      msgs.title = 'Checkpoint title is required';
    } else {
      msgs.title = ''
    }
    if (!checkPointData.label?.trim().length) {
      isValid = false;
      msgs.label = 'Checkpoint label is required';
    } else {
      msgs.label = ''
    }
    if (!checkPointData.estTime?.trim().length) {
      isValid = false;
      msgs.estTime = 'Checkpoint estimated time is required';
    } else {
      const estTime = checkPointData.estTime?.trim();
      const isInValidNumber = isNaN(parseInt(estTime));
      if (isInValidNumber) {
        isValid = false;
        msgs.estTime = 'Please enter valid number i.e. 30.';
      } else {
        msgs.estTime = ''
      }
    }
    if (checkpQuestions?.length <= 0) {
      isValid = false;
      msgs.message = 'You need to add minimum one question to create a checkpoint.';
    } else {
      msgs.message = ''
    }
    setValidation({ ...msgs });
    return isValid;
  }

  const saveNewCheckPoint = async () => {
    const isValid = validateForm();
    if (isValid) {
      try {
        setLoading(true)
        const input = {
          stage: 'checkpoint',
          type: 'checkpoint',
          label: checkPointData.label,
          title: checkPointData.title,
          subtitle: checkPointData.subtitle,
          instructionsTitle: checkPointData.instructionsTitle,
          instructions: checkPointData.instructionHtml,
          purpose: checkPointData.purposeHtml,
          objectives: checkPointData.objectiveHtml,
          designers: selectedDesigners.map((item: any) => item.id),
          language: checkPointData.language.value,
          estTime: checkPointData.estTime ? parseInt(checkPointData.estTime) : 0,
        }
        const results: any = await API.graphql(
          graphqlOperation(customMutations.createCheckpoint, { input: input })
        );
        const newCheckpoint = results?.data?.createCheckpoint;
        if (newCheckpoint) {
          let lessonCheckpointInput = {
            lessonID: lessonID,
            checkpointID: newCheckpoint.id,
            position: 0,
          }
          let lessonPlansInput = !lessonPlans?.length ? [
            {
              type: 'checkpoint',
              LessonComponentID: newCheckpoint.id,
              sequence: 0,
              stage: 'checkpoint',
            }
          ] : [
              ...lessonPlans,
              {
                type: 'checkpoint',
                LessonComponentID: newCheckpoint.id,
                sequence: lessonPlans.length,
                stage: 'checkpoint',
              }
            ]
          let [lessonCheckpoint, lesson]: any = await Promise.all([
            await API.graphql(graphqlOperation(customMutations.createLessonCheckpoint, {
              input: lessonCheckpointInput
            })),
            await API.graphql(graphqlOperation(customMutations.updateLesson, {
              input: {
                id: lessonID,
                lessonPlan: lessonPlansInput
              }
            }))
          ]);
          let questions = Promise.all(
            checkpQuestions.map(async (item: any) => addCheckpointQuestions(item.id, newCheckpoint.id, item.required))
          )
          let checkpQuestionsIds = checkpQuestions.map(item => item.id)
          let seqItem: any = await API.graphql(graphqlOperation(mutations.createCSequences, { input: { id: `Ch_Ques_${newCheckpoint.id}`, sequence: checkpQuestionsIds } }));

          const newLessonPlans = lesson?.data?.updateLesson?.lessonPlan;
          const newData = [{
            type: 'checkpoint',
            LessonComponentID: newCheckpoint.id,
            id: newCheckpoint.id,
            sequence: !lessonPlans?.length ? 0 : lessonPlans.length,
            stage: 'checkpoint',
            label: checkPointData.label,
            title: checkPointData.title,
            subtitle: checkPointData.subtitle,
            language: checkPointData.language.value,
          }]
          updateLessonPlan(newLessonPlans, newData)
          gobackToPreviousStep();
        } else {
          setValidation({
            title: '',
            label: '',
            estTime: '',
            message: 'Unable to save Checkpoint details, Please try again later.',
            isError: true
          });
        }
        setLoading(false)

        // TODO: Redirect to previous step on success.
      } catch {
        setValidation({
          title: '',
          label: '',
          estTime: '',
          message: 'Unable to save Checkpoint details, Please try again later.',
          isError: true
        });
        setLoading(false)
      }
    }
  }

  // useEffect(() => {
  //   setQuestionsState([...checkpQuestions])
  // }, [checkpQuestions]);

  const { title, subtitle, language, label, instructionsTitle, purposeHtml, objectiveHtml, instructionHtml, estTime } = checkPointData;

  return (
    <Fragment>
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex items-center">
        <span className="w-6 h-6 flex items-center mr-4" onClick={() => console.log('')}>
          <IconContext.Provider value={{ size: '1.5rem', color: 'darkgrey' }}>
            <IoIosKeypad />
          </IconContext.Provider>
        </span>

        {/* Breadcrums */}
        <h4 className="text-base leading-6 font-medium text-gray-900 flex items-center">
          <span className="w-auto flex-shrink-0 cursor-pointer" onClick={() => changeStep('SelectedCheckPointsList')}>Assessment Builder</span>
          <span className="w-6 h-6 flex items-center mx-4">
            <IconContext.Provider value={{ size: '1.5rem', color: 'darkgrey' }}>
              <RiArrowRightLine />
            </IconContext.Provider>
          </span>
          <span className="font-normal text-gray-600 w-auto flex-shrink-0">Create New Checkpoint</span>

        </h4>
      </div>

      <div className="p-4">

        <div>
          <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
            <div>
              <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                Title <span className="text-red-500"> *</span>
              </label>
              <FormInput value={title} id='title' onChange={onInputChange} name='title' />
              {validation.title && <p className="text-red-600 text-sm">{validation.title}</p>}
            </div>
            <div>
              <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                Checkpoint Label <span className="text-red-500"> *</span>
              </label>
              <FormInput value={label} id='label' onChange={onInputChange} name='label' />
              {validation.label && <p className="text-red-600 text-sm">{validation.label}</p>}
            </div>
          </div>

          <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
            <div>
              <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                Subtitle
              </label>
              <FormInput value={subtitle} id='subtitle' onChange={onInputChange} name='subtitle' />
            </div>
            <div>
              <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                Select Language
              </label>
              <Selector selectedItem={language.name} placeholder="Language" list={languageList} onChange={selectLanguage} />
            </div>
          </div>

          <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
            <div>
              <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                Select Designers
            </label>
              <MultipleSelector selectedItems={selectedDesigners} placeholder="Designers" list={designersList} onChange={selectDesigner} />
            </div>
            <div>
              <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                Estimated Time (min) <span className="text-red-500"> *</span>
              </label>
              <FormInput value={estTime} id='estTime' onChange={onInputChange} name='estTime' />
              {validation.estTime && <p className="text-red-600 text-sm">{validation.estTime}</p>}
            </div>
          </div>

          {/* New accordion */}
          <div className="bg-white mx-auto border border-gray-200 rounded-xl mt-6">
            <ul className="rounded-xl">
              {accordionSteps.map((item: { id: string, header: string, textEditorName: string, textEditorValue: string, titleLabel?: string, titleValue?: string, title?: string, }, index) => (
                <Fragment key={item.id}>
                  <li className={`relative border-b border-gray-200 ${selectedBlock === item.id ? 'rounded-lg' : ''}`}>
                    <div className={`w-full px-8 py-6 text-left ${selectedBlock === item.id ? 'border border-indigo-400 rounded-lg' : ''}`}>
                      <div className="flex items-center justify-between" onClick={() => toggleView(item.id)}>
                        <span className={`text-xs md:text-base cursor-pointer text-left ${theme.textColor[themeColor]} ${selectedBlock === item.id ? 'font-bold' : 'font-medium'}`}>
                          {item.header}
                        </span>
                        <span className="w-8 h-8 flex items-center cursor-pointer">
                          <IconContext.Provider value={{ size: '2rem', color: theme.iconColor[themeColor] }}>
                            {(selectedBlock === item.id) ? <IoCaretUpCircleOutline /> : <IoCaretDownCircleOutline />}
                          </IconContext.Provider>
                        </span>
                      </div>
                    </div>

                    {(selectedBlock === item.id) && (
                      <div className="px-8 py-6 max-h-140 overflow-auto">
                        {item.id === '1' ? (<div className="w-8/10 mx-auto my-4">
                          <FormInput value={item.titleValue} id={item.title} onChange={onInputChange} name={item.title} label={item.titleLabel} />
                        </div>) : (
                            <label className="block text-m font-medium leading-5 text-gray-600 mb-3 w-8/10 mx-auto">
                              {item.titleLabel}
                            </label>
                          )}
                        <div className="w-8/10 mx-auto">
                          <RichTextEditor initialValue={item.textEditorValue} onChange={(htmlContent, plainText) => setEditorContent(htmlContent, plainText, item.textEditorName)} />
                        </div>
                      </div>
                    )}
                  </li>
                </Fragment>
              ))}
            </ul>
          </div>

        </div>

        {/* Question table */}
        <div className="p-6 border-gray-400 border my-4 border-dashed">
          <p className="text-m font-medium leading-5 text-gray-700 my-2 text-center">Checkpoint Questions: </p>
          {!checkpQuestions?.length ? (
            <div className="my-8">
              <p className="text-center p-8"> Please add questions to checkpoint builder</p>
              <div className="flex w-full mx-auto p-8 justify-center ">
                <Buttons btnClass="mr-4" onClick={() => changeStep('QuestionLookup')} label="Add Existing Questions" />
                <Buttons btnClass="ml-4" onClick={() => changeStep('AddNewQuestion')} label="Create New Question" />
              </div>
            </div>
          ) : (
              <Fragment>
                <div className="max-h-112 overflow-auto">
                  <div className="flex justify-between w-full px-8 py-4 mx-auto whitespace-no-wrap border-b border-gray-200">
                    <div className="w-.5/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      <span>No.</span>
                    </div>
                    <div className="w-5/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      <span>Question</span>
                    </div>
                    <div className="w-2/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      <span>Type</span>
                    </div>
                    <div className="w-1.5/10 px-8 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      <span>Is Required</span>
                    </div>
                    <div className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      <span>Options</span>
                    </div>
                  </div>

                  <div className="w-full m-auto">
                    {checkpQuestions.length > 0 ? (
                      //  Drag and drop listing
                      <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="droppable">
                          {(provided, snapshot) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                            >
                              { checkpQuestions.map((item, index) => (

                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                    >
                                      <Fragment key={item.id}>
                                        <div key={item.id} className={`flex justify-between w-full  px-8 py-4 whitespace-no-wrap border-b border-gray-200 ${questionOptions.quesId === item.id && 'bg-gray-200'}`}>
                                          <div className="flex w-.5/10 items-center px-8 py-3 text-left text-s leading-4"> {index + 1}.</div>
                                          <div className="flex w-5/10 px-8 py-3 items-center text-left text-s leading-4 font-medium whitespace-normal"> {item.question} </div>
                                          <div className="flex w-2/10 px-8 py-3 text-left text-s leading-4 items-center whitespace-normal">{item.type ? getTypeString(item.type) : '--'}</div>
                                          <div className="flex w-1.5/10 px-6 py-3 text-s leading-4 items-center justify-center">
                                            <span className="cursor-pointer">
                                              <CheckBox value={item.required ? true : false} onChange={() => makeQuestionRequired(item.id)} name='isRequired' />
                                            </span>
                                          </div>
                                          <div className="flex w-1/10 px-6 py-1 text-s leading-4 items-center justify-center">
                                            {(item.type === 'selectMany' || item.type === 'selectOne') && (<div className={`w-6 h-6 cursor-pointer ${theme.textColor[themeColor]}`} onClick={() => showOptions(item.id, item.options)}>
                                              <IconContext.Provider value={{ size: '1.5rem', color: theme.iconColor[themeColor] }}>
                                                <IoOptionsOutline />
                                              </IconContext.Provider>
                                            </div>)}
                                          </div>
                                        </div>
                                        {(questionOptions.quesId === item.id) && (<div className="px-16 py-4 flex flex-col text-gray-700 font-medium text-sm border-b border-gray-200">
                                          <p className="text-gray-900 px-2 py-2 text-base">Options:</p>
                                          {questionOptions.options?.map((item, index) => (
                                            <span className="px-12 py-2" key={item.label}>{index + 1}. {item.text}</span>
                                          ))}
                                        </div>)}
                                      </Fragment>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>

                    ) : (
                        <div className="py-12 my-6 text-center">
                          <p> This checkpoint does not have any questions</p>
                        </div>
                      )}
                  </div>
                </div>
                <div className="flex w-full mx-auto p-8 justify-center ">
                  <Buttons btnClass="mr-4" onClick={() => changeStep('QuestionLookup')} label="Add Existing Questions" />
                  <Buttons btnClass="ml-4" onClick={() => changeStep('AddNewQuestion')} label="Create New Question" />
                </div>
              </Fragment>
            )}
        </div>

        {/* Action buttons */}
        <div className="mt-8 px-6 pb-4">
          {validation.message && <div className="py-4 m-auto mt-2 text-center">
            <p className={`${validation.isError ? 'text-red-600' : 'text-green-600'}`}>{validation.message}</p>
          </div>}
          <div className="flex justify-center my-6">
            <Buttons btnClass="py-1 px-4 text-xs mr-2" label="Cancel" onClick={gobackToPreviousStep} transparent />
            <Buttons btnClass="py-1 px-8 text-xs ml-2" label={loading ? 'Saving...' : 'Save'} onClick={saveNewCheckPoint} disabled={loading ? true : false} />
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default AddNewCheckPoint
