import React from 'react';
import Registration from '@components/Dashboard/Admin/UserManagement/Registration';
import Csv from '@components/Dashboard/Csv/Csv';
import { UniversalLessonBuilderProvider } from '@contexts/UniversalLessonBuilderContext';
import {Route, Switch, useHistory, useRouteMatch} from 'react-router-dom';
import LessonsBuilderHome from '../LessonsBuilder/LessonsBuilderHome';
import ClassBuilder from './Builders/ClassBuilder';
import InstitutionBuilder from './Builders/InstitutionBuilder/InstitutionBuilder';
import ClassRoomBuilder from './EditBuilders/ClassRoom/ClassRoomBuilder';
import CourseBuilder from './EditBuilders/CurricularsView/TabsActions/CourseBuilder/CourseBuilder';
import EditClass from './EditBuilders/EditClass';
import ClassList from './Listing/ClassList';
import CurriculumList from './Listing/CurriculumList';
import RoomsList from './Listing/RoomsList';
import StaffBuilder from './Listing/StaffBuilder';

const InstitutionInfoView = (instProps: any) => {
    const {institute, tabProps} = instProps;
    const match = useRouteMatch();
    const history = useHistory();
    console.log(match.url, 'inside InstitutionInfoView');
    
    return (
        <Switch>
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
                    path={`${match.url}/class-creation`}
                    exact
                    render={() => (
                      <ClassBuilder
                        instId={institute?.id}
                        toggleUpdateState={instProps.toggleUpdateState}
                      />
                    )} // Create new class
                  />
                  {/* <Route
                    path={`${match.url}/class-edit/:classId`}
                    exact
                    render={() => (
                      <EditClass
                        instId={institute?.id}
                        toggleUpdateState={instProps.toggleUpdateState}
                      />
                    )} // Edit current class
                  /> */}
                  <Route
                    path={`${match.url}/class-rooms`}
                    exact
                    render={() => (
                      <RoomsList instId={institute?.id} instName={institute?.name} />
                    )}
                  />
                  <Route
                    path={`${match.url}/room-creation`}
                    exact
                    render={() => (
                      <ClassRoomBuilder
                        instId={institute?.id}
                        toggleUpdateState={instProps.toggleUpdateState}
                      />
                    )} // Create new room
                  />
                  <Route
                    path={`${match.url}/room-edit/:roomId`}
                    render={() => (
                      <ClassRoomBuilder
                        instId={institute?.id}
                        toggleUpdateState={instProps.toggleUpdateState}
                      />
                    )} // Edit current room.
                  />
                  <Route
                    path={`${match.url}/register-user`}
                    render={() => <Registration isInInstitute instId={institute?.id} />} // Register new user to roo,
                  />
                  <Route
                    path={`${match.url}/courses`}
                    exact
                    render={() => (
                      <CurriculumList
                        curricular={instProps?.institute?.curricula}
                        instId={institute?.id}
                        instName={institute?.name}
                      />
                    )}
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
                    path={`${match.url}/course-builder`}
                    exact
                    render={() => <CourseBuilder instId={institute?.id} />} // Create new course
                  />
                  <Route
                    path={`${match.url}/course-builder/:courseId`}
                    render={() => <CourseBuilder instId={institute?.id} />} // Create new course
                  />
                  <UniversalLessonBuilderProvider>
                    <Route
                      path={`${match.url}/lessons`}
                      render={() => <LessonsBuilderHome instId={institute?.id} />}
                    />
                  </UniversalLessonBuilderProvider>
                  {/* <Route
                    path={`${match.url}/lessons`}
                    render={() => (
                      <LessonsList
                        isInInstitution
                        title={`Lessons`}
                        instId={institute?.id}
                      />
                    )}
                  />
                  <Route
                    path={`${match.url}/lessons-builder`}
                    render={() => (
                      <LessonBuilder
                        isInInstitution
                        title={`Lessons`}
                        instId={institute?.id}
                      />
                    )}
                  /> */}
                </Switch>
    )
}

export default InstitutionInfoView