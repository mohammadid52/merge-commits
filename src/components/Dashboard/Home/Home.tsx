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
import { times } from 'lodash';
import HeroBanner from '../../Header/HeroBanner';

export interface ModifiedListProps {
  id: any;
  name: any;
  teacherProfileImg: string;
  bannerImage: string;
  teacher: { email: string; firstName: string; lastName: string; image: string };
  curricula: {
    items: { curriculum: { name: string; description?: string; id: string; summary?: string; type?: string } }[];
  };
}

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
          const teacherObj = dataObj?.class?.rooms?.items[0]?.teacher;
          const teacherIsPresent = acc?.find(
            (teacher: any) => teacher?.firstName === teacherObj?.firstName && teacher?.lastName === teacherObj?.lastName
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
          image: await (studentObj?.student?.image ? getImageURL(studentObj?.student?.image) : null),
        },
      };
    })
  );

  const getClassList = (): ModifiedListProps[] => {
    let modifiedClassList: ModifiedListProps[] = [];
    let uniqIds: string[] = [];

    classList &&
      classList.length > 0 &&
      classList.forEach((item: { rooms: { items: any[] }; name: string; id: string }) => {
        item.rooms.items.forEach(async (_item: any) => {
          const curriculum = _item.curricula?.items[0].curriculum;
          if (curriculum !== null) {
            const imagePath = curriculum?.image;

            const image = await (imagePath !== null ? getImageFromS3(imagePath) : null);
            const teacherProfileImg = await (_item.teacher.image ? getImageFromS3(_item.teacher.image) : false);

            const modifiedItem = { ..._item, roomName: item?.name, bannerImage: image, teacherProfileImg };

            if (!uniqIds.includes(curriculum?.id)) {
              modifiedClassList.push(modifiedItem);
              uniqIds.push(curriculum?.id);
            }
          }
        });
      });

    return modifiedClassList;
  };

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
          <div>
            <HeroBanner imgUrl={dashboardBanner1} title={'Dashboard'} />
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

          <RoomTiles classList={getClassList()} />

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
