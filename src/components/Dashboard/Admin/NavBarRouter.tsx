import React from 'react';
import {Route, Switch, useRouteMatch} from 'react-router-dom';

import {UniversalLessonBuilderProvider} from 'contexts/UniversalLessonBuilderContext';

import LessonsBuilderHome from 'components/Dashboard/Admin/LessonsBuilder/LessonsBuilderHome';
import User from 'components/Dashboard/Admin/UserManagement/User';
import UserLookup from 'components/Dashboard/Admin/UserManagement/UserLookup';
import InstitutionBuilder from 'components/Dashboard/Admin/Institutons/Builders/InstitutionBuilder/InstitutionBuilder';
import ClassRoomBuilder from 'components/Dashboard/Admin/Institutons/EditBuilders/ClassRoom/ClassRoomBuilder';
import CourseBuilder from 'components/Dashboard/Admin/Institutons/EditBuilders/CurricularsView/TabsActions/CourseBuilder/CourseBuilder';
import UnitBuilder from 'components/Dashboard/Admin/Institutons/EditBuilders/CurricularsView/TabsActions/Unit/UnitBuilder';
import UnitList from 'components/Dashboard/Admin/Institutons/EditBuilders/CurricularsView/TabsActions/Unit/UnitList';
import ClassList from 'components/Dashboard/Admin/Institutons/Listing/ClassList';
import CurriculumList from 'components/Dashboard/Admin/Institutons/Listing/CurriculumList';
import RoomsList from 'components/Dashboard/Admin/Institutons/Listing/RoomsList';
import StaffBuilder from 'components/Dashboard/Admin/Institutons/Listing/StaffBuilder';
import Students from 'components/Dashboard/Admin/Institutons/Students';
import Registration from 'components/Dashboard/Admin/UserManagement/Registration';
import Csv from '../Csv/Csv';
import UploadCsv from '../Csv/UploadCSV';
import AnalyticsDashboard from '../Csv/AnalyticsDashboard';
import AddProfileCheckpoint from 'components/Dashboard/Admin/Institutons/EditBuilders/CurricularsView/TabsActions/AddProfileCheckpoint';
import ProfileCheckpointlookup from 'components/Dashboard/Admin/Institutons/EditBuilders/CurricularsView/TabsActions/ProfileCheckpointlookup';
import EditProfileCheckpoint from 'components/Dashboard/Admin/Institutons/EditBuilders/CurricularsView/TabsActions/EditProfileCheckpoint';

const NavBarRouter = (instProps: any) => {
  const {institute = {}, updateCurricularList, curricular} = instProps;
  const match = useRouteMatch();

  return (
    <Switch>
      <Route
        path={`${match.url}/class`}
        exact
        render={() => (
          <ClassList
            classes={institute?.classes}
            instId={institute?.id}
            instName={institute?.name}
          />
        )}
      />
      <Route
        path={`${match.url}/class-rooms`}
        exact
        render={() => <RoomsList instId={institute?.id} instName={institute?.name} />}
      />
      <Route
        path={`${match.url}/room-creation`}
        exact
        render={() => <ClassRoomBuilder instId={institute?.id} />} // Create new room
      />
      <Route
        path={`${match.url}/room-edit/:roomId`}
        render={() => <ClassRoomBuilder instId={institute?.id} />} // Edit current room.
      />
      <Route
        path={`${match.url}/register-user`}
        render={() => <Registration isInInstitute instId={institute?.id} />} // Register new user to roo,
      />
      <Route
        path={`${match.url}/students`}
        exact
        render={() => <Students instituteId={instProps?.institute?.id} isInInstitute />}
      />
      <Route
        path={`${match.url}/courses`}
        exact
        render={() => (
          <CurriculumList
            updateCurricularList={updateCurricularList}
            curricular={curricular && curricular}
            instId={institute?.id}
            instName={institute?.name}
          />
        )}
      />
      <Route
        path={`${match.url}/units`}
        exact
        render={() => <UnitList instId={institute?.id} instName={institute?.name} />}
      />
      <Route
        exact
        path={`${match.url}/units/add`}
        render={() => <UnitBuilder instId={institute?.id} />}
      />
      <Route
        exact
        path={`${match.url}/units/:unitId/edit`}
        render={() => <UnitBuilder instId={institute?.id} />}
      />
      <Route
        path={`${match.url}/research-and-analytics`}
        exact
        render={() => <Csv institutionId={institute?.id} />}
      />
      <Route
        path={`${match.url}/research-and-analytics/upload-csv`}
        exact
        render={() => <UploadCsv institutionId={institute?.id} />}
      />
      <Route
        path={`${match.url}/research-and-analytics/analytics-dashboard`}
        exact
        render={() => <AnalyticsDashboard institutionId={institute?.id} />}
      />
      <Route
        path={`${match.url}/staff`}
        exact
        render={() => (
          <StaffBuilder
            serviceProviders={institute.serviceProviders}
            instituteId={instProps?.institute?.id}
            instName={institute?.name}
          />
        )}
      />
      <Route
        path={`${match.url}/edit`}
        exact
        render={() => (
          <InstitutionBuilder
            institutionId={institute?.id}
            institute={instProps.institute}
            loading={instProps.loading}
            postInfoUpdate={instProps.postInfoUpdate}
            updateServiceProviders={instProps.updateServiceProviders}
            toggleUpdateState={instProps.toggleUpdateState}
          />
        )}
      />
      <Route
        path={`${match.url}/manage-users`}
        exact
        render={() => <UserLookup instituteId={instProps?.institute?.id} isInInstitute />}
      />
      <Route
        path={`${match.url}/manage-users/:userId`}
        render={() => <User instituteId={instProps?.institute?.id} />}
      />
      <Route
        path={`${match.url}/course-builder`}
        exact
        render={() => <CourseBuilder instId={institute?.id} />} // Create new course
      />
      <Route
        exact
        path={`${match.url}/course-builder/:courseId`}
        render={() => <CourseBuilder instId={institute?.id} />} // Edit course
      />
      <Route
        path={`${match.url}/course-builder/:courseId/checkpoint/addNew`}
        render={() => <AddProfileCheckpoint />} // Edit course
      />
      <Route
        path={`${match.url}/course-builder/:courseId/checkpoint/addPrevious`}
        render={() => <ProfileCheckpointlookup instId={institute?.id} />} // Edit course
      />
      <Route
        path={`${match.url}/course-builder/:courseId/checkpoint/edit/:id`}
        render={() => <EditProfileCheckpoint />} // Edit course
      />
      <UniversalLessonBuilderProvider>
        <Route
          path={`${match.url}/lessons`}
          render={() => <LessonsBuilderHome instId={institute?.id} />}
        />
      </UniversalLessonBuilderProvider>
    </Switch>
  );
};

export default NavBarRouter;
