import Buttons from '@components/Atoms/Buttons';
import Placeholder from '@components/Atoms/Placeholder';
import {listRoomCurriculums} from '@customGraphql/customQueries';
import useAuth from '@customHooks/useAuth';
import {deleteCurriculum} from '@graphql/mutations';
import {getImageFromS3Static} from '@utilities/services';
import {Popover, Space, message} from 'antd';
import {API, graphqlOperation} from 'aws-amplify';
import {logError} from 'graphql-functions/functions';
import {orderBy} from 'lodash';
import {useCallback, useEffect, useState} from 'react';
import {useHistory} from 'react-router';

const CourseItem = ({
  curricula,
  redirectToCourse,
  onSuccessDelete
}: {
  onSuccessDelete: (id: string) => void;
  redirectToCourse: (id: string) => void;
  curricula: any;
}) => {
  const [courseDeletable, setCourseDeletable] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const onDeleteCourse = async (courseId: string) => {
    try {
      await API.graphql(
        graphqlOperation(deleteCurriculum, {
          input: {id: courseId}
        })
      );
      messageApi.success('Course deleted successfully');

      // removed deleted course from local list

      onSuccessDelete(courseId);
    } catch (error) {
      messageApi.error('Error deleting course. Please try again later.');
    }
  };

  const checkIfDeleteable = async () => {
    try {
      const attachedClassrooms: any = await API.graphql(
        graphqlOperation(listRoomCurriculums, {
          filter: {
            curriculumID: {
              eq: curricula.id
            }
          }
        })
      );

      const savedClassroomList = attachedClassrooms.data.listRoomCurricula.items;

      if (savedClassroomList?.length > 0) {
        setCourseDeletable(false);
      } else {
        setCourseDeletable(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsChecking(false);
    }
  };

  const [messageApi, contextHolder] = message.useMessage();

  return (
    <Popover
      onOpenChange={(e) => {
        checkIfDeleteable();
      }}
      content={
        <div>
          <p>
            Do you want to delete <strong>{curricula?.name}</strong> course?
          </p>
          <Space>
            <Buttons
              size="small"
              disabled={!courseDeletable || isChecking}
              redBtn
              onClick={() => curricula.id && onDeleteCourse(curricula.id)}
              transparent
              label={isChecking ? 'Checking attached units' : 'Delete course'}
            />
          </Space>
        </div>
      }>
      {contextHolder}
      <li className="flex items-center gap-y-2">
        <div className="flex-shrink-0 h-8 w-8 flex items-center">
          {curricula.image ? (
            <img
              src={getImageFromS3Static(curricula.image)}
              className="h-5 w-5 rounded-full"
            />
          ) : (
            <Placeholder name={curricula.name} size="h-5 w-5" />
          )}
        </div>
        <h4
          onClick={() => redirectToCourse(curricula.id)}
          className="text-dark   cursor-pointer hover:underline hover:theme-text:400 text-sm">
          {curricula.name}
        </h4>
      </li>
    </Popover>
  );
};

const AttachedCourses = ({curricular, unitId}: {curricular: any; unitId: string}) => {
  const {email, authId} = useAuth();
  const getAttachedCourses = (): any[] => {
    try {
      if (curricular) {
        const filtered = curricular?.items?.filter((item: any) => {
          if (item?.universalSyllabus) {
            return item?.universalSyllabus?.items?.find(
              (item: any) => item?.unit?.id === unitId
            );
          }
        });

        const sorted = orderBy(filtered, ['name'], ['asc']);

        return sorted;
      }
      return [];
    } catch (error) {
      logError(error, {authId, email}, 'AttachedCourses @getAttachedCourses');
      return [];
    }
  };

  const history = useHistory();
  const {isSuperAdmin, instId} = useAuth();
  const redirectToCourse = (id: string) => {
    history.push(
      isSuperAdmin
        ? `/dashboard/manage-institutions/course-builder/${id}`
        : `/dashboard/manage-institutions/institution/${instId}/course-builder/${id}`
    );
  };

  const [localCopyOfCourses, setLocalCopyOfCourses] = useState<any[]>([]);

  const attachedCourses: any[] = getAttachedCourses();

  useEffect(() => {
    if (attachedCourses.length > 0) {
      setLocalCopyOfCourses(attachedCourses);
    }
  }, [attachedCourses]);

  const onSuccessDelete = useCallback((id: string) => {
    setLocalCopyOfCourses((prev) => {
      const newList = prev.filter((course) => course.id !== id);
      return newList;
    });
  }, []);

  return (
    <ul className="list-disc grid grid-cols-2 ">
      {localCopyOfCourses.length > 0 ? (
        localCopyOfCourses?.map((curricula: any) => {
          if (curricula) {
            return (
              <CourseItem
                onSuccessDelete={onSuccessDelete}
                key={curricula.id}
                redirectToCourse={redirectToCourse}
                curricula={curricula}
              />
            );
          }
          return <div key={'key'} className="w-auto hidden" />;
        })
      ) : (
        <p className="text-medium  text-xs">no attached course found</p>
      )}
    </ul>
  );
};

export default AttachedCourses;
