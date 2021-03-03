import React, { useState, useEffect } from 'react';
import API, { graphqlOperation } from '@aws-amplify/api'
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaTrash } from 'react-icons/fa';

import { InitialData, InputValueObject } from '../LessonBuilder';

import * as customMutations from '../../../../../customGraphql/customMutations';
import * as customQueries from '../../../../../customGraphql/customQueries';

import Selector from '../../../../Atoms/Form/Selector';
import MultipleSelector from '../../../../Atoms/Form/MultipleSelector';
import FormInput from '../../../../Atoms/Form/FormInput';
import Buttons from '../../../../Atoms/Buttons';
import RichTextEditor from '../../../../Atoms/RichTextEditor';
import ModalPopUp from '../../../../Molecules/ModalPopUp';

interface GeneralInformationProps {
  formData: InitialData
  designersList: InputValueObject[],
  selectedDesigners: InputValueObject[],
  setFormData: (data: InitialData) => void
  setSelectedDesigners: (designer: InputValueObject[]) => void,
  lessonId: string
  allMeasurement: { id: number, name: string, value: string }[]
  lessonMeasurements: any[]
  setLessonMeasurements: (obj: any[]) => void
}
const GeneralInformation = (props: GeneralInformationProps) => {
  const {
    formData,
    designersList,
    selectedDesigners,
    setSelectedDesigners,
    setFormData,
    lessonId,
    allMeasurement,
    lessonMeasurements,
    setLessonMeasurements
  } = props;

  const [selectedMeasu, setSelectedMeasu] = useState({ id: '', name: '', value: '' });
  const [measurementList, setMeasurementList] = useState(allMeasurement);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState({
    id: '',
    state: false,
    message: 'Are you sure you want to remove this measurement?'
  });
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

  const selectMeasurement = (val: string, name: string, id: string) => {
    setSelectedMeasu({ id, name, value: val })
  }
  const toggleModal = (id?: string) => {
    setShowDeleteModal({
      ...showDeleteModal,
      id: (id ? id : ''),
      state: !showDeleteModal.state
    })
  }

  const deleteMeasurement = async () => {
    try {
      const input = {
        id: showDeleteModal.id,
      }
      const results: any = await API.graphql(
        graphqlOperation(customMutations.deleteLessonRubrics, { input: input })
      );
      const lessonRubric = results.data.deleteLessonRubrics;
      if (lessonRubric?.id) {
        const filteredRubrics = [...lessonMeasurements].filter(item => item.id !== lessonRubric?.id)
        setLessonMeasurements([...filteredRubrics]);
      }
      toggleModal();
    } catch {
      setValidation({
        name: '',
        type: '',
        message: 'Error while deleting measurement,please try later.',
        isError: true
      });
    }
  }

  const addNewMeasurement = async () => {
    try {
      const input = {
        lessonID: lessonId,
        rubricID: selectedMeasu.id,
      }
      const results: any = await API.graphql(
        graphqlOperation(customMutations.createLessonRubrics, { input: input })
      );
      const lessonRubric = results.data.createLessonRubrics;
      if (lessonRubric?.id) {
        setLessonMeasurements([
          ...lessonMeasurements,
          {
            id: lessonRubric.id,
            rubricID: lessonRubric.rubricID,
            measurement: selectedMeasu.name,
            topic: lessonRubric?.rubric?.topic?.name
          }
        ]);
        setSelectedMeasu({ id: '', name: '', value: '' });
      }
    } catch {
      setValidation({
        name: '',
        type: '',
        message: 'Error while adding measurement,please try later.',
        isError: true
      });
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

  const fetchRubricsList = async () => {
    try {
      const [results, topics]: any = await Promise.all([
        await API.graphql(graphqlOperation(customQueries.listLessonRubricss, {
          filter: {
            lessonID: { eq: lessonId }
          }
        })),
        await API.graphql(graphqlOperation(customQueries.listTopics)),
      ]);

      const topicsList = topics.data?.listTopics?.items
      const lessonRubrics = results.data?.listLessonRubricss?.items?.map((item: any) => {
        return {
          id: item.id,
          rubricID: item.rubricID,
          measurement: item?.rubric?.name,
          topic: topicsList.find((topic: any) => topic.id === item.rubric.topicID)?.name || ''
        }
      });
      setLessonMeasurements([...lessonRubrics]);
      console.log("aafter function", allMeasurement)
    } catch {
      setValidation({
        name: '',
        type: '',
        message: 'Unable to fetch measurement details, Please try again later.',
        isError: true
      });
    }
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
      } catch {
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
  useEffect(() => {
    if (formData?.type?.id === '1') {
      fetchRubricsList()
    }
  }, [])

  useEffect(() => {
    if (allMeasurement?.length > 0) {
      const measurementID = lessonMeasurements?.map(meas => meas.rubricID)
      const measurementList = allMeasurement.filter(item => !measurementID.includes(item.id));
      setMeasurementList(measurementList);
    }
  }, [lessonMeasurements, allMeasurement])
  const { name, type, languages, purposeHtml, objectiveHtml } = formData;

  return (
    <div className='bg-white shadow-5 overflow-hidden sm:rounded-lg mb-4'>

      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900"> Lesson Overview</h3>
      </div>

      <div className="p-4">

        <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
          <div>
            <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
              Name <span className="text-red-500"> * </span>
            </label>
            <FormInput value={name} id='name' onChange={onInputChange} name='name' />
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

        {/* Measurements block */}
        {type?.id === '1' && (< div className="p-6 border-gray-400 border my-4 border-dashed">
          <p className="text-m font-medium leading-5 text-gray-700 my-2 text-center">Lesson Measurements</p>

          <div className="my-12 w-6/10 m-auto flex items-center justify-center">
            <div className="mr-4">
              <Selector selectedItem={selectedMeasu.name} list={measurementList} placeholder="Select Measurement" onChange={selectMeasurement} />
            </div>
            <div className="ml-4 w-auto">
              <Buttons btnClass="ml-4 py-1" label="Add" onClick={addNewMeasurement} disabled={selectedMeasu.value ? false : true} />
            </div>
          </div>
          <div>
            {lessonMeasurements?.length > 0 ? (<div>
              {/* Table header */}
              <div className="flex justify-between w-full px-8 py-4 mx-auto whitespace-no-wrap border-b border-gray-200">
                <div className="w-.5/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>No.</span>
                </div>
                <div className="w-4.5/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>Measurement</span>
                </div>
                <div className="w-3/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>Topic</span>
                </div>
                <div className="w-2/10 px-8 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>Action</span>
                </div>
                {/** <div className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      <span>Action</span>
                    </div> */}
              </div>


              {/* Table column */}
              <div className="w-full m-auto max-h-88 overflow-auto">
                {lessonMeasurements.map((item: any, index: number) => (
                  <div key={item.id} className="flex justify-between w-full  px-8 py-4 whitespace-no-wrap border-b border-gray-200">
                    <div className="flex w-.5/10 items-center px-8 py-3 text-left text-s leading-4"> {index + 1}.</div>
                    <div className="flex w-4.5/10 px-8 py-3 items-center text-left text-s leading-4 font-medium whitespace-normal"> {item.measurement || '--'} </div>
                    <div className="flex w-3/10 px-8 py-3 text-left text-s leading-4 items-center whitespace-normal">{item.topic ? item.topic : '--'}</div>
                    {/* <div className="flex w-2/10 px-6 py-3 text-s leading-4 items-center justify-center">
                      <span className="cursor-pointer">
                            <CheckBox value={item.required ? true : false} onChange={() => makeQuestionRequired(item.id)} name='isRequired' />
                          </span>
                          Remove
                        </div> */}
                    <div className="flex w-2/10 px-8 py-3 text-s leading-4 items-center justify-center">
                      <div className="w-6 h-6 cursor-pointer" onClick={() => toggleModal(item.id)}>
                        <IconContext.Provider value={{ size: '1.5rem', color: '#B22222' }}>
                          <FaTrash />
                        </IconContext.Provider>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>) : (
                <div className="py-12 my-6 text-center">
                  <p className="text-gray-600 font-medium"> This lesson does not have any measurements, please add new one.</p>
                </div>
              )}
          </div>

        </div>)}

        {validation.message && <div className="py-4 m-auto mt-2 text-center">
          <p className={`${validation.isError ? 'text-red-600' : 'text-green-600'}`}>{validation.message}</p>
        </div>}
        {showDeleteModal.state &&
          <ModalPopUp deleteModal closeAction={toggleModal} saveAction={deleteMeasurement} message={showDeleteModal.message} />
        }
        <div className="flex mb-8 mt-4 justify-center">
          <Buttons btnClass="py-3 px-10" label={loading ? 'Saving...' : 'Save'} onClick={updateFormInformation} disabled={loading ? true : false} />
        </div>
      </div>

    </div>
  )
}

export default GeneralInformation
