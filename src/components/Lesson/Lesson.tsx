import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import Noticebar from '@components/Noticebar/Noticebar';
import {GlobalContext} from '@contexts/GlobalContext';
import useNotifications from '@customHooks/notifications';
import {setLocalStorageData} from '@utilities/localStorage';
import React, {useContext, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import * as customQueries from '../../customGraphql/customQueries';
import LessonApp from './LessonApp';
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
  const urlParams: any = useParams();

  // ##################################################################### //
  // ############################ LESSON FETCH ########################### //
  // ##################################################################### //
  const [loaded, setLoaded] = useState<boolean>(false);

  const getSyllabusLesson = async (lessonID?: string) => {
    try {
      const universalLesson: any = await API.graphql(
        graphqlOperation(customQueries.getUniversalLesson, {id: lessonID})
      );
      const response = universalLesson.data.getUniversalLesson;
      if (response) {
        const lessonPlan = response.lessonPlan.reduce((acc: any[], page: any) => {
          return [
            ...acc,
            {
              id: page.id,
              label: page.label
            }
          ];
        }, []);
        setLocalStorageData('lesson_plan', lessonPlan);
        lessonDispatch({type: 'SET_LESSON_DATA', payload: response});
        setLoaded(true);
      }
    } catch (e) {
      setLoaded(false);
      console.error('error getting lesson - ', lessonID, ' ', e);
    }
  };

  useEffect(() => {
    const {lessonID} = urlParams;
    if (lessonID) {
      lessonDispatch({
        type: 'SET_INITIAL_STATE',
        payload: {universalLessonID: lessonID}
      });
      getSyllabusLesson(lessonID).then((_: void) => {
        //
      });
    }
  }, []);

  // ~~~~~~~~~~~ CHECK IF SURVEY ~~~~~~~~~~~ //
  const isSurvey = lessonState && lessonState.lessonData?.type === 'survey';

  return (
    <>
      <Noticebar notifications={notifications} />
      {loaded ? (
        isSurvey ? (
          <SurveyApp getSyllabusLesson={getSyllabusLesson} />
        ) : (
          <LessonApp getSyllabusLesson={getSyllabusLesson} />
        )
      ) : null}
    </>
  );
};

export default React.memo(Lesson);
