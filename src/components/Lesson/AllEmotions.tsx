import {useGlobalContext} from '@contexts/GlobalContext';
import useAuth from '@customHooks/useAuth';
import useGraphqlQuery from '@customHooks/useGraphqlQuery';
import {ListSentimentTrackersQueryVariables, SentimentTracker} from 'API';
import React from 'react';
import TableBlock from './UniversalLessonBlockComponents/Blocks/TableBlock';

const mockData = [
  {
    id: '12323',
    value: 'Page',
    options: [
      {
        text: 'Intro',
        id: 'w323',
      },
      {
        text: 'Warm up',
        id: 'sd23e',
      },
    ],
  },
  {
    id: 'sdk923n',
    value: 'Name',
    options: [
      {
        text: 'peaceful',
        id: 'w3sfdf23',
      },
      {
        text: 'pressured',
        id: '334dkdn',
      },
    ],
  },
  {
    id: '434',
    value: 'Type',
    options: [
      {
        text: 'happy',
        id: 'fldm23',
      },
      {
        text: 'sad',
        id: '334dkddf3n',
      },
    ],
  },
];

const AllEmotions = ({lessonId}: {lessonId: string}) => {
  const {authId} = useAuth();
  const {data: allEmotions = [], isLoading} = useGraphqlQuery<
    ListSentimentTrackersQueryVariables,
    SentimentTracker[]
  >('listFeelingTrackers', {
    personAuthID: authId,
    filter: {syllabusLessonID: {eq: lessonId}},
  });

  const {
    state: {lessonPage: {theme: lessonPageTheme = 'dark', themeTextColor = ''} = {}},
  } = useGlobalContext();

  const themePlaceholderColor =
    lessonPageTheme === 'light' ? 'placeholder-gray-800' : 'text-gray-400';

  return (
    <div
      className={`w-full py-2 px-4  ${themeTextColor} mt-2 rounded-xl bg-gray-200 dark:bg-darker-gray ${themePlaceholderColor}`}>
      {isLoading && mockData && mockData.length === 0 ? (
        'Loading...'
      ) : (
        <TableBlock classString="blue-500 || white || dark" value={mockData} />
      )}
    </div>
  );
};

export default AllEmotions;
