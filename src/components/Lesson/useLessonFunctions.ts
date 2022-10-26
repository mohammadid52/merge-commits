import {API, graphqlOperation} from 'aws-amplify';
import React from 'react';
import * as queries from 'graphql/queries';

const useLessonFunctions = () => {
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
      console.error(error);
    }
  };

  return {getLessonCompletedValue};
};

export default useLessonFunctions;
