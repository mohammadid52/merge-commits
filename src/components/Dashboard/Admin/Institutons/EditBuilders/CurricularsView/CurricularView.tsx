import React, { useEffect, useState } from 'react'
import API, { graphqlOperation } from '@aws-amplify/api';
import { useLocation, useHistory, useRouteMatch } from 'react-router';
import { IoArrowUndoCircleOutline, IoSpeedometerSharp } from 'react-icons/io5';
import { BiNotepad } from 'react-icons/bi';
import { MdSpeakerNotes } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';

import * as queries from '../../../../../../graphql/queries';
import * as customQueries from '../../../../../../customGraphql/customQueries';

import { languageList } from '../../../../../../utilities/staticData';
import { createFilterToFetchSpecificItemsOnly } from '../../../../../../utilities/strings';
import BreadCrums from '../../../../../Atoms/BreadCrums';
import SectionTitle from '../../../../../Atoms/SectionTitle';
import Buttons from '../../../../../Atoms/Buttons';
import PageWrapper from '../../../../../Atoms/PageWrapper';
import UnderlinedTabs from '../../../../../Atoms/UnderlinedTabs';
import SyllabusList from './TabsListing/SyllabusList';
import TopicsList from './TabsListing/TopicsList';
import MeasMntList from './TabsListing/MeasMntList';
import LearningObjectiveList from './TabsListing/learningObjective'
interface CurricularViewProps {
  tabProps?: any
}
interface InitialData {
  id: string,
  name: string,
  description: string,
  objectives: string,
  languages: { id: string, name: string, value: string }[],
  institute: {
    id: string,
    name: string,
    value: string
  },
  syllabusList: any[]
}
const CurricularView = (props: CurricularViewProps) => {
  const { tabProps } = props;

  const match = useRouteMatch();
  const history = useHistory();
  const location = useLocation();
  const pathName = location.pathname.replace(/\/$/, "");
  const currentPath = pathName.substring(pathName.lastIndexOf('/') + 1);

  const useQuery = () => {
    return new URLSearchParams(location.search);
  };
  const params = useQuery();
  const currID = params.get('id');

  const initialData = {
    id: '',
    name: '',
    institute: {
      id: '',
      name: '',
      value: ''
    },
    syllabusList: [] as any,
    description: '',
    languages: [{ id: '1', name: "English", value: 'EN' }],
    objectives: '',
  }

  const [curricularData, setCurricularData] = useState<InitialData>(initialData);
  const [designersId, setDesignersID] = useState([]);
  const [designersName, setDesignersName] = useState([]);
  const [personsDataList, setPersonsDataList] = useState([]);

  const breadCrumsList = [
    { title: 'Home', url: '/dashboard', last: false },
    { title: 'Curricular Info', url: `/dashboard/manage-institutions/curricular?id=${params.get('id')}`, last: true }
  ]
  const tabs = [
    { index: 0, title: 'Learning objectives', icon: <MdSpeakerNotes />, active: true, content: <LearningObjectiveList curricularId={currID} /> },
    { index: 1, title: 'Topics', icon: <MdSpeakerNotes />, active: false, content: <TopicsList curricularId={currID} /> },
    { index: 2, title: 'Measurements', icon: <IoSpeedometerSharp />, active: false, content: <MeasMntList curricularId={currID} /> },
    { index: 3, title: 'Syllabus', icon: <BiNotepad />, active: false, content: <SyllabusList syllabusList={curricularData.syllabusList} curricularId={currID} /> },
  ]

  const updateTab = (tab: number) => {
    tabProps.setTabsData({...tabProps.tabsData, instCurr: tab})
  }

  const fetchCurricularData = async () => {
    const currID = params.get('id');
    if (currID) {
      try {
        const result: any = await API.graphql(graphqlOperation(customQueries.getCurriculum, { id: currID }))
        const savedData = result.data.getCurriculum;
        const savedLanguages = languageList.filter(item => savedData.languages?.includes(item.value))
        setCurricularData({
          ...curricularData,
          id: savedData.id,
          name: savedData.name,
          institute: {
            id: savedData.institution.id,
            name: savedData.institution.name,
            value: savedData.institution.name,
          },
          description: savedData.description,
          objectives: savedData.objectives,
          syllabusList: savedData.syllabi?.items,
          languages: savedLanguages ? savedLanguages : []
        });
        setDesignersID(savedData?.designers);
      } catch (err) {
        console.log(err)
        console.log('Error while fetching curricular data.')
      }
    } else {
      history.push('/dashboard/manage-institutions')
    }
  }
  const fetchPersonsData = async () => {
    const result: any = await API.graphql(graphqlOperation(customQueries.listPersons, {
      filter: { ...createFilterToFetchSpecificItemsOnly(designersId, 'id') },
    }))
    const personsData = result.data.listPersons.items.map((person: any) => {
      const name = `${person.firstName || ''} ${person.lastName || ''}`
      return name;
    })
    setPersonsDataList(personsData);
  }

  useEffect(() => {
    fetchCurricularData();
  }, [])

  useEffect(() => {
    if (designersId && designersId.length > 0) {
      fetchPersonsData();
    }
  }, [designersId])

  const { name, institute, description, objectives, languages } = curricularData;
  return (
    <div className="w-9/10 h-full mt-4 p-4">

      {/* Section Header */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle title="Curricular Info" subtitle="Curricular information" />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons btnClass="mr-4" onClick={history.goBack} Icon={IoArrowUndoCircleOutline} />
          {currentPath !== 'edit' ? (
            <Buttons btnClass="mr-4" onClick={() => history.push(`${match.url}/edit?id=${params.get('id')}`)} Icon={FaEdit} />
          ) : null
          }
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

              <div className="grid grid-cols-2 divide-x divide-gray-400 p-4">
                <div className="p-8">
                  <p className="text-base leading-5 font-medium text-gray-500 my-3 flex">
                    <span className="text-gray-900 mr-2 w-3/10">Curriculum Name:</span>
                    <span className="w-auto">
                      {name || '--'}
                    </span>
                  </p>
                  <p className="text-base leading-5 font-medium text-gray-500 my-3 flex">
                    <span className="text-gray-900 mr-2 w-3/10">Institution Owner:</span>
                    <span className="w-auto">{institute.name || '--'}</span>
                  </p>
                  <p className="text-base leading-5 font-medium text-gray-500 my-3 flex">
                    <span className="text-gray-900 mr-2 w-3/10">Description:</span>
                    <span className="w-7/10">
                      {description || '--'}
                    </span>
                  </p>
                </div>
                <div className="p-8">
                  <p className="text-base leading-5 font-medium text-gray-500 my-3 flex">
                    <span className="text-gray-900 mr-2 w-3/10">Designers:</span>
                    <span className="w-auto">
                      {personsDataList && personsDataList.length > 0 ? (
                        personsDataList.map((person, i) => `${person} ${(i === personsDataList.length - 1) ? '.' : ','}`)
                      ) : '--'
                      }
                    </span>
                  </p>
                  <p className="text-base leading-5 font-medium text-gray-500 my-3 flex">
                    <span className="text-gray-900 mr-2 w-3/10">Languages:</span>
                    <span className="w-auto">{
                      languages && languages.length > 0 ? (
                        languages.map((item, index) => (item.name + `${languages.length - 1 === index ? '.' : ',' + ' '}`))
                      ) : '--'}</span>
                  </p>
                  <p className="text-base leading-5 font-medium text-gray-500 my-3 flex">
                    <span className="text-gray-900 mr-2 w-3/10">Objective:</span>
                    <span className="w-7/10">
                      {objectives?.length ? objectives[0] : '--'}
                    </span>
                  </p>
                </div>
              </div>

            </div>
            <div className='bg-white shadow-5 sm:rounded-lg'>
              <div className='px-4 py-5 sm:px-6'>
                <UnderlinedTabs tabs={tabs} activeTab={tabProps.tabsData.instCurr} updateTab={updateTab} />
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  )
}

export default CurricularView
