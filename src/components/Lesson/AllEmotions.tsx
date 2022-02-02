import Loader from '@components/Atoms/Loader';
import {useGlobalContext} from '@contexts/GlobalContext';
import useAuth from '@customHooks/useAuth';
import useGraphqlQuery from '@customHooks/useGraphqlQuery';
import {FeelingsArchive, ListFeelingsArchivesQueryVariables} from 'API';
import moment from 'moment';
import {nanoid} from 'nanoid';
import React from 'react';
import TableBlock from './UniversalLessonBlockComponents/Blocks/TableBlock';

const AllEmotions = ({lessonId}: {lessonId: string}) => {
  const {authId, isStudent} = useAuth();
  const {data = [], isLoading} = useGraphqlQuery<
    ListFeelingsArchivesQueryVariables,
    FeelingsArchive[]
  >(
    'listFeelingsArchives',
    {
      filter: {personAuthID: {eq: authId}, lessonID: {eq: lessonId}},
    },
    {custom: true}
  );

  const {
    state: {lessonPage: {theme: lessonPageTheme = 'dark', themeTextColor = ''} = {}},
    lessonState,
  } = useGlobalContext();

  const PAGES = isStudent ? lessonState?.lessonData?.lessonPlan : null;

  const pageColumn = {
    id: nanoid(24),
    value: 'Page',
    options: data.map((em) => {
      const pageId: number =
        Number(em.sentimentType) >= 0 ? Number(em.sentimentType) : null;

      const text =
        pageId !== null
          ? !em?.lesson || isStudent
            ? PAGES[pageId].title
            : em?.lesson?.lessonPlan[pageId].label
          : 'unknown';
      return {
        id: nanoid(24),
        text,
      };
    }),
  };

  const nameColumn = {
    id: nanoid(24),
    value: 'Emotion Name',
    options: data.map((em) => {
      const [emoji = ''] = em.sentimentId.split('-');
      return {
        id: nanoid(24),
        text: `${emoji} ${em.sentimentName}`,
      };
    }),
  };

  const timeColumn = {
    id: nanoid(24),
    value: 'Time',
    options: data.map((em) => ({
      id: nanoid(24),
      text: moment(em.createdAt).format('ll LT'),
    })),
  };

  const themePlaceholderColor =
    lessonPageTheme === 'light' ? 'placeholder-gray-800' : 'text-gray-400';

  return (
    data &&
    data.length > 0 && (
      <div
        className={`w-full py-2 px-4  ${themeTextColor} mt-2 rounded-xl bg-gray-200 dark:bg-darker-gray ${themePlaceholderColor}`}>
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader color="#fff" />
          </div>
        ) : (
          <TableBlock
            classString="blue-500 || white || dark"
            value={[pageColumn, nameColumn, timeColumn]}
          />
        )}
      </div>
    )
  );
};

export default AllEmotions;
