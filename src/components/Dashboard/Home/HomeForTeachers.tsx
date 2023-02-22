import isEmpty from 'lodash/isEmpty';
import React, {useEffect, useState} from 'react';
import {BsFillInfoCircleFill} from 'react-icons/bs';
import {setLocalStorageData} from 'utilities/localStorage';

import useAuth from '@customHooks/useAuth';
import {getAsset} from 'assets';
import SectionTitleV3 from 'atoms/SectionTitleV3';
import InformationalWalkThrough from 'components/Dashboard/Admin/Institutons/InformationalWalkThrough/InformationalWalkThrough';
import {useGlobalContext} from 'contexts/GlobalContext';
import {getImageFromS3} from 'utilities/services';
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

const HomeForTeachers = (props: ClassroomControlProps) => {
  const {homeData, handleRoomSelection, roomsLoading} = props;

  const {state, dispatch, clientKey} = useGlobalContext();
  const dashboardBanner1 = getAsset(clientKey, 'dashboardBanner2');
  const [openWalkThroughModal, setOpenWalkThroughModal] = useState(false);
  const {firstName, isTeacher, isFellow} = useAuth();

  const user = !isEmpty(state) ? {firstName: firstName, preferredName: firstName} : null;

  useEffect(() => {
    if (isTeacher || isFellow) {
      if (state.currentPage !== 'home') {
        // dispatch({ type: 'UPDATE_CURRENTPAGE', payload: { data: 'lesson-planner' } });
      }
      if (state.activeRoom && state.activeRoom.length > 0) {
        dispatch({type: 'UPDATE_ACTIVEROOM', payload: {data: null}});
      }
    }
  }, [isTeacher, isFellow]);

  const [teacherList, setTeacherList] = useState<any[]>();
  const [coTeachersList, setCoTeachersList] = useState<any[]>();
  const [studentsList, setStudentsList] = useState<any[]>();

  const getStudentsList = () => {
    let list: any[] = [];
    let uniqIds: string[] = [];
    homeData &&
      homeData.length > 0 &&
      homeData[0]?.class?.rooms?.items.forEach((item: any) => {
        item?.class?.students?.items.forEach((student: any) => {
          if (!uniqIds.includes(student.student.id)) {
            list.push(student);
            uniqIds.push(student.student.id);
          }
        });
      });

    return list;
  };

  const getImageURL = async (uniqKey: string) => {
    const imageUrl: any = await getImageFromS3(uniqKey);
    if (imageUrl) {
      return imageUrl;
    } else {
      return '';
    }
  };

  const getTeacherList = homeData?.length
    ? homeData[0]?.class?.rooms?.items.reduce((acc: any[], dataObj: any) => {
        const teacherObj = dataObj?.teacher;
        if (teacherObj) {
          const teacherIsPresent = acc?.find(
            (teacher: any) =>
              teacher?.firstName === teacherObj?.firstName &&
              teacher?.lastName === teacherObj?.lastName
          );
          if (teacherIsPresent) {
            return acc;
          } else {
            return [...acc, {...teacherObj, room: dataObj}];
          }
        }
        return acc;
      }, [])
    : [];

  const getCoTeacherList = () => {
    let coTeachersList: any[] = [];
    let uniqIds: string[] = [];
    homeData?.length &&
      homeData[0]?.class?.rooms?.items.forEach((item: any) => {
        if (item.coTeachers?.items?.length) {
          item.coTeachers.items.forEach((_item: any) => {
            if (!uniqIds.includes(_item.teacher.email)) {
              coTeachersList.push({..._item.teacher, room: item});
              uniqIds.push(_item.teacher.email);
            }
          });
        }
      });

    return coTeachersList;
  };

  const teacherListWithImages = async () => {
    let data: any[] = await Promise.all(
      getTeacherList.map(async (teacherObj: any) => {
        return {
          ...teacherObj,
          image: await (teacherObj?.image ? getImageURL(teacherObj?.image) : null)
        };
      })
    );
    data = data.filter((d: any) => d.id !== state.user.id);
    setTeacherList(data);
  };

  const coTeacherListWithImages = async () => {
    let data: any[] = await Promise.all(
      getCoTeacherList().map(async (teacherObj: any) => {
        return {
          ...teacherObj,
          image: await (teacherObj?.image ? getImageURL(teacherObj?.image) : null)
        };
      })
    );
    data = data.filter((d: any) => d.id !== state.user.id);
    setCoTeachersList(data);
  };

  const studentsListWithImages = async () => {
    const data = await Promise.all(
      getStudentsList().map(async (studentObj: any) => {
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
    setStudentsList(data);
    setLocalStorageData('student_list', data);
  };

  const getClassList = (): any => {
    let modifiedClassList: any[] = [];
    let uniqIds: string[] = [];

    homeData &&
      homeData.length > 0 &&
      homeData[0].class?.rooms?.items.forEach(async (_item: any, index: number) => {
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

          if (!uniqIds.includes(curriculum?.id)) {
            uniqIds.push(curriculum?.id);
            modifiedClassList.push(modifiedItem);
          }
        }
      });

    return modifiedClassList;
  };

  const fetchAndProcessDashboardData = () => {
    teacherListWithImages();
    studentsListWithImages();
    coTeacherListWithImages();
  };

  useEffect(() => {
    if (homeData && homeData.length > 0) {
      fetchAndProcessDashboardData();
    }
  }, [homeData]);

  const classList = getClassList();

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
              <p className={`text-sm 2xl:text-base text-center font-normal`}>
                Welcome,{' '}
                <span className="font-semibold">
                  {user.preferredName ? user.preferredName : user.firstName}
                </span>
                . What do you want to teach today?
              </p>
              <div className="absolute z-100 w-6 top-0 right-1">
                <span
                  className="w-auto cursor-pointer"
                  onClick={() => setOpenWalkThroughModal(true)}>
                  <BsFillInfoCircleFill className={`h-5 w-5 text-white`} />
                </span>
              </div>
            </HeaderTextBar>
          )}
          <div className="px-5">
            {/* Classroom Section */}

            <RoomTiles
              roomsLoading={roomsLoading}
              isTeacher
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
                handleRoomSelection={handleRoomSelection}
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
      <InformationalWalkThrough
        open={openWalkThroughModal}
        onCancel={() => setOpenWalkThroughModal(false)}
      />
    </>
  );
};

export default HomeForTeachers;
