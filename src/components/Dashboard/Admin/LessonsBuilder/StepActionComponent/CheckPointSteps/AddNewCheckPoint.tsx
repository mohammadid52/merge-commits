import React, { Fragment, useState } from 'react'
import API, { graphqlOperation } from '@aws-amplify/api'
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { IoIosKeypad } from 'react-icons/io';
import { RiArrowRightLine } from 'react-icons/ri';

import * as customMutations from '../../../../../../customGraphql/customMutations';

import MultipleSelector from '../../../../../Atoms/Form/MultipleSelector';
import Selector from '../../../../../Atoms/Form/Selector';
import FormInput from '../../../../../Atoms/Form/FormInput';
import Buttons from '../../../../../Atoms/Buttons';
import RichTextEditor from '../../../../../Atoms/RichTextEditor';
import { LessonPlansProps } from '../../LessonEdit';

interface AddNewCheckPointProps {
  changeStep: (step: string) => void
  updateLessonPlan: (plan: LessonPlansProps[]) => void
  designersList?: InputValueObject[]
  lessonID: string
  lessonPlans?: LessonPlansProps[] | null
}
export interface InitialData {
  title: string
  subtitle: string
  language: InputValueObject
  label: string,
  instructionsTitle: string,
  purposeHtml: string,
  objectiveHtml: string,
  instructionHtml: string,
}
interface InputValueObject {
  id: string,
  name: string,
  value: string
}

const AddNewCheckPoint = (props: AddNewCheckPointProps) => {
  const { changeStep, updateLessonPlan, designersList, lessonID, lessonPlans } = props;

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
  const [checkPointData, setCheckPointData] = useState<InitialData>(initialData);
  const [selectedDesigners, setSelectedDesigners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState({
    title: '',
    label: '',
    message: '',
    isError: true
  });

  const selectedQuestionsList: any = [];

  const languageList = [
    { id: 1, name: 'English', value: 'EN' },
    { id: 2, name: 'Spanish', value: 'ES' },
  ];

  const onInputChange = (e: any) => {
    setCheckPointData({
      ...checkPointData,
      [e.target.name]: e.target.value
    })
    if (validation.title || validation.label) {
      setValidation({
        ...validation,
        title: '',
        label: ''
      })
    }
  }

  const setEditorContent = (html: string, text: string, fieldHtml: string, field: string) => {
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
          designers: selectedDesigners.map(item => item.id),
          language: checkPointData.language.value,
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
          const newLessonPlans = lesson?.data?.updateLesson?.lessonPlan;
          updateLessonPlan(newLessonPlans)
        }
        setValidation({
          title: '',
          label: '',
          message: 'Checkpoint details has been saved.',
          isError: true
        });
        setLoading(false)
        
        // TODO: Redirect to previous step on success.
      } catch{
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
            <div>
              <FormInput value={instructionsTitle} id='instructionsTitle' onChange={onInputChange} name='instructionsTitle' label="Instructions Title" />
            </div>
          </div>

          <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
            <div>
              <label className="block text-m font-medium leading-5 text-gray-700 mb-3">
                Purpose
            </label>
              <RichTextEditor initialValue={purposeHtml} onChange={(htmlContent, plainText) => setEditorContent(htmlContent, plainText, 'purposeHtml', 'purpose')} />
            </div>
            <div>
              <label className="block text-m font-medium leading-5 text-gray-700 mb-3">
                Instructions
            </label>
              <RichTextEditor initialValue={instructionHtml} onChange={(htmlContent, plainText) => setEditorContent(htmlContent, plainText, 'instructionHtml', 'instruction')} />
            </div>
          </div>

          <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
            <div>
              <label className="block text-m font-medium leading-5 text-gray-700 mb-3">
                Objective
              </label>
              <RichTextEditor initialValue={objectiveHtml} onChange={(htmlContent, plainText) => setEditorContent(htmlContent, plainText, 'objectiveHtml', 'objective')} />
            </div>
          </div>
        </div>

        <div className="p-6 border-gray-400 border my-4 border-dashed">
          <p className="text-m font-medium leading-5 text-gray-700 mb-1">Checkpoint Questions: </p>
          {!selectedQuestionsList?.length ? (
            <div className="my-8">
              <p className="text-center p-8"> Please add questions to checkpoint builder</p>
              <div className="flex w-full mx-auto p-8 justify-center ">
                <Buttons btnClass="mr-4" onClick={() => changeStep('QuestionLookup')} label="Add Existing Questions" />
                <Buttons btnClass="ml-4" onClick={() => changeStep('AddNewQuestion')} label="Create New Question" />
              </div>
            </div>
          ) : (
              <p>Questions list</p>
            )}
        </div>
        <div className="flex mt-8 justify-center px-6 pb-4">
          {validation.message && <div className="py-4 m-auto mt-2 text-center">
            <p className={`${validation.isError ? 'text-red-600' : 'text-green-600'}`}>{validation.message}</p>
          </div>}
          <div className="flex justify-center my-6">
            <Buttons btnClass="py-1 px-4 text-xs mr-2" label="Cancel" onClick={() => changeStep('SelectedCheckPointsList')} transparent />
            <Buttons btnClass="py-1 px-8 text-xs ml-2" label={loading ? 'Saving...' : 'Save'} onClick={saveNewCheckPoint} disabled={loading ? true : false} />
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default AddNewCheckPoint
