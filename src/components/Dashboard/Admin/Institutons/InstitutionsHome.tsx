import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import PageWrapper from '@components/Atoms/PageWrapper';
import ErrorBoundary from '@components/Error/ErrorBoundary';
import useAuth from '@customHooks/useAuth';
import {logError} from '@graphql/functions';
import {getAsset} from 'assets';
import BreadcrumbsWithBanner from 'atoms/BreadcrumbsWithBanner';
import {useGlobalContext} from 'contexts/GlobalContext';
import * as customQueries from 'customGraphql/customQueries';
import React, {useEffect, useState} from 'react';
import {Route, Switch, useLocation, useRouteMatch} from 'react-router-dom';
import {DashboardProps} from '../../Dashboard';
import NavBarRouter from '../NavBarRouter';
import CurricularBuilder from './Builders/CurricularBuilder';
import InstitutionBuilder from './Builders/InstitutionBuilder/InstitutionBuilder';
import CurricularView from './EditBuilders/CurricularsView/CurricularView';
import AddProfileCheckpoint from './EditBuilders/CurricularsView/TabsActions/AddProfileCheckpoint';
import EditLearningObjective from './EditBuilders/CurricularsView/TabsActions/EditLearningObjective';
import EditMeasurement from './EditBuilders/CurricularsView/TabsActions/EditMeasurement';
import EditProfileCheckpoint from './EditBuilders/CurricularsView/TabsActions/EditProfileCheckpoint';
import EditTopic from './EditBuilders/CurricularsView/TabsActions/EditTopic';
import ProfileCheckpointlookup from './EditBuilders/CurricularsView/TabsActions/ProfileCheckpointlookup';
import UnitBuilder from './EditBuilders/CurricularsView/TabsActions/Unit/UnitBuilder';
import Institution from './Institution';
// Instituttion
import InstitutionLookup from './InstitutionLookup';
import InstitutionProfile from './InstitutionProfile';

const InstitutionsHome: React.FC<DashboardProps> = (props: DashboardProps) => {
  const {clientKey, state, dispatch} = useGlobalContext();
  const match = useRouteMatch();
  const {pathname} = useLocation();

  const bannerImage = getAsset(clientKey, 'dashboardBanner1');
  const [lessonData, setLessonData] = useState<{
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
    dispatch({type: 'UPDATE_CURRENTPAGE', payload: {data: 'manage-institutions'}});
  }, [state.user.role]);

  const getLessonData = async () => {
    try {
      // To extract lesson id from path name
      const splitUrl = pathname.split('/lessons/')?.length
        ? pathname.split('/lessons/')[1]
        : '';
      if (splitUrl.indexOf('add') === -1) {
        const result: any = await API.graphql(
          graphqlOperation(customQueries.getUniversalLessonBasicDetails, {
            id: splitUrl.split('/')[0]
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

  useEffect(() => {
    if (state.user.isSuperAdmin) {
      if (pathname.indexOf('lessons/') > -1) {
        getLessonData();
      }
    }
  }, [pathname]);

  const {user} = useAuth();
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
          <div className="">
            <BreadcrumbsWithBanner forInstitution bannerImage={bannerImage} />
            <div className="px-2 py-8 md:px-4 lg:p-8">
              {/* <PageWrapper> */}
              <PageWrapper>
                <NavBarRouter institute={institute} />
                {/* </PageWrapper> */}
                <InstitutionProfile institute={institute} />
              </PageWrapper>
            </div>
          </div>
        )}
      </Switch>
    </div>
  );
};

export default InstitutionsHome;
