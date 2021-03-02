import React, { useState, useEffect } from 'react'
import API, { graphqlOperation } from '@aws-amplify/api'
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaTrash } from 'react-icons/fa';
// import { v4 as uuidv4 } from 'uuid';

import * as customMutations from '../../../../../customGraphql/customMutations';

import Selector from '../../../../Atoms/Form/Selector';
import MultipleSelector from '../../../../Atoms/Form/MultipleSelector';
import FormInput from '../../../../Atoms/Form/FormInput';
import RichTextEditor from '../../../../Atoms/RichTextEditor';
import Buttons from '../../../../Atoms/Buttons';
import ModalPopUp from '../../../../Molecules/ModalPopUp';

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
  allMeasurement: { id: number, name: string, value: string, topic?: string }[]
  lessonMeasurements: any[]
  setLessonMeasurements: (obj: any[]) => void
  lessonId: string
}

const AddNewLessonForm = (props: AddNewLessonFormProps) => {
  const {
    formData,
    designersList,
    selectedDesigners,
    setSelectedDesigners,
    changeLessonType,
    setFormData,
    postLessonCreation,
    allMeasurement,
    lessonMeasurements,
    setLessonMeasurements,
    lessonId
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
    languages: '',
    message: '',
    isError: true
  });

  const typeList: any = [
    { id: '1', name: 'Lecture', value: 'lesson' },
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
  const selectMeasurement = (val: string, name: string, id: string) => {
    setSelectedMeasu({ id, name, value: val })
  }

  const addNewMeasurement = () => {
    setLessonMeasurements([
      ...lessonMeasurements,
      {
        id: selectedMeasu.id,
        measurement: selectedMeasu.name,
        topic: allMeasurement.find(item => item.id.toString() === selectedMeasu.id)?.topic || ''
      }
    ]);
    setSelectedMeasu({ id: '', name: '', value: '' });
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
  const toggleModal = (id?: string) => {
    setShowDeleteModal({
      ...showDeleteModal,
      id: (id ? id : ''),
      state: !showDeleteModal.state
    })
  }

  const deleteMeasurement = async () => {
    if (showDeleteModal?.id) {
      const filteredRubrics = [...lessonMeasurements].filter(item => item.id !== showDeleteModal?.id)
      setLessonMeasurements([...filteredRubrics]);
    }
    toggleModal();
  }
  const saveMeasurements = async (lessonId: string, rubricsId: string) => {
    try {
      const input = {
        lessonID: lessonId,
        rubricID: rubricsId,
      }
      const results: any = await API.graphql(
        graphqlOperation(customMutations.createLessonRubrics, { input: input })
      );
      const lessonRubric = results.data.createLessonRubrics;

    } catch {
      setValidation({
        name: '',
        type: '',
        languages: '',
        message: 'Error while adding measurement,please try later.',
        isError: true
      });
    }
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
        if (lessonsData?.id) {

          let rubrics = Promise.all(
            lessonMeasurements.map(async (item: any) => saveMeasurements(lessonsData?.id, item.id))
          )
          setLoading(false);
          postLessonCreation(lessonsData?.id);
          setValidation({
            name: '',
            type: '',
            languages: '',
            message: 'Lesson details saved successfully.',
            isError: false
          })
        }
      } catch {
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

  useEffect(() => {
    if (allMeasurement?.length > 0) {
      const measurementID = lessonMeasurements?.map(meas => meas.id)
      const measurementList = allMeasurement.filter(item => !measurementID.includes(item.id));
      setMeasurementList(measurementList);
    }
  }, [lessonMeasurements, allMeasurement])

  const { name, type, languages, purpose, purposeHtml, objective, objectiveHtml } = formData;

  return (
    <div className='bg-white shadow-5 overflow-hidden sm:rounded-lg mb-4'>

      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Lesson Overview </h3>
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

        {formData.type?.id === '1' && (< div className="p-6 border-gray-400 border my-4 border-dashed">
          <p className="text-m font-medium leading-5 text-gray-700 my-2 text-center">Lesson Measurements</p>

          <div className="my-12 w-6/10 m-auto flex items-center justify-center">
            <div className="mr-4">
              <Selector selectedItem={selectedMeasu.name} list={measurementList} placeholder="Select Lesson" onChange={selectMeasurement} />
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
                    <div className="flex w-4.5/10 px-8 py-3 items-center text-left text-s leading-4 font-medium whitespace-normal"> {item.measurement} </div>
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

        {validation.message && <div className="py-2 m-auto mt-2 text-center">
          <p className={`${validation.isError ? 'text-red-600' : 'text-green-600'}`}>{validation.message}</p>
        </div>}
        {showDeleteModal.state &&
          <ModalPopUp deleteModal closeAction={toggleModal} saveAction={deleteMeasurement} message={showDeleteModal.message} />
        }
        <div className="flex mb-8 mt-4 justify-center">
          <Buttons btnClass="py-3 px-10" label={loading ? 'Saving...' : 'Save'} onClick={saveFormData} disabled={(loading || lessonId) ? true : false} />
        </div>
      </div>

    </div >
  )
}

export default AddNewLessonForm
