import {useGlobalContext} from '@contexts/GlobalContext';
import useAuth from '@customHooks/useAuth';
import useGraphqlQuery from '@customHooks/useGraphqlQuery';
import {ListSentimentTrackersQueryVariables, SentimentTracker} from 'API';
import React from 'react';

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
      {isLoading && allEmotions && allEmotions.length === 0
        ? 'Loading...'
        : allEmotions.map((item) => <p>{item.sentimentName}</p>)}
    </div>
  );
};

export default AllEmotions;
