import ErrorBoundary from '@components/Error/ErrorBoundary';
import useAuth from '@customHooks/useAuth';
import {logError} from 'graphql-functions/functions';
import {getAsset} from 'assets';
import BreadcrumbsWithBanner from 'atoms/BreadcrumbsWithBanner';
import {API, graphqlOperation} from 'aws-amplify';
import {useGlobalContext} from 'contexts/GlobalContext';
import * as customQueries from 'customGraphql/customQueries';
import React, {lazy, useEffect, useState} from 'react';
import {Route, Switch, useLocation, useRouteMatch} from 'react-router-dom';
import NavBarRouter from 'router/NavBarRouter';
const CurricularBuilder = lazy(
  () => import('dashboard/Admin/Institutons/Builders/CurricularBuilder')
);
const InstitutionBuilder = lazy(
  () =>
    import('dashboard/Admin/Institutons/Builders/InstitutionBuilder/InstitutionBuilder')
);
const CurricularView = lazy(
  () => import('dashboard/Admin/Institutons/EditBuilders/CurricularsView/CurricularView')
);
const AddProfileCheckpoint = lazy(
  () =>
    import(
      'dashboard/Admin/Institutons/EditBuilders/CurricularsView/TabsActions/AddProfileCheckpoint'
    )
);
const EditLearningObjective = lazy(
  () =>
    import(
      'dashboard/Admin/Institutons/EditBuilders/CurricularsView/TabsActions/EditLearningObjective'
    )
);
const EditMeasurement = lazy(
  () =>
    import(
      'dashboard/Admin/Institutons/EditBuilders/CurricularsView/TabsActions/EditMeasurement'
    )
);
const EditProfileCheckpoint = lazy(
  () =>
    import(
      'dashboard/Admin/Institutons/EditBuilders/CurricularsView/TabsActions/EditProfileCheckpoint'
    )
);
const EditTopic = lazy(
  () =>
    import(
      'dashboard/Admin/Institutons/EditBuilders/CurricularsView/TabsActions/EditTopic'
    )
);
const ProfileCheckpointlookup = lazy(
  () =>
    import(
      'dashboard/Admin/Institutons/EditBuilders/CurricularsView/TabsActions/ProfileCheckpointlookup'
    )
);
const UnitBuilder = lazy(
  () =>
    import(
      'dashboard/Admin/Institutons/EditBuilders/CurricularsView/TabsActions/Unit/UnitBuilder'
    )
);
const Institution = lazy(() => import('dashboard/Admin/Institutons/Institution'));
// Instituttion
const InstitutionLookup = lazy(
  () => import('dashboard/Admin/Institutons/InstitutionLookup')
);
const InstitutionProfile = lazy(
  () => import('dashboard/Admin/Institutons/InstitutionProfile')
);

