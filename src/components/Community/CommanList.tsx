import ContentCard from '@components/Atoms/ContentCard';
import Loader from '@components/Atoms/Loader';
import ErrorBoundary from '@components/Error/ErrorBoundary';
import AnimatedContainer from '@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import {ICommunityCard} from '@interfaces/Community.interfaces';
import {isEmpty} from 'lodash';
import {BsCardHeading} from 'react-icons/bs';
import Card from 'components/Community/Card';

const FAB = ({
  setShowCardsModal
}: {
  setShowCardsModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div
      data-cy="open-builder-button"
      onClick={() => setShowCardsModal(true)}
      className="fixed z-100 bottom-8 md:bottom-5 cursor-pointer flex items-center justify-center right-2 md:right-5 h-14 w-14  rounded-full iconoclast:bg-main curate:bg-main">
      <BsCardHeading className="text-white text-lg" />
    </div>
  );
};

interface ICommonList {
  selectedFilterType: any;
  onCardEdit: (card: ICommunityCard) => void;
  onDelete: (cardId: string, fileKey: string) => void;
  list: ICommunityCard[];
  filteredList: ICommunityCard[];
  setShowCardsModal: React.Dispatch<React.SetStateAction<boolean>>;
  error: string;
  isFetched: boolean;
  isLoading: boolean;
}

const CommonList = ({
  selectedFilterType,
  onCardEdit,
  onDelete,
  list,
  filteredList,
  setShowCardsModal,
  error,
  isFetched,
  isLoading
}: ICommonList) => {
  let data =
    isEmpty(selectedFilterType) || selectedFilterType.value === 'all'
      ? list
      : filteredList;
  return (
    <ErrorBoundary componentName="CommonList">
      <ContentCard hasBackground={false} additionalClass=" space-y-12 p-6">
        <div> {<FAB setShowCardsModal={setShowCardsModal} />}</div>

        {/* Error--1213 */}
        <AnimatedContainer show={Boolean(error)}>
          {error && (
            <div className="flex items-center justify-center">
              <p className="text-red-500 text-xs">{error}</p>
            </div>
          )}
        </AnimatedContainer>

        {/* Other Cards here */}

        {!Boolean(error) && isLoading && !isFetched && (
          <div className="flex items-center justify-center">
            <Loader animation withText="Loading cards..." className="w-auto" />
          </div>
        )}

        {!Boolean(error) &&
          !isLoading &&
          isFetched &&
          data &&
          data.length > 0 &&
          data.map((card: ICommunityCard) => (
            <Card
              onCardEdit={onCardEdit}
              onDelete={onDelete}
              key={card.id}
              cardDetails={card}
            />
          ))}

        <AnimatedContainer show={Boolean(data.length === 0 && isFetched)}>
          {data.length === 0 && isFetched && (
            <div className="flex items-center justify-center">
              <p className="text-gray-500 text-sm">
                No community posts... Be the first to start the conversation
              </p>
            </div>
          )}
        </AnimatedContainer>
      </ContentCard>
    </ErrorBoundary>
  );
};

export default CommonList;
