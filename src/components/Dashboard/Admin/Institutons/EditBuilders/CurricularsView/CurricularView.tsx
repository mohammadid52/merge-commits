import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {useEffect, useState} from 'react';
import {BiNotepad} from 'react-icons/bi';
import {FiUserCheck} from 'react-icons/fi';
import {HiPencil} from 'react-icons/hi';
import {MdSpeakerNotes} from 'react-icons/md';
import {useHistory, useLocation, useParams} from 'react-router';

import * as customQueries from 'customGraphql/customQueries';

import {languageList} from 'utilities/staticData';
import {createFilterToFetchSpecificItemsOnly} from 'utilities/strings';

import BreadCrums from 'atoms/BreadCrums';
import Modal from 'atoms/Modal';
import PageWrapper from 'atoms/PageWrapper';
import Tooltip from 'atoms/Tooltip';
import UnderlinedTabs from 'atoms/UnderlinedTabs';

import SectionTitleV3 from '@components/Atoms/SectionTitleV3';
import {RoomStatus} from 'API';
import {getAsset} from 'assets';
import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import EditCurricular from '../EditCurricular';
import CheckpointList from './TabsListing/CheckpointList';
import LearningObjective from './TabsListing/LearningObjective';
import SyllabusList from './TabsListing/SyllabusList';

interface CurricularViewProps {
  tabProps?: any;
}
interface InitialData {
  id: string;
  name: string;
  description: string;
  status: RoomStatus;
  summary: string;
  objectives: string;
  languages: {label: string; value: string}[];
  institute: {
    id: string;
    name: string;
    value: string;
  };
  image: string;
  syllabusList: any[];
  syllabusSequence: any[];
  type: string;
  designers: any[];
}

