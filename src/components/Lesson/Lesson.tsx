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
import moment from 'moment';

export interface ILessonSurveyApp {
  personLoading: boolean;
  personLessonData: PersonLessonsData | null;
  canContinue?: boolean;
  setPersonLessonData?: React.Dispatch<React.SetStateAction<PersonLessonsData | null>>;
  setPersonLoading?: React.Dispatch<React.SetStateAction<boolean>>;
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

  useEffect(() => {
    const data: PersonLessonsData[] = getLocalStorageData('lessonPersonData');
    if (isEmpty(personLessonData)) {
      const _personLessonData = data.find(
        (d: PersonLessonsData) => d.lessonID === lessonID
      );

      setPersonLessonData(_personLessonData);
      setPersonLoading(false);
    }
  }, []);

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
    validateRequired,
    setPersonLoading
  };

  /**
   * Lesson IDs
   * 531eafe6-61aa-4c82-b056-247b14be3035
   */

  const getAllStudentIds = async (nextToken?: string, outArray?: any) => {
    try {
      let combined: any;

      const universalLesson: any = await API.graphql(
        graphqlOperation(customQueries.listUniversalLessonStudentDatas, {
          nextToken: nextToken,
          filter: {
            hasExerciseData: {eq: true},
            lessonID: {eq: '531eafe6-61aa-4c82-b056-247b14be3035'}
          }
        })
      );
      const response = universalLesson.data.listUniversalLessonStudentData.items;
      const NextToken = universalLesson.data.listUniversalLessonStudentData.nextToken;

      combined = [...outArray, ...response];

      if (NextToken) {
        combined = await getAllStudentIds(NextToken, combined);
      }

      return combined;
    } catch (error) {}
  };

  const test = async () => {
    const res = await getAllStudentIds(null, []);
    const studentIdArr: any = [];
    const lessonPageIdArr: any = [];
    const roomIdArr: any = [];

    const duplicate: any = [];

    res.forEach((r: any) => {
      const dup = duplicate.find(
        (d: any) =>
          d.studentAuthID === r.studentAuthID &&
          d.roomID &&
          r.roomID &&
          d.lessonPageID &&
          r.lessonPageID
      );
      if (dup) {
        console.log('dup', {
          studentAuthID: r.studentAuthID,
          roomID: r.roomID,
          lessonPageID: r.lessonPageID
        });
      } else {
        duplicate.push(r);
      }
    });

    //
  };
  // useEffect(() => {
  //   test();
  // }, []);

  return (
    <>
      <Noticebar notifications={notifications} />
      {loaded ? isSurvey ? <SurveyApp {...props} /> : <LessonApp {...props} /> : null}
    </>
  );
};

export default React.memo(Lesson);
