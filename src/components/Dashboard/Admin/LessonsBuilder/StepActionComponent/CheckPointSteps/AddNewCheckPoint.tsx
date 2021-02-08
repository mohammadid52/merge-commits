import React, { Fragment, useState } from 'react'
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { IoIosKeypad } from 'react-icons/io';
import { RiArrowRightLine } from 'react-icons/ri';

import MultipleSelector from '../../../../../Atoms/Form/MultipleSelector';
import Selector from '../../../../../Atoms/Form/Selector';
import FormInput from '../../../../../Atoms/Form/FormInput';
import Buttons from '../../../../../Atoms/Buttons';
import RichTextEditor from '../../../../../Atoms/RichTextEditor';

interface AddNewCheckPointProps {
  changeStep: (step: string) => void
}
export interface InitialData {
  title: string
  subtitle: string
  purposeHtml: string,
  objectiveHtml: string,
  instructionHtml: string,
  languages: InputValueObject[]
}
interface InputValueObject {
  id: string,
  name: string,
  value: string
}

const AddNewCheckPoint = (props: AddNewCheckPointProps) => {
  const { changeStep } = props;
  const designersList: any = [];

  const initialData = {
    title: '',
    subtitle: '',
    purposeHtml: '<p></p>',
    objectiveHtml: '<p></p>',
    instructionHtml: '<p></p>',
    languages: [{ id: '1', name: "English", value: 'EN' }]
  }
  const [checkPointData, setCheckPointData] = useState<InitialData>(initialData);
  const [selectedDesigners, setSelectedDesigners] = useState([]);

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

  }
  const setEditorContent = (html: string, text: string, fieldHtml: string, field: string) => {
    setCheckPointData({
      ...checkPointData,
      [fieldHtml]: html,
      [field]: text
    })
  }
  const selectLanguage = (id: string, name: string, value: string) => {
    let updatedList;
    const currentLanguages = checkPointData.languages;
    const selectedItem = currentLanguages.find(item => item.id === id);
    if (!selectedItem) {
      updatedList = [...currentLanguages, { id, name, value }];
    } else {
      updatedList = currentLanguages.filter(item => item.id !== id);
    }
    setCheckPointData({
      ...checkPointData,
      languages: updatedList
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

  const { title, subtitle, languages, purposeHtml, objectiveHtml, instructionHtml } = checkPointData;

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
            </div>
            <div>
              <FormInput value={subtitle} id='subtitle' onChange={onInputChange} name='subtitle' label="Subtitle" />
            </div>
          </div>

          <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
            <div>
              <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                Select Language
            </label>
              <Selector selectedItem={""} placeholder="Language" list={languageList} onChange={selectLanguage} />
            </div>
            <div>
              <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                Select Designers
            </label>
              <MultipleSelector selectedItems={selectedDesigners} placeholder="Designers" list={designersList} onChange={selectDesigner} />
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
                Objective
            </label>
              <RichTextEditor initialValue={objectiveHtml} onChange={(htmlContent, plainText) => setEditorContent(htmlContent, plainText, 'objectiveHtml', 'objective')} />
            </div>
          </div>

          <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
            <div>
              <label className="block text-m font-medium leading-5 text-gray-700 mb-3">
                Instructions
            </label>
              <RichTextEditor initialValue={instructionHtml} onChange={(htmlContent, plainText) => setEditorContent(htmlContent, plainText, 'instructionHtml', 'instruction')} />
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
          <div className="flex justify-center my-6">
            <Buttons btnClass="py-1 px-4 text-xs mr-2" label="Cancel" onClick={() => changeStep('SelectedCheckPointsList')} transparent />
            <Buttons btnClass="py-1 px-8 text-xs ml-2" label="Save" onClick={() => console.log('')} />
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default AddNewCheckPoint
