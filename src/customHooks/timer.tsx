import {useContext, useEffect, useState} from 'react';
import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import * as mutations from '../graphql/mutations';
import {Auth} from '@aws-amplify/auth';
import {GlobalContext} from '../contexts/GlobalContext';
import {getLocalStorageData} from '../utilities/localStorage';
import {filterData} from '../utilities/UploadArchiveData';
import {PartInput} from 'API';

const useStudentTimer = () => {
  const {state, dispatch, lessonState, lessonDispatch} = useContext(GlobalContext);

  const getRoomData = getLocalStorageData('room_info');

  // ##################################################################### //
  // ###################### TEACHER VIEWING TRIGGER ###################### //
  // ##################################################################### //

  const [iAmViewed, setiAmViewed] = useState<boolean>(false);

  const viewingLogic = async () => {
    const user = await Auth.currentAuthenticatedUser();
    const authId = user.attributes.sub;

    if (lessonState.studentViewing && lessonState.studentViewing === authId) {
      if (!iAmViewed) {
        setiAmViewed(true);
      }
    }
    if (lessonState.studentViewing !== authId) {
      if (iAmViewed) {
        setiAmViewed(false);
      }
    }
  };

  useEffect(() => {
    viewingLogic();
  }, [lessonState.studentViewing, state.user.authId]);

  // ##################################################################### //
  // ###################### SAVE TIMERS & TRIGGERING ##################### //
  // ##################################################################### //
  const [activityTimeout, setactivityTimeout] = useState<any>();
  const [savePending, setSavePending] = useState<boolean>(false);

  // ~~~~~~~~~~~ CHECK IF SURVEY ~~~~~~~~~~~ //
  const isSurvey = lessonState && lessonState.lessonData?.type === 'survey';

  // save intervals
  const VIEWED_INTERVAL = 2000;
  const STANDARD_INTERVAL = 1500;
  const SURVEY_INTERVAL = 100;

  useEffect(() => {
    if (lessonState.updated && !savePending) {
      setSavePending(true);

      if (iAmViewed) {
        setactivityTimeout(
          setTimeout(() => {
            lessonDispatch({type: 'INCREMENT_SAVE_COUNT'});
            console.log(
              '%c viewed save: ',
              'background: #00FF00; color: #000000',
              'saved'
            );
          }, VIEWED_INTERVAL)
        );
      } else {
        if (isSurvey) {
          setactivityTimeout(
            setTimeout(() => {
              lessonDispatch({type: 'INCREMENT_SAVE_COUNT'});
              console.log(
                '%c standard save: ',
                'background: #BEFAB5; color: #1E156F',
                'saved'
              );
            }, SURVEY_INTERVAL)
          );
        } else {
          setactivityTimeout(
            setTimeout(() => {
              lessonDispatch({type: 'INCREMENT_SAVE_COUNT'});
              console.log(
                '%c standard save: ',
                'background: #BEFAB5; color: #1E156F',
                'saved'
              );
            }, STANDARD_INTERVAL)
          );
        }
      }
    }
  }, [lessonState.studentData]);

  // ##################################################################### //
  // ######################## EXECUTE SAVE EFFECT ######################## //
  // ##################################################################### //

  const [currentSaveCount, setCurrentSaveCount] = useState<number>(0);

  useEffect(() => {
    if (currentSaveCount < lessonState.saveCount) {
      setCurrentSaveCount(lessonState.saveCount);
    }

    if (iAmViewed) {
      const viewedUpdate = updateStudentLessonData();

      Promise.resolve(viewedUpdate).then((_: void) => {
        clearUpdateCycle();
      });
    } else {
      const standardUpdate = isSurvey ? updateSurveyData() : updateStudentLessonData();

      Promise.resolve(standardUpdate).then((_: void) => {
        clearUpdateCycle();
      });
    }
  }, [lessonState.saveCount]);

  // ##################################################################### //
  // ######################## MAIN SAVE FUNCTIONS ######################## //
  // ##################################################################### //

  // ~~~~~~~~~~~ RESET SAVE LOOP ~~~~~~~~~~~ //
  const clearUpdateCycle = async () => {
    const cleanUpProcess = [
      () => lessonDispatch({type: 'COMPLETE_STUDENT_UPDATE'}),
      () => clearTimeout(activityTimeout),
      () => setSavePending(false),
    ];
    return cleanUpProcess.reduce((truth: boolean, cleanUpFn: any, idx: number) => {
      cleanUpFn();
      if (idx === cleanUpProcess.length - 1) {
        console.log('update cycle cleared...');
        return true;
      } else {
        return truth;
      }
    }, false);
  };

  // ~~~~~~~~~~ UPDATE DB RECORDS ~~~~~~~~~~ //
  const updateStudentLessonData = async () => {
    return lessonState.universalStudentDataID.reduce(
      async (p: any, currentIdObj: any, idx: number) => {
        if (currentIdObj.update) {
          let data = {
            id: currentIdObj.id,
            pageData: lessonState.studentData[currentIdObj.pageIdx],
            hasExerciseData: lessonState?.exerciseData[currentIdObj.pageIdx]?.length > 0,
            exerciseData: lessonState?.exerciseData[currentIdObj.pageIdx],
            roomID: getRoomData.id,
          };

          try {
            await API.graphql(
              graphqlOperation(mutations.updateUniversalLessonStudentData, {input: data})
            );
          } catch (e) {
            console.error('update universal student data - ', e);
          } finally {
            if (idx === lessonState.universalStudentDataID.length - 1) {
              return Promise.resolve();
            }
          }
        }
      },
      Promise.resolve()
    );
  };

  const updateSurveyData = async () => {
    if (
      lessonState.loaded &&
      lessonState?.universalStudentDataID[0]?.id &&
      lessonState?.studentData &&
      lessonState?.studentData.length > 0 &&
      lessonState?.studentData
    ) {
      const surveyData = lessonState?.studentData.map((pageData: any) => {
        return {
          domID: pageData.domID,
          input: pageData.input,
        };
      });
      let data = {
        id: lessonState?.universalStudentDataID[0]?.id,
        surveyData,
        roomID: getRoomData.id,
      };

      try {
        await API.graphql(
          graphqlOperation(mutations.updateUniversalSurveyStudentData, {input: data})
        );
        // await filterData();
        console.log('updateSurveyData - success');
      } catch (e) {
        console.error('updateSurveyData - ', e);
      } finally {
        return Promise.resolve();
      }
    }
  };

  return {
    iAmViewed,
    savePending,
    currentSaveCount,
    clearUpdateCycle,
    updateStudentLessonData,
    updateSurveyData,
  };
};

export default useStudentTimer;
