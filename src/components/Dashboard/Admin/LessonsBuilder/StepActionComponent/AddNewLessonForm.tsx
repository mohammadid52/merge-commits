import React, {useState, useEffect, useContext} from 'react';
import API, {graphqlOperation} from '@aws-amplify/api';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {FaTrash} from 'react-icons/fa';
// import { v4 as uuidv4 } from 'uuid';

import * as customMutations from '../../../../../customGraphql/customMutations';

import Selector from '../../../../Atoms/Form/Selector';
import MultipleSelector from '../../../../Atoms/Form/MultipleSelector';
import FormInput from '../../../../Atoms/Form/FormInput';
import RichTextEditor from '../../../../Atoms/RichTextEditor';
import Buttons from '../../../../Atoms/Buttons';
import ModalPopUp from '../../../../Molecules/ModalPopUp';

import {languageList} from '../../../../../utilities/staticData';
import {InitialData, InputValueObject} from '../LessonBuilder';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../customHooks/dictionary';

interface AddNewLessonFormProps {
  formData: InitialData;
  designersList: InputValueObject[];
  selectedDesigners: InputValueObject[];
  changeLessonType: (type: string) => void;
  setFormData: (data: InitialData) => void;
  setSelectedDesigners: (designer: InputValueObject[]) => void;
  postLessonCreation: (lessonId: string) => void;
  allMeasurement: {id: number; name: string; value: string; topic?: string}[];
  lessonMeasurements: any[];
  setLessonMeasurements: (obj: any[]) => void;
  lessonId: string;
  institutionList: any[];
  setUnsavedChanges: Function;
}