const InstitutionsHome: React.FC = () => {
  const {clientKey, state, dispatch} = useGlobalContext();
  const match = useRouteMatch();
  const {pathname} = useLocation();

  const bannerImage = getAsset(clientKey, 'dashboardBanner1');
  const [_, setLessonData] = useState<{
    id?: string;
    title?: string;
  }>({});
  const [tabsData, setTabsData] = useState({inst: 'staff', instCurr: 0});
  const tabProps = {tabsData, setTabsData};
  // TODO: Need to setup route separately if required,
  // currently everything is tied to institutions.
  // so curricular can be open after selecting any specific institute only.
  // Need to discuss this with Mike.

  //  INITIALIZE CURRENT PAGE LOCATION
  useEffect(() => {
    dispatch({
      type: 'UPDATE_CURRENTPAGE',
      payload: {data: 'manage-institutions'}
    });
  }, [state.user.role]);

  const getLessonData = async () => {
    try {
      // To extract lesson id from path name
      const splitUrl = pathname.split('/lessons/')?.length
        ? pathname.split('/lessons/')[1]
        : '';

      const splitted = splitUrl.split('/');
      if (splitUrl.indexOf('add') === -1 && splitted.length > 0) {
        const result: any = await API.graphql(
          graphqlOperation(customQueries.getUniversalLessonBasicDetails, {
            id: splitted[0]
          })
        );
        setLessonData(result.data?.getUniversalLesson);
      } else {
        setLessonData({});
      }
    } catch (error) {
      console.error(error);
      logError(
        error,
        {authId: state.user.authId, email: state.user.email},
        'InstitutionsHome @getLessonData'
      );
    }
  };

  const {user, isSuperAdmin} = useAuth();

  useEffect(() => {
    if (isSuperAdmin) {
      if (pathname.indexOf('lessons/') > -1) {
        getLessonData();
      }
    }
  }, [pathname]);

  const institute =
    user && user.associateInstitute && user?.associateInstitute[0]?.institution;

  return (
    <div className={`w-full h-full flex justify-center`}>
      <Switch>
        <Route
          exact
          path={`${match.url}`}
          render={() => (
            <ErrorBoundary componentName="InstitutionLookup">
              <InstitutionLookup />
            </ErrorBoundary>
          )} // Institutions list
        />
        <Route
          path={`${match.url}/add`}
          render={() => (
            <ErrorBoundary componentName="InstitutionBuilder">
              <InstitutionBuilder />
            </ErrorBoundary>
          )} // Create New institution.
        />
        <Route
          path={`${match.url}/institution/curricular-creation`}
          render={() => (
            <ErrorBoundary componentName="CurricularBuilder">
              <CurricularBuilder />
            </ErrorBoundary>
          )} // Create new curricular
        />
        <Route
          path={`${match.url}/institution/:institutionId`}
          render={() => (
            <ErrorBoundary componentName="Institution">
              <Institution tabProps={tabProps} />
            </ErrorBoundary>
          )} // Institution info page
        />
        <Route
          path={`${match.url}/:institutionId/curricular/:curricularId/learning-objective/edit/:id`}
          render={() => (
            <ErrorBoundary componentName="EditLearningObjective">
              <EditLearningObjective />
            </ErrorBoundary>
          )} // Edit curricular topic
        />
        <Route
          path={`${match.url}/curricular/:curricularId/topic/edit/:id`}
          render={() => (
            <ErrorBoundary componentName="EditTopic">
              <EditTopic />
            </ErrorBoundary>
          )} // Edit curricular topic
        />
        <Route
          path={`${match.url}/curricular/:curricularId/measurement/edit/:id`}
          render={() => (
            <ErrorBoundary componentName="EditMeasurement">
              <EditMeasurement />
            </ErrorBoundary>
          )} // Edit curricular measurement
        />
        <Route
          path={`${match.url}/:institutionId/curricular/:curricularId/syllabus/edit`}
          render={() => (
            <ErrorBoundary componentName="UnitBuilder">
              <UnitBuilder />
            </ErrorBoundary>
          )} // Edit curricular syllabus
        />
        <Route
          path={`${match.url}/:institutionId/curricular/:curricularId/checkpoint/addNew`}
          render={() => (
            <ErrorBoundary componentName="AddProfileCheckpoint">
              <AddProfileCheckpoint />
            </ErrorBoundary>
          )} // Add new Checkpoint to curricular
        />
        <Route
          path={`${match.url}/:institutionId/curricular/:curricularId/checkpoint/edit/:id`}
          render={() => (
            <ErrorBoundary componentName="EditProfileCheckpoint">
              <EditProfileCheckpoint />
            </ErrorBoundary>
          )} // Edit curricular Checkpoint
        />
        <Route
          path={`${match.url}/:institutionId/curricular/:curricularId/checkpoint/addPrevious`}
          render={() => (
            <ErrorBoundary componentName="ProfileCheckpointlookup">
              <ProfileCheckpointlookup />
            </ErrorBoundary>
          )} // Add existing Checkpoint to curricular
        />
        <Route
          path={`${match.url}/:institutionId/curricular`}
          render={() => (
            <ErrorBoundary componentName="CurricularView">
              <CurricularView tabProps={tabProps} />
            </ErrorBoundary>
          )} // Curricular information view.
        />
        {pathname.indexOf('/manage-institutions/institution') === -1 && (
          <ErrorBoundary componentName="InstitutionProfile">
            <div className="">
              <BreadcrumbsWithBanner forInstitution bannerImage={bannerImage} />

              {/* <PageWrapper> */}

              <NavBarRouter institute={institute} />
              {/* </PageWrapper> */}
              <InstitutionProfile institute={institute} />
            </div>
          </ErrorBoundary>
        )}
      </Switch>
    </div>
  );
};

export default InstitutionsHome;
