import React, { useContext, useEffect, useState } from 'react';
import API, { graphqlOperation } from '@aws-amplify/api';
import { useLocation, useHistory, useRouteMatch, useParams } from 'react-router';
import { IoArrowUndoCircleOutline } from 'react-icons/io5';
import { BiNotepad } from 'react-icons/bi';
import { MdSpeakerNotes } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';
import { FiUserCheck } from 'react-icons/fi';

import * as customQueries from '../../../../../../customGraphql/customQueries';

import { languageList } from '../../../../../../utilities/staticData';
import { createFilterToFetchSpecificItemsOnly } from '../../../../../../utilities/strings';

import BreadCrums from '../../../../../Atoms/BreadCrums';
import SectionTitle from '../../../../../Atoms/SectionTitle';
import Buttons from '../../../../../Atoms/Buttons';
import PageWrapper from '../../../../../Atoms/PageWrapper';
import UnderlinedTabs from '../../../../../Atoms/UnderlinedTabs';

import SyllabusList from './TabsListing/SyllabusList';
import LearningObjective from './TabsListing/LearningObjective';
import CheckpointList from './TabsListing/CheckpointList';
import { GlobalContext } from '../../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../../customHooks/dictionary';
import { goBackBreadCrumb } from '../../../../../../utilities/functions';

interface CurricularViewProps {
  tabProps?: any;
}
interface InitialData {
  id: string;
  name: string;
  description: string;
  objectives: string;
  languages: { id: string; name: string; value: string }[];
  institute: {
    id: string;
    name: string;
    value: string;
  };
  syllabusList: any[];
  syllabusSequence: any[];
}

