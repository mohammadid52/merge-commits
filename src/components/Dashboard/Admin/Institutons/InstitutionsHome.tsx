import React, { useContext, useEffect, useState } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

// Instituttion
import InstitutionLookup from './InstitutionLookup';
import Institution from './Institution';
import InstitutionAdd from './InstitutionAdd';

// Institute info tabs.
import ClassBuilder from './Builders/ClassBuilder';
import RoomBuilder from './Builders/RoomBuilder';
import CurricularBuilder from './Builders/CurricularBuilder';
import EditClass from './EditBuilders/EditClass';
import EditCurricular from './EditBuilders/EditCurricular';
import EditRoom from './EditBuilders/EditRoom';
import CurricularView from './EditBuilders/CurricularsView/CurricularView';

// Curricular tabs.
import AddTopic from './EditBuilders/CurricularsView/TabsActions/AddTopic';
import AddMeasurement from './EditBuilders/CurricularsView/TabsActions/AddMeasurement';
import AddSyllabus from './EditBuilders/CurricularsView/TabsActions/AddSyllabus';
import EditTopic from './EditBuilders/CurricularsView/TabsActions/EditTopic';
import EditMeasurement from './EditBuilders/CurricularsView/TabsActions/EditMeasurement';
import EditSyllabus from './EditBuilders/CurricularsView/TabsActions/EditSyllabus';
import AddLearningObjective from './EditBuilders/CurricularsView/TabsActions/AddLearningObjective';
import EditLearningObjective from './EditBuilders/CurricularsView/TabsActions/EditLearningObjective';
import AddProfileCheckpoint from './EditBuilders/CurricularsView/TabsActions/AddProfileCheckpoint';
import ProfileCheckpointlookup from './EditBuilders/CurricularsView/TabsActions/ProfileCheckpointlookup';
import EditProfileCheckpoint from './EditBuilders/CurricularsView/TabsActions/EditProfileCheckpoint';
import { DashboardProps } from '../../Dashboard';
import { GlobalContext } from '../../../../contexts/GlobalContext';
import UnitBuilder from './EditBuilders/CurricularsView/TabsActions/Unit/UnitBuilder';
import ClassRoomBuilder from './EditBuilders/ClassRoom/ClassRoomBuilder';

const InstitutionsHome: React.FC<DashboardProps> = (props: DashboardProps) => {
  const { setCurrentPage } = props;
  const { state, dispatch } = useContext(GlobalContext);
  const match = useRouteMatch();
  const [tabsData, setTabsData] = useState({ inst: 0, instCurr: 0 });
  const tabProps = { tabsData, setTabsData };
  // TODO: Need to setup route saperately if required,
  // currently everything is tied to institutions.
  // so curricular can be open after selecting any specific institute only.
  // Need to discuss this with Mike.

  //  INITIALIZE CURRENT PAGE LOCATION
  useEffect(() => {
    dispatch({ type: 'UPDATE_CURRENTPAGE', payload: { data: 'manage-institutions' } });
  }, [state.user.role]);

  return (
    <div className={`w-full h-full px-2 py-8 md:p-8 flex justify-center`}>
      <Switch>
        <Route
          exact
          path={`${match.url}`}
          render={() => <InstitutionLookup />} // Institutions list
        />
        <Route
          path={`${match.url}/add`}
          render={() => <InstitutionAdd />} // Create New institution.
        />
        <Route
          path={`${match.url}/institution/class-creation`}
          render={() => <ClassBuilder />} // Create new class
        />
        <Route
          path={`${match.url}/institution/curricular-creation`}
          render={() => <CurricularBuilder />} // Create new curricular
        />
        <Route
          path={`${match.url}/institution/room-creation`}
          render={() => <RoomBuilder />} // Create new room
        />
        <Route
          path={`${match.url}/institution`}
          render={() => <Institution tabProps={tabProps} />} // Institution info page
        />
        <Route
          path={`${match.url}/class-edit`}
          render={() => <EditClass />} // Edit current class
        />
        <Route
          path={`${match.url}/room-edit`}
          render={() => <ClassRoomBuilder />} // Edit current room.
        />
        {/* <Route
          path={`${match.url}/:institutionId/curricular/edit`}
          render={() => <EditCurricular />} // Edit current curricular
        /> */}
        {/* <Route
          path={`${match.url}/:institutionId/curricular/:curricularId/learning-objective/add`}
          render={() => <AddLearningObjective />} // Add new topic to curricular
        /> */}
        <Route
          path={`${match.url}/:institutionId/curricular/:curricularId/learning-objective/edit/:id`}
          render={() => <EditLearningObjective />} // Edit curricular topic
        />
        {/* <Route
          path={`${match.url}/curricular/:curricularId/topic/add`}
          render={() => <AddTopic />} // Add new topic to curricular
        /> */}
        <Route
          path={`${match.url}/curricular/:curricularId/topic/edit/:id`}
          render={() => <EditTopic />} // Edit curricular topic
        />
        {/* <Route
          path={`${match.url}/curricular/:curricularId/measurement/add`}
          render={() => <AddMeasurement />} // Add new measurement to curricular
        /> */}
        <Route
          path={`${match.url}/curricular/:curricularId/measurement/edit/:id`}
          render={() => <EditMeasurement />} // Edit curricular measurement
        />
        <Route
          path={`${match.url}/:institutionId/curricular/:curricularId/syllabus/add`}
          render={() => <UnitBuilder />} // Add new syllabus to curricular
        />
        {/* <Route
          path={`${match.url}/:institutionId/curricular/:curricularId/syllabus/add`}
          render={() => <AddSyllabus />} // Add new syllabus to curricular
        /> */}
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
      </Switch>
    </div>
  );
};

export default InstitutionsHome;
