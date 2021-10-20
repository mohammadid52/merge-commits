import ContentCard from '@atoms/ContentCard';
import SectionTitleV3 from '@atoms/SectionTitleV3';
import BreadCrums from '@components/Atoms/BreadCrums';
import AddNewCard from '@components/Community/AddNewCard';
import Card from '@components/Community/Card';
import CardsModal from '@components/Community/CardsModal';
import {communityTypes} from '@components/Community/constants.community';
import DashboardContainer from '@components/Dashboard/DashboardContainer';
import {useGlobalContext} from '@contexts/GlobalContext';
import useDictionary from '@customHooks/dictionary';
import {getAsset} from 'assets';
import React, {useState} from 'react';

const Community = ({role}: {role: string}) => {
  const {state, clientKey, userLanguage} = useGlobalContext();
  const instId = state.user.associateInstitute[0].institution.id;

  const bannerImg = getAsset(clientKey, 'dashboardBanner1');
  const {CommunityDict, BreadcrumsTitles} = useDictionary(clientKey);

  const [showCardsModal, setShowCardsModal] = useState(false);

  const breadCrumsList = [
    {title: BreadcrumsTitles[userLanguage]['HOME'], url: '/dashboard', last: false},
    {
      title: BreadcrumsTitles[userLanguage]['CLASSROOM'],
      url: `/dashboard/`,
      last: true,
    },
  ];

  const dummyInit = {
    type: communityTypes.SPOTLIGHT,
    media: 'community/1634651773858_f5256f22b9dea5d4eb80c41f91f87793.jpg',
    person: {
      id: 'd8ae581e-fce9-40ce-9107-969992d6717d',
      name: 'aman test',
      value: 'aman test',
    },
    note: 'Test note ',
  };
  const [cardList, setCardList] = useState([dummyInit]);

  const onSpotlightSubmit = (spotlightDetails: any) => {
    cardList.push({...spotlightDetails, type: communityTypes.SPOTLIGHT});
    setCardList((prev) => [...prev]);
  };
  const onAnnouncementSubmit = (announcementDetails: any) => {
    cardList.push({...announcementDetails, type: communityTypes.ANNOUNCEMENTS});
    setCardList((prev) => [...prev]);
  };
  const onEventSubmit = (eventDetails: any) => {
    cardList.push({...eventDetails, type: communityTypes.ANNOUNCEMENTS});
    setCardList((prev) => [...prev]);
  };

  return (
    <DashboardContainer
      bannerImg={bannerImg}
      label={'Community'}
      currentPage={state.currentPage}
      bannerTitle={CommunityDict[userLanguage]['TITLE']}>
      {/* ~~~~~~~~~~~~~CARDS MODAL STARTS~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      <CardsModal
        functions={{onSpotlightSubmit, onAnnouncementSubmit, onEventSubmit}}
        instId={instId}
        showCardsModal={showCardsModal}
        setShowCardsModal={setShowCardsModal}
      />
      {/* ~~~~~~~~~~~~~CARDS MODAL ENDS~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      <div className="px-5 2xl:px-0 lg:mx-auto lg:max-w-192 md:max-w-none 2xl:max-w-256">
        <div className="flex flex-row my-0 w-full py-0 mb-4 justify-between">
          <BreadCrums items={breadCrumsList} />
        </div>
      </div>
      <div>
        <SectionTitleV3
          extraContainerClass="lg:max-w-192 md:max-w-none 2xl:max-w-256 my-8 px-6"
          title={'Community'}
          fontSize="xl"
          fontStyle="semibold"
          extraClass="leading-6 text-gray-900"
          borderBottom
        />
        <ContentCard
          hasBackground={false}
          additionalClass="shadow bg-white space-y-12 p-6 rounded-b-lg">
          {/* Other Cards here */}

          {cardList.map((card) => (
            <Card cardDetails={card} />
          ))}

          <AddNewCard onClick={() => setShowCardsModal(true)} />
        </ContentCard>
      </div>
    </DashboardContainer>
  );
};

export default Community;
