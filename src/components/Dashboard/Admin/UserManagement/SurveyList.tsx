import SearchInput from '@components/Atoms/Form/SearchInput';
import Highlighted from '@components/Atoms/Highlighted';
import {SEARCH_LIMIT} from '@components/Lesson/constants';
import Table, {ITableProps} from '@components/Molecules/Table';
import {useGlobalContext} from '@contexts/GlobalContext';
import useGraphqlQuery from '@customHooks/useGraphqlQuery';
import {listPersonLessonsData} from '@graphql/queries';
import {setLocalStorageData} from '@utilities/localStorage';
import {PersonLessonsData} from 'API';
import {map} from 'lodash';
import {useEffect, useState} from 'react';

const SurveyList = ({
  studentAuthID,
  studentEmail
}: {
  studentEmail: string;
  insideModalPopUp?: boolean;
  studentAuthID: string;
}) => {
  const {state} = useGlobalContext();
  const roomData = (state?.temp?.roomData || []).filter(Boolean);

  const roomIdFilter = roomData?.map((room: any) => ({
    roomId: {eq: room.id}
  }));

  const {data, isLoading, isFetched} = useGraphqlQuery<any, PersonLessonsData[]>(
    listPersonLessonsData,
    {
      limit: SEARCH_LIMIT,
      filter: {
        or: roomIdFilter,
        studentAuthID: {eq: studentAuthID},
        studentEmail: {eq: studentEmail},
        lessonType: {eq: 'survey'},
        isCompleted: {eq: true}
      }
    },
    {
      enabled: roomData?.length > 0 && roomIdFilter?.length > 0,
      onSuccess: (data) => setSurveyList(data),
      loopOnNextToken: true
    }
  );

  const updateUrlForRedirect = () => {
    // add this to localstorage
    setLocalStorageData('survey_redirect', location.pathname);
  };

  useEffect(() => {
    updateUrlForRedirect();
  }, []);

  // fetch all rooms for this student first
  // map all lessons/surveys from rooms
  // filter only surveys
  // check if they are completed
  // if its completed, show it in the list

  const [surveyList, setSurveyList] = useState<PersonLessonsData[]>([]);
  const [searchInput, setSearchInput] = useState('');

  const haveData = !isLoading && isFetched && data.length > 0;

  const removeSearchAction = () => {
    setSearchInput('');
  };

  const searchSurveyFromList = () => {
    const searchedData = data.filter((survey: PersonLessonsData) => {
      return survey?.lesson?.title?.toLowerCase().includes(searchInput.toLowerCase());
    });

    setSurveyList(searchedData);
  };

  const dataList = map(surveyList, (survey, idx) => ({
    no: idx + 1,
    onClick: () => {},
    surveyName: <Highlighted text={survey?.lesson?.title} highlight={searchInput} />,
    classroom: survey?.room?.name,
    completedAt: new Date(survey.updatedAt).toLocaleDateString(),
    actions: (
      <a
        href={`/lesson/${survey.lessonID}/0?sId=${studentAuthID}&sEmail=${studentEmail}&tab=Completed%20Surveys`}
        className="iconoclast:text-main curate:text-main hover:underline">
        View survey
      </a>
    )
  }));

  const tableConfig: ITableProps = {
    headers: ['No', 'Survey Name', 'Classroom', 'Completed At', 'Actions'],
    dataList,
    config: {
      dataList: {
        loading: isLoading
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="align-middle inline-block min-w-full">
        {haveData && (
          <SearchInput
            value={searchInput}
            onChange={(str) => setSearchInput(str)}
            onKeyDown={searchSurveyFromList}
            closeAction={removeSearchAction}
          />
        )}

        <Table {...tableConfig} />
      </div>
    </div>
  );
};

export default SurveyList;
