import React, { useState, useEffect } from 'react'
import { useHistory, useLocation, useParams } from 'react-router'
import { IoArrowUndoCircleOutline } from 'react-icons/io5'
import API, { graphqlOperation } from '@aws-amplify/api'

import BreadCrums from '../../../../../../Atoms/BreadCrums'
import SectionTitle from '../../../../../../Atoms/SectionTitle'
import Buttons from '../../../../../../Atoms/Buttons'
import PageWrapper from '../../../../../../Atoms/PageWrapper'
import FormInput from '../../../../../../Atoms/Form/FormInput'
import TextArea from '../../../../../../Atoms/Form/TextArea'
import Selector from '../../../../../../Atoms/Form/Selector'
import { languageList } from '../../../../../../../utilities/staticData'
import MultipleSelector from '../../../../../../Atoms/Form/MultipleSelector'

// TODO: Check wether mutations and queries are needed for fetching all the data or not.
import * as mutations from '../../../../../../../graphql/mutations'
import * as queries from '../../../../../../../graphql/queries'
import * as customQueries from '../../../../../../../customGraphql/customQueries'
import * as customMutations from '../../../../../../../customGraphql/customMutations'

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
  // lessonsList: any[]
}

const EditSyllabus = (props: EditSyllabusProps) => {
  const { } = props;
  const history = useHistory();
  const location = useLocation();

  const initialData = {
    name: '',
    description: '',
    methodology: '',
    policies: '',
    purpose: '',
    objectives: '',
    languages: [{ id: '1', name: "English", value: 'EN' }],
    // lessonsList: []
  }
  const [syllabusData, setSyllabusData] = useState<InitialData>(initialData);
  const [loading, setIsLoading] = useState(false);
  const [allLessonsList, setAllLessonsList] = useState([]);
  const [dropdownLessonsList, setDropdownLessonsList] = useState([]);
  const [selecetedLesson, setSelectedLesson] = useState({
    id: '',
    name: '',
    value: ''
  });
  const [messages, setMessages] = useState({
    show: false,
    message: '',
    isError: false
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
    { title: 'Edit Syllabus', url: `/dashboard/curricular/${curricularId}/syllabus/edit?id=${syllabusId}`, last: true }
  ];

  const sequenceList: any[] = [];
  const designersList: any[] = [];
  const selectedLessonsList: any[] = [];
  const lessonsList: any[] = [];

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

  const selectLesson = (value: string, name: string, id: string) => {
    setSelectedLesson({ id, name, value })
  }

  const saveSyllabusDetails = async () => {
    const isValid = await validateForm();
    if (isValid) {
      try {
        setIsLoading(true);
        const languagesCode = syllabusData.languages.map((item: { value: string }) => item.value);
        const input = {
          id: syllabusId,
          name: syllabusData.name,
          curriculumID: curricularId,
          description: syllabusData.description,
          methodology: syllabusData.methodology,
          policies: syllabusData.policies,
          pupose: syllabusData.purpose,
          objectives: syllabusData.objectives,
          languages: languagesCode
        }
        const newSyllabus = await API.graphql(graphqlOperation(mutations.updateSyllabus, { input: input }));
        setMessages({
          show: true,
          message: 'New syllabus has been saved.',
          isError: false
        })
        setSyllabusData(initialData);
        setIsLoading(false);
      } catch{
        setMessages({
          show: true,
          message: 'Unable to save new syllabus please try again later.',
          isError: true
        })
      }
    }
  }
  const validateForm = async () => {
    if (syllabusData.name.trim() === '') {
      setMessages({
        show: true,
        message: 'Syllabus name is required please enter name.',
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

  const editCurrentLesson = (id: string) => {

  }
  const addNewLesson = async () => {
    try {
      const input = {
        syllabusID: syllabusId,
        lessonID: selecetedLesson.id
      }
      const newLesson = await API.graphql(graphqlOperation(customMutations.createSyllabusLesson, { input: input }));
    
      // IN PROGRESS....
    } catch{

    }
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
          // lessonsList: savedData.lessons?.items
        })
      } catch {
        console.log('Error while fetching syllabus data.')
      }
    } else {
      console.log('can not find syllabus id')
      history.push('/dashboard/manage-institutions')
    }

  }

  const fetchLessonsList = async () => {
    try {
      const result: any = await API.graphql(graphqlOperation(customQueries.listLessonsTitles))
      const savedData = result.data.listLessons;
      const updatedList = savedData?.items.map((item: { id: string, title: string }) => ({ id: item.id, name: item.title, value: item.title }))
      setAllLessonsList([...savedData?.items])
      setDropdownLessonsList([...updatedList])
    } catch {
      console.log('Error while fetching lessons list data.')
    }
  }

  useEffect(() => {
    fetchSyllabusData();
    fetchLessonsList();
  }, [])

  const { name, languages, description, purpose, objectives, methodology, policies } = syllabusData;
  return (
    <div className="w-9/10 h-full mt-4 p-4">

      {/* Section Header */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle title="Edit Syllabus" subtitle="Edit curricular syllabus." />
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
                    <FormInput value={name} id='name' onChange={onInputChange} name='name' label="Syllabus Name" isRequired />
                  </div>
                  <div>
                    <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                      Select Designers
                </label>
                    <Selector placeholder="Designers" list={designersList} onChange={() => console.log('')} />
                  </div>
                </div>
                <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
                  <div>
                    <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                      Select Sequence
                </label>
                    <Selector placeholder="Sequence" list={sequenceList} onChange={() => console.log('')} />
                  </div>
                  <div>
                    <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
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
                {messages.show ? (<div className="py-2 m-auto text-center">
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
              <div className="w-9/10 m-auto p-4">

                {/* Add new lesson section */}
                <div className="my-12 w-8/10 m-auto grid grid-cols-8 gap-x-4">
                  <div className="col-span-2">
                    <Selector list={sequenceList} placeholder="Select Sequence" onChange={() => console.log('')} />
                  </div>
                  <div className="col-span-5">
                    <Selector selectedItem={selecetedLesson.value} list={dropdownLessonsList} placeholder="Select Lesson" onChange={selectLesson} />
                  </div>
                  <div className="col-span-1">
                    <Buttons btnClass="ml-4 py-1" label="Add" onClick={addNewLesson} />
                  </div>
                </div>

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
                        <div className="w-3/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          <span>Type</span>
                        </div>
                        <div className="w-3/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          <span>Status</span>
                        </div>
                        <div className="w-2/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          <span>Actions</span>
                        </div>
                      </div>

                      <div className="max-h-88 overflow-y-auto">
                        {selectedLessonsList.map((item, index) => (
                          // Modify fileds property as required.

                          <div key={index} className="flex justify-between w-full px-8 py-4 whitespace-no-wrap border-b border-gray-200">
                            <div className="flex w-1/10 items-center px-8 py-3 text-left text-s leading-4">{index + 1}.</div>
                            <div className="flex w-3/10 items-center px-8 py-3 text-left text-s leading-4 font-medium ">
                              {item.name ? item.name : ''}
                            </div>
                            <div className="flex w-3/10 items-center px-8 py-3 text-left text-s text-gray-500 leading-4 font-medium ">
                              {item.type ? item.type : ''}
                            </div>
                            <div className="flex w-3/10 items-center px-8 py-3 text-left text-s text-gray-500 leading-4 font-medium ">
                              {item.status ? item.status : ''}
                            </div>
                            <span className="w-2/10 h-6 flex items-center text-left px-8 py-3 text-indigo-600 hover:text-indigo-900 cursor-pointer" onClick={() => editCurrentLesson(item.id)}>
                              edit
                      </span>
                          </div>
                        ))}

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
