import React, { useState, useEffect, useContext } from 'react'
import { useHistory, useLocation, useParams } from 'react-router'
import { IoArrowUndoCircleOutline } from 'react-icons/io5'
import API, { graphqlOperation } from '@aws-amplify/api'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import BreadCrums from '../../../../../../Atoms/BreadCrums'
import SectionTitle from '../../../../../../Atoms/SectionTitle'
import Buttons from '../../../../../../Atoms/Buttons'
import PageWrapper from '../../../../../../Atoms/PageWrapper'
import FormInput from '../../../../../../Atoms/Form/FormInput'
import TextArea from '../../../../../../Atoms/Form/TextArea'
import Selector from '../../../../../../Atoms/Form/Selector'
import MultipleSelector from '../../../../../../Atoms/Form/MultipleSelector'
import { languageList, statusList } from '../../../../../../../utilities/staticData'
import { reorder, getLessonType } from '../../../../../../../utilities/strings';

// TODO: Check wether mutations and queries are needed for fetching all the data or not.
import * as mutations from '../../../../../../../graphql/mutations'
import * as queries from '../../../../../../../graphql/queries'
import * as customQueries from '../../../../../../../customGraphql/customQueries'
import * as customMutations from '../../../../../../../customGraphql/customMutations'
import { getAsset } from '../../../../../../../assets';
import { GlobalContext } from '../../../../../../../contexts/GlobalContext';

interface EditSyllabusProps {

}
interface InitialData {
  name: string
  description: string
  methodology: string
  policies: string
  purpose: string
  objectives: string
  languages: { id: string, name: string, value: string }[]
}

interface UIMessages {
  show: boolean,
  message: string,
  isError: boolean,
  lessonError?: boolean
}

