import {useRouteMatch} from 'react-router-dom';

const useInGC = () => {
  const match = useRouteMatch();
  return /\/game-changers/g.test(match.url);
};

export default useInGC;
