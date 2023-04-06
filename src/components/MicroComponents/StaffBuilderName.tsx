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
        <Placeholder image={item.image} size="h-8 w-8" name={item.name} />
      </div>
      <div className="ml-2">
        <div className=" text-sm leading-5 font-medium ">
          <Highlighted text={item?.name} highlight={searchTerm} />
        </div>
        <div className="text-sm leading-5 text-medium ">
          <Highlighted text={item.email} highlight={searchTerm} />
        </div>
      </div>
    </div>
  );
};

export default StaffBuilderName;
