import {Route, Switch, useRouteMatch} from 'react-router-dom';

import {UniversalLessonBuilderProvider} from 'contexts/UniversalLessonBuilderContext';

import ErrorBoundary from 'components/Error/ErrorBoundary';
import {lazy, Suspense} from 'react';
const InstitutionBuilder = lazy(
  () =>
    import('dashboard/Admin/Institutons/Builders/InstitutionBuilder/InstitutionBuilder')
);
const ClassRoomBuilder = lazy(
  () => import('dashboard/Admin/Institutons/EditBuilders/ClassRoom/ClassRoomBuilder')
);
const AddProfileCheckpoint = lazy(
  () =>
    import(
      'dashboard/Admin/Institutons/EditBuilders/CurricularsView/TabsActions/AddProfileCheckpoint'
    )
);
const CourseBuilder = lazy(
  () =>
    import(
      'dashboard/Admin/Institutons/EditBuilders/CurricularsView/TabsActions/CourseBuilder/CourseBuilder'
    )
);
const EditProfileCheckpoint = lazy(
  () =>
    import(
      'dashboard/Admin/Institutons/EditBuilders/CurricularsView/TabsActions/EditProfileCheckpoint'
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
const UnitList = lazy(
  () =>
    import(
      'dashboard/Admin/Institutons/EditBuilders/CurricularsView/TabsActions/Unit/UnitList'
    )
);

const CurriculumList = lazy(
  () => import('dashboard/Admin/Institutons/Listing/CurriculumList')
);
const RoomsList = lazy(() => import('dashboard/Admin/Institutons/Listing/RoomsList'));
const StaffBuilder = lazy(
  () => import('dashboard/Admin/Institutons/Listing/StaffBuilder')
);
const Students = lazy(() => import('dashboard/Admin/Institutons/Students'));
const LessonsBuilderHome = lazy(
  () => import('dashboard/Admin/LessonsBuilder/LessonsBuilderHome')
);
const Registration = lazy(() => import('dashboard/Admin/UserManagement/Registration'));
const User = lazy(() => import('dashboard/Admin/UserManagement/User'));
const UserLookup = lazy(() => import('dashboard/Admin/UserManagement/UserLookup'));

const Csv = lazy(() => import('dashboard/Csv/Csv'));
const UploadCsv = lazy(() => import('dashboard/Csv/UploadCSV'));

const NavBarRouter = (instProps: any) => {
  const {institute = {}, updateCurricularList, curricular} = instProps;
  const match = useRouteMatch();

  return (
    <Suspense>
      <Switch>
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
                curricular={curricular}
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
              <UnitList
                curricular={curricular}
                instId={institute?.id}
                instName={institute?.name}
              />
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
              <UnitBuilder curricular={curricular} instId={institute?.id} />
            </ErrorBoundary>
          )}
        />
        <Route
          path={`${match.url}/research-and-analytics`}
          exact
          render={() => (
            <ErrorBoundary componentName="Csv">
              <Csv />
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
          path={`${match.url}/manage-users/:userId/staff`}
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
              <ProfileCheckpointlookup />
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
    </Suspense>
  );
};

export default NavBarRouter;
