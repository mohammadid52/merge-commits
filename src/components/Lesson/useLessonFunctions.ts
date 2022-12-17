import {API, graphqlOperation} from 'aws-amplify';
import React from 'react';
import * as queries from 'graphql/queries';
import {logError} from '@graphql/functions';
import useAuth from '@customHooks/useAuth';

const useLessonFunctions = () => {
  const {authId, email} = useAuth();
  const getLessonCompletedValue = async (input: any) => {
    try {
      const getLessonRatingDetails: any = await API.graphql(
        graphqlOperation(queries.getPersonLessonsData, input)
      );

      const pageNumber = getLessonRatingDetails.data.getPersonLessonsData.pages;
      const lessonProgress = JSON.parse(pageNumber).lessonProgress;
      const totalPages = JSON.parse(pageNumber).totalPages;
      return {
        lessonProgress,
        totalPages
      };
    } catch (error) {
      logError(error, {authId, email}, 'useLessonFunctions @getLessonCompletedValue');

      console.error(error);
    }
  };

  return {getLessonCompletedValue};
};

export default useLessonFunctions;
