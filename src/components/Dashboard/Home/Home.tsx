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

const Home = (props: ClassroomControlProps) => {
  const { homeData, classList } = props;
  const { state, dispatch, theme } = useContext(GlobalContext);

  const user = !isEmpty(state) ? { firstName: state.user.firstName, preferredName: state.user.firstName } : null;

  useEffect(() => {
    if (state.user.role === 'ST') {
      dispatch({ type: 'UPDATE_CURRENTPAGE', payload: { data: 'home' } });
    }
  }, []);

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
      return { ...teacherObj, image: await (teacherObj.image ? getImageURL(teacherObj.image) : null) };
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
          {/* Header */}
          {user && (
            <div className={`${theme.section} mt-6 mb-4 px-6 py-4 m-auto bg-indigo-500 text-white rounded-lg`}>
              <h2 className={`text-base font-normal`}>
                Welcome, What do you want to learn today, {user.preferredName || ''} {user.firstName} ?
              </h2>
            </div>
          )}

          {/* Classroom Section */}
          <SectionTitleV3 extraContainerClass={`${theme.section}`} title={'Your Classrooms'} />
          <RoomTiles classList={classList} />

          {/* Teachers Section */}
          <SectionTitleV3 extraContainerClass={`${theme.section}`} title={'Your Teachers'} />
          <TeacherRows teacherList={teacherList} />

          {/* Classmates Section */}
          <SectionTitleV3 extraContainerClass={`${theme.section}`} spacing="pt-6 pb-4" title={'Your Classmates'} />
          <StudentsTiles state={state} studentsList={studentsList} />
        </>
      ) : (
        <ComponentLoading />
      )}
    </>
  );
};

export default Home;
