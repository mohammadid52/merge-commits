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
  const { homeData, classList } = props;
  const { state, dispatch, theme, clientKey } = useContext(GlobalContext);
  const dashboardBanner1 = getAsset(clientKey, 'dashboardBanner1');
  const [loading, setLoading] = useState(false);
  const themeColor = getAsset(clientKey, 'themeClassName');

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

  const getUserGreetings = () => {
    if (user?.preferredName) {
      if (user?.preferredName === user?.firstName) {
        return `${user.firstName}`;
      } else {
        return `${user.preferredName} ${user.firstName}`;
      }
    } else {
      return `${user.firstName}`;
    }
  };

  return (
    <>
      {homeData ? (
        <>
          {/* Hero Section */}
          <div className="relative">
            <div className="absolute inset-0 w-full h-60">
              <div className=" bg-black bg-opacity-60 z-0 w-full h-full absolute" />
              <img
                className="object-cover w-full h-full bg-center bg-no-repeat bg-contain"
                src={dashboardBanner1}
                alt=""
              />
            </div>
            <div className="relative h-full flex items-center justify-center flex-col max-w-7xl">
              <h1
                style={{ fontSize: '6rem' }}
                className="z-100 flex align-center self-auto items-center justify-center h-60 text-9xl font-extrabold tracking-tight text-center text-white sm:text-9xl	lg:text-9xl">
                Dashboard
              </h1>
            </div>
          </div>
          {/* Header */}
          {user && (
            <div
              className={`${theme.section} -mt-6 mb-4 px-6 py-4 m-auto ${theme.backGround[themeColor]} text-white rounded`}>
              <h2 className={`text-base text-center font-normal`}>
                Welcome, What do you want to learn today,{' '}
                <span className="font-semibold">{user.preferredName ? user.preferredName : user.firstName}</span> ?
              </h2>
            </div>
          )}

          {/* Classroom Section */}

          <RoomTiles classList={classList} />

          {/* Teachers Section */}
          <div className="my-6">
            <SectionTitleV3
              title={'Your Teachers'}
              fontSize="lg"
              fontStyle="semibold"
              extraContainerClass="max-w-256"
              borderBottom
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
