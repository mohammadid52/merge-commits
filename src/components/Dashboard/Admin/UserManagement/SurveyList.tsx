import SearchInput from '@components/Atoms/Form/SearchInput';
import Loader from '@components/Atoms/Loader';
import {useGlobalContext} from '@contexts/GlobalContext';
import useGraphqlQuery from '@customHooks/useGraphqlQuery';
import {setLocalStorageData} from '@utilities/localStorage';
import {ListPersonLessonsDataQuery, PersonLessonsData} from 'API';
import moment from 'moment';
import React, {useEffect, useState} from 'react';

const SurveyList = ({
  studentAuthID,
  studentEmail
}: {
  studentEmail: string;
  studentAuthID: string;
}) => {
  const {state} = useGlobalContext();
  const roomData = state?.temp?.roomData;
  const roomIdFilter = roomData?.map((room: any) => ({
    roomId: {eq: room.id}
  }));

  const {data, isLoading, isFetched, isSuccess, isError, error} = useGraphqlQuery<
    any,
    ListPersonLessonsDataQuery['listPersonLessonsData']['items']
  >(
    'listPersonLessonsData',
    {
      filter: {
        or: roomIdFilter,
        studentAuthID: {eq: studentAuthID},
        studentEmail: {eq: studentEmail},
        lessonType: {eq: 'survey'},
        isCompleted: {eq: true}
      }
    },
    {
      enabled: roomData?.length > 0,
      custom: true,
      onSuccess: (data) => setSurveyList(data)
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

  return (
    <div className="overflow-x-auto">
      <div className="align-middle inline-block min-w-full">
        {isLoading && (
          <div className="overflow-hidden">
            <Loader />
          </div>
        )}
        {!isLoading && isFetched && isError && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        {!isLoading && isFetched && data.length === 0 && (
          <p className="text-gray-500 text-sm text-center">No completed surveys found</p>
        )}
        {haveData && (
          <SearchInput
            value={searchInput}
            onChange={(str) => setSearchInput(str)}
            onKeyDown={searchSurveyFromList}
            closeAction={removeSearchAction}
            style={`mr-4 w-full`}
          />
        )}
        {haveData ? (
          <div className="mt-8 overflow-hidden border-b-0 border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 w-auto text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Survey Name
                  </th>
                  {/* <th
                    scope="col"
                    className="px-6 py-3 w-auto text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Institution
                  </th> */}
                  <th
                    scope="col"
                    className="px-6 py-3 w-auto text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Completed At
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 w-auto text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {surveyList &&
                  surveyList.map((survey, idx: number) => {
                    return (
                      <tr
                        key={`${survey.id}_${idx}`}
                        className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                        <td className="px-6 py-4 w-auto whitespace-nowrap text-sm text-gray-500">
                          {survey?.lesson?.title}
                        </td>
                        <td className="px-6 py-4 w-auto whitespace-nowrap text-sm text-gray-500">
                          {moment(survey.updatedAt).format('DD/MM/YYYY')}
                        </td>
                        <td className="px-6 py-4 w-auto whitespace-nowrap text-sm text-gray-500">
                          <a
                            href={`/lesson/${survey.lessonID}/0?sId=${studentAuthID}&sEmail=${studentEmail}`}
                            className="iconoclast:text-main curate:text-main hover:underline">
                            View survey
                          </a>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SurveyList;
