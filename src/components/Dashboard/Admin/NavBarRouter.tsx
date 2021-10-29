import React from 'react';
import {Route, Switch, useRouteMatch} from 'react-router-dom';

import LessonsBuilderHome from './LessonsBuilder/LessonsBuilderHome';
import User from './UserManagement/User';
import UserLookup from './UserManagement/UserLookup';
import InstitutionBuilder from './Institutons/Builders/InstitutionBuilder/InstitutionBuilder';
import ClassRoomBuilder from './Institutons/EditBuilders/ClassRoom/ClassRoomBuilder';
import CourseBuilder from './Institutons/EditBuilders/CurricularsView/TabsActions/CourseBuilder/CourseBuilder';
import UnitBuilder from './Institutons/EditBuilders/CurricularsView/TabsActions/Unit/UnitBuilder';
import UnitList from './Institutons/EditBuilders/CurricularsView/TabsActions/Unit/UnitList';
import ClassList from './Institutons/Listing/ClassList';
import CurriculumList from './Institutons/Listing/CurriculumList';
import RoomsList from './Institutons/Listing/RoomsList';
import StaffBuilder from './Institutons/Listing/StaffBuilder';
import Students from './Institutons/Students';
import Registration from './UserManagement/Registration';
import Csv from '../Csv/Csv';
import {UniversalLessonBuilderProvider} from '@contexts/UniversalLessonBuilderContext';

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
        render={() => <Students instId={institute?.id} />}
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
        path={`${match.url}/course-builder/:courseId`}
        render={() => <CourseBuilder instId={institute?.id} />} // Edit course
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
