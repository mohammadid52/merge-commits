import Placeholder from '@components/Atoms/Placeholder';
import React from 'react';

const StudentName = ({user, item, onClick}: {item: any; user: any; onClick: any}) => {
  return (
    <div
      className={`flex ${user.role !== 'BLD' ? 'cursor-pointer' : ''} `}
      onClick={onClick}>
      <div className="flex-shrink-0 h-10 w-10 flex items-center">
        {item.student.avatar ? (
          <img src={item.student.avatar} className="h-8 w-8 rounded-full" />
        ) : (
          <Placeholder
            lastName={item.student.lastName}
            firstName={item.student.firstName}
            size="h-8 w-8"
          />
        )}
      </div>
      <div className="ml-4">
        <div
          className={`${
            user.role !== 'BLD' ? 'hover:text-gray-600' : ''
          } text-sm leading-5 font-medium text-gray-900`}>
          {item.student.name}
        </div>
        <div className="text-sm leading-5 text-gray-500">{item.student.email}</div>
      </div>
    </div>
  );
};

export default StudentName;
