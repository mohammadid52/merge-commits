import Placeholder from '@components/Atoms/Placeholder';
import AnimatedContainer from '@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import {useGlobalContext} from '@contexts/GlobalContext';
import {getImageFromS3} from '@utilities/services';
import gsap from 'gsap';
import React, {useEffect, useState} from 'react';
import ClickAwayListener from 'react-click-away-listener';
import {AiOutlineUsergroupDelete} from 'react-icons/ai';
import {HiOutlineUserGroup} from 'react-icons/hi';
import {formatPageName} from '../Admin/UserManagement/List';

const Content = ({
  list,
  header,
  name,
  isTeacher
}: {
  isTeacher: boolean;
  name: 'teacher' | 'student';
  list: any[];
  header: string;
}) => {
  let tl = gsap.timeline({});

  const showPageState = isTeacher && name === 'student';

  useEffect(() => {
    gsap.from('.card-body-header', {
      y: -100,
      opacity: 0.5,
      duration: 0.3
    });
    gsap.from('.card-list-item', {
      stagger: {
        each: 0.1
      },
      ease: 'power2.inOut',
      duration: 0.3,
      x: -50,
      opacity: 0
    });
  }, [tl]);

  return (
    <div className="card-body">
      <div className="card-body-header theme-bg text-white rounded-t-xl px-4 py-2">
        <h1 className="text-lg text-center tracking-wider font-medium uppercase text-white">
          {header}
        </h1>
      </div>
      <ul className="w-full max-h-72 min-h-72  p-4 overflow-y-auto overflow-x-hidden gap-y-4 flex flex-col">
        {list.map((item, idx) => (
          <Item idx={idx} showPageState={showPageState} item={item} />
        ))}
      </ul>
    </div>
  );
};

const Item = ({
  item,
  idx,
  showPageState
}: {
  showPageState: boolean;
  item: any;
  idx: number;
}) => {
  return (
    <div className="flex  whitespace-pre card-list-item items-center bg-white px-4 py-2 rounded-xl">
      <span className="text-gray-500 text-xs w-auto mr-2">{idx + 1}.</span>

      {item.image ? (
        <img className="h-8 w-8 bg-gray-200 rounded-full" src={item?.image} alt="" />
      ) : (
        <Placeholder name={item.firstName + ' ' + item.lastName} size="h-8 w-8" />
      )}

      <div className="ml-2 flex flex-col">
        <p className="text-sm font-medium theme-text">
          {item.firstName + ' ' + item.lastName}{' '}
          {Boolean(showPageState && item?.pageState) ? (
            <span className="text-xs text-gray-500 w-auto">
              ({formatPageName(item?.pageState)})
            </span>
          ) : null}
        </p>
        <p
          style={{overflowWrap: 'anywhere', whiteSpace: 'break-spaces'}}
          className="flex items-center text-sm text-gray-500">
          {item.email}
        </p>
      </div>
    </div>
  );
};

