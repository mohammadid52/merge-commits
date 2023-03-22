import Loader from '@components/Atoms/Loader';
import PageWrapper from '@components/Atoms/PageWrapper';
import Placeholder from '@components/Atoms/Placeholder';
import SectionTitleV3 from '@components/Atoms/SectionTitleV3';
import useAuth from '@customHooks/useAuth';
import {Card, Empty, List} from 'antd';
import {PersonStatus, RoomStatus} from 'API';
import {filter, map, orderBy} from 'lodash';
import {useHistory} from 'react-router';

const {Meta} = Card;

export interface Teacher {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  authId: string;

  status: PersonStatus;
  image: string | null;
}

const TeacherRows = (props: {
  loading: boolean;
  coTeachersList: Teacher[];
  teachersList: Teacher[];
  title: string;
}) => {
  const {coTeachersList = [], title, loading, teachersList = []} = props;

  const allTeachers = [...teachersList, ...coTeachersList];

  const removeSame = () => {
    let result: any[] = [];
    let uniq: any[] = [];

    if (allTeachers.length > 0) {
      allTeachers.forEach((d) => {
        if (!uniq.includes(d.authId)) {
          result.push(d);
          uniq.push(d.authId);
        }
      });
    }
    return result;
  };

  const finalList = orderBy(removeSame(), ['firstName'], ['asc']);

  const {isStudent, user, instId} = useAuth();
  const extraFilter = isStudent
    ? filter(finalList, (d) => {
        if (d.status === RoomStatus.ACTIVE) {
          if (user.status === PersonStatus.ACTIVE) {
            return d.status === RoomStatus.ACTIVE;
          } else {
            return true;
          }
        }
        return true;
      })
    : finalList;

  const history = useHistory();

  const getClassesByTeacher = (rooms: any[]) => {
    let totalClasses: any[] = [];

    if (rooms && rooms.length > 0) {
      rooms.forEach((room) => {
        if (room.status === 'ACTIVE') {
          const curriculum = room?.curricula?.items[0]?.curriculum;

          if (Boolean(curriculum)) {
            totalClasses.push({...curriculum, roomId: room.id});
          }
        }
      });
    }

    return totalClasses;
  };

  const attachedClasses = map(extraFilter, (d) => {
    if (!isStudent) {
      const classes =
        getClassesByTeacher(d?.rooms?.length > 0 ? d.rooms : [d.room]) || [];

      return {
        ...d,
        classes: classes.length > 0 ? classes : []
      };
    } else {
      return {
        ...d
      };
    }
  }).filter(Boolean);

  return (
    <PageWrapper>
      <SectionTitleV3
        title={title}
        fontSize="xl"
        fontStyle="semibold"
        shadowOff
        extraContainerClass="px-4"
        borderBottom
      />
      {loading ? (
        <div className="min-h-56 flex items-center justify-center ">
          <Loader className="w-auto text-gray-400" withText="Loading teachers..." />
        </div>
      ) : attachedClasses && attachedClasses.length > 0 ? (
        <List>
          {attachedClasses.map((teacher) => {
            return (
              <List.Item
                style={
                  teacher.status === PersonStatus.INACTIVE
                    ? {borderLeft: '2px solid red'}
                    : {}
                }
                key={teacher?.authId}>
                <a
                  className="w-full flex items-center justify-between"
                  href={
                    isStudent
                      ? '#'
                      : `/dashboard/manage-institutions/institution/${instId}/manage-users/${teacher.id}/staff`
                  }>
                  <Meta
                    className="flex"
                    avatar={
                      <Placeholder
                        size="h-12 w-12 mx-4"
                        firstName={teacher?.firstName}
                        lastName={teacher?.lastName}
                      />
                    }
                    title={teacher?.firstName + ' ' + teacher?.lastName}
                    description={<p className="text-gray-600">{teacher.email}</p>}
                  />
                  {!isStudent && teacher?.classes?.length > 0 && (
                    <div className="w-1/3">
                      <h4 className="theme-text ">Classrooms: </h4>
                      <ul
                        className={`w-auto gap-y-2 ${
                          teacher?.classes?.length > 1 ? 'list-disc' : ''
                        }`}>
                        {teacher?.classes?.map((d: any) => (
                          <>
                            <li
                              key={d.name}
                              onClick={(e) => {
                                e.preventDefault();
                                history.push(
                                  `/dashboard/manage-institutions/institution/${instId}/room-edit/${d.roomId}`
                                );
                              }}
                              className="text-gray-600 cursor-pointer  transition-all hover:underline hover:theme-text:500 rounded-md px-2">
                              {d.name}
                            </li>
                          </>
                        ))}
                      </ul>
                    </div>
                  )}
                </a>
              </List.Item>
            );
          })}
        </List>
      ) : (
        <Empty description={'No teachers found'} />
      )}
    </PageWrapper>
  );
};

export default TeacherRows;
