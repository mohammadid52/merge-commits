import React, { useState } from 'react'
import API, { graphqlOperation } from '@aws-amplify/api'
// import { v4 as uuidv4 } from 'uuid';

import * as customMutations from '../../../../../customGraphql/customMutations';

import Selector from '../../../../Atoms/Form/Selector';
import MultipleSelector from '../../../../Atoms/Form/MultipleSelector';
import FormInput from '../../../../Atoms/Form/FormInput';
import RichTextEditor from '../../../../Atoms/RichTextEditor';
import Buttons from '../../../../Atoms/Buttons';

import { languageList } from '../../../../../utilities/staticData';
import { InitialData, InputValueObject } from '../LessonBuilder';

interface AddNewLessonFormProps {
  formData: InitialData
  designersList: InputValueObject[],
  selectedDesigners: InputValueObject[],
  changeLessonType: (type: string) => void
  setFormData: (data: InitialData) => void
  setSelectedDesigners: (designer: InputValueObject[]) => void,
  postLessonCreation: (lessonId: string) => void
}

const AddNewLessonForm = (props: AddNewLessonFormProps) => {
  const {
    formData,
    designersList,
    selectedDesigners,
    setSelectedDesigners,
    changeLessonType,
    setFormData,
    postLessonCreation
  } = props;

  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState({
    name: '',
    type: '',
    languages: '',
    message: '',
    isError: true
  });

  const typeList: any = [
    { id: '1', name: 'Lesson', value: 'lesson' },
    { id: '2', name: 'Assessment', value: 'assessment' },
    { id: '3', name: 'Survey', value: 'survey' }
  ];

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

  const onSelectOption = (val: string, name: string, id: string, field: string) => {
    setFormData({
      ...formData,
      [field]: {
        id: id,
        name: name,
        value: val
      }
    });
    if (validation.type || validation.languages) {
      setValidation({
        ...validation,
        type: '',
        languages: ''
      })
    }
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

  const setEditorContent = (html: string, text: string, fieldHtml: string, field: string) => {
    setFormData({
      ...formData,
      [fieldHtml]: html,
      [field]: text
    })
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
    if (!formData.type?.value.trim().length) {
      isValid = false;
      msgs.type = 'Lesson type is required';
    } else {
      msgs.type = ''
    }
    if (!formData.languages?.length) {
      isValid = false;
      msgs.languages = 'Language selection is required';
    } else {
      msgs.languages = ''
    }
    // TODO: Add validation for repeating lesson names.
    setValidation({ ...msgs });
    return isValid;
  }

  const saveFormData = async () => {
    const isValid = validateForm();
    if (isValid) {
      try {
        setLoading(true)
        const input = {
          title: formData.name,
          type: formData.type?.value,
          purpose: formData.purposeHtml,
          objectives: [formData.objectiveHtml],
          language: formData.languages.map(item => item.value),
          designers: selectedDesigners.map(item => item.id),
          artistID: "0",
          doFirstID: "0",
          warmUpId: "0",
          coreLessonId: "0",
          activityId: "0",
          assessmentID: "0",
          // assessmentID: formData.type?.value === 'lesson' ? "0" : uuidv4(),
        }
        const results: any = await API.graphql(
          graphqlOperation(customMutations.createLesson, { input: input })
        );
        const lessonsData = results?.data?.createLesson;
        setLoading(false);
        postLessonCreation(lessonsData?.id);
        if (lessonsData) {
          setValidation({
            name: '',
            type: '',
            languages: '',
            message: 'Lesson details saved successfully.',
            isError: false
          })
        }
      } catch{
        setValidation({
          name: '',
          type: '',
          languages: '',
          message: 'Unable to save Lesson details, Please try again later.',
          isError: true
        });
        setLoading(false)
      }
    }
  }

  const { name, type, languages, purpose, purposeHtml, objective, objectiveHtml } = formData;

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
              Select Type <span className="text-red-500"> * </span>
            </label>
            <Selector selectedItem={type.name} placeholder="Type" list={typeList} onChange={(val, name, id) => onSelectOption(val, name, id, 'type')} />
            {validation.type && <p className="text-red-600 text-sm">{validation.type}</p>}
          </div>
        </div>

        <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
          <div>
            <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
              Select Language <span className="text-red-500"> * </span>
            </label>
            <MultipleSelector selectedItems={languages} placeholder="Language" list={languageList} onChange={selectLanguage} />
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

        {validation.message && <div className="py-2 m-auto mt-2 text-center">
          <p className={`${validation.isError ? 'text-red-600' : 'text-green-600'}`}>{validation.message}</p>
        </div>}
        <div className="flex mb-8 mt-4 justify-center">
          <Buttons btnClass="py-3 px-10" label={loading ? 'Saving...' : 'Save'} onClick={saveFormData} disabled={loading ? true : false} />
        </div>

      </div>
    </div>
  )
}

export default AddNewLessonForm
