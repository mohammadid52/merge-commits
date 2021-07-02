import { useRouteMatch } from 'react-router-dom';

const useInLessonCheck = () => {
  const match = useRouteMatch();
  return (/^\/lesson\//g).test(match.url);
}

export default useInLessonCheck;