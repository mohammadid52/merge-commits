import Highlighted from '@components/Atoms/Highlighted';
import Placeholder from '@components/Atoms/Placeholder';
import {getImageFromS3} from '@utilities/services';

const UserLookupName = ({
  item,

  searchTerm
}: {
  searchTerm: string;
  item: any;
}) => {
  return (
    <div className="">
      <div className="flex items-center">
        <div className="flex-shrink-0 h-10 w-10">
          <Placeholder
            // @ts-ignore
            image={item.image ? getImageFromS3(item.image) : null}
            lastName={item.lastName}
            firstName={item.firstName}
            size="h-8 w-8"
          />
        </div>
        <div className="ml-2">
          <div
            data-cy={`${item.id}`}
            className="hover:text-gray-600 cursor-pointer text-sm leading-5 font-medium text-gray-900">
            <Highlighted
              text={item.name.split(' ').join('').length > 0 ? item.name : '--'}
              highlight={searchTerm}
            />
          </div>
          <div className="text-sm leading-5 text-gray-500">
            <Highlighted text={item.email} highlight={searchTerm} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLookupName;
