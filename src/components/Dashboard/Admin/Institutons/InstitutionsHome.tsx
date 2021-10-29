import React, {useContext, useEffect, useState} from 'react';
import {Route, Switch, useLocation, useRouteMatch} from 'react-router-dom';

import BreadcrumbsWithBanner from '@components/Atoms/BreadcrumbsWithBanner';
import PageWrapper from '@components/Atoms/PageWrapper';
import HeroBanner from '@components/Header/HeroBanner';
import useDictionary from '@customHooks/dictionary';
import {breadcrumbsRoutes} from '@utilities/breadcrumb';
import {getAsset} from 'assets';

import {GlobalContext} from '../../../../contexts/GlobalContext';
import {DashboardProps} from '../../Dashboard';
import NavBarRouter from '../NavBarRouter';
// Institute info tabs.
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

const InstitutionsHome: React.FC<DashboardProps> = (props: DashboardProps) => {
  const {clientKey, state, theme, userLanguage, dispatch} = useContext(GlobalContext);
  const match = useRouteMatch();
  const {pathname} = useLocation();
  const themeColor = getAsset(clientKey, 'themeClassName');
  const {BreadcrumsTitles, Institute_info} = useDictionary(clientKey);
  const bannerImage = getAsset(clientKey, 'dashboardBanner1');
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

  const {heroSectionTitle, breadcrumbPathForSection} = breadcrumbsRoutes({
    breadcrumbsTitles: BreadcrumsTitles[userLanguage],
    instituteTabTitles: Institute_info[userLanguage],
    pathname,
  });

  const breadCrumbsList = [
    {title: BreadcrumsTitles[userLanguage]['HOME'], url: '/dashboard', last: false},
    ...breadcrumbPathForSection,
  ].filter(Boolean);

  return (
    <div className={`w-full h-full flex justify-center`}>
      <Switch>
        <Route
          exact
          path={`${match.url}`}
          render={() => <InstitutionLookup />} // Institutions list
        />
        <Route
          path={`${match.url}/add`}
          render={() => <InstitutionBuilder />} // Create New institution.
        />
        <Route
          path={`${match.url}/institution/curricular-creation`}
          render={() => <CurricularBuilder />} // Create new curricular
        />
        <Route
          path={`${match.url}/institution/:institutionId`}
          render={() => <Institution tabProps={tabProps} />} // Institution info page
        />
        <Route
          path={`${match.url}/:institutionId/curricular/:curricularId/learning-objective/edit/:id`}
          render={() => <EditLearningObjective />} // Edit curricular topic
        />
        <Route
          path={`${match.url}/curricular/:curricularId/topic/edit/:id`}
          render={() => <EditTopic />} // Edit curricular topic
        />
        <Route
          path={`${match.url}/curricular/:curricularId/measurement/edit/:id`}
          render={() => <EditMeasurement />} // Edit curricular measurement
        />
        <Route
          path={`${match.url}/:institutionId/curricular/:curricularId/syllabus/edit`}
          render={() => <UnitBuilder />} // Edit curricular syllabus
        />
        <Route
          path={`${match.url}/:institutionId/curricular/:curricularId/checkpoint/addNew`}
          render={() => <AddProfileCheckpoint />} // Add new Checkpoint to curricular
        />
        <Route
          path={`${match.url}/:institutionId/curricular/:curricularId/checkpoint/edit/:id`}
          render={() => <EditProfileCheckpoint />} // Edit curricular Checkpoint
        />
        <Route
          path={`${match.url}/:institutionId/curricular/:curricularId/checkpoint/addPrevious`}
          render={() => <ProfileCheckpointlookup />} // Add existing Checkpoint to curricular
        />
        <Route
          path={`${match.url}/:institutionId/curricular`}
          render={() => <CurricularView tabProps={tabProps} />} // Curricular information view.
        />
        {pathname.indexOf('/manage-institutions/institution') === -1 && (
          <div className={`w-full h-full`}>
            <div className="relative">
              <HeroBanner imgUrl={bannerImage} title={heroSectionTitle} />
              <div className={`absolute ${theme.backGround[themeColor]} bottom-0 z-20`}>
                <BreadcrumbsWithBanner items={breadCrumbsList} />
              </div>
            </div>
            <div className="px-2 py-8 md:px-4 lg:p-8">
              <PageWrapper>
                <NavBarRouter />
              </PageWrapper>
            </div>
          </div>
        )}
      </Switch>
    </div>
  );
};

export default InstitutionsHome;
