import {API, graphqlOperation} from 'aws-amplify';
import * as mutations from '../graphql/mutations';

export const updateLessonPageToDB = async (input: any) => {
  try {
    const res: any = await API.graphql(
      graphqlOperation(mutations.updateUniversalLesson, {input})
    );
    return res.data.updateUniversalLesson;
  } catch (error) {
    console.error(error.message);
  }
};
