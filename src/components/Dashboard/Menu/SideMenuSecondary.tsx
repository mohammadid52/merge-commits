import React, { useContext, useEffect, useState } from 'react';
import { SideMenuProps } from '../Dashboard';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { API, graphqlOperation } from '@aws-amplify/api';
import * as customQueries from '../../../customGraphql/customQueries';
import * as queries from '../../../graphql/queries';
import { getArrayOfUniqueValueByProperty } from '../../../utilities/arrays';
import { createFilterToFetchSpecificItemsOnly } from '../../../utilities/strings';

interface Room {
  id: string;
  classID: string;
  teacherAuthID: string;
  name: string;
}

const SideMenuSecondary = (props: SideMenuProps) => {
  // Essentials
  const { isTeacher, currentPage, setCurrentPage } = props;
  const { state, theme, dispatch } = useContext(GlobalContext);
  // Fetching results
  const [classIds, setClassIds] = useState<string[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [curriculumIds, setCurriculumIds] = useState<string[]>([]);
  const [syllabusId, setSyllabusId] = useState<string[]>([]);
  const [syllabusLessons, setSyllabusLessons] = useState<any>([]);
  // Menu state
  const [loaded, setLoaded] = useState<boolean>(false);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [activeMenuItem, setActiveMenuItem] = useState<string[]>([]);

  useEffect(() => {
    const listClassStudents = async () => {
      const standardUserID = '19944846-faa9-4f94-a2b1-434902d4aa49';

      try {
        const classesFetch: any = await API.graphql(
          graphqlOperation(customQueries.listClassStudents, { studentID: standardUserID })
        );
        const response = await classesFetch;
        const arrayOfResponseObjects = response?.data?.listClassStudents?.items;
        const arrayOfClassIDs = getArrayOfUniqueValueByProperty(arrayOfResponseObjects, 'classID');
        setClassIds(arrayOfClassIDs);
      } catch (e) {
        console.error('Classes Fetch ERR: ', e);
      }
    };
    listClassStudents();
  }, []);

  useEffect(() => {
    const listRooms = async () => {
      if (classIds.length > 0) {
        try {
          const roomsFetch: any = await API.graphql(
            graphqlOperation(customQueries.listRooms, {
              filter: { ...createFilterToFetchSpecificItemsOnly(classIds, 'classID') },
            })
          );
          const response = await roomsFetch;
          const arrayOfResponseObjects = response?.data?.listRooms?.items;
          setRooms(arrayOfResponseObjects);
        } catch (e) {
          console.error('Rooms Fetch ERR: ', e);
        } finally {
          setLoaded(true);
        }
      }
    };
    listRooms();
  }, [classIds]);

  useEffect(() => {
    const listRoomCurriculums = async () => {
      if (rooms.length > 0) {
        try {
          const roomIds = getArrayOfUniqueValueByProperty(rooms, 'id');
          const roomCurriculumsFetch: any = API.graphql(
            graphqlOperation(customQueries.listRoomCurriculums, {
              filter: { ...createFilterToFetchSpecificItemsOnly(roomIds, 'roomID') },
            })
          );
          const response = await roomCurriculumsFetch;
          console.log('list room curriculums : ', response);
          const arrayOfResponseObjects = response?.data?.listRoomCurriculums?.items;
          const arrayOfCurriculumIds = getArrayOfUniqueValueByProperty(arrayOfResponseObjects, 'curriculumID');
          setCurriculumIds(arrayOfCurriculumIds);
        } catch (e) {
          console.error('RoomCurriculums fetch ERR: ', e);
        } finally {
          console.log('curriculum ids: ', curriculumIds);
        }
      }
    };
    listRoomCurriculums();
  }, [rooms]);

  useEffect(() => {
    const listSyllabus = async () => {
      if (curriculumIds.length > 0) {
        try {
          const syllabusMultiFetch: any = API.graphql(
            graphqlOperation(customQueries.listSyllabuss, {
              filter: { ...createFilterToFetchSpecificItemsOnly(curriculumIds, 'curriculumID') },
            })
          );
          const response = await syllabusMultiFetch;
          const arrayOfResponseObjects = response?.data?.listSyllabuss?.items;
          const arrayOfSyllabusIds = getArrayOfUniqueValueByProperty(arrayOfResponseObjects, 'id');
          setSyllabusId(arrayOfSyllabusIds);
        } catch (e) {
          console.error('Curriculum ids: ', e);
        }
      }
    };
    listSyllabus();
  }, [curriculumIds]);

  useEffect(() => {
    const listSyllabusLessons = async () => {
      if (syllabusId.length > 0) {
        // BELOW SHOULD BE REMOVED WHEN THERE ARE MULTIPLE SYLLABUSES
        const getActiveSyllabus = syllabusId.filter((syllabusObject: any) => {
          if(syllabusObject.hasOwnProperty('active') && syllabusObject.active){
            return syllabusObject;
          }
        })
        const syllabusIdSource = getActiveSyllabus.length > 0 ? getActiveSyllabus[0] : syllabusId[0];
        try {
          const syllabusLessonFetch: any = API.graphql(
            graphqlOperation(customQueries.listSyllabusLessons, {
              syllabusID: syllabusIdSource,
            })
          );
          const response = await syllabusLessonFetch;
          const arrayOfResponseObjects = response?.data?.listSyllabusLessons?.items;
          // const arrayOfSyllabusLessons = getArrayOfUniqueValueByProperty(arrayOfResponseObjects, 'id');
          setSyllabusLessons(arrayOfResponseObjects);
        } catch (e) {
          console.error('syllabus lessons: ', e);
        }
      }
    };
    listSyllabusLessons();
  }, [syllabusId]);

  return (
    <div className={`${theme.sidemenu.secondary} mr-2`}>
      {rooms.length > 0 ? (
        rooms.map((room: Room, i: number) => {
          return (
            <div
              key={`room_button_sb${i}`}
              className={`p-2 bg-white border border-dark-gray border-opacity-10 truncate ...`}>
              {room.name}
            </div>
          );
        })
      ) : loaded === false ? (
        <>
          <p className={`w-full p-2`}>Loading rooms...</p>
        </>
      ) : (
        <>
          <p className={`w-full p-2`}>No available rooms.</p>
        </>
      )}
    </div>
  );
};

export default SideMenuSecondary;
