import React, {useContext} from 'react';
import LessonApp from './LessonApp';
import Noticebar from '@components/Noticebar/Noticebar';
import useNotifications from '@customHooks/notifications';
import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import * as customQueries from '../../customGraphql/customQueries';
import * as customSubscriptions from '../../customGraphql/customSubscriptions';
import * as mutations from '../../graphql/mutations';
import * as queries from '../../graphql/queries';
import {setLocalStorageData} from '@utilities/localStorage';
import {GlobalContext} from '@contexts/GlobalContext';
import SurveyApp from './SurveyApp';

export interface ILessonSurveyApp {
  getSyllabusLesson: (lessonID?: string) => Promise<void>;
}

const Lesson = () => {
  // ~~~~~~~~~~ CONTEXT SEPARATION ~~~~~~~~~ //
  const gContext = useContext(GlobalContext);
  const lessonState = gContext.lessonState;
  const lessonDispatch = gContext.lessonDispatch;
  const {notifications} = useNotifications('lesson');

  // ##################################################################### //
  // ############################ LESSON FETCH ########################### //
  // ##################################################################### //

  const getSyllabusLesson = async (lessonID?: string) => {
    try {
      const universalLesson: any = await API.graphql(
        graphqlOperation(customQueries.getUniversalLesson, {id: lessonID})
      );
      const response = universalLesson.data.getUniversalLesson;
      const lessonPlan = response.lessonPlan.reduce((acc: any[], page: any) => {
        return [
          ...acc,
          {
            id: page.id,
            label: page.label,
          },
        ];
      }, []);
      setLocalStorageData('lesson_plan', lessonPlan);
      lessonDispatch({type: 'SET_LESSON_DATA', payload: response});
    } catch (e) {
      console.error('error getting lesson - ', lessonID, ' ', e);
    }
  };

  // ~~~~~~~~~~~ CHECK IF SURVEY ~~~~~~~~~~~ //
  const isSurvey = lessonState && lessonState.lessonData?.type === 'survey';

  return (
    <>
      <Noticebar notifications={notifications} />
      {isSurvey ? (
        <SurveyApp getSyllabusLesson={getSyllabusLesson} />
      ) : (
        <LessonApp getSyllabusLesson={getSyllabusLesson} />
      )}
    </>
  );
};

export default React.memo(Lesson);
