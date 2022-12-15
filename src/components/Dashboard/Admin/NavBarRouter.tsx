import React from 'react';
import {Route, Switch, useRouteMatch} from 'react-router-dom';

import {UniversalLessonBuilderProvider} from 'contexts/UniversalLessonBuilderContext';

import ErrorBoundary from '@components/Error/ErrorBoundary';
import InstitutionBuilder from 'components/Dashboard/Admin/Institutons/Builders/InstitutionBuilder/InstitutionBuilder';
import ClassRoomBuilder from 'components/Dashboard/Admin/Institutons/EditBuilders/ClassRoom/ClassRoomBuilder';
import AddProfileCheckpoint from 'components/Dashboard/Admin/Institutons/EditBuilders/CurricularsView/TabsActions/AddProfileCheckpoint';
import CourseBuilder from 'components/Dashboard/Admin/Institutons/EditBuilders/CurricularsView/TabsActions/CourseBuilder/CourseBuilder';
import EditProfileCheckpoint from 'components/Dashboard/Admin/Institutons/EditBuilders/CurricularsView/TabsActions/EditProfileCheckpoint';
import ProfileCheckpointlookup from 'components/Dashboard/Admin/Institutons/EditBuilders/CurricularsView/TabsActions/ProfileCheckpointlookup';
import UnitBuilder from 'components/Dashboard/Admin/Institutons/EditBuilders/CurricularsView/TabsActions/Unit/UnitBuilder';
import UnitList from 'components/Dashboard/Admin/Institutons/EditBuilders/CurricularsView/TabsActions/Unit/UnitList';
import ClassList from 'components/Dashboard/Admin/Institutons/Listing/ClassList';
import CurriculumList from 'components/Dashboard/Admin/Institutons/Listing/CurriculumList';
import RoomsList from 'components/Dashboard/Admin/Institutons/Listing/RoomsList';
import StaffBuilder from 'components/Dashboard/Admin/Institutons/Listing/StaffBuilder';
import Students from 'components/Dashboard/Admin/Institutons/Students';
import LessonsBuilderHome from 'components/Dashboard/Admin/LessonsBuilder/LessonsBuilderHome';
import Registration from 'components/Dashboard/Admin/UserManagement/Registration';
import User from 'components/Dashboard/Admin/UserManagement/User';
import UserLookup from 'components/Dashboard/Admin/UserManagement/UserLookup';
import AnalyticsDashboard from '../Csv/AnalyticsDashboard';
import Csv from '../Csv/Csv';
import UploadCsv from '../Csv/UploadCSV';

