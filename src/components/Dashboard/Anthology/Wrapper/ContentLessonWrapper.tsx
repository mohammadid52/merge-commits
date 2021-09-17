import React, {useContext, useEffect, useState} from 'react';
import {API, graphqlOperation} from '@aws-amplify/api';
import * as customQueries from '@customGraphql/customQueries';
import ContentCard from '@components/Atoms/ContentCard';

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
      const response = minimumLessonInfo.data.getUniversalLesson;
      if (response !== null) {
        setWrapperTitle(response?.title);
      } else {
        setWrapperTitle('Lesson does not exist');
      }
    } catch (e) {
      console.error('getMinimumLessonInfo - ', e);
    } finally {
    }
  };

  useEffect(() => {
    getMinimumLessonInfo();
  }, [lessonID]);

  return (
    <ContentCard hasBackground={false}>
      <div className="px-6 mt-6">
        <h2 className="border-b-2 border-gray-200 w-auto font-medium flex items-center text-lg 2xl:text-2xl  text-black text-left">
          Lesson: {wrapperTitle}
        </h2>
      </div>
      {children}
    </ContentCard>
  );
};

export default React.memo(ContentLessonWrapper);
