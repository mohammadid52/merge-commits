import ContentCard from '../../Atoms/ContentCard';
import React from 'react';
import Avatar from './Avatar';

const StudentsTiles = (props: {studentsList: any}) => {
  const {studentsList} = props;
  return (
    <ContentCard>
      <div className={`grid grid-cols-8 gap-2`}>
        {studentsList &&
        studentsList.length > 0 &&
        studentsList.map(
          (studentObj: { student: { firstName: string; lastName: string; image: string | null } }, idx: number) => {
            return (
              <div key={`home_student_${idx}`} className={`w-full p-2 flex flex-col justify-center items-center`}>
                <Avatar userObj={studentObj.student} size={8} idx={idx}/>
                <div className={`text-center`}>
                  <h4>{studentObj.student.firstName}</h4>
                  <p>{studentObj.student.lastName}</p>
                </div>
              </div>
            );
          }
        )}
      </div>
    </ContentCard>
  )
}

export default StudentsTiles;
