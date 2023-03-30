import useAuth from '@customHooks/useAuth';
import {dashboardFunctions} from '@graphql/functions';
import ErrorBoundary from 'components/Error/ErrorBoundary';
import ComponentLoading from 'components/Lesson/Loading/ComponentLoading';
import {GameChangerProvider} from 'dashboard/GameChangers/context/GameChangersContext';
import {lazy, Suspense, useEffect, useState} from 'react';
import {Redirect, Route, Switch, useRouteMatch} from 'react-router-dom';

// Routes
const Classroom = lazy(() => import('dashboard/Classroom/Classroom'));
const UploadLogsPage = lazy(() => import('dashboard/Csv/UploadLogsPage'));
const GameChangers = lazy(() => import('dashboard/GameChangers/GameChangers'));
const Anthology = lazy(() => import('dashboard/Anthology/Anthology'));
const Profile = lazy(() => import('dashboard/Profile/Profile'));
const Registration = lazy(() => import('dashboard/Admin/UserManagement/Registration'));
const ErrorsPage = lazy(() => import('dashboard/Errors/ErrorsPage'));
const DictionaryPage = lazy(() => import('dashboard/Dictionary/DictionaryPage'));
const HomeSwitch = lazy(() => import('dashboard/Home/HomeSwitch'));
const Community = lazy(() => import('components/Community/Community'));
const InstitutionsHome = lazy(
  () => import('dashboard/Admin/Institutons/InstitutionsHome')
);
const Csv = lazy(() => import('dashboard/Csv/Csv'));

const conditionalRender = (children: JSX.Element, condition: boolean) => {
  if (condition) {
    return children;
  } else {
    return <Redirect to={`/dashboard/home`} />;
  }
};

