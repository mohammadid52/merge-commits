import {API, graphqlOperation} from 'aws-amplify';
import * as customMutations from '../customGraphql/customMutations';

export const updateLessonPageToDB = async (input: any) => {
  try {
    const res: any = await API.graphql(
      graphqlOperation(customMutations.updateUniversalLesson, {input})
    );
    return res.data.updateUniversalLesson;
  } catch (error) {
    console.error(error.message);
  }
};
