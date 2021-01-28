import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import { IoArrowUndoCircleOutline } from 'react-icons/io5';
import API, { graphqlOperation } from '@aws-amplify/api'
import { v4 as uuidv4 } from 'uuid';

import * as customQueries from '../../../../customGraphql/customQueries';
import * as mutations from '../../../../graphql/mutations';

import Buttons from '../../../Atoms/Buttons';
import Selector from '../../../Atoms/Form/Selector';
import MultipleSelector from '../../../Atoms/Form/MultipleSelector';
import FormInput from '../../../Atoms/Form/FormInput';
import BreadCrums from '../../../Atoms/BreadCrums';
import SectionTitle from '../../../Atoms/SectionTitle';
import PageWrapper from '../../../Atoms/PageWrapper';

import { languageList } from '../../../../utilities/staticData'
import RichTextEditor from '../../../Atoms/RichTextEditor';

interface InitialData {
  name: string
  type: InputValue,
  purpose: string,
  purposeHtml: string,
  objective: string,
  objectiveHtml: string,
  languages: { id: string, name: string, value: string }[]
}
interface InputValue {
  id: string,
  name: string,
  value: string
}
const LessonBuilder = () => {
  const history = useHistory();

  const breadCrumsList = [
    { title: 'Home', url: '/dashboard', last: false },
    { title: 'Lesson Builder', url: '/dashborad/lesson-builder', last: false },
    { title: 'Add New Lesson ', url: '/dashborad/lesson-builder/lesson/add', last: true },
  ]
  const initialData = {
    name: '',
    type: { id: '', name: '', value: '' },
    purpose: '',
    purposeHtml: '<p></p>',
    objective: '',
    objectiveHtml: '<p></p>',
    languages: [{ id: '1', name: "English", value: 'EN' }]
  }
  const [formData, setFormData] = useState<InitialData>(initialData);
  const [designersList, setDesignersList] = useState([]);
  const [selectedDesigners, setSelectedDesigners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState({
    name: '',
    type: '',
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
    setValidation({
      ...validation,
      name: ''
    })
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
    setValidation({
      ...validation,
      type: ''
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
    if (!formData.type?.value.trim().length) {
      isValid = false;
      msgs.type = 'Lesson type is required';
    } else {
      msgs.type = ''
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
          purpose: formData.purpose,
          objectives: [formData.objective],
          language: formData.languages.map(item => item.value),
          designers: selectedDesigners.map(item => item.id),
          artistID: "0",
          doFirstID: "0",
          warmUpId: "0",
          coreLessonId: "0",
          activityId: "0",
          assessmentID: formData.type?.value === 'lesson' ? "0" : uuidv4(),
        }
        const results: any = await API.graphql(
          graphqlOperation(mutations.createLesson, { input: input })
        );
        const lessonsData = results?.data?.createLesson;
        // if (formData.type?.value !== 'lesson') {
        //   const assessmentInput = {
        //     id: lessonsData.assessmentID,
        //     title: formData.name,
        //     type: formData.type?.value,
        //   }
        //   const results: any = await API.graphql(
        //     graphqlOperation(mutations.createAssessment, { input: assessmentInput })
        //   );
        //   const assessmentData = results?.data?.createAssessment;
        // }
        setLoading(false);
        if (lessonsData) {
          setValidation({
            name: '',
            type: '',
            message: 'Lesson details saved successfully.',
            isError: false
          })
        }
        setFormData(initialData);
        setSelectedDesigners([])
      } catch{
        setValidation({
          name: '',
          type: '',
          message: 'Unable to save Lesson details, Please try again later.',
          isError: true
        });
        setLoading(false)
      }
    }
  }

  const setEditorContent = (html: string, text: string, fieldHtml: string, field: string) => {
    setFormData({
      ...formData,
      [fieldHtml]: html,
      [field]: text
    })
  }

  const fetchPersonsList = async () => {
    try {
      const result: any = await API.graphql(graphqlOperation(customQueries.listPersons, {
        filter: { or: [{ role: { eq: "TR" } }, { role: { eq: "BLD" } }] }
      }))
      const savedData = result.data.listPersons;
      const updatedList = savedData?.items.map((item: { id: string, firstName: string, lastName: string }) => ({
        id: item?.id,
        name: `${item?.firstName || ''} ${item.lastName || ''}`,
        value: `${item?.firstName || ''} ${item.lastName || ''}`
      }))
      setDesignersList(updatedList);
    } catch {
      setValidation({
        name: '',
        type: '',
        message: 'Error while fetching designers list, you can add them later.',
        isError: true
      });
    }
  }

  useEffect(() => {
    fetchPersonsList();
  }, [])

  const { name, type, languages, purpose, purposeHtml, objective, objectiveHtml } = formData;
  return (
    <div className="w-8/10 h-full">

      {/* Section Header */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle title="ADD NEW LESSONS" subtitle="Add lessons, surveys or assessments." />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons btnClass="mr-4" onClick={history.goBack} Icon={IoArrowUndoCircleOutline} />
        </div>
      </div>

      {/* Body */}
      <PageWrapper>

        <div className="w-7/10 m-auto">
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">LESSON INFORMATION</h3>
          <div className="">

            <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
              <div>
                <FormInput value={name} id='name' onChange={onInputChange} name='name' label="Name" isRequired />
                {validation.name && <p className="text-red-600 text-sm">{validation.name}</p>}
              </div>
              <div>
                <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                  Select Type
                </label>
                <Selector selectedItem={type.name} placeholder="Type" list={typeList} onChange={(val, name, id) => onSelectOption(val, name, id, 'type')} />
                {validation.type && <p className="text-red-600 text-sm">{validation.type}</p>}
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
                  Select Language
                    </label>
                <MultipleSelector selectedItems={languages} placeholder="Language" list={languageList} onChange={selectLanguage} />
              </div>
            </div>

            <div className="px-3 py-4">
              <label className="block text-m font-medium leading-5 text-gray-700 mb-3">
                Purpose
              </label>
              <RichTextEditor initialValue={purposeHtml} onChange={(htmlContent, plainText) => setEditorContent(htmlContent, plainText, 'purposeHtml', 'purpose')} />
            </div>

            <div className="px-3 py-4">
              <label className="block text-m font-medium leading-5 text-gray-700 mb-3">
                Objective
              </label>
              <RichTextEditor initialValue={objectiveHtml} onChange={(htmlContent, plainText) => setEditorContent(htmlContent, plainText, 'objectiveHtml', 'objective')} />
            </div>

          </div>
        </div>

        {validation.message && <div className="py-2 m-auto mt-2 text-center">
          <p className={`${validation.isError ? 'text-red-600' : 'text-green-600'}`}>{validation.message}</p>
        </div>}
        <div className="flex mb-8 mt-4 justify-center">
          <Buttons btnClass="py-3 px-10" label={loading ? 'Saving...' : 'Save'} onClick={saveFormData} disabled={loading ? true : false} />
        </div>

      </PageWrapper>
    </div>
  )
}

export default LessonBuilder
