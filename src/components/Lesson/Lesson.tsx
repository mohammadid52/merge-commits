import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import Noticebar from 'components/Noticebar/Noticebar';
import {GlobalContext} from 'contexts/GlobalContext';
import useNotifications from 'customHooks/notifications';
import {getLocalStorageData, setLocalStorageData} from 'utilities/localStorage';
import React, {useContext, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import * as customQueries from 'customGraphql/customQueries';
import LessonApp from './LessonApp';
import SurveyApp from './SurveyApp';
import {PersonLessonsData} from 'API';
import {isEmpty} from 'lodash';

export interface ILessonSurveyApp {
  personLoading: boolean;
  personLessonData: PersonLessonsData | null;
  setPersonLessonData?: React.Dispatch<React.SetStateAction<PersonLessonsData | null>>;
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

  const {lessonID} = urlParams;
  useEffect(() => {
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

  const [personLessonData, setPersonLessonData] = useState<PersonLessonsData | null>(
    null
  );
  const [personLoading, setPersonLoading] = useState(true);

  const data: PersonLessonsData[] = getLocalStorageData('lessonPersonData');

  useEffect(() => {
    if (isEmpty(personLessonData)) {
      setPersonLessonData(data.find((d) => d.lessonID === lessonID));
      setPersonLoading(false);
    }
  }, [data]);

  // ~~~~~~~~~~~ CHECK IF SURVEY ~~~~~~~~~~~ //
  const isSurvey = lessonState && lessonState.lessonData?.type === 'survey';

  return (
    <>
      <Noticebar notifications={notifications} />
      {loaded ? (
        isSurvey ? (
          <SurveyApp
            setPersonLessonData={setPersonLessonData}
            personLoading={personLoading}
            personLessonData={personLessonData}
          />
        ) : (
          <LessonApp
            setPersonLessonData={setPersonLessonData}
            personLoading={personLoading}
            personLessonData={personLessonData}
          />
        )
      ) : null}
    </>
  );
};

export default React.memo(Lesson);
