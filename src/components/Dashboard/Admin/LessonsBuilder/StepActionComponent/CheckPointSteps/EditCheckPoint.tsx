import React, { Fragment, useState } from 'react'
import API, { graphqlOperation } from '@aws-amplify/api'
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { IoIosKeypad } from 'react-icons/io';
import { RiArrowRightLine } from 'react-icons/ri';
import { IoCaretDownCircleOutline, IoCaretUpCircleOutline } from 'react-icons/io5';
import { FaEdit } from 'react-icons/fa';
import CheckBox from '../../../../../Atoms/Form/CheckBox';

import * as customMutations from '../../../../../../customGraphql/customMutations';

import MultipleSelector from '../../../../../Atoms/Form/MultipleSelector';
import Selector from '../../../../../Atoms/Form/Selector';
import FormInput from '../../../../../Atoms/Form/FormInput';
import Buttons from '../../../../../Atoms/Buttons';
import RichTextEditor from '../../../../../Atoms/RichTextEditor';
import { AddNewCheckPointProps } from './AddNewCheckPoint';

interface EditCheckPointProps {
  changeStep: (step: string) => void

}
const EditCheckPoint = (props: AddNewCheckPointProps) => {
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
    setCheckpQuestions,
    previouslySelectedId
  } = props;

  const initialData = {
    title: '',
    subtitle: '',
    label: '',
    instructionsTitle: '',
    purposeHtml: '<p></p>',
    objectiveHtml: '<p></p>',
    instructionHtml: '<p></p>',
    language: { id: '1', name: "English", value: 'EN' }
  }
  const [selectedBlock, setSelectedBlock] = useState('');
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState({
    title: '',
    label: '',
    message: '',
    isError: true
  });
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
      titleLabel: 'Instructions title',
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

  }
  const setEditorContent = (html: string, text: string, fieldHtml: string) => {
    setCheckPointData({
      ...checkPointData,
      [fieldHtml]: html,
      // [field]: text
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
        message: 'Unable to save Checkpoint details, Please try again later.',
        isError: true
      });
    }
  }

  // Removed question from checkpoint
  const removeCheckpointQuestion = async (quesId: string) => {
    const deletedQuestions: any = [...checkPointData?.checkpQuestions]
    const deletedQuesID = deletedQuestions.find((item: any) => item.questionID === quesId)?.id;
    try {
      const input = {
        id: deletedQuesID
      };
      const result: any = await API.graphql(graphqlOperation(customMutations.deleteCheckpointQuestions, { input: input }));
    } catch {
      setValidation({
        title: '',
        label: '',
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
    setValidation({ ...msgs });
    return isValid;
  }

  const updateCheckPointDetails = async () => {
    const isValid = validateForm();
    if (isValid) {
      try {
        setLoading(true)
        const input = {
          id: checkPointData.id,
          label: checkPointData.label,
          title: checkPointData.title,
          subtitle: checkPointData.subtitle,
          instructionsTitle: checkPointData.instructionsTitle,
          instructions: checkPointData.instructionHtml,
          purpose: checkPointData.purposeHtml,
          objectives: checkPointData.objectiveHtml,
          designers: selectedDesigners.map((item: any) => item.id),
          language: checkPointData.language.value,
        }
        const results: any = await API.graphql(
          graphqlOperation(customMutations.updateCheckpoint, { input: input })
        );
        const newCheckpoint = results?.data?.updateCheckpoint;
        const newQuestions: any = checkpQuestions.filter(que => !previouslySelectedId.includes(que.id));
        const deletedQuestions: any = previouslySelectedId.filter(queId => {
          let newArrayOfId = checkpQuestions.map((que: any) => que.id);
          return !newArrayOfId.includes(queId)
        });
        if (newCheckpoint) {
          if (newQuestions.length > 0) {
            let newAddedQuestions = Promise.all(
              newQuestions.map(async (item: any) => addCheckpointQuestions(item.id, newCheckpoint.id, item.required))
            )
          }
          if (deletedQuestions.length > 0) {
            let removedQuestions = Promise.all(
              deletedQuestions.map(async (quesId: any) => removeCheckpointQuestion(quesId))
            )
          }
          gobackToPreviousStep();
        } else {
          setValidation({
            title: '',
            label: '',
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

  const { title, subtitle, language, label, instructionsTitle, purposeHtml, objectiveHtml, instructionHtml } = checkPointData;

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
          <span className="font-normal text-gray-600 w-auto flex-shrink-0">Add New Checkpoint</span>

        </h4>
      </div>

      <div className="p-4">

        <div>
          <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
            <div>
              <FormInput value={title} id='title' onChange={onInputChange} name='title' label="Title" isRequired />
              {validation.title && <p className="text-red-600 text-sm">{validation.title}</p>}
            </div>
            <div>
              <FormInput value={label} id='label' onChange={onInputChange} name='label' label="Checkpoint Label" isRequired />
              {validation.label && <p className="text-red-600 text-sm">{validation.label}</p>}
            </div>
          </div>

          <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
            <div>
              <FormInput value={subtitle} id='subtitle' onChange={onInputChange} name='subtitle' label="Subtitle" />
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
            {/* <div>
              <FormInput value={instructionsTitle} id='instructionsTitle' onChange={onInputChange} name='instructionsTitle' label="Instructions Title" />
            </div> */}
          </div>

          {/* New accordion */}
          <div className="bg-white mx-auto border border-gray-200 rounded-xl mt-6">
            <ul className="rounded-xl">
              {accordionSteps.map((item: { id: string, header: string, textEditorName: string, textEditorValue: string, titleLabel?: string, titleValue?: string, title?: string, }, index) => (
                <Fragment key={item.id}>
                  <li className={`relative border-b border-gray-200 ${selectedBlock === item.id ? 'rounded-lg' : ''}`}>
                    <div className={`w-full px-8 py-6 text-left ${selectedBlock === item.id ? 'border border-indigo-400 rounded-lg' : ''}`}>
                      <div className="flex items-center justify-between" onClick={() => toggleView(item.id)}>
                        <span className={`text-xs md:text-base font-medium cursor-pointer text-left text-indigo-500 ${selectedBlock === item.id && 'text-indigo-600'}`}>
                          {item.header}
                        </span>
                        <span className="w-8 h-8 flex items-center cursor-pointer">
                          <IconContext.Provider value={{ size: '2rem', color: '#667eea' }}>
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
                <div>
                  <div className="flex justify-between w-full px-8 py-4 mx-auto whitespace-no-wrap border-b border-gray-200">
                    <div className="w-.5/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      <span>No.</span>
                    </div>
                    <div className="w-5/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      <span>Question</span>
                    </div>
                    <div className="w-1.5/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      <span>Type</span>
                    </div>
                    <div className="w-2/10 px-8 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      <span>Is Required</span>
                    </div>
                    <div className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      <span>Action</span>
                    </div>
                  </div>

                  <div className="w-full m-auto">
                    {checkpQuestions.length > 0 ? checkpQuestions.map((item, index) => (
                      <div key={item.id} className="flex justify-between w-full  px-8 py-4 whitespace-no-wrap border-b border-gray-200">
                        <div className="flex w-.5/10 items-center px-8 py-3 text-left text-s leading-4"> {index + 1}.</div>
                        <div className="flex w-5/10 px-8 py-3 items-center text-left text-s leading-4 font-medium whitespace-normal"> {item.question} </div>
                        <div className="flex w-1.5/10 px-8 py-3 text-left text-s leading-4 items-center justify-center whitespace-normal">{item.type}</div>
                        <div className="flex w-2/10 px-6 py-3 text-s leading-4 items-center justify-center">
                          <span className="cursor-pointer">
                            <CheckBox value={item.required ? true : false} onChange={() => makeQuestionRequired(item.id)} name='isRequired' />
                          </span>
                        </div>
                        <div className="flex w-1/10 px-6 py-1 text-s leading-4 items-center justify-center">
                          <div className="w-6 h-6 cursor-pointer text-indigo-600" onClick={() => console.log(item.id)}>
                            <IconContext.Provider value={{ size: '1.5rem', color: '#667eea' }}>
                              <FaEdit />
                            </IconContext.Provider>
                          </div>
                        </div>
                      </div>
                    )) : (
                        <div className="py-12 my-6 text-center">
                          <p> This checkpoint does not have any questions</p>
                        </div>
                      )}
                  </div>
                </div>
                <div className="flex w-full mx-auto p-8 justify-center ">
                  <Buttons btnClass="mr-4" onClick={() => changeStep('QuestionLookup')} label="Edit Existing Questions" />
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
            <Buttons btnClass="py-1 px-8 text-xs ml-2" label={loading ? 'Saving...' : 'Save'} onClick={updateCheckPointDetails} disabled={loading ? true : false} />
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default EditCheckPoint
