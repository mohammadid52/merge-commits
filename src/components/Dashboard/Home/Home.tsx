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
          {/* Hero Section */}
          <div className="relative bg-indigo-800">
            <div className="absolute inset-0">
              <img
                className="w-full h-full object-cover"
                src="https://images.unsplash.com/photo-1525130413817-d45c1d127c42?ixlib=rb-1.2.1&ixqx=5od8bulhcw&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1920&q=60&&sat=-100"
                alt=""
              />
              <div
                className="absolute inset-0 bg-indigo-800"
                // style="mix-blend-mode: multiply;"
                aria-hidden="true"></div>
            </div>
            <div className="relative h-full flex flex-col max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
              <div />
              <h1 className="text-4xl font-extrabold tracking-tight text-center text-white sm:text-5xl lg:text-6xl">
                Dashboard
              </h1>
            </div>
          </div>
          {/* Header */}
          {user && (
            <div className={`${theme.section} mt-6 mb-4 px-6 py-4 m-auto bg-indigo-500 text-white rounded-lg`}>
              <h2 className={`text-base font-normal`}>
                Welcome, What do you want to learn today, {user.preferredName || ''} {user.firstName} ?
              </h2>
            </div>
          )}

          {/* Classroom Section */}
          <SectionTitleV3 title={'Your Classrooms'} />
          <RoomTiles classList={classList} />

          {/* Teachers Section */}
          <div className="my-6">
            <SectionTitleV3
              title={'Your Teachers'}
              fontSize="lg"
              fontStyle="semibold"
              extraClass="leading-6 text-gray-900"
            />
            <TeacherRows teacherList={teacherList} />
          </div>
          {/* Classmates Section */}
          <div className="my-6">
            <StudentsTiles state={state} studentsList={studentsList} />
          </div>
        </>
      ) : (
        <ComponentLoading />
      )}
    </>
  );
};

export default Home;
