import React, {useContext, useEffect, useState} from 'react';
import {API, graphqlOperation} from '@aws-amplify/api';
import * as customQueries from '@customGraphql/customQueries';

interface IContentLessonWrapper {
  children?: React.ReactNode;
  lessonID: string;
}

const ContentLessonWrapper = ({children, lessonID}: IContentLessonWrapper) => {
  const [wrapperTitle, setWrapperTitle] = useState<string>('');

  const getMinimumLessonInfo = async () => {
    // const user = await Auth.currentAuthenticatedUser();
    // const studentAuthId = user.username;

    try {
      const minimumLessonInfo: any = await API.graphql(
        graphqlOperation(customQueries.getUniversalLessonMinimum, {id: lessonID})
      );
      // existing student rows
      const response = minimumLessonInfo.data;
      console.log('getMinimumLessonInfo - ', response);
    } catch (e) {
      console.error('getMinimumLessonInfo - ', e);
    } finally {
    }
  };

  return (
    <section>
      <h2>{wrapperTitle}</h2>
      {children}
    </section>
  );
};

export default ContentLessonWrapper;
