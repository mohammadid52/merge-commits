import ErrorBoundary from '@components/Error/ErrorBoundary';
import useAuth from '@customHooks/useAuth';
import {PersonStatus} from 'API';
import {getAsset} from 'assets';
import SectionTitleV3 from 'atoms/SectionTitleV3';
import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import {useEffect, useState} from 'react';
import {setLocalStorageData} from 'utilities/localStorage';
import {getImageFromS3} from 'utilities/services';
import HeroBanner from '../../Header/HeroBanner';
import {ClassroomControlProps} from '../Dashboard';
import HeaderTextBar from '../HeaderTextBar/HeaderTextBar';
import RoomTiles from './RoomTiles';
import StudentsTiles from './StudentsTiles';
import TeacherRows from './TeacherRows';

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

const Home = (props: ClassroomControlProps) => {
  const {roomsLoading, homeData = [], handleRoomSelection = () => {}} = props;

  const [classList, setClassList] = useState<any[]>([]);

  const {user, isStudent} = useAuth();

  const getRooms = () => {
    let rooms = homeData.map(
      (dataObj: {class: {name: any; room: any; students: any}}) => ({
        name: dataObj?.class?.name,
        room: dataObj?.class?.room,
        students: dataObj?.class?.students
      })
    );

    setClassList(rooms);
  };

  useEffect(() => {
    if (homeData && classList.length === 0) {
      getRooms();
    }
  }, [homeData]);

  const {state, dispatch, userLanguage, clientKey} = useGlobalContext();
  const dashboardBanner1 = getAsset(clientKey, 'dashboardBanner1');

  const {DashboardDict} = useDictionary();

  const {currentPage, activeRoom} = state;

  useEffect(() => {
    if (isStudent) {
      if (currentPage !== 'home') {
        // dispatch({ type: 'UPDATE_CURRENTPAGE', payload: { data: 'home' } });
      }
      if (activeRoom && activeRoom.length > 0) {
        dispatch({
          type: 'UPDATE_ACTIVEROOM',
          payload: {roomID: '', syllabusID: '', name: ''}
        });
      }
    }
  }, [isStudent]);

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
          if (dataObj?.class?.room) {
            const teacherObj = dataObj?.class?.room?.teacher;
            // const allRooms = homeData[0]?.class?.rooms?.items;

            const teacherIsPresent = acc?.find(
              (teacher: any) =>
                teacher?.firstName === teacherObj?.firstName &&
                teacher?.lastName === teacherObj?.lastName
            );
            if (teacherIsPresent) {
              return acc;
            } else {
              return [...acc, {...teacherObj}];
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
        if (item?.class?.room) {
          if (item?.class?.room.coTeachers.items.length > 0) {
            item?.class?.room.coTeachers.items.map((_item: any) => {
              if (!uniqIds.includes(_item.teacher.authId)) {
                uniqIds.push(_item.teacher.authId);
                coTeachersList.push({..._item.teacher});
              }
            });
          }
        }
      });

    return coTeachersList;
  };

  const teacherListWithImages =
    getTeacherList.length > 0
      ? Promise.all(
          getTeacherList.map(async (teacherObj: any) => {
            return {
              ...teacherObj,
              image: await (teacherObj.image ? getImageURL(teacherObj.image) : null)
            };
          })
        )
      : [];

  const coTeacherListWithImages =
    getCoTeacherList().length > 0
      ? Promise.all(
          getCoTeacherList().map(async (teacherObj: any) => {
            return {
              ...teacherObj,
              image: await (teacherObj.image ? getImageURL(teacherObj.image) : null)
            };
          })
        )
      : [];

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
    getStudentsList.map(async (studentObj: any) => {
      return {
        ...studentObj,
        student: {
          ...studentObj?.student,
          image: await (studentObj?.student?.image
            ? getImageURL(studentObj?.student?.image)
            : null)
        }
      };
    })
  );

  const getClassList = (): ModifiedListProps[] => {
    let modifiedClassList: ModifiedListProps[] = [];
    let uniqIds: string[] = [];

    classList &&
      classList.length > 0 &&
      classList
        .filter(
          (item: {room: {status: PersonStatus}}) =>
            item.room.status !== PersonStatus.INACTIVE
        )
        .forEach(async (item: {room: any; name: string; id: string}, idx: number) => {
          if (item.room) {
            const curriculum = item.room.curricula?.items[0].curriculum;
            if (curriculum !== null) {
              const imagePath = curriculum?.image;

              const image = await (imagePath !== null ? getImageFromS3(imagePath) : null);
              const teacherProfileImg = await (item.room.teacher.image
                ? getImageFromS3(item.room.teacher.image)
                : false);

              const modifiedItem = {
                ...item.room,
                curriculumName: curriculum?.name,
                curriculumId: curriculum?.id,
                roomName: item?.name,
                bannerImage: image,
                teacherProfileImg,
                roomIndex: idx
              };

              if (!uniqIds.includes(curriculum?.id)) {
                uniqIds.push(curriculum?.id);
                modifiedClassList.push(modifiedItem);
              }
            }
          }
        });

    return modifiedClassList;
  };

  const fetchAndProcessDashboardData = async () => {
    setTeacherList(await teacherListWithImages);
    const studentList = await studentsListWithImages;
    setStudentsList(studentList);
    setLocalStorageData('student_list', studentList);
    setCoTeachersList(await coTeacherListWithImages);
  };

  useEffect(() => {
    if (homeData && homeData.length > 0) {
      fetchAndProcessDashboardData();
    }
  }, [homeData]);

  return (
    <ErrorBoundary componentName="Home">
      {homeData ? (
        <div>
          <div>
            <HeroBanner imgUrl={dashboardBanner1} title={'Dashboard'} />
          </div>
          {/* Header */}
          {user && (
            <HeaderTextBar>
              Welcome,{' '}
              <span className="font-semibold">
                {user.preferredName ? user.preferredName : user.firstName}
              </span>
              . {DashboardDict[userLanguage]['GREETINGS_STUDENT']}
            </HeaderTextBar>
          )}

          {/* Classroom Section */}
          <div className="px-3">
            <ErrorBoundary componentName="RoomTiles">
              <RoomTiles
                roomsLoading={roomsLoading}
                handleRoomSelection={handleRoomSelection}
                classList={user.status !== PersonStatus.INACTIVE ? getClassList() : []}
              />
            </ErrorBoundary>

            <ErrorBoundary componentName="TeacherRows">
              {/* Teachers Section */}
              {teacherList && teacherList.length > 0 && (
                <div className="my-6">
                  <TeacherRows
                    title={DashboardDict[userLanguage]['YOUR_TEACHERS']}
                    loading={Boolean(roomsLoading)}
                    coTeachersList={coTeachersList || []}
                    teachersList={teacherList}
                  />
                </div>
              )}
            </ErrorBoundary>
            {/* Classmates Section */}
            <ErrorBoundary componentName="StudentTiles">
              <div className="my-6">
                <StudentsTiles
                  title={DashboardDict[userLanguage]['YOUR_CLASSMATES']}
                  studentsList={studentsList}
                  loading={Boolean(roomsLoading)}
                />
              </div>
            </ErrorBoundary>
          </div>
        </div>
      ) : null}
    </ErrorBoundary>
  );
};

export default Home;
