import Placeholder from '@components/Atoms/Placeholder';
import React from 'react';

const StudentName = ({
  user,
  onHover,
  item
}: {
  item: any;
  onHover?: boolean;
  user?: any;
}) => {
  return (
    <div
      className={`flex ${
        onHover
          ? 'hover:theme-bg:200 px-4 py-2 hover:theme-border:400 hover:theme-text:400 '
          : ''
      } ${user?.role !== 'BLD' ? 'cursor-pointer' : 'cursor-pointer'} `}>
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
            onHover ? '' : user?.role !== 'BLD' ? 'hover:text-medium ' : ''
          } text-sm leading-5 font-medium text-darkest`}>
          {item.student.name}
        </div>
        <div className="text-sm leading-5 text-medium ">{item.student.email}</div>
      </div>
    </div>
  );
};

export default StudentName;
