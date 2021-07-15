import {useRouteMatch} from 'react-router-dom';

const useInLessonCheck = () => {
  const match = useRouteMatch();
  return /\/lesson\/|\/lesson-control\//g.test(match.url);
};

export default useInLessonCheck;