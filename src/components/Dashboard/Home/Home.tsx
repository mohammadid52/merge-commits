import React, { useEffect, useState, useContext } from 'react';

import SectionTitleV3 from '../../Atoms/SectionTitleV3';
import { getImageFromS3 } from '../../../utilities/services';
import RoomTiles from './RoomTiles';
import TeacherRows from './TeacherRows';
import StudentsTiles from './StudentsTiles';
import { ClassroomControlProps } from '../Dashboard';
import ComponentLoading from '../../Lesson/Loading/ComponentLoading';
import { GlobalContext } from '../../../contexts/GlobalContext';
import isEmpty from 'lodash/isEmpty';
import { getAsset } from '../../../assets';

const Home = (props: ClassroomControlProps) => {
  const { homeData, classList, handleRoomSelection } = props;
  const { state, theme, clientKey } = useContext(GlobalContext);

  const themeColor = getAsset(clientKey, 'themeClassName');

  const user = !isEmpty(state) ? { firstName: state.user.firstName } : null;

  const [teacherList, setTeacherList] = useState<any[]>();
  const [studentsList, setStudentsList] = useState<any[]>();

  const getImageURL = async (uniqKey: string) => {
    const imageUrl: any = await getImageFromS3(uniqKey);
    if (imageUrl) {
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
          image: await (studentObj.student.image ? getImageURL(studentObj.student.image) : null),
        },
      };
    })
  );

  useEffect(() => {
    const fetchAndProcessDashboardData = async () => {
      setTeacherList(await teacherListWithImages);
      setStudentsList(await studentsListWithImages);
    };
    if (homeData && homeData.length > 0) {
      fetchAndProcessDashboardData();
    }
  }, [homeData]);

  return (
    <>
      {homeData ? (
        <>
          {user && (
            <div className={`${theme.section} mt-4 px-6 py-4 m-auto bg-indigo-500 text-white rounded-lg`}>
              <h2 className={`text-base font-normal`}>Welcome, What do you want to learn today, {user.firstName} ?</h2>
            </div>
          )}

          <SectionTitleV3 title={'Your Classrooms'} />
          <RoomTiles handleRoomSelection={handleRoomSelection} classList={classList} />
          <SectionTitleV3 title={'Your Teachers'} />
          <TeacherRows teacherList={teacherList} />
          <SectionTitleV3 spacing="pt-6 pb-4" title={'Your Classmates'} />
          <StudentsTiles studentsList={studentsList} />
        </>
      ) : (
        <ComponentLoading />
      )}
    </>
  );
};

export default Home;
