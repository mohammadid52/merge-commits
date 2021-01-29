import React from 'react';
import * as customQueries from '../customGraphql/customQueries';
import * as customMutations from '../customGraphql/customMutations';
import { API, graphqlOperation } from '@aws-amplify/api';

// query all syllabus lessons
const getSyllabusLessons = async () => {
  try {
    const getQuery: any = await API.graphql(graphqlOperation(customQueries.listAllSyllabusLessons));
    return await getQuery?.data?.listSyllabusLessons?.items;
  } catch (e) {
    console.error('getSyllabusLessons - ', e);
  }
};

// reduce into [...acc, {id: asdf4234234}]
const syllabusLessonIds = async (arr: any) => {
  const outArray = arr.reduce((acc: any[], val: any) => {
    return [...acc, { id: val.id }];
  }, []);
  return outArray;
};

const loopSyllabusLessonIdAndMutate = async (sylLessonIds: any) => {
  try {
    sylLessonIds.reduce((_: any, idArr: any) => {
        mutateSingleSyllabusLesson(idArr.id, []);
    });
  } catch (e) {
    console.error('loop mutate: ', e);
  }
};

const mutateSingleSyllabusLesson = async (sylID: string, content: any[]) => {
  console.log('mutateSingleSyllabusLesson: ', 'start');
  try {
    await API.graphql(
      graphqlOperation(customMutations.updateSyllabusLesson, {
        input: {
          id: sylID,
          displayData:{},
          roster: content,
        },
      })
    );
  } catch (e) {
    console.log('mutateSingleSyllabusLesson: ', e);
  } finally {
    console.log('mutateSingleSyllabusLesson: ', 'end');
  }
};

export const initRosterSyllabusLessons = async () => {
  const syllabusLessons = await getSyllabusLessons();
  const reducedIds = await syllabusLessonIds(syllabusLessons);

  Promise.all([syllabusLessons, reducedIds]).then(() => {
    loopSyllabusLessonIdAndMutate(reducedIds);
  });
};
