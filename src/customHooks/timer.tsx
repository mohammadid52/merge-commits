import React, {useEffect, useState} from 'react';
import {LessonActions} from '../reducers/LessonReducerOLD';
import API, {graphqlOperation} from '@aws-amplify/api';
import * as customMutations from '../customGraphql/customMutations';
import {AnthologyContentInterface} from '../components/Dashboard/Anthology/Anthology';
import * as mutations from '../graphql/mutations';
import {useParams} from 'react-router-dom';
import {lessonStateOLD} from '../state/LessonStateOLD';
import {lessonState} from '../state/LessonState';
import {globalState} from '../state/GlobalState';
import {Auth} from '@aws-amplify/auth';

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

const useStudentTimer = (inputs?: inputs) => {
  const urlParams: any = useParams();
  const {
    subscription,
    subscribeFunc,
    dispatch,
    callback,
    state,
    lessonState,
    lessonDispatch,
  } = inputs;
  const [params, setParams] = useState<timerStateType>({
    subscription: subscription,
    subscribeFunc: subscribeFunc,
    dispatch: dispatch,
    callback: callback,
    state: state,
    lessonState: lessonState,
    activeTimer: null,
    idleTimer: null,
    autoSaveInterval: null,
  });

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
    if (lessonState.studentViewing !== '') {
      viewingLogic();
    }
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
            dispatch({type: 'INCREMENT_SAVE_COUNT'});
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
            dispatch({type: 'INCREMENT_SAVE_COUNT'});
            console.log(
              '%c standard save: ',
              'background: #BEFAB5; color: #1E156F',
              'saved'
            );
          }, STANDARD_INTERVAL)
        );
      }
    }
    return () => {
      Promise.resolve(clearUpdateCycle());
    };
  }, [iAmViewed, lessonState.updated]);

  // ##################################################################### //
  // ######################## EXECUTE SAVE EFFECT ######################## //
  // ##################################################################### //

  const [currentSaveCount, setCurrentSaveCount] = useState<number>(0);

  useEffect(() => {
    if (currentSaveCount < lessonState.saveCount) {
      setCurrentSaveCount(lessonState.saveCount);

      if (iAmViewed) {
        const viewedUpdate = updateStudentData();

        Promise.resolve(viewedUpdate).then((_: void) => {
          clearUpdateCycle().then((_: void) => {
            console.log('viewedUpdate - ', 'done');
          });
        });
      } else {
        const standardUpdate = updateStudentData();

        Promise.resolve(standardUpdate).then((_: void) => {
          clearUpdateCycle().then((_: void) => {
            console.log('standardUpdate - ', 'done');
          });
        });
      }
    }

    return () => {
      Promise.resolve(clearUpdateCycle());
    };
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
    return cleanUpProcess.reduce((p: any, cleanUpFn: any, idx: number) => {
      return p.then((_: void) => {
        cleanUpFn();
        if (idx === cleanUpProcess.length - 1) {
          console.log('update cycle cleared...');
          return p;
        }
      });
    }, Promise.resolve());
  };

  // ~~~~~~~~~~ UPDATE DB RECORDS ~~~~~~~~~~ //
  const updateStudentData = async () => {
    const loopOverDataId = lessonState.universalStudentDataID.reduce(
      async (acc: any[], currentIdObj: any, idx: number) => {
        if (currentIdObj.update) {
          let data = {
            id: currentIdObj.id,
            pageData: lessonState.studentData[currentIdObj.pageIdx],
          };

          try {
            let updatedStudentData: any = await API.graphql(
              graphqlOperation(mutations.updateUniversalLessonStudentData, {input: data})
            );
          } catch (e) {
            console.error('update universal student data - ', encodeURI);
          } finally {
            console.log('updateStudentData - finally - ', idx);
          }

          console.log('updateStudentData - timer - ', data);
        }
      },
      []
    );
  };

  /**
   *
   * LEGACY CODE
   *
   */
  const changeParams = (key: string, updatedValue: any) => {
    setParams((prev) => {
      return {
        ...prev,
        [key]: updatedValue,
      };
    });
  };

  const resetParams = () => {
    setParams(timerInitialParams);
    clearTimeout(activityTimeout);
  };

  const startAutoSave = () => {
    clearTimeout(params.activeTimer);
    clearTimeout(params.idleTimer);
    params.dispatch({type: 'UPDATE_STUDENT_STATUS', payload: 'ACTIVE'});
    params.dispatch({type: 'INCREMENT_SAVE_COUNT'});
  };

  const clearAutoSave = () => {
    clearInterval(params.autoSaveInterval);
    console.log('cleared');
  };

  const clearAllTimers = () => {
    clearInterval(params.autoSaveInterval);
    clearTimeout(params.activeTimer);
    clearTimeout(params.idleTimer);
  };

  return {
    // startTimer,
    startAutoSave,
    clearAutoSave,
    clearAllTimers,
    changeParams,
    resetParams,
  };
};

export default useStudentTimer;
