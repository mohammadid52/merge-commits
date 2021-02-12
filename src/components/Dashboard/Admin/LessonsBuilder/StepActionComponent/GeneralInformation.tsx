import React, { useState } from 'react';
import API, { graphqlOperation } from '@aws-amplify/api'

import { InitialData, InputValueObject } from '../LessonBuilder';
import { languageList } from '../../../../../utilities/staticData'

import * as customMutations from '../../../../../customGraphql/customMutations';

import MultipleSelector from '../../../../Atoms/Form/MultipleSelector';
import FormInput from '../../../../Atoms/Form/FormInput';
import Buttons from '../../../../Atoms/Buttons';
import RichTextEditor from '../../../../Atoms/RichTextEditor';

interface GeneralInformationProps {
  formData: InitialData
  designersList: InputValueObject[],
  selectedDesigners: InputValueObject[],
  setFormData: (data: InitialData) => void
  setSelectedDesigners: (designer: InputValueObject[]) => void,
  lessonId: string
}
const GeneralInformation = (props: GeneralInformationProps) => {
  const {
    formData,
    designersList,
    selectedDesigners,
    setSelectedDesigners,
    setFormData,
    lessonId
  } = props;

  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState({
    name: '',
    type: '',
    message: '',
    isError: true
  });

  const onInputChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    if (validation.name) {
      setValidation({
        ...validation,
        name: ''
      })
    }
  }
  const setEditorContent = (html: string, text: string, fieldHtml: string, field: string) => {
    setFormData({
      ...formData,
      [fieldHtml]: html,
      [field]: text
    })
  }
  const selectLanguage = (id: string, name: string, value: string) => {
    let updatedList;
    const currentLanguages = formData.languages;
    const selectedItem = currentLanguages.find(item => item.id === id);
    if (!selectedItem) {
      updatedList = [...currentLanguages, { id, name, value }];
    } else {
      updatedList = currentLanguages.filter(item => item.id !== id);
    }
    setFormData({
      ...formData,
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

  const validateForm = () => {
    let isValid = true
    const msgs = validation;
    if (!formData.name?.trim().length) {
      isValid = false;
      msgs.name = 'Lessson name is required';
    } else {
      msgs.name = ''
    }
    // TODO: Add validation for repeating lesson names.
    setValidation({ ...msgs });
    return isValid;
  }

  const updateFormInformation = async () => {
    const isValid = validateForm();
    if (isValid) {
      try {
        setLoading(true)
        const input = {
          id: lessonId,
          title: formData.name,
          purpose: formData.purposeHtml,
          objectives: [formData.objectiveHtml],
          designers: selectedDesigners.map(item => item.id),
        }
        const results: any = await API.graphql(
          graphqlOperation(customMutations.updateLesson, { input: input })
        );
        const lessonsData = results?.data?.updateLesson;
        if (lessonsData.type !== 'lesson') {
          const assessmentInput = {
            id: lessonsData.assessmentID,
            title: formData.name,
            type: formData.type?.value,
          }
          const results: any = await API.graphql(
            graphqlOperation(customMutations.updateAssessment, { input: assessmentInput })
          );
          const assessmentData = results?.data?.updateAssessment;
        }
        setLoading(false);
        if (lessonsData) {
          setValidation({
            name: '',
            type: '',
            message: 'Lesson details updated successfully.',
            isError: false
          })
        }
      } catch{
        setValidation({
          name: '',
          type: '',
          message: 'Unable to update Lesson details, Please try again later.',
          isError: true
        });
        setLoading(false)
      }
    }
  }

  const { name, type, languages, purposeHtml, objectiveHtml } = formData;

  return (
    <div className='bg-white shadow-5 overflow-hidden sm:rounded-lg mb-4'>

      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900"> General Information </h3>
      </div>

      <div className="p-4">

        <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
          <div>
            <FormInput value={name} id='name' onChange={onInputChange} name='name' label="Name" isRequired />
            {validation.name && <p className="text-red-600 text-sm">{validation.name}</p>}
          </div>
          <div>
            <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
              Select Designers
            </label>
            <MultipleSelector selectedItems={selectedDesigners} placeholder="Designers" list={designersList} onChange={selectDesigner} />
          </div>
        </div>

        {/* 
        <div className="px-3 py-4 grid gap-x-6 grid-cols-2">

          <div>
            <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
              Select Language
            </label>
            <MultipleSelector selectedItems={languages} placeholder="Language" list={languageList} onChange={selectLanguage} />
          </div>
        </div> */}

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

        {validation.message && <div className="py-4 m-auto mt-2 text-center">
          <p className={`${validation.isError ? 'text-red-600' : 'text-green-600'}`}>{validation.message}</p>
        </div>}
        <div className="flex mb-8 mt-4 justify-center">
          <Buttons btnClass="py-3 px-10" label={loading ? 'Saving...' : 'Save'} onClick={updateFormInformation} disabled={loading ? true : false} />
        </div>
      </div>

    </div>
  )
}

export default GeneralInformation
