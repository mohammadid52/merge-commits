import ContentCard from '../../Atoms/ContentCard';
import React from 'react';
import Avatar from './Avatar';

const TeacherRows = (props: { teacherList: any }) => {
  const { teacherList } = props;
  return (
    <ContentCard>
      <div className={`grid grid-cols-1 gap-2`}>
        {teacherList &&
          teacherList.length > 0 &&
          teacherList.map(
            (
              teacher: {
                phone: string;
                email: string;
                firstName: string;
                lastName: string;
                image: string | null;
              },
              idx: number
            ) => {
              return (
                <div key={`home_teacher_${idx}`} className={`w-full p-2 flex flex-row justify-between`}>
                  <Avatar userObj={teacher} size={16} idx={idx}/>
                  <div className={`text-center`}>
                    <h4>
                      {teacher.firstName}
                      {teacher.lastName}
                    </h4>
                  </div>
                  <div className={`text-center`}>
                    <p>E:{teacher.email}</p>
                    <p>P:{teacher.phone}</p>
                  </div>
                </div>
              );
            }
          )}
      </div>
    </ContentCard>
  );
};

export default TeacherRows;
