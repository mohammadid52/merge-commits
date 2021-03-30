import React, { lazy, Suspense, useContext, useEffect, useState } from 'react';
import API, { graphqlOperation } from '@aws-amplify/api';
import { GlobalContext } from '../../../contexts/GlobalContext';
import * as customQueries from '../../../customGraphql/customQueries';
import ContentCard from '../../Atoms/ContentCard';
import ContentCardTitle from '../../Atoms/ContentCardTitle';
import SectionTitleV2 from '../../Atoms/SectionTitleV2';
import { getImageFromS3 } from '../../../utilities/services';
import RoomTiles from './RoomTiles';
import TeacherRows from './TeacherRows';
import StudentsTiles from './StudentsTiles';
import { getRoom } from '../../../graphql/queries';
import { ClassroomControlProps } from '../Dashboard';

const Home = (props: ClassroomControlProps) => {
  const {
    activeRoom,
    roomsLoading,
    handleRoomSelection,
  } = props;
  const { state, dispatch } = useContext(GlobalContext);
  const [homeData, setHomeData] = useState<{ class: any }[]>();
  const [teacherList, setTeacherList] = useState<any[]>();
  const [classList, setClassList] = useState<any[]>();
  const [studentsList, setStudentsList] = useState<any[]>();

  const getDashboardData = async (authId: string, email: string) => {
    try {
      const dashboardDataFetch: any = await API.graphql(
        graphqlOperation(customQueries.getDashboardData, {
          authId: authId,
          email: email,
        })
      );
      const response = await dashboardDataFetch;
      const arrayOfResponseObjects = response?.data.getPerson.classes.items;
      setHomeData(arrayOfResponseObjects);
    } catch (e) {
      console.error('getDashbaordData -> ', e);
    } finally {
      // need to do some cleanup
    }
  };

  useEffect(() => {
    if (state.user.authId) {
      const authId = state.user.authId;
      const email = state.user.email;
      getDashboardData(authId, email);
    }
  }, [state.user.authId]);

  const getImageURL = async (uniqKey: string) => {
    const imageUrl: any = await getImageFromS3(uniqKey);
    if (imageUrl) {
      console.log(imageUrl);
      return imageUrl;
    } else {
      return '';
    }
  };

  const getTeacherList =
    homeData && homeData.length > 0
      ? homeData.reduce((acc: any[], dataObj: any) => {
          const teacherObj = dataObj.class.rooms.items[0].teacher;
          const teacherIsPresent = acc.find(
            (teacher: any) => teacher.firstName === teacherObj.firstName && teacher.lastName === teacherObj.lastName
          );
          if (teacherIsPresent) {
            return acc;
          } else {
            return [...acc, teacherObj];
          }
        }, [])
      : [];

  const teacherListWithImages = Promise.all(
    getTeacherList.map(async (teacherObj: any, idx: number) => {
      return { ...teacherObj, image: teacherObj.image ? await getImageURL(teacherObj.image) : null };
    })
  );

  const getStudentsList =
    homeData && homeData.length > 0
      ? homeData
          .reduce((acc: any[], dataObj: any) => {
            return [...acc, ...dataObj.class.students.items];
          }, [])
          .reduce((acc: any[], studentObj: any) => {
            const studentIsPresent = acc.find(
              (studentObj2: any) =>
                studentObj2.student.firstName === studentObj.student.firstName &&
                studentObj2.student.lastName === studentObj.student.lastName
            );
            if (studentIsPresent) {
              return acc;
            } else {
              return [...acc, studentObj];
            }
          }, [])
      : [];

  const studentsListWithImages = Promise.all(
    getStudentsList.map(async (studentObj: any, idx: number) => {
      return {
        ...studentObj,
        student: {
          ...studentObj.student,
          image: studentObj.student.image ? await getImageURL(studentObj.student.image) : null,
        },
      };
    })
  );

  const getClassList =
    homeData && homeData.length > 0
      ? homeData.reduce((acc: any[], dataObj: any) => {
          return [...acc, { name: dataObj.class.name, rooms: dataObj.class.rooms, students: dataObj.class.students }];
        }, [])
      : [];


  useEffect(() => {
    const fetchAndProcessDashboardData = async () => {
      setTeacherList(await teacherListWithImages);
      setStudentsList(await studentsListWithImages);
      setClassList(getClassList);
    };
    if (homeData && homeData.length > 0) {
      fetchAndProcessDashboardData();
    }
  }, [homeData]);

  const getRoomsFromClassList =
    classList && classList.length > 0
    ? classList.reduce((acc: any[], classObj: any) => {
        return [...acc, classObj.rooms.items[0]]
      },[])
      :[];


  useEffect(() => {
      dispatch({
        type: 'UPDATE_ROOM',
        payload: {
          property: 'rooms',
          data: getRoomsFromClassList,
        },
      });
  }, [classList]);


  return (
    <>
      <SectionTitleV2 title={`Your Classrooms:`} />
      <RoomTiles
        handleRoomSelection={handleRoomSelection}
        classList={classList} />

      <SectionTitleV2 title={`Your Teachers:`} />
      <TeacherRows teacherList={teacherList} />

      <SectionTitleV2 title={`Your Classmates:`} />
      <StudentsTiles studentsList={studentsList} />
    </>
  );
};

export default Home;
