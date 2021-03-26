import React, { lazy, Suspense, useContext, useEffect, useState } from 'react';
import API, { graphqlOperation } from '@aws-amplify/api';
import { GlobalContext } from '../../../contexts/GlobalContext';
import * as customQueries from '../../../customGraphql/customQueries';
import ContentCard from '../../Atoms/ContentCard';
import ContentCardTitle from '../../Atoms/ContentCardTitle';
import SectionTitleV2 from '../../Atoms/SectionTitleV2';
import { getImageFromS3 } from '../../../utilities/services';

const Home = () => {
  const { state } = useContext(GlobalContext);
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
      console.log(imageUrl)
      return imageUrl
    } else {
      return ''
    }
  }

  const getTeacherList =
    homeData && homeData.length > 0
      ? homeData.reduce( (acc: any[], dataObj: any) => {
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

  const teacherListWithImages = Promise.all(getTeacherList.map(async (teacherObj: any, idx: number) => {
    return {...teacherObj, image: teacherObj.image ? await getImageURL(teacherObj.image) : null}
  }))

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

  const studentsListWithImages = Promise.all(getStudentsList.map(async (studentObj: any, idx: number)=> {
    return {...studentObj, student: {...studentObj.student,  image: studentObj.student.image ? await getImageURL(studentObj.student.image) : null}}
  }));

  const getClassList =
    homeData && homeData.length > 0
      ? homeData.reduce((acc: any[], dataObj: any) => {
        return [...acc, { name: dataObj.class.name, students: dataObj.class.students }];
      }, [])
      : [];

  useEffect(()=>{
    const fetchAndProcessDashboardData = async()=>{
      setTeacherList(await teacherListWithImages)
      setStudentsList(await studentsListWithImages);
      setClassList(getClassList)
    }
    if(homeData && homeData.length > 0){
      fetchAndProcessDashboardData()
    }
  },[homeData])


  return (
    <>
      <SectionTitleV2 title={`Your Classrooms:`}/>
      <ContentCard>
        <div className={`grid grid-cols-6 gap-2`}>
          {classList &&
            classList.length > 0 &&
            classList.map((classObj: { name: string; students: any[] }, idx: number) => {
              return (
                <div key={`home_class_${idx}`} className={`w-full p-2 flex flex-col justify-center items-center`}>
                  <div
                    className={`w-32 h-48 flex justify-center content-center items-center rounded border border-dark-gray border-opacity-10`}>
                    <span className={`w-full h-auto p-2`}>{'no image'}</span>
                  </div>
                  <div className={`text-center`}>
                    <h4>{classObj.name}</h4>
                  </div>
                </div>
              );
            })}
        </div>
      </ContentCard>

      <SectionTitleV2 title={`Your Teachers:`}/>
      <ContentCard>
        <div className={`grid grid-cols-6 gap-2`}>
          {teacherList &&
            teacherList.length > 0 &&
          teacherList.map(
              (teacher: { firstName: string; lastName: string; image: string | null }, idx: number) => {
                return (
                  <div key={`home_teacher_${idx}`} className={`w-full p-2 flex flex-col justify-center items-center`}>
                    <div
                      className={`w-32 h-32 flex justify-center content-center items-center rounded-full border border-dark-gray border-opacity-10 overflow-hidden`}>
                        <img src={`${teacher.image}`} alt={`teacher_${idx}_avatar`} className={`object-cover h-32 w-full`}/>
                    </div>
                    <div className={`text-center`}>
                      <h4>{teacher.firstName}</h4>
                      <p>{teacher.lastName}</p>
                    </div>
                  </div>
                );
              }
            )}
        </div>
      </ContentCard>

      <SectionTitleV2 title={`Your Classmates:`}/>
      <ContentCard >
        <div className={`grid grid-cols-8 gap-2`}>
          {studentsList &&
            studentsList.length > 0 &&
            studentsList.map(
              (studentObj: { student: { firstName: string; lastName: string; image: string | null } }, idx: number) => {
                return (
                  <div key={`home_student_${idx}`} className={`w-full p-2 flex flex-col justify-center items-center`}>
                    <div
                      className={`w-16 h-16 flex justify-center content-center items-center rounded-full border border-dark-gray border-opacity-10 overflow-hidden`}>
                        <img src={`${studentObj.student.image}`} alt={`student_${idx}_avatar`} className={`object-cover h-16 w-full`}/>
                    </div>
                    <div className={`text-center`}>
                      <h4>{studentObj.student.firstName}</h4>
                      <p>{studentObj.student.lastName}</p>
                    </div>
                  </div>
                );
              }
            )}
        </div>
      </ContentCard>
    </>
  );
};

export default Home;
