import {useRouteMatch} from 'react-router-dom';

const useInLessonCheck = () => {
  const match = useRouteMatch();
  return /\/lesson\/(?!page-builder)|\/lesson-control\/|\/anthology/g.test(match.url);
};

export default useInLessonCheck;
