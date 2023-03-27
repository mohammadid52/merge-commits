import isEmpty from 'lodash/isEmpty';
import {useEffect, useState} from 'react';
import {setLocalStorageData} from 'utilities/localStorage';

import useAuth from '@customHooks/useAuth';
import {logError} from '@graphql/functions';
import {getAsset} from 'assets';
import SectionTitleV3 from 'atoms/SectionTitleV3';
import {useGlobalContext} from 'contexts/GlobalContext';
import {getImageFromS3} from 'utilities/services';
import {ClassroomControlProps} from '../Dashboard';
import HeaderTextBar from '../HeaderTextBar/HeaderTextBar';
import RoomTiles from './RoomTiles';
import StudentsTiles from './StudentsTiles';
import TeacherRows, {Teacher} from './TeacherRows';

export const findRooms = (teacherAuthID: string, allRooms: any[]) => {
  try {
    let rooms: any[] = [];
    let roomIds: any[] = [];

    if (allRooms && allRooms?.length > 0) {
      allRooms.forEach((room: any) => {
        if (room.teacherAuthID === teacherAuthID && !roomIds.includes(room.id)) {
          rooms.push(room);
          roomIds.push(room.id);
        } else {
          if (room.coTeachers.items > 0) {
            const idx = room.coTeachers.items.findIndex(
              (d: any) => d.teacher.authId === teacherAuthID
            );
            if (idx > -1 && !roomIds.includes(room.id)) {
              rooms.push(room);
              roomIds.push(room.id);
            }
          }
        }
      });
    }
    return rooms;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export interface ModifiedListProps {
  id: any;
  name: any;
  teacherProfileImg: string;
  bannerImage: string;
  teacher: {
    email: string;
    firstName: string;
    lastName: string;
    image: string;
  };
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

const HomeForTeachers = (props: ClassroomControlProps) => {
  const {homeData, handleRoomSelection, roomsLoading} = props;

  const {state, clientKey} = useGlobalContext();
  const dashboardBanner1 = getAsset(clientKey, 'dashboardBanner2');

  const {firstName} = useAuth();

  const user = !isEmpty(state) ? {firstName: firstName, preferredName: firstName} : null;

  const [teacherList, setTeacherList] = useState<Teacher[]>([]);
  const [coTeachersList, setCoTeachersList] = useState<Teacher[]>([]);
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [classList, setClassList] = useState<any[]>([]);

  const fetchAndProcessDashboardData = () => {
    getClassList();
    teacherListWithImages();
    coTeacherListWithImages();
    loadStudents();
  };

  useEffect(() => {
    if (homeData && homeData.length > 0) {
      fetchAndProcessDashboardData();
    }
  }, [
    homeData,
    classList.length,
    teacherList.length,
    coTeachersList.length,
    studentsList.length
  ]);

  const getStudentsList = () => {
    let list: any[] = [];
    let uniqIds: string[] = [];

    homeData[0]?.class?.rooms?.items.forEach((item: any) => {
      item?.class?.students?.items.forEach((student: any) => {
        if (student?.student && !uniqIds.includes(student?.student?.id)) {
          list.push(student);
          uniqIds.push(student?.student?.id);
        }
      });
    });

    return list;
  };

  const getTeacherList = () => {
    return homeData?.length
      ? homeData[0]?.class?.rooms?.items.reduce((acc: any[], dataObj: any) => {
          const teacherObj = dataObj?.teacher;
          const allRooms = homeData[0]?.class?.rooms?.items;
          if (teacherObj) {
            const teacherIsPresent = acc?.find(
              (teacher: any) =>
                teacher?.firstName === teacherObj?.firstName &&
                teacher?.lastName === teacherObj?.lastName
            );
            if (teacherIsPresent) {
              return acc;
            } else {
              // find rooms that has this teacher;
              // it could be a teacher or co teacher
              try {
                const rooms = findRooms(teacherObj.authId, allRooms);
                return [...acc, {...teacherObj, room: dataObj, rooms}];
              } catch (error) {
                console.error(error);
                logError(
                  error,
                  {authId: teacherObj.authId, email: teacherObj.email},
                  'HomeForTeachers #getTeacherList'
                );
              }
            }
          }
          return acc;
        }, [])
      : [];
  };

  const getCoTeacherList = () => {
    let coTeachersList: any[] = [];
    let uniqIds: string[] = [];
    const allRooms = homeData[0]?.class?.rooms?.items;

    homeData[0]?.class?.rooms?.items.forEach((item: any) => {
      if (item.coTeachers?.items?.length) {
        item.coTeachers.items.forEach((_item: any) => {
          const rooms = findRooms(_item.teacher.authId, allRooms);
          if (!uniqIds.includes(_item.teacher.email)) {
            coTeachersList.push({
              ..._item.teacher,
              room: item,
              rooms
            });
            uniqIds.push(_item.teacher.email);
          }
        });
      }
    });

    return coTeachersList;
  };

  const teacherListWithImages = async () => {
    let data: any[] = getTeacherList();
    data = data.filter((d: any) => d.id !== state.user.id);
    setTeacherList(data);
  };

  const coTeacherListWithImages = async () => {
    let data: any[] = getCoTeacherList();
    data = data.filter((d: any) => d.id !== state.user.id);
    setCoTeachersList(data);
  };

  const loadStudents = async () => {
    const data = getStudentsList();

    setStudentsList(data);
    setLocalStorageData('student_list', data);
  };

  const getClassList = (): any => {
    let modifiedClassList: any[] = [];

    let uniqIds: string[] = [];

    homeData[0]?.class?.rooms?.items.forEach(async (_item: any, index: number) => {
      const curriculum = _item.curricula?.items[0]?.curriculum;
      if (curriculum) {
        const imagePath = curriculum?.image;

        const image = await (imagePath !== null ? getImageFromS3(imagePath) : null);
        const teacherProfileImg = await (_item.teacher?.image
          ? getImageFromS3(_item.teacher?.image)
          : false);

        const modifiedItem = {
          ..._item,
          roomName: _item?.name,
          curriculumName: curriculum?.name,
          bannerImage: image,
          teacherProfileImg,
          roomIndex: index
        };

        if (!uniqIds.includes(_item?.id) && _item.status === 'ACTIVE') {
          modifiedClassList.push(modifiedItem);
          uniqIds.push(_item?.id);
        }
      }
    });

    setClassList(modifiedClassList);
    return modifiedClassList;
  };

  const refetchHomeData = () => {
    const response = getClassList();
    return response;
  };

  return (
    <>
      {homeData ? (
        <>
          {/* Hero Section */}
          <div className="relative">
            <div className="absolute inset-0 w-full h-32 2xl:h-60">
              <div className=" bg-black bg-opacity-60 z-0 w-full h-full absolute" />
              <img
                className="object-cover w-full h-full bg-center bg-no-repeat bg-contain"
                src={dashboardBanner1}
                alt=""
              />
            </div>
            <div className="relative h-full flex items-center justify-center flex-col max-w-7xl">
              <h1 className="z-10 flex align-center self-auto items-center justify-center h-32 2xl:h-60 text-9xl font-extrabold tracking-tight text-center text-white text-4xl md:text-6xl 2xl:text-8xl pb-4 2xl:pb-6">
                Dashboard
              </h1>
            </div>
          </div>
          {/* Header */}
          {user && (
            <HeaderTextBar>
              <p className={`text-sm mb-0 2xl:text-base text-center font-normal`}>
                Welcome,{' '}
                <span className="font-semibold">
                  {user.preferredName ? user.preferredName : user.firstName}
                </span>
                . What do you want to teach today?
              </p>
              {/* <div className="absolute z-100 w-6 top-0 right-1">
                <span
                  className="w-auto cursor-pointer"
                  onClick={() => setOpenWalkThroughModal(true)}>
                  <BsFillInfoCircleFill className={`h-5 w-5 text-white`} />
                </span>
              </div> */}
            </HeaderTextBar>
          )}
          <div className="px-5">
            {/* Classroom Section */}

            <RoomTiles
              roomsLoading={roomsLoading}
              refetchHomeData={refetchHomeData}
              handleRoomSelection={handleRoomSelection}
              classList={classList}
            />

            {/* Teachers Section */}

            <div className="my-6">
              <SectionTitleV3
                title={`Your Team`}
                fontSize="lg"
                fontStyle="semibold"
                extraContainerClass="lg:max-w-192 px-6 md:max-w-none 2xl:max-w-256"
                borderBottom
                extraClass="leading-6 text-gray-900"
              />
              <TeacherRows
                loading={Boolean(roomsLoading)}
                coTeachersList={coTeachersList}
                teachersList={teacherList}
              />
            </div>

            {/* Classmates Section */}
            <div className="my-6">
              <StudentsTiles
                isTeacher
                title={`Your Students`}
                studentsList={studentsList}
              />
            </div>
          </div>
        </>
      ) : null}
      {/* <InformationalWalkThrough
        open={openWalkThroughModal}
        onCancel={() => setOpenWalkThroughModal(false)}
      /> */}
    </>
  );
};

export default HomeForTeachers;