const CurricularView = (props: CurricularViewProps) => {
  const { tabProps } = props;

  const match = useRouteMatch();
  const history = useHistory();
  const location = useLocation();
  const pathName = location.pathname.replace(/\/$/, '');
  const currentPath = pathName.substring(pathName.lastIndexOf('/') + 1);

  const useQuery = () => {
    return new URLSearchParams(location.search);
  };
  const params = useQuery();
  const urlParams: any = useParams();
  const currID = params.get('id');
  const institutionId = urlParams.institutionId;
  const initialData = {
    id: '',
    name: '',
    institute: {
      id: '',
      name: '',
      value: '',
    },
    syllabusList: [] as any,
    syllabusSequence: [] as any,
    description: '',
    languages: [{ id: '1', name: 'English', value: 'EN' }],
    objectives: '',
  };

  const [curricularData, setCurricularData] = useState<InitialData>(initialData);
  const [designersId, setDesignersID] = useState([]);
  const [personsDataList, setPersonsDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { clientKey, userLanguage, theme } = useContext(GlobalContext);
  const { curricularviewdict, BreadcrumsTitles } = useDictionary(clientKey);

  const breadCrumsList = [
    {title: BreadcrumsTitles[userLanguage]['HOME'], url: '/dashboard', last: false},
    {
      title: BreadcrumsTitles[userLanguage]['INSTITUTION_MANAGEMENT'],
      url: '/dashboard/manage-institutions',
      last: false,
    },
    {
      title: curricularData.institute?.name,
      url: `/dashboard/manage-institutions/institution?id=${institutionId}`,
      last: false,
    },
    {
      title: curricularData?.name,
      url: `/dashboard/manage-institutions/${institutionId}/curricular?id=${params.get(
        'id'
      )}`,
      last: true,
    },
  ];
  const tabs = [
    {
      index: 0,
      title: curricularviewdict[userLanguage]['TAB']['UNIT'],
      icon: <BiNotepad />,
      active: false,
      content: (
        <SyllabusList
          curricularId={currID}
          institutionId={institutionId}
          loading={loading}
          syllabusList={curricularData.syllabusList}
          syllabusSequence={curricularData.syllabusSequence}
        />
      ),
    },
    {
      index: 1,
      title: curricularviewdict[userLanguage]['TAB']['LEARINGOBJECTIVE'],
      icon: <MdSpeakerNotes />,
      active: true,
      content: <LearningObjective curricularId={currID} institutionId={institutionId} />,
    },
    {
      index: 2,
      title: curricularviewdict[userLanguage]['TAB']['INFORMATION'],
      icon: <FiUserCheck />,
      active: false,
      content: <CheckpointList curricularId={currID} institutionId={institutionId} />,
    },
  ];

  const updateTab = (tab: number) => {
    tabProps.setTabsData({ ...tabProps.tabsData, instCurr: tab });
  };

  const fetchCurricularData = async () => {
    const currID = params.get('id');
    if (currID) {
      setLoading(true);
      try {
        const result: any = await API.graphql(graphqlOperation(customQueries.getCurriculum, { id: currID }));
        const savedData = result.data.getCurriculum;
        const savedLanguages = languageList.filter((item) => savedData.languages?.includes(item.value));
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
          // syllabusList: savedData.syllabi?.items,
          syllabusList: savedData.universalSyllabus?.items,
          syllabusSequence: savedData.universalSyllabusSeq,
          languages: savedLanguages ? savedLanguages : [],
        });
        setDesignersID(savedData?.designers);
        setLoading(false);
      } catch (err) {
        console.log(err);
        console.log('Error while fetching curricular data.');
        setLoading(false);
      }
    } else {
      history.push('/dashboard/manage-institutions');
    }
  };
  const fetchPersonsData = async () => {
    const result: any = await API.graphql(
      graphqlOperation(customQueries.listPersons, {
        filter: { ...createFilterToFetchSpecificItemsOnly(designersId, 'id') },
      })
    );
    const personsData = result.data.listPersons.items.map((person: any) => {
      const name = `${person.firstName || ''} ${person.lastName || ''}`;
      return name;
    });
    setPersonsDataList(personsData);
  };

  useEffect(() => {
    fetchCurricularData();
  }, []);

  useEffect(() => {
    if (designersId && designersId.length > 0) {
      fetchPersonsData();
    }
  }, [designersId]);

  const { name, institute, description, objectives, languages } = curricularData;
  return (
    <div>
      {/* Section Header */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle
          title={curricularviewdict[userLanguage]['TITLE']}
          subtitle={curricularviewdict[userLanguage]['SUBTITLE']}
        />
        {/* <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons
            label="Go Back"
            btnClass="mr-4"
            onClick={() => goBackBreadCrumb(breadCrumsList, history)}
            Icon={IoArrowUndoCircleOutline}
          />
          {currentPath !== 'edit' ? (
            <Buttons
              btnClass="mr-4 px-6"
              label="Edit"
              onClick={() =>
                history.push(
                  `/dashboard/manage-institutions/${institutionId}/curricular/edit?id=${params.get(
                    'id'
                  )}`
                )
              }
              Icon={FaEdit}
            />
          ) : null}
        </div> */}
      </div>

      {/* Body section */}
      <PageWrapper>
        <div className="h-9/10 flex flex-col md:flex-row">
          <div className="w-full">
            <div className="bg-white shadow-5 sm:rounded-lg mb-4">
              <div className="px-4 py-5 border-b-0 border-gray-200 sm:px-6 flex">
                <h3 className="text-lg flex items-center justify-center leading-6 font-medium text-gray-900">
                  {curricularviewdict[userLanguage]['HEADING']}
                </h3>
                {currentPath !== 'edit' ? (
                  <Buttons
                    btnClass="px-6 py-1"
                    label="Edit"
                    onClick={() =>
                      history.push(
                        `/dashboard/manage-institutions/${institutionId}/curricular/edit?id=${params.get(
                          'id'
                        )}`
                      )
                    }
                    Icon={FaEdit}
                  />
                ) : null}
              </div>

              <div className="grid grid-cols-2 divide-x-0 divide-gray-400 p-4">
                <div className="p-8">
                  <p className="text-base leading-5 font-medium text-gray-500 my-3 flex">
                    <span className="text-gray-900 mr-2 w-3/10">
                      {curricularviewdict[userLanguage]['NAME']}:
                    </span>
                    <span className="w-auto">{name || '--'}</span>
                  </p>
                  <p className="text-base leading-5 font-medium text-gray-500 my-3 flex">
                    <span className="text-gray-900 mr-2 w-3/10">
                      {curricularviewdict[userLanguage]['OWNER']}:
                    </span>
                    <span className="w-auto">{institute.name || '--'}</span>
                  </p>
                  <p className="text-base leading-5 font-medium text-gray-500 my-3 flex">
                    <span className="text-gray-900 mr-2 w-3/10">
                      {curricularviewdict[userLanguage]['DESCRIPTION']}:
                    </span>
                    <span className="w-7/10">{description || '--'}</span>
                  </p>
                </div>
                <div className="p-8">
                  <p className="text-base leading-5 font-medium text-gray-500 my-3 flex">
                    <span className="text-gray-900 mr-2 w-3/10">
                      {curricularviewdict[userLanguage]['DESIGNER']}:
                    </span>
                    <span className="w-auto">
                      {personsDataList && personsDataList.length > 0
                        ? personsDataList.map(
                            (person, i) =>
                              `${person} ${i === personsDataList.length - 1 ? '.' : ','}`
                          )
                        : '--'}
                    </span>
                  </p>
                  <p className="text-base leading-5 font-medium text-gray-500 my-3 flex">
                    <span className="text-gray-900 mr-2 w-3/10">
                      {curricularviewdict[userLanguage]['LANGUAGE']}:
                    </span>
                    <span className="w-auto">
                      {languages && languages.length > 0
                        ? languages.map(
                            (item, index) =>
                              item.name +
                              `${languages.length - 1 === index ? '.' : ',' + ' '}`
                          )
                        : '--'}
                    </span>
                  </p>
                  <p className="text-base leading-5 font-medium text-gray-500 my-3 flex">
                    <span className="text-gray-900 mr-2 w-3/10">
                      {curricularviewdict[userLanguage]['OBJECTIVE']}:
                    </span>
                    <span className="w-7/10">
                      {objectives?.length ? objectives[0] : '--'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white shadow-5 sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <UnderlinedTabs
                  tabs={tabs}
                  activeTab={tabProps.tabsData.instCurr}
                  updateTab={updateTab}
                />
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
};

export default CurricularView;