const AddNewLessonForm = (props: AddNewLessonFormProps) => {
  const {
    formData,
    designersList,
    selectedDesigners,
    setSelectedDesigners,
    changeLessonType,
    setUnsavedChanges,
    setFormData,
    postLessonCreation,
    allMeasurement,
    lessonMeasurements,
    setLessonMeasurements,
    lessonId,
    institutionList,
  } = props;

  const [selectedMeasu, setSelectedMeasu] = useState({id: '', name: '', value: ''});
  const [measurementList, setMeasurementList] = useState(allMeasurement);
  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {AddNewLessonFormDict, BreadcrumsTitles} = useDictionary(clientKey);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState({
    id: '',
    state: false,
    message: AddNewLessonFormDict[userLanguage]['MESSAGES']['REMOVE'],
  });
  const [validation, setValidation] = useState({
    name: '',
    type: '',
    languages: '',
    message: '',
    institution: '',
    isError: true,
  });

  const typeList: any = [
    {id: '1', name: 'Lecture', value: 'lesson'},
    {id: '2', name: 'Assessment', value: 'assessment'},
    {id: '3', name: 'Survey', value: 'survey'},
  ];

  const onInputChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setUnsavedChanges(true);
    if (validation.name) {
      setValidation({
        ...validation,
        name: '',
      });
    }
  };

  const onSelectOption = (val: string, name: string, id: string, field: string) => {
    setFormData({
      ...formData,
      [field]: {
        id: id,
        name: name,
        value: val,
      },
    });
    setUnsavedChanges(true);
    if (validation.type || validation.languages) {
      setValidation({
        ...validation,
        type: '',
        languages: '',
        institution: '',
      });
    }
  };
  const selectMeasurement = (val: string, name: string, id: string) => {
    setSelectedMeasu({id, name, value: val});
  };

  const addNewMeasurement = () => {
    setLessonMeasurements([
      ...lessonMeasurements,
      {
        id: selectedMeasu.id,
        measurement: selectedMeasu.name,
        topic:
          allMeasurement.find((item) => item.id.toString() === selectedMeasu.id)?.topic ||
          '',
      },
    ]);
    setSelectedMeasu({id: '', name: '', value: ''});
  };

  const selectLanguage = (id: string, name: string, value: string) => {
    let updatedList;
    const currentLanguages = formData.languages;
    const selectedItem = currentLanguages.find((item) => item.id === id);
    if (!selectedItem) {
      updatedList = [...currentLanguages, {id, name, value}];
    } else {
      updatedList = currentLanguages.filter((item) => item.id !== id);
    }
    setFormData({
      ...formData,
      languages: updatedList,
    });
    setUnsavedChanges(true);
  };

  const selectDesigner = (id: string, name: string, value: string) => {
    let updatedList;
    const currentDesigners = selectedDesigners;
    const selectedItem = currentDesigners.find((item) => item.id === id);
    if (!selectedItem) {
      updatedList = [...currentDesigners, {id, name, value}];
    } else {
      updatedList = currentDesigners.filter((item) => item.id !== id);
    }
    setSelectedDesigners(updatedList);
  };

  const setEditorContent = (
    html: string,
    text: string,
    fieldHtml: string,
    field: string
  ) => {
    setFormData({
      ...formData,
      [fieldHtml]: html,
      [field]: text,
    });
    setUnsavedChanges(true);
  };
  const toggleModal = (id?: string) => {
    setShowDeleteModal({
      ...showDeleteModal,
      id: id ? id : '',
      state: !showDeleteModal.state,
    });
  };

  const deleteMeasurement = async () => {
    if (showDeleteModal?.id) {
      const filteredRubrics = [...lessonMeasurements].filter(
        (item) => item.id !== showDeleteModal?.id
      );
      setLessonMeasurements([...filteredRubrics]);
    }
    toggleModal();
  };
  const saveMeasurements = async (lessonId: string, rubricsId: string) => {
    try {
      const input = {
        lessonID: lessonId,
        rubricID: rubricsId,
      };
      const results: any = await API.graphql(
        graphqlOperation(customMutations.createLessonRubrics, {input: input})
      );
      const lessonRubric = results.data.createLessonRubrics;
    } catch {
      setValidation({
        name: '',
        type: '',
        languages: '',
        institution: '',
        message: AddNewLessonFormDict[userLanguage]['ADDERR'],
        isError: true,
      });
    }
    setUnsavedChanges(false);
  };

  const validateForm = () => {
    let isValid = true;
    const msgs = validation;
    if (!formData.name?.trim().length) {
      isValid = false;
      msgs.name = AddNewLessonFormDict[userLanguage]['VALIDATION']['NAME'];
    } else {
      msgs.name = '';
    }
    if (!formData.type?.value.trim().length) {
      isValid = false;
      msgs.type = AddNewLessonFormDict[userLanguage]['VALIDATION']['TYPE'];
    } else {
      msgs.type = '';
    }
    if (!formData.institution?.value.trim().length) {
      isValid = false;
      msgs.institution = AddNewLessonFormDict[userLanguage]['VALIDATION']['INSTITUTE'];
    } else {
      msgs.institution = '';
    }
    if (!formData.languages?.length) {
      isValid = false;
      msgs.languages = AddNewLessonFormDict[userLanguage]['VALIDATION']['LANGUAGE'];
    } else {
      msgs.languages = '';
    }
    // TODO: Add validation for repeating lesson names.
    setValidation({...msgs});
    return isValid;
  };

  const saveFormData = async () => {
    if (!lessonId) {
      const isValid = validateForm();
      if (isValid) {
        try {
          setLoading(true);
          const input = {
            title: formData.name,
            type: formData.type?.value,
            purpose: formData.purposeHtml,
            objectives: [formData.objectiveHtml],
            language: formData.languages.map((item) => item.value),
            designers: selectedDesigners.map((item) => item.id),
            institutionID: formData.institution?.id,
            artistID: '0',
            doFirstID: '0',
            warmUpId: '0',
            coreLessonId: '0',
            activityId: '0',
            assessmentID: '0',
            // assessmentID: formData.type?.value === 'lesson' ? "0" : uuidv4(),
          };

          const results: any = await API.graphql(
            graphqlOperation(customMutations.createLesson, {input: input})
          );
          const lessonsData = results?.data?.createLesson;

          if (lessonsData?.id) {
            let rubrics = Promise.all(
              lessonMeasurements.map(async (item: any) =>
                saveMeasurements(lessonsData?.id, item.id)
              )
            );
            setLoading(false);
            postLessonCreation(lessonsData?.id);
            setUnsavedChanges(false);

            setValidation({
              name: '',
              type: '',
              institution: '',
              languages: '',
              message: AddNewLessonFormDict[userLanguage]['MESSAGES']['SAVE'],
              isError: false,
            });
          }
        } catch {
          setValidation({
            name: '',
            type: '',
            institution: '',
            languages: '',
            message: AddNewLessonFormDict[userLanguage]['MESSAGES']['SAVEERR'],
            isError: true,
          });
          setLoading(false);
        }
      }
    } else {
      const isValid = validateForm();
      if (isValid) {
        try {
          setLoading(true);
          const input = {
            id: lessonId,
            title: formData.name,
            purpose: formData.purposeHtml,
            objectives: [formData.objectiveHtml],
            designers: selectedDesigners.map((item) => item.id),
            language: formData.languages.map((item) => item.value),
          };
          const results: any = await API.graphql(
            graphqlOperation(customMutations.updateLesson, {input: input})
          );
          const lessonsData = results?.data?.updateLesson;

          setLoading(false);
          setUnsavedChanges(false);

          if (lessonsData) {
            postLessonCreation(lessonsData?.id);
            setValidation({
              name: '',
              type: '',
              message: AddNewLessonFormDict[userLanguage]['MESSAGES']['SAVE'],
              isError: false,
              institution: '',
              languages: '',
            });
          }
        } catch {
          setValidation({
            name: '',
            type: '',
            message: AddNewLessonFormDict[userLanguage]['MESSAGES']['SAVEERR'],
            isError: true,
            institution: '',
            languages: '',
          });
          setLoading(false);
        }
      }
    }
  };

  useEffect(() => {
    if (allMeasurement?.length > 0) {
      const measurementID = lessonMeasurements?.map((meas) => meas.id);
      const measurementList = allMeasurement.filter(
        (item) => !measurementID.includes(item.id)
      );
      setMeasurementList(measurementList);
    }
  }, [lessonMeasurements, allMeasurement]);

  const {name, type, languages, purposeHtml, objectiveHtml, institution} = formData;

  return (
    <div className="bg-white shadow-5 overflow-hidden sm:rounded-lg mb-4">
      <div className="px-4 py-5 border-b-0 border-gray-200 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {AddNewLessonFormDict[userLanguage]['TITLE']}
        </h3>
      </div>

      <div className="p-4">
        <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
          <div>
            <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
              {AddNewLessonFormDict[userLanguage]['NAME']}{' '}
              <span className="text-red-500"> * </span>
            </label>
            <FormInput value={name} id="name" onChange={onInputChange} name="name" />
            {validation.name && <p className="text-red-600 text-sm">{validation.name}</p>}
          </div>
          <div>
            <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
              {AddNewLessonFormDict[userLanguage]['SELECTTYPE']}{' '}
              <span className="text-red-500"> * </span>
            </label>
            <Selector
              disabled={lessonId !== ''}
              selectedItem={type.name}
              placeholder={AddNewLessonFormDict[userLanguage]['TYPE']}
              list={typeList}
              onChange={(val, name, id) => onSelectOption(val, name, id, 'type')}
            />
            {validation.type && <p className="text-red-600 text-sm">{validation.type}</p>}
          </div>
        </div>

        <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
          <div>
            <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
              {AddNewLessonFormDict[userLanguage]['SELECTINSTITUTION']}{' '}
              <span className="text-red-500"> * </span>
            </label>
            <Selector
              disabled={lessonId !== ''}
              selectedItem={institution.name}
              placeholder={AddNewLessonFormDict[userLanguage]['INSTITUTION']}
              list={institutionList}
              onChange={(val, name, id) => onSelectOption(val, name, id, 'institution')}
            />
            {validation.institution && (
              <p className="text-red-600 text-sm">{validation.institution}</p>
            )}
          </div>
          <div>
            <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
              {AddNewLessonFormDict[userLanguage]['SELECTLANG']}
              <span className="text-red-500"> * </span>
            </label>
            <MultipleSelector
              // disabled={lessonId !== ''}
              selectedItems={languages}
              placeholder={AddNewLessonFormDict[userLanguage]['LANGUAGE']}
              list={languageList}
              onChange={selectLanguage}
            />
          </div>
        </div>

        <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
          <div>
            <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
              {AddNewLessonFormDict[userLanguage]['SELECTDESIGNER']}
            </label>
            <MultipleSelector
              selectedItems={selectedDesigners}
              placeholder={AddNewLessonFormDict[userLanguage]['DESIGNER']}
              list={designersList}
              onChange={selectDesigner}
            />
          </div>
        </div>

        <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
          <div>
            <label className="block text-m font-medium leading-5 text-gray-700 mb-3">
              {AddNewLessonFormDict[userLanguage]['PURPOSE']}
            </label>
            <RichTextEditor
              initialValue={purposeHtml}
              onChange={(htmlContent, plainText) =>
                setEditorContent(htmlContent, plainText, 'purposeHtml', 'purpose')
              }
            />
          </div>
          <div>
            <label className="block text-m font-medium leading-5 text-gray-700 mb-3">
              {AddNewLessonFormDict[userLanguage]['OBJECTIVE']}
            </label>
            <RichTextEditor
              initialValue={objectiveHtml}
              onChange={(htmlContent, plainText) =>
                setEditorContent(htmlContent, plainText, 'objectiveHtml', 'objective')
              }
            />
          </div>
        </div>

        {formData.type?.id === '1' && (
          <div className="p-6 border-gray-400  border-0 my-4 border-dashed">
            <p className="text-m font-medium leading-5 text-gray-700 my-2 text-center">
              {AddNewLessonFormDict[userLanguage]['MEASUREMENTLESSON']}
            </p>

            <div className="my-12 w-6/10 m-auto flex items-center justify-center">
              <div className="mr-4">
                <Selector
                  selectedItem={selectedMeasu.name}
                  list={measurementList}
                  placeholder={AddNewLessonFormDict[userLanguage]['SELECTMEASURE']}
                  onChange={selectMeasurement}
                />
              </div>
              <div className="ml-4 w-auto">
                <Buttons
                  btnClass="ml-4 py-1"
                  label="Add"
                  onClick={addNewMeasurement}
                  disabled={selectedMeasu.value ? false : true}
                />
              </div>
            </div>
            <div>
              {lessonMeasurements?.length > 0 ? (
                <div>
                  {/* Table header */}
                  <div className="flex justify-between w-full px-8 py-4 mx-auto whitespace-nowrap border-b-0 border-gray-200">
                    <div className="w-.5/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      <span>{AddNewLessonFormDict[userLanguage]['NO']}</span>
                    </div>
                    <div className="w-4.5/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      <span>{AddNewLessonFormDict[userLanguage]['MEASUREMENT']}</span>
                    </div>
                    <div className="w-3/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      <span>{AddNewLessonFormDict[userLanguage]['TOPIC']}</span>
                    </div>
                    <div className="w-2/10 px-8 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      <span>{AddNewLessonFormDict[userLanguage]['ACTION']}</span>
                    </div>
                    {/** <div className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      <span>Action</span>
                    </div> */}
                  </div>

                  {/* Table column */}
                  <div className="w-full m-auto max-h-88 overflow-auto">
                    {lessonMeasurements.map((item: any, index: number) => (
                      <div
                        key={item.id}
                        className="flex justify-between w-full  px-8 py-4 whitespace-nowrap border-b-0 border-gray-200">
                        <div className="flex w-.5/10 items-center px-8 py-3 text-left text-s leading-4">
                          {' '}
                          {index + 1}.
                        </div>
                        <div className="flex w-4.5/10 px-8 py-3 items-center text-left text-s leading-4 font-medium whitespace-normal">
                          {' '}
                          {item.measurement}{' '}
                        </div>
                        <div className="flex w-3/10 px-8 py-3 text-left text-s leading-4 items-center whitespace-normal">
                          {item.topic ? item.topic : '--'}
                        </div>
                        {/* <div className="flex w-2/10 px-6 py-3 text-s leading-4 items-center justify-center">
                      <span className="cursor-pointer">
                            <CheckBox value={item.required ? true : false} onChange={() => makeQuestionRequired(item.id)} name='isRequired' />
                          </span>
                          Remove
                        </div> */}
                        <div className="flex w-2/10 px-8 py-3 text-s leading-4 items-center justify-center">
                          <div
                            className="w-6 h-6 cursor-pointer"
                            onClick={() => toggleModal(item.id)}>
                            <IconContext.Provider
                              value={{size: '1rem', color: '#B22222'}}>
                              <FaTrash />
                            </IconContext.Provider>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-12 my-6 text-center">
                  <p className="text-gray-600 font-medium">
                    {AddNewLessonFormDict[userLanguage]['MESSAGES']['LESSONNOTHAVE']}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {validation.message && (
          <div className="py-2 m-auto mt-2 text-center">
            <p className={`${validation.isError ? 'text-red-600' : 'text-green-600'}`}>
              {validation.message}
            </p>
          </div>
        )}
        {showDeleteModal.state && (
          <ModalPopUp
            deleteModal
            deleteLabel="Remove"
            closeAction={toggleModal}
            saveAction={deleteMeasurement}
            message={showDeleteModal.message}
          />
        )}
        <div className="flex mb-8 mt-4 justify-center">
          <Buttons
            btnClass="py-3 px-10"
            label={
              loading
                ? AddNewLessonFormDict[userLanguage]['SAVING']
                : AddNewLessonFormDict[userLanguage]['SAVE']
            }
            onClick={saveFormData}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default AddNewLessonForm;
