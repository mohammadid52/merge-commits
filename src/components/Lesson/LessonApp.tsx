import React, { useContext, useEffect, useState } from 'react';
import { LessonContext } from '../../contexts/LessonContext';
import Body from './Body/Body';
// import Foot from './Foot/_Foot';
import LessonHeaderBar from '../Header/LessonHeaderBar';
import Foot from './Foot/Foot';
import API, { graphqlOperation } from '@aws-amplify/api';
import * as customQueries from '../../customGraphql/customQueries';
import { useParams } from 'react-router-dom';
import { Auth } from '@aws-amplify/auth';
import * as queries from '../../graphql/queries';
import { createFilterToFetchSpecificItemsOnly } from '../../utilities/strings';
import * as customMutations from '../../customGraphql/customMutations';

const LessonApp = () => {
  const lessonCTX = useContext(LessonContext);
  const { state } = lessonCTX;
  const urlParams: any = useParams();

  const [lessonDataLoaded, setLessonDataLoaded] = useState<boolean>(false);

  const [overlay, setOverlay] = useState<string>('');
  const [recentQuestionOp, setRecentQuestionOp] = useState<string>('');
  const [checkpointIdList, setCheckpointIdList] = useState<string[]>(['']);
  const [checkpointsLoaded, setCheckpointsLoaded] = useState<boolean>(false);
  const [checkpointsItems, setCheckpointsItems] = useState<any[]>([]);
  const [checkpointsSequence, setCheckpointsSequence] = useState<string[]>(['']);
  const [checkpointsQuestionsSequence, setCheckpointsQuestionsSequence] = useState<{ [key: string]: string[] }[]>([]);
  const [reordered, setReordered] = useState<boolean>(false);

  /**
   *
   *
   * HELP SECTION:
   *
   *  On mount ->
   *  1. setLessonDataLoaded -> true;
   *  2. setCheckpointIdList()
   *
   *  Then ->
   *  3. getAllCheckpoints()
   *
   *  Then ->
   *  4. getOrCreateQuestionData()
   *
   */

  useEffect(() => {
    if (Object.keys(lessonCTX.state.data).length > 0 && lessonCTX.state.data.lesson && lessonCTX.state.pages) {
      setLessonDataLoaded(true);
    }
  }, [lessonCTX.state.data]);

  /***
   *
   * let questionSequence: any = await API.graphql(
   graphqlOperation(queries.getCSequences, { id: `Ch_Ques_${checkpointId}` })
   );
   questionSequence = questionSequence?.data.getCSequences?.sequence || [];
   * */

  /**
   * Function and useEffect for getting/setting checkpoints if
   * condition is met and lesson plans include
   * checkpoints in their name
   */

  const getAllCheckpointQuestionsSequence = async (cpIdList: string[]) => {
    const questionSequences = Promise.all(
      cpIdList.map(async (cpId: string) => {
        const questionSequences: any = await API.graphql(
          graphqlOperation(queries.getCSequences, { id: `Ch_Ques_${cpId}` })
        );
        return { [`${cpId}`]: questionSequences.data.getCSequences.sequence };
      })
    );
    // console.log('question sequences --> ', questionSequences);
    return questionSequences;
  };

  const getAllCheckpointSequence = () => {
    return state.data.lesson.lessonPlan.map((lessonPlanObj: any) => {
      return { [`${lessonPlanObj.LessonComponentID}`]: lessonPlanObj.sequence };
    });
  };

  const getAllCheckpoints = async (cpIdList: string[]) => {
    if (cpIdList.length > 0) {
      try {
        const checkpoints: any = await API.graphql(
          graphqlOperation(customQueries.listCheckpoints, {
            filter: { ...createFilterToFetchSpecificItemsOnly(cpIdList, 'id') },
          })
        );

        const items = checkpoints.data.listCheckpoints.items;
        setCheckpointsItems(items);
      } catch (e) {
        console.error('err fetch checkpoints ::: ', e);
      } finally {
        setCheckpointsLoaded(true);
      }
    } else {
      setCheckpointsLoaded(false);
    }
  };

  const reorderCheckpoints = (checkpointsArray: any[], orderArray: string[]) => {
    const ordered = orderArray.map((seqObj: any) => {
      const key = Object.keys(seqObj);
      const val: string[] = Object.values(seqObj);
      const findCP = checkpointsArray.find((cpObj: any) => cpObj.id === key[0]);
      return findCP;
    });
    return ordered;
  };

  const reorderCheckpointQuestions = (checkpointQuestions: any[], orderArray: string[]) => {
    const ordered = orderArray.map((qStr: string) => {
      const findQ = checkpointQuestions.find((qObj: any) => qObj.question.id === qStr);
      return findQ;
    });
    return ordered;
  };

  const setCheckpointsToLessonData = (checkpointsArray: any[]) => {
    setCheckpointsItems(checkpointsArray);
  };

  useEffect(() => {
    const reorderProcess = async () => {
      if (checkpointsLoaded && checkpointsItems) {
        if (state.data.lesson.type !== 'lesson') {
          if (checkpointsSequence.length === checkpointsItems.length) {
            const ordered = reorderCheckpoints(checkpointsItems, checkpointsSequence);
            setCheckpointsToLessonData(ordered);
          }
        }
      }
    };

    const reorderProcess2 = async () => {
      if (checkpointsLoaded && checkpointsQuestionsSequence.length > 0) {
        const mapCheckpointQuestions = checkpointsItems.map((checkpoint: any) => {
          const questions = checkpoint.questions.items;
          const questionsOrder = checkpointsQuestionsSequence.reduce((acc: any[], seqObj: any) => {
            const key = Object.keys(seqObj);
            const val: string[] = Object.values(seqObj);
            if (key[0] === checkpoint.id) {
              //@ts-ignore
              return [...acc, ...val[0]];
            } else {
              return acc;
            }
          }, []);

          if (questionsOrder) {
            // @ts-ignore
            const ordered = reorderCheckpointQuestions(questions, questionsOrder);
            return { ...checkpoint, questions: { ...checkpoint.questions, items: ordered } };
          } else {
            return checkpoint;
          }
        });

        setCheckpointsToLessonData(mapCheckpointQuestions);
      } else {
        console.log('skipped reorderProcess2()');
      }
    };

    const process = async () => {
      await reorderProcess();
      await reorderProcess2();
    };

    if (checkpointsLoaded && checkpointsQuestionsSequence.length > 0) {
      process();
      setReordered(true);
    }
  }, [checkpointsLoaded, checkpointsSequence, checkpointsQuestionsSequence]);

  /**
   *
   * FINAL CONTEXT DISPATCH AFTER REORDERING
   * AND PROCESSING
   *
   */
  useEffect(() => {
    if (checkpointsItems.length > 0) {
      const initCheckpointsObj = checkpointsItems.reduce((acc: any, checkpointObj: any) => {
        const initQuestionObj = checkpointObj.questions.items.reduce((acc: any[], questionObj: any) => {
          return [...acc, { qid: questionObj.question.id, response: [] }];
        }, []);
        return { ...acc, [checkpointObj?.id]: initQuestionObj };
      }, {});

      lessonCTX.dispatch({
        type: 'UPDATE_CHECKPOINT_DATA',
        payload: checkpointsItems,
      });

      lessonCTX.dispatch({
        type: 'SET_QUESTION_DATA',
        payload: {
          data: initCheckpointsObj,
        },
      });
    }
  }, [checkpointsItems, reordered]);

  useEffect(() => {
    const getAdditionalLessonData = async () => {
      if (state.data && state.data?.lessonPlan) {
        await getAllCheckpoints(checkpointIdList);
      }
      if (lessonDataLoaded && state.data.lesson.type !== 'lesson') {
        const checkpointSequences = await getAllCheckpointSequence();
        setCheckpointsSequence(checkpointSequences);
      }
      if (lessonDataLoaded && state.data.lesson.type !== 'lesson') {
        const questionSequences = await getAllCheckpointQuestionsSequence(checkpointIdList);
        setCheckpointsQuestionsSequence(questionSequences);
      }
    };
    if (!checkpointsLoaded && checkpointIdList.length > 0) {
      getAdditionalLessonData();
    }
  }, [checkpointIdList]);

  const getAllCheckpointIds = () => {
    return state.data.lessonPlan.reduce((acc: string[], lessonPlanObj: any, i: number) => {
      const isCheckpoint = lessonPlanObj.stage.includes('checkpoint');
      if (isCheckpoint) {
        return [...acc, lessonPlanObj.stage.match(/checkpoint\?id=(.*)/)[1]];
      } else {
        return acc;
      }
    }, []);
  };

  useEffect(() => {
    if (lessonDataLoaded && state.data.hasOwnProperty('lessonPlan')) {
      setCheckpointIdList(getAllCheckpointIds);
    }
  }, [lessonDataLoaded, state.data]);

  /**
   * GET or CREATE QUESTION DATA
   */
  const createQuestionData = async (responseObj: any) => {
    try {
      const newQuestionData = await API.graphql(
        graphqlOperation(customMutations.createQuestionData, { input: responseObj })
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateQuestionData = async () => {
    let studentID: string;
    let studentAuthID: string;

    await Auth.currentAuthenticatedUser().then((user) => {
      studentID = user.attributes.email;
      studentAuthID = user.attributes.sub;
    });

    if (typeof state.questionData === 'object') {
      let checkpointIdKeys = Object.keys(state.questionData); // doFirst, checkpoint_1
      await checkpointIdKeys.reduce((_: any, key: string) => {
        let responseObject = {
          syllabusLessonID: state.syllabusLessonID,
          checkpointID: key,
          componentType: state.data.lesson.type,
          lessonID: state.data.lesson.id,
          authID: studentAuthID,
          email: studentID,
          responseObject: state.questionData[key],
        };

        createQuestionData(responseObject);
      }, null);
      setRecentQuestionOp('created');
    }
  };

  const getOrCreateQuestionData = async () => {
    const { lessonID } = urlParams;
    let studentID: string;
    let studentAuthID: string;

    await Auth.currentAuthenticatedUser().then((user) => {
      studentID = user.attributes.email;
      studentAuthID = user.attributes.sub;
    });

    // console.log('getOrCreateQuestionData -> recentQuestionOp, ', recentQuestionOp)

    try {
      const questionDatas: any = await API.graphql(
        graphqlOperation(queries.listQuestionDatas, {
          filter: {
            syllabusLessonID: { eq: lessonID },
            email: { eq: studentID },
          },
        })
      );
      const questionDataUpdateArray = questionDatas.data.listQuestionDatas.items.reduce((acc: any[], val: any) => {
        return [
          ...acc,
          {
            id: val.id,
            checkpointID: val.checkpointID,
          },
        ];
      }, []);

      const noQuestionDatas = questionDatas.data.listQuestionDatas.items.length === 0;
      const existQuestionDatas = questionDatas.data.listQuestionDatas.items.length > 0;

      if (noQuestionDatas && recentQuestionOp === '') {
        await handleCreateQuestionData();
      }

      if ((existQuestionDatas && recentQuestionOp === '') || (existQuestionDatas && recentQuestionOp === 'created')) {
        lessonCTX.dispatch({ type: 'SET_QUESTION_DATA_UPDATE', payload: { data: questionDataUpdateArray } });
        setRecentQuestionOp('fetched');
      }
    } catch (e) {
      console.error('getOrCreateQuestionData -> ', e);
    }
  };

  // Init questionData in DB if necessary
  useEffect(() => {
    if (checkpointsLoaded && state.data.lesson.type === 'lesson') {
      if (recentQuestionOp === '' || recentQuestionOp === 'created') {
        getOrCreateQuestionData();
      }
    }
  }, [checkpointsLoaded, recentQuestionOp]);

  return (
    <div className={`${lessonCTX.theme.bg} w-full md:h-screen flex flex-col items-start`}>
      <LessonHeaderBar
        lessonDataLoaded={lessonDataLoaded}
        checkpointsLoaded={checkpointsLoaded}
        overlay={overlay}
        setOverlay={setOverlay}
      />
      {/*<NotificationBar />*/}

      <div
        className={`fixed w-1/2 right-1/2 top-1/2 transform translate-x-1/2 -translate-y-1/2 ${
          overlay === '' ? 'z-0' : 'z-50'
        }`}>
        {/*<NotesForm overlay={overlay} setOverlay={setOverlay} />*/}
      </div>

      {lessonDataLoaded && <Body checkpointsItems={checkpointsItems} />}
      {lessonDataLoaded && <Foot />}
    </div>
  );
};

export default LessonApp;