const DashboardRouter = () => {
  const match = useRouteMatch();
  const {user, authId, email, isStudent, isTeacher} = useAuth();
  const [homeData, setHomeData] = useState<any[]>([]);

  const [isRoomsFetched, setIsRoomsFetched] = useState(false);
  const [roomsLoading, setRoomsLoading] = useState(true);

  const initHomeDataFetch = async () => {
    let response = [];

    if (isTeacher) {
      response = await dashboardFunctions.getDashboardDataForTeachers(authId, email);
    } else if (isStudent) {
      response = await dashboardFunctions.getDashboardData(authId, email);
    }

    setHomeData(response);
    setIsRoomsFetched(true);
    setRoomsLoading(false);
  };

  const location = window.location.href;
  const shouldFetchHomeData =
    location.includes('/home') ||
    location.includes('/classroom') ||
    location.includes('/lesson-planner');

  useEffect(() => {
    if (!isRoomsFetched && shouldFetchHomeData && authId && email) {
      initHomeDataFetch();
    }
  }, [isTeacher, isStudent, isRoomsFetched, shouldFetchHomeData]);

  const classroomProps = {
    homeData
  };

  return (
    <ErrorBoundary componentName="DashboardRouter">
      <Suspense
        fallback={
          <div className="min-h-screen w-full flex flex-col justify-center items-center">
            <ComponentLoading from="DashboardRouter 1" />
          </div>
        }>
        <Switch>
          <Route
            path={`${match.url}`}
            exact
            render={() => {
              if (user && user.role !== undefined) {
                if (user.role === 'FLW' || user.role === 'TR') {
                  return <Redirect to={`${match.url}/home`} />;
                } else if (user.role === 'ST') {
                  return <Redirect to={`${match.url}/home`} />;
                } else {
                  return !user?.associateInstitute?.length ||
                    user?.associateInstitute?.length > 1 ? (
                    <Redirect to={`${match.url}/manage-institutions`} />
                  ) : (
                    <Redirect
                      to={`${match.url}/manage-institutions/institution/${user?.associateInstitute[0].institution.id}/staff`}
                    />
                  );
                }
              } else
                return (
                  <div className="min-h-screen w-full flex flex-col justify-center items-center">
                    <ComponentLoading from="DashboardRouter" />
                  </div>
                );
            }}
          />
          <Route
            exact
            path={`${match.url}/home`}
            render={() => (
              <ErrorBoundary
                componentName="HomeSwitch"
                fallback={<h1>Oops with the Dashboard</h1>}>
                <HomeSwitch roomsLoading={roomsLoading} homeData={homeData} />
              </ErrorBoundary>
            )}
          />
          <Route
            // exact
            path={`${match.url}/community/:action`}
            render={() => (
              <ErrorBoundary
                componentName="Community"
                fallback={<h1>Community Page is not working</h1>}>
                <Community />
              </ErrorBoundary>
            )}
          />

          <Route
            // exact
            path={`${match.url}/game-changers`}
            render={() => (
              <ErrorBoundary
                componentName="GameChangers"
                fallback={<h1>Game changers is not working</h1>}>
                <GameChangerProvider>
                  <GameChangers />
                </GameChangerProvider>
              </ErrorBoundary>
            )}
          />

          <Route
            exact
            path={`${match.url}/csv`}
            render={() =>
              conditionalRender(
                <ErrorBoundary componentName="Csv" fallback={<h1>CSV is not working</h1>}>
                  <Csv />
                </ErrorBoundary>,
                user.role === 'SUP' ||
                  user.role === 'ADM' ||
                  user.role === 'TR' ||
                  user.role === 'FLW' ||
                  user.role === 'BLD'
              )
            }
          />

          <Route
            exact
            path={`${match.url}/classroom/:roomId`}
            render={() => (
              <ErrorBoundary
                componentName="Classroom"
                fallback={<h1>Oops with the Classroom</h1>}>
                <Classroom {...classroomProps} />
              </ErrorBoundary>
            )}
          />
          <Route
            path={`${match.url}/anthology`}
            render={() => (
              <ErrorBoundary
                componentName="Anthology"
                fallback={<h1>Oops with the Anthology</h1>}>
                <Anthology
                  studentAuthID={user?.authId}
                  studentID={user?.id}
                  studentEmail={user?.email}
                  studentName={user?.firstName}
                />
              </ErrorBoundary>
            )}
          />

          <Route
            path={`${match.url}/registration`}
            render={() => (
              <ErrorBoundary
                componentName="Registration"
                fallback={<h1>Oops with the Registration</h1>}>
                <Registration />
              </ErrorBoundary>
            )}
          />
          <Route
            path={`${match.url}/profile`}
            render={() => (
              <ErrorBoundary componentName="Profile">
                <Profile />
              </ErrorBoundary>
            )}
          />

          <Route
            path={`${match.url}/errors`}
            render={() => (
              <ErrorBoundary componentName="Errors">
                <ErrorsPage />
              </ErrorBoundary>
            )}
          />
          <Route
            path={`${match.url}/dictionary`}
            render={() => (
              <ErrorBoundary componentName="Dictionary">
                <DictionaryPage />
              </ErrorBoundary>
            )}
          />
          <Route
            path={`${match.url}/upload-logs`}
            render={() => (
              <ErrorBoundary componentName="UploadLogs">
                <UploadLogsPage />
              </ErrorBoundary>
            )}
          />
          <Route
            path={`${match.url}/lesson-planner/:roomId`}
            render={() => (
              <ErrorBoundary
                componentName="LessonPlanHome"
                fallback={<h1>Oops with the Lesson-Planner</h1>}>
                <Classroom {...classroomProps} isTeacher />
              </ErrorBoundary>
            )}
          />
          <Route
            path={`${match.url}/manage-institutions`}
            render={() => (
              <ErrorBoundary componentName="InstitutionsHome">
                <InstitutionsHome />
              </ErrorBoundary>
            )}
          />
          {/* <Route
                path={`${match.url}/question-bank`}
                render={() => (
                  <ErrorBoundary componentName="QuestionBank">
                    <QuestionBank />
                  </ErrorBoundary>
                )}
              /> */}
        </Switch>
      </Suspense>
    </ErrorBoundary>
  );
};

export default DashboardRouter;