const EditSyllabus = (props: EditSyllabusProps) => {
  const { } = props;
  const history = useHistory();
  const location = useLocation();

  const { clientKey, theme } = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');

  const initialData = {
    name: '',
    description: '',
    methodology: '',
    policies: '',
    purpose: '',
    objectives: '',
    languages: [{ id: '1', name: "English", value: 'EN' }],
  }
  const [syllabusData, setSyllabusData] = useState<InitialData>(initialData);
  const [loading, setIsLoading] = useState(false);
  const [editState, setEditState] = useState<{ id: string, action?: string }>({
    id: '',
    action: ''
  });
  const [designerIds, setDesignerIds] = useState([]);
  const [designersList, setDesignersList] = useState([]);
  const [selectedDesigners, setSelectedDesigners] = useState([]);
  const [allLessonsList, setAllLessonsList] = useState([]);
  const [dropdownLessonsList, setDropdownLessonsList] = useState([]);
  const [selectedLessonsList, setSelectedLessonsList] = useState([]);
  const [savedLessonsList, setSavedLessonsList] = useState([]);
  const [lessonsIds, setLessonsIds] = useState([])
  const [sequenceId, setSequenceId] = useState('')
  const [selecetedLesson, setSelectedLesson] = useState({
    id: '',
    name: '',
    value: ''
  });
  const [messages, setMessages] = useState<UIMessages>({
    show: false,
    message: '',
    isError: false,
    lessonError: false
  });

  const useQuery = () => {
    return new URLSearchParams(location.search);
  };
  const params = useQuery();
  const urlParams: any = useParams();

  const syllabusId = params.get('id');
  const curricularId = urlParams.curricularId;

  const breadCrumsList = [
    { title: 'Home', url: '/dashboard', last: false },
    { title: 'Edit Unit', url: `/dashboard/curricular/${curricularId}/syllabus/edit?id=${syllabusId}`, last: true }
  ];

  const onDragEnd = async (result: any) => {
    if (result.source.index !== result.destination.index) {
      const list = reorder(lessonsIds, result.source.index, result.destination.index)
      setLessonsIds(list);
      let lessonsList = selectedLessonsList.map((t: any) => {
        let index = list.indexOf(t.uniqlessonId)
        return { ...t, index }
      }).sort((a: any, b: any) => (a.index > b.index ? 1 : -1))

      setSelectedLessonsList(lessonsList)
      let seqItem: any = await API.graphql(graphqlOperation(mutations.updateCSequences, { input: { id: `lesson_${syllabusId}`, sequence: list } }));
      seqItem = seqItem.data.updateCSequences;
      console.log('seq updated');
    }
  }

  const onInputChange = (e: any) => {
    setSyllabusData({
      ...syllabusData,
      [e.target.name]: e.target.value
    })
    if (messages.show) {
      setMessages({
        show: false,
        message: '',
        isError: false
      })
    }
  }
  const selectLanguage = (id: string, name: string, value: string) => {
    let updatedList;
    const currentLanguages = syllabusData.languages;
    const selectedItem = currentLanguages.find(item => item.id === id);
    if (!selectedItem) {
      updatedList = [...currentLanguages, { id, name, value }];
    } else {
      updatedList = currentLanguages.filter(item => item.id !== id);
    }
    setSyllabusData({
      ...syllabusData,
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

  const selectLesson = (value: string, name: string, id: string) => {
    setSelectedLesson({ id, name, value })
  }

  const saveSyllabusDetails = async () => {
    const isValid = await validateForm();
    if (isValid) {
      try {
        setIsLoading(true);
        const languagesCode = syllabusData.languages.map((item: { value: string }) => item.value);
        const designers = selectedDesigners.map(item => ({ id: item.id }))
        const input = {
          id: syllabusId,
          name: syllabusData.name,
          curriculumID: curricularId,
          description: syllabusData.description,
          methodology: syllabusData.methodology,
          policies: syllabusData.policies,
          pupose: syllabusData.purpose,
          objectives: syllabusData.objectives,
          languages: languagesCode,
          designers: designers
        }
        const newSyllabus = await API.graphql(graphqlOperation(mutations.updateSyllabus, { input: input }));
        setMessages({
          show: true,
          message: 'Unit details has been updated.',
          isError: false
        })
        setSyllabusData(initialData);
        setIsLoading(false);
      } catch {
        setMessages({
          show: true,
          message: 'Unable to update unit details please try again later.',
          isError: true
        })
      }
    }
  }
  const validateForm = async () => {
    if (syllabusData.name.trim() === '') {
      setMessages({
        show: true,
        message: 'Unit name is required please enter name.',
        isError: true
      })
      return false;
    }
    //  TODO: Need to confirm that syllabus name should be uniq or not?

    // else if (syllabusData.name.trim() !== '') {
    //   const isUniq = await checkUniqSyllabusName()
    //   if (!isUniq) {
    //     setMessages({
    //       show: true,
    //       message: 'This syllabus name is already exist, please add another name.',
    //       isError: true
    //     })
    //     return false;
    //   } else {
    //     return true
    //   }
    // }
    else {
      return true
    }
  }
  const updateStatusOnTable = (lessonId: string, status: string) => {
    let updatedList = [...selectedLessonsList];
    updatedList.find(item => item.id === lessonId).status = status;
    setSelectedLessonsList(updatedList)
  }

  const onStatusChange = async (val: string, name: string, id: string, uniqlessonId: string) => {
    try {
      setEditState({ ...editState, action: 'updating...' })
      const input = {
        id: uniqlessonId,
        status: val
      }
      const result: any = await API.graphql(graphqlOperation(customMutations.updateSyllabusLesson, { input: input }));
      const newLesson = result.data.updateSyllabusLesson;
      setEditState({ id: '' });
      updateStatusOnTable(newLesson.lessonID, newLesson.status);
    } catch {
      setMessages({
        show: true,
        message: 'Error while updating lesson status please try later.',
        isError: true,
        lessonError: true
      })
      setEditState({ id: '', action: '' });
    }
  }

  const editCurrentLesson = (id: string) => {
    setEditState({ id });
  }

  const cancelEdit = () => {
    setEditState({ id: '', action: '' })
  }

  const addNewLesson = async () => {
    try {
      const selectedLesson = allLessonsList.find(item => item.id === selecetedLesson.id)
      const lessonComponentPlan: any = selectedLesson?.lessonPlan && selectedLesson.lessonPlan.map((item: any) => {
        return {
          disabled: false,
          open: selectedLesson.type !== 'lesson' ? true : false,
          active: selectedLesson.type !== 'lesson' ? true : false,
          stage: `checkpoint?id=${item.LessonComponentID}`,
          type: 'survey',
          displayMode: 'SELF',
        }
      })
      const input = {
        syllabusID: syllabusId,
        lessonID: selecetedLesson.id,
        displayData: {
          breakdownComponent: selectedLesson?.type
        },
        lessonPlan: lessonComponentPlan?.length > 0 ? lessonComponentPlan : [],
        status: 'Active'
      }

      const result: any = await API.graphql(graphqlOperation(customMutations.createSyllabusLesson, { input: input }));
      const newLesson = result.data.createSyllabusLesson;

      if (!lessonsIds.length) {
        setLessonsIds([newLesson.id])
        let seqItem: any = await API.graphql(graphqlOperation(mutations.createCSequences, { input: { id: `lesson_${syllabusId}`, sequence: [newLesson.id] } }));
        seqItem = seqItem.data.createCSequences
        console.log('seqItem', seqItem)
      } else {
        setLessonsIds([...lessonsIds, newLesson.id])
        let seqItem: any = await API.graphql(graphqlOperation(mutations.updateCSequences, { input: { id: `lesson_${syllabusId}`, sequence: [...lessonsIds, newLesson.id] } }));
        seqItem = seqItem.data.updateCSequences
        console.log('seqItem', seqItem)
      }

      setSelectedLesson({ id: '', name: '', value: '' })
      setSavedLessonsList([
        ...savedLessonsList, newLesson
      ]);
    } catch {
      setMessages({
        show: true,
        message: 'Error while adding new lesson please try later.',
        isError: true,
        lessonError: true
      })
    }
  }

  const updateListAndDropdown = async () => {
    // To update table list and dropdown as per selected items.
    const savedLessonIds = [...savedLessonsList];
    const lessonsDetails = [...allLessonsList];
    const filteredList = lessonsDetails.filter(item => savedLessonIds.some(lesson => lesson.lessonID === item.id));
    let updatedTableList = filteredList.map(item => {
      let tableList;
      const selectedLesson = savedLessonIds.find(lesson => lesson.lessonID === item.id)
      tableList = {
        ...item,
        status: selectedLesson?.status || '',
        uniqlessonId: selectedLesson?.id
      }
      return tableList;
    });
    const filteredDropDownList = dropdownLessonsList.filter(item => updatedTableList.find(lesson => lesson.id === item.id) ? false : true)

    updatedTableList = updatedTableList.map((t: any) => {
      let index = lessonsIds?.indexOf(t.uniqlessonId)
      return { ...t, index }
    }).sort((a: any, b: any) => (a.index > b.index ? 1 : -1));

    setSelectedLessonsList(updatedTableList)
    setDropdownLessonsList(filteredDropDownList)
  }

  const fetchSyllabusData = async () => {

    if (syllabusId) {
      try {
        const result: any = await API.graphql(graphqlOperation(queries.getSyllabus, { id: syllabusId }))
        const savedData = result.data.getSyllabus;
        setSyllabusData({
          ...syllabusData,
          name: savedData.name,
          languages: languageList.filter(item => savedData.languages.includes(item.value)),
          description: savedData.description,
          objectives: savedData.objectives,
          purpose: savedData.pupose,
          methodology: savedData.methodology,
          policies: savedData.policies,
        });
        if (savedData.designers) {
          setDesignerIds([...savedData?.designers])
        }
        setSavedLessonsList([...savedData.lessons?.items]);
      } catch (err) {
        console.log('err', err)
        setMessages({
          show: true,
          message: 'Error while fetching unit data.',
          isError: true
        })
      }
    } else {
      console.log('can not find unit id')
      history.push('/dashboard/manage-institutions')
    }

  }

  const fetchLessonsList = async () => {
    try {
      const result: any = await API.graphql(graphqlOperation(customQueries.listLessonsTitles))
      const savedData = result.data.listLessons;
      const sortedList = savedData?.items?.sort((a: any, b: any) => a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1)
      const updatedList = sortedList?.map((item: { id: string, title: string, type: string }) => (
        {
          id: item.id,
          name: `${item.title} - ${item.type && getLessonType(item.type)}`,
          value: item.title
        }))
      setAllLessonsList([...sortedList])
      // console.log(sortedList, savedData)
      setDropdownLessonsList([...updatedList])
    } catch {
      setMessages({
        show: true,
        message: 'Error while fetching lessons list data.',
        isError: true,
        lessonError: true
      })
    }
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
      setMessages({
        show: true,
        message: 'Error while fetching Designers list Please try again later.',
        isError: true,
        lessonError: true
      })
    }
  }

  const fetchLessonsSequence = async () => {
    let item: any = await API.graphql(graphqlOperation(queries.getCSequences,
      { id: `lesson_${syllabusId}` }))
    item = item?.data.getCSequences?.sequence || []
    if (item) {
      setLessonsIds(item)
    }
  }
  const createLessonSequence = async (lessonsID: string[]) => {
    let seqItem: any = await API.graphql(graphqlOperation(mutations.createCSequences, { input: { id: `lesson_${syllabusId}`, sequence: lessonsID } }));
    setLessonsIds(lessonsID)
  }

  useEffect(() => {
    fetchLessonsList();
    fetchPersonsList();
    fetchLessonsSequence();
    fetchSyllabusData();
  }, []);

  useEffect(() => {
    if (Array.isArray(savedLessonsList) && savedLessonsList.length) {
      updateListAndDropdown();
    }
  }, [savedLessonsList, allLessonsList])

  useEffect(() => {
    if (savedLessonsList?.length && !lessonsIds.length) {
      const currentLessonsID = savedLessonsList.map(item => item.id);
      createLessonSequence(currentLessonsID);
    }
  }, [savedLessonsList])

  useEffect(() => {
    if (designersList && designersList.length > 0) {
      const designers = [...designerIds].map((desID: string) => {
        const personData = designersList.find(per => per.id === desID)
        const personObj = {
          id: personData?.id,
          name: personData?.name,
          value: personData?.name
        }
        return personObj
      })
      setSelectedDesigners(designers);
    }
  }, [designersList, designerIds])


  const { name, languages, description, purpose, objectives, methodology, policies } = syllabusData;
  return (
    <div className="w-9/10 h-full mt-4 p-4">

      {/* Section Header */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle title="Edit Unit" subtitle="Edit curricular unit." />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons btnClass="mr-4" onClick={history.goBack} Icon={IoArrowUndoCircleOutline} />
        </div>
      </div>

      {/* Body section */}
      <PageWrapper>

        <div className="h-9/10 flex flex-col md:flex-row">
          <div className="w-full">
            <div className='bg-white shadow-5 sm:rounded-lg mb-4'>
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg text-center leading-6 font-medium text-gray-900">
                  GENERAL INFORMATION
                </h3>
              </div>
              <div className="w-9/10 m-auto p-4">

                <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
                  <div>
                    <FormInput value={name} id='name' onChange={onInputChange} name='name' label="Unit Name" isRequired />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
                      Select Designers
                    </label>
                    <MultipleSelector selectedItems={selectedDesigners} placeholder="Designers" list={designersList} onChange={selectDesigner} />
                  </div>
                </div>
                <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
                      Select Language
                  </label>
                    <MultipleSelector selectedItems={languages} placeholder="Language" list={languageList} onChange={selectLanguage} />
                  </div>

                </div>

                <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
                  <div>
                    <TextArea value={description} rows={2} id='description' onChange={onInputChange} name='description' label="Description" />
                  </div>
                  <div>
                    <TextArea value={purpose} rows={2} id='purpose' onChange={onInputChange} name='purpose' label="Purpose" />
                  </div>
                </div>

                <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
                  <div>
                    <TextArea value={objectives} rows={2} id='objectives' onChange={onInputChange} name='objectives' label="Objectives" />
                  </div>
                  <div>
                    <TextArea value={methodology} rows={2} id='methodology' onChange={onInputChange} name='methodology' label="Methodology" />
                  </div>
                </div>
                <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
                  <div>
                    <TextArea value={policies} rows={2} id='policies' onChange={onInputChange} name='policies' label="Policies" />
                  </div>
                </div>
                {(messages.show && !messages.lessonError) ? (<div className="py-2 m-auto text-center">
                  <p className={`${messages.isError ? 'text-red-600' : 'text-green-600'}`}>{messages.message && messages.message}</p>
                </div>) : null}
                <div className="flex my-8 justify-center">
                  <Buttons btnClass="py-3 px-10" label={loading ? 'Saving...' : 'Save'} onClick={saveSyllabusDetails} disabled={loading ? true : false} />
                </div>
              </div>
            </div>


            <div className='bg-white shadow-5 sm:rounded-lg mb-4'>
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg text-center leading-6 font-medium text-gray-900">
                  LESSONS
                </h3>
              </div>
              <div className="w-9.5/10 m-auto p-4">

                {/* Add new lesson section */}
                <div className="my-12 w-6/10 m-auto flex items-center justify-center">
                  <div className="mr-4">
                    <Selector selectedItem={selecetedLesson.value} list={dropdownLessonsList} placeholder="Select Lesson" onChange={selectLesson} />
                  </div>
                  <div className="ml-4 w-auto">
                    <Buttons btnClass="ml-4 py-1" label="Add" onClick={addNewLesson} disabled={selecetedLesson.value ? false : true} />
                  </div>
                </div>
                {(messages.show && messages.lessonError) ? (<div className="py-2 mb-4 m-auto text-center">
                  <p className={`${messages.isError ? 'text-red-600' : 'text-green-600'}`}>{messages.message && messages.message}</p>
                </div>) : null}
                {/* Lessons list  */}
                <div>
                  {(selectedLessonsList && selectedLessonsList.length > 0) ? (
                    <div>
                      <div className="flex justify-between w-full  px-8 py-4 whitespace-no-wrap border-b border-gray-200">
                        <div className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          <span>No.</span>
                        </div>
                        <div className="w-3/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          <span>Lesson Name</span>
                        </div>
                        <div className="w-2/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          <span>Type</span>
                        </div>
                        <div className="w-3/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          <span>Status</span>
                        </div>
                        <div className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          <span>Actions</span>
                        </div>
                      </div>

                      <div className="max-h-88 overflow-y-auto mb-10">

                        {/* Drag and drop listing */}
                        <DragDropContext onDragEnd={onDragEnd}>
                          <Droppable droppableId="droppable">
                            {(provided, snapshot) => (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                              >
                                {selectedLessonsList.map((item, index) => (
                                  <Draggable key={item.id} draggableId={item.id} index={index}>
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                      >
                                        <div key={index} className="flex justify-between w-full px-8 py-4 whitespace-no-wrap border-b border-gray-200 cursor-move">
                                          <div className="flex w-1/10 items-center px-8 py-3 text-left text-s leading-4">{index + 1}.</div>
                                          <div className="flex w-3/10 items-center px-8 py-3 text-left text-s leading-4 font-medium whitespace-normal">
                                            {item.title ? item.title : '--'}
                                          </div>
                                          <div className="flex w-2/10 items-center px-8 py-3 text-left text-s text-gray-500 leading-4 font-medium whitespace-normal">
                                            {item.type ? item.type : '--'}
                                          </div>
                                          <div className="flex w-3/10 items-center px-8 py-3 text-left text-s text-gray-500 leading-4 font-medium ">
                                            {(editState.id !== item.id) ?
                                              (item.status ? item.status : '--')
                                              : (
                                                <div className="text-gray-900">
                                                  <Selector selectedItem={item.status} placeholder="Select Status" list={statusList} onChange={(val, name, id) => onStatusChange(val, name, id, item.uniqlessonId)} />
                                                </div>
                                              )}
                                          </div>
                                          {
                                            (editState.id !== item.id) ?
                                              <span className={`w-1/10 flex items-center text-left px-8 py-3 ${theme.textColor[themeColor]}`} onClick={() => editCurrentLesson(item.id)}>
                                                edit
                                              </span>
                                              :
                                              <span className={`w-1/10 flex items-center text-left px-8 py-3 ${theme.textColor[themeColor]}`} onClick={cancelEdit}>
                                                {editState.action ? editState.action : 'Cancel'}
                                              </span>
                                          }
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </DragDropContext>

                      </div>

                    </div>
                  ) : (
                      <div className="text-center p-16 mt-4">
                        No lessons selected.
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>




      </PageWrapper>
    </div>
  )
}

export default EditSyllabus
