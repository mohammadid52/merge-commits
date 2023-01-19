import Highlighted from '@components/Atoms/Highlighted';
import Placeholder from '@components/Atoms/Placeholder';
import React from 'react';

const StaffBuilderName = ({
  gotoProfilePage,
  item,
  searchTerm
}: {
  gotoProfilePage: (id: string) => void;
  item: any;
  searchTerm: string;
}) => {
  return (
    <div
      className="flex items-center cursor-pointer "
      onClick={() => gotoProfilePage(item.userId)}>
      <div className="flex-shrink-0 h-10 w-10 flex items-center">
        {!item.image ? (
          <Placeholder size="h-8 w-8" name={item.name} />
        ) : (
          <div className="h-8 w-8 rounded-full flex justify-center items-center">
            <img src={item.image} className="rounded-full" />
          </div>
        )}
      </div>
      <div className="ml-2">
        <div className=" text-sm leading-5 font-medium ">
          <Highlighted text={item?.name} highlight={searchTerm} />
        </div>
        <div className="text-sm leading-5 text-gray-500">
          <Highlighted text={item.email} highlight={searchTerm} />
        </div>
      </div>
    </div>
  );
};

export default StaffBuilderName;