const NavBarRouter = (instProps: any) => {
  const {institute = {}, updateCurricularList, curricular} = instProps;
  const match = useRouteMatch();

  return (
    <Switch>
      <Route
        path={`${match.url}/class`}
        exact
        render={() => (
          <ErrorBoundary componentName="ClassList">
            <ClassList
              classes={institute?.classes}
              instId={institute?.id}
              instName={institute?.name}
            />
          </ErrorBoundary>
        )}
      />
      <Route
        path={`${match.url}/class-rooms`}
        exact
        render={() => (
          <ErrorBoundary componentName="RoomsList">
            <RoomsList instId={institute?.id} instName={institute?.name} />
          </ErrorBoundary>
        )}
      />
      <Route
        path={`${match.url}/room-creation`}
        exact
        render={() => (
          <ErrorBoundary componentName="ClassRoomBuilder">
            <ClassRoomBuilder instId={institute?.id} />
          </ErrorBoundary>
        )} // Create new room
      />
      <Route
        path={`${match.url}/room-edit/:roomId`}
        render={() => (
          <ErrorBoundary componentName="ClassRoomBuilderWithID">
            <ClassRoomBuilder instId={institute?.id} />
          </ErrorBoundary>
        )} // Edit current room.
      />
      <Route
        path={`${match.url}/register-user`}
        render={() => (
          <ErrorBoundary componentName="Registration">
            <Registration isInInstitute instId={institute?.id} />
          </ErrorBoundary>
        )} // Register new user to roo,
      />
      <Route
        path={`${match.url}/students`}
        exact
        render={() => (
          <ErrorBoundary componentName="Students">
            <Students instituteId={instProps?.institute?.id} isInInstitute />
          </ErrorBoundary>
        )}
      />
      <Route
        path={`${match.url}/courses`}
        exact
        render={() => (
          <ErrorBoundary componentName="CurriculumList">
            <CurriculumList
              updateCurricularList={updateCurricularList}
              curricular={curricular && curricular}
              instId={institute?.id}
              instName={institute?.name}
            />
          </ErrorBoundary>
        )}
      />
      <Route
        path={`${match.url}/units`}
        exact
        render={() => (
          <ErrorBoundary componentName="UnitList">
            <UnitList instId={institute?.id} instName={institute?.name} />
          </ErrorBoundary>
        )}
      />
      <Route
        exact
        path={`${match.url}/units/add`}
        render={() => (
          <ErrorBoundary componentName="UnitBuilder">
            <UnitBuilder instId={institute?.id} />
          </ErrorBoundary>
        )}
      />
      <Route
        exact
        path={`${match.url}/units/:unitId/edit`}
        render={() => (
          <ErrorBoundary componentName="UnitBuilder">
            <UnitBuilder instId={institute?.id} />
          </ErrorBoundary>
        )}
      />
      <Route
        path={`${match.url}/research-and-analytics`}
        exact
        render={() => (
          <ErrorBoundary componentName="Csv">
            <Csv institutionId={institute?.id} />
          </ErrorBoundary>
        )}
      />
      <Route
        path={`${match.url}/research-and-analytics/upload-csv`}
        exact
        render={() => (
          <ErrorBoundary componentName="UploadCsv">
            <UploadCsv institutionId={institute?.id} />
          </ErrorBoundary>
        )}
      />
      <Route
        path={`${match.url}/research-and-analytics/analytics-dashboard`}
        exact
        render={() => (
          <ErrorBoundary componentName="AnalyticsDashboard">
            <AnalyticsDashboard institutionId={institute?.id} />
          </ErrorBoundary>
        )}
      />
      <Route
        path={`${match.url}/staff`}
        exact
        render={() => (
          <ErrorBoundary componentName="StaffBuilder">
            <StaffBuilder
              serviceProviders={institute.serviceProviders}
              instituteId={instProps?.institute?.id}
              instName={institute?.name}
            />
          </ErrorBoundary>
        )}
      />
      <Route
        path={`${match.url}/edit`}
        exact
        render={() => (
          <ErrorBoundary componentName="InstitutionBuilder">
            <InstitutionBuilder
              institutionId={institute?.id}
              institute={instProps.institute}
              loading={instProps.loading}
              postInfoUpdate={instProps.postInfoUpdate}
              updateServiceProviders={instProps.updateServiceProviders}
              toggleUpdateState={instProps.toggleUpdateState}
            />
          </ErrorBoundary>
        )}
      />
      <Route
        path={`${match.url}/manage-users`}
        exact
        render={() => (
          <ErrorBoundary componentName="UserLookup">
            <UserLookup instituteId={instProps?.institute?.id} isInInstitute />
          </ErrorBoundary>
        )}
      />
      <Route
        path={`${match.url}/manage-users/:userId`}
        render={() => (
          <ErrorBoundary componentName="User">
            <User instituteId={instProps?.institute?.id} />
          </ErrorBoundary>
        )}
      />
      <Route
        path={`${match.url}/course-builder`}
        exact
        render={() => (
          <ErrorBoundary componentName="CourseBuilder">
            <CourseBuilder instId={institute?.id} />
          </ErrorBoundary>
        )} // Create new course
      />
      <Route
        exact
        path={`${match.url}/course-builder/:courseId`}
        render={() => (
          <ErrorBoundary componentName="CourseBuilder">
            <CourseBuilder instId={institute?.id} />
          </ErrorBoundary>
        )} // Edit course
      />
      <Route
        path={`${match.url}/course-builder/:courseId/checkpoint/addNew`}
        render={() => (
          <ErrorBoundary componentName="AddProfileCheckpoint">
            <AddProfileCheckpoint />
          </ErrorBoundary>
        )} // Edit course
      />
      <Route
        path={`${match.url}/course-builder/:courseId/checkpoint/addPrevious`}
        render={() => (
          <ErrorBoundary componentName="ProfileCheckpointlookup">
            <ProfileCheckpointlookup instId={institute?.id} />
          </ErrorBoundary>
        )} // Edit course
      />
      <Route
        path={`${match.url}/course-builder/:courseId/checkpoint/edit/:id`}
        render={() => (
          <ErrorBoundary componentName="EditProfileCheckpoint">
            <EditProfileCheckpoint />
          </ErrorBoundary>
        )} // Edit course
      />
      <UniversalLessonBuilderProvider>
        <Route
          path={`${match.url}/lessons`}
          render={() => (
            <ErrorBoundary componentName="LessonsBuilderHome">
              <LessonsBuilderHome instId={institute?.id} />
            </ErrorBoundary>
          )}
        />
      </UniversalLessonBuilderProvider>
    </Switch>
  );
};

export default NavBarRouter;
