import Loader from '@components/Atoms/Loader';
import Placeholder from '@components/Atoms/Placeholder';
import useAuth from '@customHooks/useAuth';
import {Empty} from 'antd';
import {PersonStatus, RoomStatus} from 'API';
import ContentCard from 'atoms/ContentCard';
import {filter, map, orderBy} from 'lodash';
import {useHistory} from 'react-router';

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
}) => {
  const {coTeachersList = [], loading, teachersList = []} = props;

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
    <ContentCard hasBackground={false}>
      <div className="overflow-hidden">
        {attachedClasses && attachedClasses.length > 0 ? (
          <ul className="grid grid-cols-1 ">
            {attachedClasses.map((teacher, idx: number) => {
              return (
                <li
                  key={teacher?.firstName + teacher?.lastName}
                  style={
                    teacher.status === PersonStatus.INACTIVE
                      ? {borderLeftWidth: '2px', borderLeftColor: 'red'}
                      : {}
                  }
                  className={`border-b-0 ${
                    attachedClasses.length - 1 === idx ? 'rounded-b-xl' : ''
                  }`}>
                  <a
                    href={
                      isStudent
                        ? '#'
                        : `/dashboard/manage-institutions/institution/${instId}/manage-users/${teacher.id}/staff`
                    }
                    className={`block no-underline hover:bg-lightest ${
                      isStudent ? 'pointer-events-none' : ''
                    }`}
                    style={{borderRadius: 'inherit'}}>
                    <div className="flex items-center px-4 py-4 sm:px-6">
                      <div className="min-w-0 flex-1 flex items-center">
                        <Placeholder
                          size=" h-8 w-8 lg:h-12 lg:w-12"
                          firstName={teacher?.firstName}
                          lastName={teacher?.lastName}
                          image={teacher?.image}
                        />

                        <div className="min-w-0 flex-1 px-4">
                          <div>
                            <h4 className="text-sm mb-0 font-medium text-indigo-600 truncate">
                              {teacher.firstName + ' ' + teacher.lastName}
                            </h4>
                            <p className="mt-2 flex mb-0 items-center text-sm text-medium ">
                              <svg
                                className="flex-shrink-0 mr-1.5 h-5 w-5 text-light "
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                              </svg>
                              <span className=" truncate">{teacher.email}</span>
                            </p>
                          </div>
                        </div>
                      </div>

                      {!isStudent && teacher?.classes?.length > 0 && (
                        <div className="w-1/2">
                          <h4 className="theme-text ">Classrooms: </h4>
                          <ul
                            className={`w-auto gap-y-2 ${
                              teacher?.classes?.length > 1 ? 'list-disc' : ''
                            }`}>
                            {teacher?.classes?.map((d: any) => (
                              <li
                                key={d.name}
                                onClick={(e) => {
                                  e.preventDefault();
                                  history.push(
                                    `/dashboard/manage-institutions/institution/${instId}/room-edit/${d.roomId}`
                                  );
                                }}
                                className="text-medium   transition-all hover:underline hover:theme-text:500 rounded-md ">
                                {d.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        ) : loading ? (
          <div className="min-h-56 flex items-center justify-center ">
            <Loader withText="Loading teachers..." />
          </div>
        ) : (
          <Empty description={'No teachers found'} />
        )}
      </div>
    </ContentCard>
  );
};

export default TeacherRows;
