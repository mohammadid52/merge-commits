import React from 'react';
import * as customQueries from '../customGraphql/customQueries';
import * as customMutations from '../customGraphql/customMutations';
import { API, graphqlOperation } from '@aws-amplify/api';
import {classroom} from './classroom';

// query classroom, separate out lesson plans
const getClassroomLessonplans = async () => {
  try {
    // const getQuery: any = await API.graphql(graphqlOperation(customQueries.listLessonPlans));
    // return getQuery?.data?.listClassrooms?.items;
    return classroom;
  } catch (e) {
    console.error('getClassroomLessonPlans - ', e);
  }
};

// query all syllabus lessons
const getSyllabusLessons = async () => {
  try {
    const getQuery: any = await API.graphql(graphqlOperation(customQueries.listAllSyllabusLessons));
    console.log('getSyllabusLessons: ', getQuery)
    return await getQuery?.data?.listSyllabusLessons?.items;
  } catch (e) {
    console.error('getSyllabusLessons - ', e);
  }
};

// reduce into [...acc, {id: asdf4234234, lessonPlanID: 2}]
const syllabusLessonIdsAndPlanIds = async (arr: any) => {
  const outArray = arr.reduce((acc: any[], val: any) => {
    return [...acc, { id: val.id, lessonID: val.lessonID }];
  }, []);
  return outArray;
};

const loopSyllabusLessonIdAndMutate = async (arrIdsAndPlanIdd: any, lessonPlans: any) => {
  // console.log('before try mutate: ', arrIdsAndPlanIdd);
  arrIdsAndPlanIdd.reduce((_: any, idPlanIdArr: any, iKey: number) => {
    const lessonPlanLessonIds = lessonPlans.map((lpObj: any) => lpObj.lessonID);
    const lessonPlanExists = lessonPlans.filter((arr: any) => arr.lessonID === idPlanIdArr.lessonID).length > 0;

    console.log('lesson plans: ', lessonPlans.filter((arr: any) => arr.lessonID === idPlanIdArr.lessonID))
    // console.log('loop -> ', lessonPlanLessonIds)

    if (lessonPlanExists) {
      const lessonPlan = lessonPlans[lessonPlanLessonIds.indexOf(idPlanIdArr.lessonID)].lessonPlan;
      mutateSingleSyllabusLesson(idPlanIdArr.id, lessonPlan);
      // console.log(idPlanIdArr.lessonID)
    }
  }, []);
};

const mutateSingleSyllabusLesson = async (sylID: string, lessonPlan: any[]) => {
  // console.log('mutateSingleSyllabusLesson: ', 'start');
  try {
    await API.graphql(
      graphqlOperation(customMutations.updateSyllabusLesson, {
        input: {
          id: sylID,
          lessonPlan: lessonPlan,
        },
      })
    );
  } catch (e) {
    console.error('mutateSingleSyllabusLesson: ', e);
  }
};

export const copyLessonPlans = async () => {
  const lessonPlans = await getClassroomLessonplans();
  const syllabusLessons = await getSyllabusLessons();
  const reducedIdsAndSyllabus = await syllabusLessonIdsAndPlanIds(syllabusLessons);

  Promise.all([lessonPlans, syllabusLessons, reducedIdsAndSyllabus]).then(() => {
    if (typeof lessonPlans !== 'undefined') {
      loopSyllabusLessonIdAndMutate(reducedIdsAndSyllabus, lessonPlans);
    } else {
      console.log('Promise.all  ', 'could not mutate...');
    }
  });
};
