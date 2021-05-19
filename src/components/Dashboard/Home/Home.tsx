import React, {useEffect, useState, useContext} from 'react';

import SectionTitleV3 from '../../Atoms/SectionTitleV3';
import {getImageFromS3} from '../../../utilities/services';
import RoomTiles from './RoomTiles';
import TeacherRows from './TeacherRows';
import StudentsTiles from './StudentsTiles';
import {ClassroomControlProps} from '../Dashboard';
import ComponentLoading from '../../Lesson/Loading/ComponentLoading';
import {GlobalContext} from '../../../contexts/GlobalContext';
import isEmpty from 'lodash/isEmpty';
import {getAsset} from '../../../assets';
import HeroBanner from '../../Header/HeroBanner';
import times from 'lodash/times';
import {difference} from 'lodash';

export interface ModifiedListProps {
  id: any;
  name: any;
  teacherProfileImg: string;
  bannerImage: string;
  teacher: {email: string; firstName: string; lastName: string; image: string};
  curricula: {
    items: {
      curriculum: {
        name: string;
        description?: string;
        id: string;
        summary?: string;
        type?: string;
      };
    }[];
  };
}

const Home = (props: ClassroomControlProps) => {
  const {homeData, classList, handleRoomSelection, isTeacher} = props;
  const {state, dispatch, theme, clientKey} = useContext(GlobalContext);
  const dashboardBanner1 = getAsset(clientKey, 'dashboardBanner1');
  const themeColor = getAsset(clientKey, 'themeClassName');

  const user = !isEmpty(state)
    ? {firstName: state.user.firstName, preferredName: state.user.firstName}
    : null;

  useEffect(() => {
    if (state.user.role === 'ST') {
      if (state.currentPage !== 'home') {
        // dispatch({ type: 'UPDATE_CURRENTPAGE', payload: { data: 'home' } });
      }
      if (state.activeRoom && state.activeRoom.length > 0) {
        dispatch({type: 'UPDATE_ACTIVEROOM', payload: {data: null}});
      }
    }
  }, [state.user.role]);

  const [teacherList, setTeacherList] = useState<any[]>();
  const [coTeachersList, setCoTeachersList] = useState<any[]>();
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
          if (dataObj?.class?.rooms.items.length > 0) {
            const teacherObj = dataObj?.class?.rooms?.items[0]?.teacher;
            const teacherIsPresent = acc?.find(
              (teacher: any) =>
                teacher?.firstName === teacherObj?.firstName &&
                teacher?.lastName === teacherObj?.lastName
            );
            if (teacherIsPresent) {
              return acc;
            } else {
              return [...acc, teacherObj];
            }
          } else {
            return acc;
          }
        }, [])
      : [];

  const getCoTeacherList = () => {
    let coTeachersList: any[] = [];
    let uniqIds: string[] = [];
    homeData &&
      homeData.length > 0 &&
      homeData.forEach((item: any) => {
        if (item?.class?.rooms?.items.length > 0) {
          if (item?.class?.rooms?.items[0].coTeachers.items.length > 0) {
            item?.class?.rooms?.items[0].coTeachers.items.map((_item: any) => {
              if (!uniqIds.includes(_item.teacher.authId)) {
                uniqIds.push(_item.teacher.authId);
                coTeachersList.push(_item.teacher);
              }
            });
          }
        }
      });

    return coTeachersList;
  };

  const teacherListWithImages =
    getTeacherList.length > 0 &&
    Promise.all(
      getTeacherList.map(async (teacherObj: any, idx: number) => {
        return {
          ...teacherObj,
          image: await (teacherObj.image ? getImageURL(teacherObj.image) : null),
        };
      })
    );
  const coTeacherListWithImages =
    getCoTeacherList().length > 0 &&
    Promise.all(
      getCoTeacherList().map(async (teacherObj: any, idx: number) => {
        return {
          ...teacherObj,
          image: await (teacherObj.image ? getImageURL(teacherObj.image) : null),
        };
      })
    );

  const getStudentsList =
    homeData && homeData.length > 0
      ? homeData
          .reduce((acc: any[], dataObj: any) => {
            return [...acc, ...dataObj?.class?.students?.items];
          }, [])
          .reduce((acc: any[], studentObj: any) => {
            const studentIsPresent = acc.find(
              (studentObj2: any) =>
                studentObj2?.student?.firstName === studentObj?.student?.firstName &&
                studentObj2?.student?.lastName === studentObj?.student?.lastName
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
          ...studentObj?.student,
          image: await (studentObj?.student?.image
            ? getImageURL(studentObj?.student?.image)
            : null),
        },
      };
    })
  );

  const getClassList = (): ModifiedListProps[] => {
    let modifiedClassList: ModifiedListProps[] = [];
    let uniqIds: string[] = [];

    classList &&
      classList.length > 0 &&
      classList.forEach((item: {rooms: {items: any[]}; name: string; id: string}) => {
        item.rooms.items.forEach(async (_item: any, index) => {
          const curriculum = _item.curricula?.items[0].curriculum;
          if (curriculum !== null) {
            const imagePath = curriculum?.image;

            const image = await (imagePath !== null ? getImageFromS3(imagePath) : null);
            const teacherProfileImg = await (_item.teacher.image
              ? getImageFromS3(_item.teacher.image)
              : false);

            const modifiedItem = {
              ..._item,
              roomName: item?.name,
              bannerImage: image,
              teacherProfileImg,
              roomIndex: index,
            };

            // if (!uniqIds.includes(curriculum?.id)) {
            //   uniqIds.push(curriculum?.id);
            // }
            modifiedClassList.push(modifiedItem);
          }
        });
      });

    return modifiedClassList;
  };

  useEffect(() => {
    const fetchAndProcessDashboardData = async () => {
      setTeacherList(await teacherListWithImages);
      setStudentsList(await studentsListWithImages);
      setCoTeachersList(await coTeacherListWithImages);
    };
    if (homeData && homeData.length > 0) {
      fetchAndProcessDashboardData();
    }
  }, [homeData]);

  return (
    <>
      {homeData ? (
        <>
          <div>
            <HeroBanner imgUrl={dashboardBanner1} title={'Dashboard'} />
          </div>
          {/* Header */}
          {user && (
            <div
              className={`${theme.section} -mt-6 mb-4 px-6 py-4 m-auto relative ${theme.backGround[themeColor]} text-white rounded`}>
              <h2 className={`text-base text-center font-normal`}>
                Welcome,{' '}
                <span className="font-semibold">
                  {user.preferredName ? user.preferredName : user.firstName}
                </span>
                . What do you want to {isTeacher ? 'teach' : 'learn'} today?
              </h2>
            </div>
          )}

          {/* Classroom Section */}

          <RoomTiles
            handleRoomSelection={handleRoomSelection}
            classList={getClassList()}
          />

          {/* Teachers Section */}
          {teacherList && teacherList.length > 0 && (
            <div className="my-8">
              <SectionTitleV3
                title={'Your Teachers'}
                fontSize="xl"
                fontStyle="semibold"
                extraContainerClass="max-w-256 px-6"
                borderBottom
                extraClass="leading-6 text-gray-900"
              />
              <TeacherRows coTeachersList={coTeachersList} teachersList={teacherList} />
            </div>
          )}
          {/* Classmates Section */}
          <div className="my-6">
            <StudentsTiles
              title={`Your ${isTeacher ? 'Students' : 'Classmates'}`}
              state={state}
              studentsList={studentsList}
            />
          </div>
        </>
      ) : (
        <ComponentLoading />
      )}
    </>
  );
};

export default Home;
