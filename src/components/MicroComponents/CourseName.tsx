import Highlighted from '@components/Atoms/Highlighted';
import Placeholder from '@components/Atoms/Placeholder';
import {getImageFromS3Static} from '@utilities/services';

const CourseName = ({
  item,

  searchTerm,
  editCurrentCurricular
}: any) => {
  // const showPopover = hoveringItem?.id === item.id && currentSelectedItem;

  // const filter: ModelPersonFilterInput = {
  //   role: {
  //     ne: Role.ST
  //   },
  //   status: {
  //     ne: PersonStatus.INACTIVE
  //   },
  //   ...createFilterToFetchSpecificItemsOnly(item?.designers || [], 'id')
  // };
  // const [designers, setDesigners] = useState<any[]>([]);

  // const {isLoading, isFetched} = useGraphqlQuery(
  //   'fetchPersons',
  //   {
  //     filter: filter,
  //     limit: 50
  //   },
  //   {
  //     custom: true,
  //     originalName: 'listPeople',
  //     onSuccess: (data: any) => {
  //       setDesigners(data);
  //     },
  //     enabled:
  //       showPopover && item && item?.designers?.length > 0 && designers.length === 0
  //   }
  // );
  return (
    <div
      data-cy={`curriculum-${item.name.split(' ').join('-')}`}
      onClick={() => editCurrentCurricular(item.id)}
      className="flex hover:underline hover:theme-text:400 cursor-pointer items-center">
      <div className="flex-shrink-0 h-10 w-10 flex items-center">
        {item.image ? (
          <img src={getImageFromS3Static(item.image)} className="h-8 w-8 rounded-full" />
        ) : (
          <Placeholder name={item.name} size="h-8 w-8" />
        )}
      </div>
      <div className="relative  ">
        <Highlighted text={item.name} highlight={searchTerm} />
      </div>
    </div>
  );
};

export default CourseName;
