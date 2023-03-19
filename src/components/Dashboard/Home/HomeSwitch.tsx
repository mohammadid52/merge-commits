import ErrorBoundary from '@components/Error/ErrorBoundary';
import {useGlobalContext} from '@contexts/GlobalContext';
import useAuth from '@customHooks/useAuth';
import {lazy} from 'react';
import {Redirect, useHistory} from 'react-router-dom';

// Lazy routes
const HomeForTeachers = lazy(() => import('components/Dashboard/Home/HomeForTeachers'));
const Home = lazy(() => import('components/Dashboard/Home/Home'));

const HomeSwitch = (props: {roomsLoading: boolean; homeData: any[]}) => {
  const {isStudent, isTeacher} = useAuth();
  const {activeRoom, currentPage} = useGlobalContext().state;
  const history = useHistory();

  const handleRoomSelection = (id: string) => {
    if (
      (activeRoom !== id && currentPage !== 'lesson-planner') ||
      (activeRoom !== id && currentPage !== 'classroom')
    ) {
      let route = !isTeacher ? 'classroom' : 'lesson-planner';
      history.push(`/dashboard/${route}/${id}`);
    }
  };

  if (isStudent) {
    return (
      <ErrorBoundary componentName="Home">
        <Home {...props} handleRoomSelection={handleRoomSelection} />
      </ErrorBoundary>
    );
  } else if (isTeacher) {
    return (
      <ErrorBoundary componentName="HomeForTeachers">
        <HomeForTeachers {...props} handleRoomSelection={handleRoomSelection} />
      </ErrorBoundary>
    );
  } else {
    return <Redirect to="/staff" />;
  }
};

export default HomeSwitch;