const FloatingAction = ({
  homeData,
  name,
  roomId
}: {
  name: 'teacher' | 'student';
  homeData: any[];
  roomId: string;
}) => {
  const [isActive, setIsActive] = useState(false);

  const [teacherList, setTeacherList] = useState<any[]>([]);
  const [coTeachersList, setCoTeachersList] = useState<any[]>([]);
  const [studentsList, setStudentsList] = useState<any[]>([]);

  const [isLoaded, setIsLoaded] = useState(false);

  const getImageURL = async (uniqKey: string) => {
    const imageUrl: any = await getImageFromS3(uniqKey);
    if (imageUrl) {
      return imageUrl;
    } else {
      return '';
    }
  };

  const getTeacherListTr = () =>
    homeData?.length
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
              return [...acc, teacherObj];
            }
          }
          return acc;
        }, [])
      : [];

  const getCoTeacherListTr = () => {
    let coTeachersList: any[] = [];
    let uniqIds: string[] = [];
    homeData?.length &&
      homeData[0]?.class?.rooms?.items.forEach((item: any) => {
        if (item.coTeachers?.items?.length) {
          item.coTeachers.items.forEach((_item: any) => {
            if (!uniqIds.includes(_item.teacher.email)) {
              coTeachersList.push(_item.teacher);
              uniqIds.push(_item.teacher.email);
            }
          });
        }
      });

    return coTeachersList;
  };

  const getTeacherList = () =>
    homeData && homeData.length > 0
      ? homeData.reduce((acc: any[], dataObj: any) => {
          if (dataObj?.class?.room) {
            const teacherObj = dataObj?.class?.room?.teacher;
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
        if (item?.class?.room) {
          if (item?.class?.room.coTeachers.items.length > 0) {
            item?.class?.room.coTeachers.items.map((_item: any) => {
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

  const getStudentsListTr = () => {
    let list: any[] = [];
    let uniqIds: string[] = [];
    homeData &&
      homeData.length > 0 &&
      filterStudentsForCurrentClassroom()[0].class?.rooms?.items.forEach((item: any) => {
        item?.class?.students?.items.forEach((student: any) => {
          if (!uniqIds.includes(student.student.id)) {
            list.push(student);
            uniqIds.push(student.student.id);
          }
        });
      });

    return list;
  };

  const coTeacherListWithImages = () =>
    getCoTeacherList().length > 0 &&
    Promise.all(
      getCoTeacherList().map(async (teacherObj: any, idx: number) => {
        return {
          ...teacherObj,
          image: await (teacherObj.image ? getImageURL(teacherObj.image) : null)
        };
      })
    );

  const filterStudentsForCurrentClassroom = () => {
    if (homeData && homeData.length > 0) {
      if (isTeacher) {
        let result = homeData.map((dataObj: any) => {
          let items = dataObj.class.rooms.items;
          const filtered = items.filter((d: any) => d.id === roomId);
          return {
            ...dataObj,
            class: {
              rooms: {
                items: filtered
              }
            }
          };
        });

        return result;
      } else {
        const filtered = homeData.filter(
          (dataObj: any) => dataObj.class.room.id === roomId
        );
        return filtered;
      }
    }
    return [];
  };

  const getStudentsList = () =>
    homeData && homeData.length > 0
      ? filterStudentsForCurrentClassroom()
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

  const studentsListWithImages = () =>
    homeData &&
    homeData.length > 0 &&
    Promise.all(
      getStudentsList().map(async (studentObj: any, idx: number) => {
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

  const {
    state: {user}
  } = useGlobalContext();

  const teacherListWithImagesForTeachers = async () => {
    let data: any[] = await Promise.all(
      getTeacherListTr().map(async (teacherObj: any) => {
        return {
          ...teacherObj,
          image: await (teacherObj?.image ? getImageURL(teacherObj?.image) : null)
        };
      })
    );
    data = data.filter((d: any) => d.id !== user.id);
    setTeacherList(data);
  };

  const coTeacherListWithImagesForTeachers = async () => {
    let data: any[] = await Promise.all(
      getCoTeacherListTr().map(async (teacherObj: any) => {
        return {
          ...teacherObj,
          image: await (teacherObj?.image ? getImageURL(teacherObj?.image) : null)
        };
      })
    );
    data = data.filter((d: any) => d.id !== user.id);
    setCoTeachersList(data);
  };

  const studentsListWithImagesForTeachers = async () => {
    const list = user.role === 'ST' ? getStudentsList() : getStudentsListTr();
    const data = await Promise.all(
      list.map(async (studentObj: any) => {
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
    return data;
  };

  const fetchAndProcessDashboardDataForTeachers = async () => {
    if (name === 'teacher') {
      teacherListWithImagesForTeachers();
      coTeacherListWithImagesForTeachers();
    } else {
      const studentList = await studentsListWithImagesForTeachers();
      setStudentsList(studentList);
    }
    setIsLoaded(true);
  };

  const fetchAndProcessDashboardDataForStudents = async () => {
    if (name === 'student') {
      const studentList = await studentsListWithImages();
      setStudentsList(studentList);
    } else {
      setTeacherList(await getTeacherList());

      setCoTeachersList(await coTeacherListWithImages());
    }
    setIsLoaded(true);
  };

  useEffect(() => {
    if (homeData && homeData.length > 0) {
      if (user.role === 'ST') {
        fetchAndProcessDashboardDataForStudents();
      } else {
        fetchAndProcessDashboardDataForTeachers();
      }
    }
  }, [homeData]);

  const allTeachers = [...teacherList, ...coTeachersList];

  const isTeacher = user.role !== 'ST';

  const labelForTeacher = isTeacher ? 'Your Team' : 'Your Teachers';
  const labelForStudent = isTeacher ? 'Your Students' : 'Your Classmates';

  const teacherProps = isLoaded
    ? {
        list: allTeachers,
        header: `${labelForTeacher} (${allTeachers.length})`,
        isTeacher,
        name
      }
    : {};
  const studentProps = isLoaded
    ? {
        list: studentsList.map((item) => item.student),
        header: `${labelForStudent} (${studentsList.length})`,
        isTeacher,
        name
      }
    : {};

  const props = name === 'teacher' ? {...teacherProps} : {...studentProps};

  return (
    <ClickAwayListener onClickAway={() => setIsActive(false)}>
      <div
        onClick={(e) => {
          e.stopPropagation();
          setIsActive(!isActive);
        }}
        title={isActive ? '' : name === 'teacher' ? labelForTeacher : labelForStudent}
        className="theme-bg floating-item  relative p-2 customShadow rounded-full  border-white border-2 hover:theme-bg:500 transition-all cursor-pointer ">
        <div className="text-lg text-white w-auto">
          {name === 'teacher' ? <AiOutlineUsergroupDelete /> : <HiOutlineUserGroup />}
        </div>

        <AnimatedContainer animationType="sliderInvert" duration="700" show={isActive}>
          {isActive && (
            <div
              className={`${
                name === 'teacher' ? 'teacher-card' : 'student-card'
              } bg-gray-200 item-open cursor-default z-100 top-0 absolute border-2 border-white theme-card-shadow min-w-96 rounded-xl`}>
              {homeData && homeData.length > 0 ? (
                //  @ts-ignore
                isLoaded && <Content {...props} />
              ) : (
                <p className="text-gray-500 text-center text-sm">No data</p>
              )}
            </div>
          )}
        </AnimatedContainer>
      </div>
    </ClickAwayListener>
  );
};

export default FloatingAction;
