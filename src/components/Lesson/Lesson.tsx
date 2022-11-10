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
import {StudentPageInput} from '@interfaces/UniversalLessonInterfaces';

export interface ILessonSurveyApp {
  personLoading: boolean;
  personLessonData: PersonLessonsData | null;
  canContinue?: boolean;
  setPersonLessonData?: React.Dispatch<React.SetStateAction<PersonLessonsData | null>>;
  invokeRequiredField?: () => void;
  validateRequired?: (pageIdx: number) => boolean;
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
      const _personLessonData = data.find(
        (d: PersonLessonsData) => d.lessonID === lessonID
      );

      setPersonLessonData(_personLessonData);
      setPersonLoading(false);
    }
  }, [data]);

  // ~~~~~~~~~~~ CHECK IF SURVEY ~~~~~~~~~~~ //
  const isSurvey = lessonState && lessonState.lessonData?.type === 'survey';

  const PAGES = lessonState.lessonData.lessonPlan;

  const invokeRequiredField = () => {
    const domID = getFirstEmptyFieldDomId();

    if (domID && typeof domID === 'string') {
      const domElement = document.getElementById(`${domID}_for_error`);
      if (domElement) {
        domElement.scrollIntoView({behavior: 'smooth', block: 'center'});
      }
    }
  };

  const validateRequired = (pageIdx: number) => {
    if (PAGES) {
      const thisPageData = lessonState?.studentData || [];
      const thisPageRequired = lessonState?.requiredInputs[pageIdx] || [];

      if (thisPageData && thisPageData.length > 0) {
        const areAnyEmpty = thisPageData.filter((input: StudentPageInput) => {
          if (thisPageRequired.includes(input.domID) && input.input[0] === '') {
            return input;
          }
        });

        if (areAnyEmpty.length > 0) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    } else {
      return false;
    }
  };
  const getFirstEmptyFieldDomId = (): any => {
    if (PAGES) {
      const thisPageData = lessonState?.studentData || [];
      const thisPageRequired = lessonState?.requiredInputs[lessonState.currentPage] || [];

      if (thisPageData && thisPageData.length > 0) {
        const areAnyEmpty = thisPageData.filter((input: StudentPageInput) => {
          if (thisPageRequired.includes(input.domID) && input.input[0] === '') {
            return input;
          }
        });

        if (areAnyEmpty.length > 0) {
          return areAnyEmpty[0].domID;
        } else {
          return true;
        }
      } else {
        return true;
      }
    } else {
      return false;
    }
  };

  const canContinue = () => {
    if (PAGES) {
      return (
        validateRequired(lessonState.currentPage) &&
        lessonState.currentPage <= PAGES.length - 1
      );
    } else {
      return false;
    }
  };

  const props = {
    personLessonData,
    invokeRequiredField,
    setPersonLessonData,
    personLoading,
    canContinue: canContinue(),
    validateRequired
  };

  return (
    <>
      <Noticebar notifications={notifications} />
      {loaded ? isSurvey ? <SurveyApp {...props} /> : <LessonApp {...props} /> : null}
    </>
  );
};

export default React.memo(Lesson);