const CurricularView = (props: CurricularViewProps) => {
  const {tabProps} = props;

  const history = useHistory();
  const location = useLocation();

  const useQuery = () => {
    return new URLSearchParams(location.search);
  };
  const params = useQuery();
  const urlParams: any = useParams();
  const currID = params.get('id') || '';
  const institutionId = urlParams.institutionId;
  const initialData = {
    id: '',
    name: '',
    image: '',
    status: RoomStatus.ACTIVE,
    institute: {
      id: '',
      name: '',
      value: ''
    },
    syllabusList: [] as any,
    syllabusSequence: [] as any,
    description: '',
    summary: '',
    languages: [{label: 'English', value: 'EN'}],
    objectives: '',
    type: '',
    designers: [] as any
  };

  const [curricularModal, setCurricularModal] = useState(false);
  const [curricularData, setCurricularData] = useState<InitialData>(initialData);
  const [designersId, setDesignersID] = useState<any[]>([]);
  const [personsDataList, setPersonsDataList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const {clientKey, userLanguage, theme} = useGlobalContext();
  const themeColor = getAsset(clientKey, 'themeClassName');
  const {curricularviewdict, BreadcrumsTitles, EditCurriculardict} = useDictionary();

  const breadCrumsList = [
    {
      title: BreadcrumsTitles[userLanguage]['HOME'],
      href: '/dashboard',
      last: false
    },
    {
      title: BreadcrumsTitles[userLanguage]['INSTITUTION_MANAGEMENT'],
      href: '/dashboard/manage-institutions',
      last: false
    },
    {
      title: curricularData.institute?.name,
      href: `/dashboard/manage-institutions/institution/${institutionId}`,
      last: false
    },
    {
      title: BreadcrumsTitles[userLanguage]['CURRICULUM'],
      href: `/dashboard/manage-institutions/institution/${institutionId}/course`,
      last: false
    },
    {
      title: curricularData?.name,
      href: `/dashboard/manage-institutions/${institutionId}/curricular?id=${params.get(
        'id'
      )}`,
      last: true
    }
  ];
  const tabs = [
    {
      index: 0,
      title: curricularviewdict[userLanguage]['TAB']['LEARINGOBJECTIVE'],
      icon: <MdSpeakerNotes />,
      active: true,
      content: <LearningObjective curricularId={currID} institutionId={institutionId} />
    },
    {
      index: 1,
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
      )
    },
    {
      index: 2,
      title: curricularviewdict[userLanguage]['TAB']['INFORMATION'],
      icon: <FiUserCheck />,
      active: false,
      content: (
        <CheckpointList
          status={curricularData.status}
          curricularId={currID}
          institutionId={institutionId}
        />
      )
    }
  ];

  useEffect(() => {
    const tab = params.get('tab');

    if (tab) {
      tabProps.setTabsData({...tabProps.tabsData, instCurr: parseInt(tab)});
    }
  }, [params.get('tab')]);

  const updateTab = (tab: number) => {
    tabProps.setTabsData({...tabProps.tabsData, instCurr: tab});
  };

  const postUpdateDetails = (data: any) => {
    const savedLanguages = languageList.filter((item) =>
      data.languages?.includes(item.value)
    );
    setCurricularData({
      ...curricularData,
      id: data.id,
      name: data.name,
      image: data.image,
      institute: {
        id: data.institution.id,
        name: data.institution.name,
        value: data.institution.name
      },
      description: data.description,
      designers: data.designers,
      summary: data.summary,
      objectives: data.objectives,
      // syllabusList: data.syllabi?.items,
      syllabusList: data.universalSyllabus?.items,
      syllabusSequence: data.universalSyllabusSeq,
      type: data.type,
      languages: savedLanguages ? savedLanguages : []
    });
    setDesignersID(data?.designers);
    setCurricularModal(false);
  };

  const fetchCurricularData = async () => {
    const currID = params.get('id');
    if (currID) {
      setLoading(true);
      try {
        const result: any = await API.graphql(
          graphqlOperation(customQueries.getCurriculum, {id: currID})
        );
        const savedData = result.data.getCurriculum;
        const savedLanguages = languageList.filter((item) =>
          savedData.languages?.includes(item.value)
        );
        setCurricularData({
          ...curricularData,
          id: savedData.id,
          name: savedData.name,
          image: savedData.image,
          institute: {
            id: savedData.institution.id,
            name: savedData.institution.name,
            value: savedData.institution.name
          },
          description: savedData.description,
          designers: savedData.designers,
          summary: savedData.summary,
          objectives: savedData.objectives,
          // syllabusList: savedData.syllabi?.items,
          syllabusList: savedData.universalSyllabus?.items,
          syllabusSequence: savedData.universalSyllabusSeq,
          type: savedData.type,
          languages: savedLanguages ? savedLanguages : []
        });
        setDesignersID(savedData?.designers);
        setLoading(false);
      } catch (err) {
        console.error('Error while fetching curricular data.', err);
        setLoading(false);
      }
    } else {
      history.push('/dashboard/manage-institutions');
    }
  };
  const fetchPersonsData = async () => {
    const result: any = await API.graphql(
      graphqlOperation(customQueries.listPersons, {
        filter: {...createFilterToFetchSpecificItemsOnly(designersId, 'id')}
      })
    );
    const personsData = result.data.listPeople.items.map((person: any) => {
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

  const closeCurricularModal = () => {
    setCurricularModal(false);
  };

  const {name, institute, description, objectives, languages} = curricularData;
  return (
    <div>
      {/* Section Header */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitleV3
          title={curricularviewdict[userLanguage]['TITLE']}
          subtitle={curricularviewdict[userLanguage]['SUBTITLE']}
        />
      </div>

      {/* Body section */}
      <PageWrapper>
        <div className="h-9/10 flex flex-col md:flex-row">
          <div className="w-full">
            <div className="bg-white shadow-5 sm:rounded-lg mb-4">
              <div className="px-4 py-5 border-b-0 border-gray-200 sm:px-6 flex">
                <h3 className="text-lg flex items-center justify-center leading-6 font-medium text-gray-900">
                  {curricularviewdict[userLanguage]['HEADING']}
                  <Tooltip key={'id'} text={'Edit Curriculum Details'} placement="top">
                    <span
                      className={`w-auto cursor-pointer hover:${theme.textColor[themeColor]}`}>
                      <HiPencil
                        className="w-6 h-6 pl-2"
                        onClick={() => setCurricularModal(true)}
                      />
                    </span>
                  </Tooltip>
                </h3>
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
                              item.label +
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
      {curricularModal && (
        <Modal
          showHeader={true}
          title={EditCurriculardict[userLanguage]['TITLE']}
          showHeaderBorder={true}
          showFooter={false}
          closeAction={closeCurricularModal}>
          <EditCurricular
            curricularDetails={curricularData}
            postUpdateDetails={postUpdateDetails}
            closeAction={closeCurricularModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default CurricularView;
