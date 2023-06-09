import {API, graphqlOperation} from 'aws-amplify';
import {updateUniversalLesson} from 'customGraphql/customMutations';

export const updateLessonPageToDB = async (input: any) => {
  try {
    const res: any = await API.graphql(graphqlOperation(updateUniversalLesson, {input}));
    return res.data.updateUniversalLesson;
  } catch (error) {
    console.error(error.message);
  }
};
