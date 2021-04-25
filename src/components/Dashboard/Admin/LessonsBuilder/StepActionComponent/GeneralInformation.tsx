import React, { useState, useEffect, useContext } from 'react';
import API, { graphqlOperation } from '@aws-amplify/api';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaTrash } from 'react-icons/fa';
import { useHistory } from 'react-router';

import { InitialData, InputValueObject } from '../LessonBuilder';

import * as customMutations from '../../../../../customGraphql/customMutations';
import * as customQueries from '../../../../../customGraphql/customQueries';

import Selector from '../../../../Atoms/Form/Selector';
import MultipleSelector from '../../../../Atoms/Form/MultipleSelector';
import FormInput from '../../../../Atoms/Form/FormInput';
import Buttons from '../../../../Atoms/Buttons';
import RichTextEditor from '../../../../Atoms/RichTextEditor';
import ModalPopUp from '../../../../Molecules/ModalPopUp';
import { GlobalContext } from '../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../customHooks/dictionary';
import { languageList } from '../../../../../utilities/staticData';

interface GeneralInformationProps {
  formData: InitialData;
  designersList: InputValueObject[];
  selectedDesigners: InputValueObject[];
  setFormData: (data: InitialData) => void;
  setSelectedDesigners: (designer: InputValueObject[]) => void;
  lessonId: string;
  allMeasurement: { id: number; name: string; value: string }[];
  lessonMeasurements: any[];
  setLessonMeasurements: (obj: any[]) => void;
  setUnsavedChanges: Function;
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
    setLessonMeasurements,
    setUnsavedChanges,
  } = props;

  const typeList: any = [
    { id: '1', name: 'Lecture', value: 'lesson' },
    { id: '2', name: 'Assessment', value: 'assessment' },
    { id: '3', name: 'Survey', value: 'survey' },
  ];

  const history = useHistory();
  const [selectedMeasu, setSelectedMeasu] = useState({ id: '', name: '', value: '' });
  const [measurementList, setMeasurementList] = useState(allMeasurement);
  const [loading, setLoading] = useState(false);
  const { theme, clientKey, userLanguage } = useContext(GlobalContext);
  const { GeneralInformationDict, BreadcrumsTitles } = useDictionary(clientKey);
  const [showDeleteModal, setShowDeleteModal] = useState({
    id: '',
    state: false,
    message: GeneralInformationDict[userLanguage]['MESSAGES']['REMOVE'],
  });
  const [validation, setValidation] = useState({
    name: '',
    type: '',
    message: '',
    isError: true,
  });

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
  const setEditorContent = (html: string, text: string, fieldHtml: string, field: string) => {
    setFormData({
      ...formData,
      [fieldHtml]: html,
      [field]: text,
    });
    setUnsavedChanges(true);
  };
  const selectLanguage = (id: string, name: string, value: string) => {
    let updatedList;
    const currentLanguages = formData.languages;
    const selectedItem = currentLanguages.find((item) => item.id === id);
    if (!selectedItem) {
      updatedList = [...currentLanguages, { id, name, value }];
    } else {
      updatedList = currentLanguages.filter((item) => item.id !== id);
    }
    setUnsavedChanges(true);
    setFormData({
      ...formData,
      languages: updatedList,
    });
  };

  const selectMeasurement = (val: string, name: string, id: string) => {
    setSelectedMeasu({ id, name, value: val });
  };
  const toggleModal = (id?: string) => {
    setShowDeleteModal({
      ...showDeleteModal,
      id: id ? id : '',
      state: !showDeleteModal.state,
    });
  };
  const goToMeasmntDetails = (curriculumId: string, measurementId: string) => {
    history.push(`/dashboard/manage-institutions/curricular/${curriculumId}/measurement/edit/${measurementId}`);
  };
  const deleteMeasurement = async () => {
    try {
      const input = {
        id: showDeleteModal.id,
      };
      const results: any = await API.graphql(graphqlOperation(customMutations.deleteLessonRubrics, { input: input }));
      const lessonRubric = results.data.deleteLessonRubrics;
      if (lessonRubric?.id) {
        const filteredRubrics = [...lessonMeasurements].filter((item) => item.id !== lessonRubric?.id);
        setLessonMeasurements([...filteredRubrics]);
      }
      toggleModal();
    } catch {
      setValidation({
        name: '',
        type: '',
        message: GeneralInformationDict[userLanguage]['MESSAGES']['DELETEERR'],
        isError: true,
      });
    }
  };

  const addNewMeasurement = async () => {
    try {
      const input = {
        lessonID: lessonId,
        rubricID: selectedMeasu.id,
      };
      const results: any = await API.graphql(graphqlOperation(customMutations.createLessonRubrics, { input: input }));
      const lessonRubric = results.data.createLessonRubrics;
      if (lessonRubric?.id) {
        setLessonMeasurements([
          ...lessonMeasurements,
          {
            id: lessonRubric.id,
            rubricID: lessonRubric.rubricID,
            measurement: selectedMeasu.name,
            topic: lessonRubric?.rubric?.topic?.name,
            curriculumId: lessonRubric?.rubric?.curriculumID,
          },
        ]);
        setSelectedMeasu({ id: '', name: '', value: '' });
      }
    } catch {
      setValidation({
        name: '',
        type: '',
        message: GeneralInformationDict[userLanguage]['MESSAGES']['ADDERR'],
        isError: true,
      });
    }
  };

  const selectDesigner = (id: string, name: string, value: string) => {
    let updatedList;
    const currentDesigners = selectedDesigners;
    const selectedItem = currentDesigners.find((item) => item.id === id);
    if (!selectedItem) {
      updatedList = [...currentDesigners, { id, name, value }];
    } else {
      updatedList = currentDesigners.filter((item) => item.id !== id);
    }
    setSelectedDesigners(updatedList);
    setUnsavedChanges(true);
  };

  const validateForm = () => {
    let isValid = true;
    const msgs = validation;
    if (!formData.name?.trim().length) {
      isValid = false;
      msgs.name = GeneralInformationDict[userLanguage]['MESSAGES']['NAME'];
    } else {
      msgs.name = '';
    }
    // TODO: Add validation for repeating lesson names.
    setValidation({ ...msgs });
    return isValid;
  };

  const fetchRubricsList = async () => {
    try {
      const [results, topics]: any = await Promise.all([
        await API.graphql(
          graphqlOperation(customQueries.listLessonRubricss, {
            filter: {
              lessonID: { eq: lessonId },
            },
          })
        ),
        await API.graphql(graphqlOperation(customQueries.listTopics)),
      ]);

      const topicsList = topics.data?.listTopics?.items;
      const lessonRubrics = results.data?.listLessonRubricss?.items?.map((item: any) => {
        return {
          id: item.id,
          rubricID: item.rubricID,
          measurement: item?.rubric?.name,
          topic: topicsList.find((topic: any) => topic.id === item.rubric.topicID)?.name || '',
          curriculumId: item?.rubric?.curriculumID,
        };
      });
      setLessonMeasurements([...lessonRubrics]);
      console.log('aafter function', allMeasurement);
    } catch {
      setValidation({
        name: '',
        type: '',
        message: GeneralInformationDict[userLanguage]['MESSAGES']['FETCHERR'],
        isError: true,
      });
    }
  };

  const updateFormInformation = async () => {
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
        const results: any = await API.graphql(graphqlOperation(customMutations.updateLesson, { input: input }));
        const lessonsData = results?.data?.updateLesson;
        console.log(lessonsData);

        // if (lessonsData.type !== 'lesson') {
        //   const assessmentInput = {
        //     id: lessonsData.assessmentID,
        //     title: formData.name,
        //     type: formData.type?.value,
        //   }
        //   const results: any = await API.graphql(
        //     graphqlOperation(customMutations.updateAssessment, { input: assessmentInput })
        //   );
        //   const assessmentData = results?.data?.updateAssessment;
        // }
        setLoading(false);
        setUnsavedChanges(false);
        if (lessonsData) {
          setValidation({
            name: '',
            type: '',
            message: GeneralInformationDict[userLanguage]['UPDATESUCCESS'],
            isError: false,
          });
        }
      } catch {
        setValidation({
          name: '',
          type: '',
          message: GeneralInformationDict[userLanguage]['UPDATEERR'],
          isError: true,
        });
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (formData?.type?.id === '1') {
      fetchRubricsList();
    }
  }, []);

  useEffect(() => {
    if (allMeasurement?.length > 0) {
      const measurementID = lessonMeasurements?.map((meas) => meas.rubricID);
      const measurementList = allMeasurement.filter((item) => !measurementID.includes(item.id));
      setMeasurementList(measurementList);
    }
  }, [lessonMeasurements, allMeasurement]);
  const { name, type, languages, purposeHtml, objectiveHtml, institution } = formData;

  return (
    <div className="bg-white shadow-5 overflow-hidden sm:rounded-lg mb-4">
      <div className="px-4 py-5 border-b-0 border-gray-200 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {GeneralInformationDict[userLanguage]['HEADING']}
        </h3>
      </div>

      <div className="p-4">
        <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
          <div>
            <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
              {GeneralInformationDict[userLanguage]['NAME']} <span className="text-red-500"> * </span>
            </label>
            <FormInput value={name} id="name" onChange={onInputChange} name="name" />
            {validation.name && <p className="text-red-600 text-sm">{validation.name}</p>}
          </div>
          <div>
            <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
              {GeneralInformationDict[userLanguage]['SELECTTYPE']} <span className="text-red-500"> * </span>
            </label>
            <Selector
              disabled
              selectedItem={type.name}
              placeholder={GeneralInformationDict[userLanguage]['TYPE']}
              list={typeList}
              onChange={() => {}}
            />
            {validation.type && <p className="text-red-600 text-sm">{validation.type}</p>}
          </div>
        </div>

        <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
          <div>
            <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
              {GeneralInformationDict[userLanguage]['SELECTINSTITUTION']} <span className="text-red-500"> * </span>
            </label>
            <Selector
              disabled={lessonId !== ''}
              selectedItem={institution.name}
              placeholder={GeneralInformationDict[userLanguage]['INSTITUTION']}
              list={[]}
              onChange={() => {}}
            />
          </div>
          <div>
            <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
              {GeneralInformationDict[userLanguage]['SELECTLANG']}
              <span className="text-red-500"> * </span>
            </label>
            <MultipleSelector
              // disabled={lessonId !== ''}
              selectedItems={languages}
              placeholder={GeneralInformationDict[userLanguage]['LANGUAGE']}
              list={languageList}
              onChange={selectLanguage}
            />
          </div>
        </div>

        <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
          <div>
            <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
              {GeneralInformationDict[userLanguage]['SELECTDESIGNER']}
            </label>
            <MultipleSelector
              selectedItems={selectedDesigners}
              placeholder={GeneralInformationDict[userLanguage]['DESIGNER']}
              list={designersList}
              onChange={selectDesigner}
            />
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
              {GeneralInformationDict[userLanguage]['PURPOSE']}
            </label>
            <RichTextEditor
              initialValue={purposeHtml}
              onChange={(htmlContent, plainText) => setEditorContent(htmlContent, plainText, 'purposeHtml', 'purpose')}
            />
          </div>
          <div>
            <label className="block text-m font-medium leading-5 text-gray-700 mb-3">
              {GeneralInformationDict[userLanguage]['OBJECTIVE']}
            </label>
            <RichTextEditor
              initialValue={objectiveHtml}
              onChange={(htmlContent, plainText) =>
                setEditorContent(htmlContent, plainText, 'objectiveHtml', 'objective')
              }
            />
          </div>
        </div>

        {/* Measurements block */}
        {type?.id === '1' && (
          <div className="p-6 border-gray-400  border-0 my-4 border-dashed">
            <p className="text-m font-medium leading-5 text-gray-700 my-2 text-center">
              {GeneralInformationDict[userLanguage]['LESSONMEASUREMENT']}
            </p>

            <div className="my-12 w-6/10 m-auto flex items-center justify-center">
              <div className="mr-4">
                <Selector
                  selectedItem={selectedMeasu.name}
                  list={measurementList}
                  placeholder={GeneralInformationDict[userLanguage]['SELECTMEASUREMENT']}
                  onChange={selectMeasurement}
                />
              </div>
              <div className="ml-4 w-auto">
                <Buttons
                  btnClass="ml-4 py-1"
                  label={GeneralInformationDict[userLanguage]['BUTTON']['ADD']}
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
                      <span>{GeneralInformationDict[userLanguage]['NO']}</span>
                    </div>
                    <div className="w-4.5/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      <span>{GeneralInformationDict[userLanguage]['MEASUREMENT']}</span>
                    </div>
                    <div className="w-3/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      <span>{GeneralInformationDict[userLanguage]['TOPIC']}</span>
                    </div>
                    <div className="w-2/10 px-8 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      <span>{GeneralInformationDict[userLanguage]['ACTION']}</span>
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
                        <div
                          className="flex w-4.5/10 px-8 py-3 items-center text-left text-s leading-4 font-medium whitespace-normal cursor-pointer"
                          onClick={() => goToMeasmntDetails(item.curriculumId, item.rubricID)}>
                          {' '}
                          {item.measurement || '--'}{' '}
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
                          <div className="w-6 h-6 cursor-pointer" onClick={() => toggleModal(item.id)}>
                            <IconContext.Provider value={{ size: '1rem', color: '#B22222' }}>
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
                    {' '}
                    {GeneralInformationDict[userLanguage]['MESSAGES']['LESSONNOTHAVE']}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {validation.message && (
          <div className="py-4 m-auto mt-2 text-center">
            <p className={`${validation.isError ? 'text-red-600' : 'text-green-600'}`}>{validation.message}</p>
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
                ? GeneralInformationDict[userLanguage]['BUTTON']['SAVING']
                : GeneralInformationDict[userLanguage]['BUTTON']['SAVE']
            }
            onClick={updateFormInformation}
            disabled={loading ? true : false}
          />
        </div>
      </div>
    </div>
  );
};

export default GeneralInformation;
