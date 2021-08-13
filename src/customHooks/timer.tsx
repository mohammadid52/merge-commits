import React, {useContext, useEffect, useState} from 'react';
import {LessonActions} from '../reducers/LessonReducerOLD';
import API, {graphqlOperation} from '@aws-amplify/api';
import * as customMutations from '../customGraphql/customMutations';
import * as mutations from '../graphql/mutations';
import {useParams} from 'react-router-dom';
import {lessonStateOLD} from '../state/LessonStateOLD';
import {lessonState} from '../state/LessonState';
import {globalState} from '../state/GlobalState';
import {Auth} from '@aws-amplify/auth';
import {GlobalContext} from '../contexts/GlobalContext';

interface inputs {
  subscription?: any;
  subscribeFunc?: () => any;
  dispatch: React.Dispatch<LessonActions>;
  callback?: () => Promise<void>;
  state?: any;
  lessonState?: any;
  lessonDispatch?: any;
}

interface timerStateType {
  subscription?: any;
  subscribeFunc?: () => any;
  dispatch: React.Dispatch<LessonActions>;
  callback?: () => Promise<void>;
  state?: any;
  lessonState?: any;
  activeTimer?: any;
  idleTimer?: any;
  autoSaveInterval?: any;
}

const timerInitialParams: timerStateType = {
  subscription: null,
  subscribeFunc: null,
  dispatch: null,
  callback: null,
  state: globalState,
  lessonState: lessonState,
  activeTimer: null,
  idleTimer: null,
  autoSaveInterval: null,
};

const useStudentTimer = () => {
  const {state, dispatch, lessonState, lessonDispatch} = useContext(GlobalContext);

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

  // save intervals
  const VIEWED_INTERVAL = 2000;
  const STANDARD_INTERVAL = 4000;

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
      const viewedUpdate = updateStudentData();

      Promise.resolve(viewedUpdate).then((_: void) => {
        clearUpdateCycle();
        console.log('viewedUpdate - ', 'done');
      });
    } else {
      const standardUpdate = updateStudentData();

      Promise.resolve(standardUpdate).then((_: void) => {
        clearUpdateCycle();
        console.log('standardUpdate - ', 'done');
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
  const updateStudentData = async () => {
    return lessonState.universalStudentDataID.reduce(
      async (p: any, currentIdObj: any, idx: number) => {
        if (currentIdObj.update) {
          let data = {
            id: currentIdObj.id,
            pageData: lessonState.studentData[currentIdObj.pageIdx],
          };

          try {
            let updatedStudentData: any = await API.graphql(
              graphqlOperation(mutations.updateUniversalLessonStudentData, {input: data})
            );
            console.log('updateStudentData - timer - ', data);
          } catch (e) {
            console.error('update universal student data - ', encodeURI);
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

  return {
    iAmViewed,
    savePending,
    currentSaveCount,
    clearUpdateCycle,
    updateStudentData,
  };
};

export default useStudentTimer;
