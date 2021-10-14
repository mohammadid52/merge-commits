import ContentCard from '@atoms/ContentCard';
import BreadCrums from '@components/Atoms/BreadCrums';
import DashboardContainer from '@components/Dashboard/DashboardContainer';
import {useGlobalContext} from '@contexts/GlobalContext';
import SectionTitleV3 from '@atoms/SectionTitleV3';
import useDictionary from '@customHooks/dictionary';
import {getAsset} from 'assets';
import React from 'react';

const AddNewCard = () => {
  return (
    <div className="h-48 border-gray-400 border-0 rounded-lg flex items-center justify-center">
      <p className="w-auto">Add new card</p>
    </div>
  );
};

const Community = ({role}: {role: string}) => {
  const {state, clientKey, userLanguage} = useGlobalContext();
  const bannerImg = getAsset(clientKey, 'dashboardBanner1');
  const {CommunityDict, BreadcrumsTitles} = useDictionary(clientKey);

  const breadCrumsList = [
    {title: BreadcrumsTitles[userLanguage]['HOME'], url: '/dashboard', last: false},
    {
      title: BreadcrumsTitles[userLanguage]['CLASSROOM'],
      url: `/dashboard/`,
      last: true,
    },
  ];

  return (
    <DashboardContainer
      bannerImg={bannerImg}
      currentPage={state.currentPage}
      bannerTitle={CommunityDict[userLanguage]['TITLE']}>
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
          additionalClass="shadow bg-white p-6 rounded-b-lg">
          <AddNewCard />
        </ContentCard>
      </div>
    </DashboardContainer>
  );
};

export default Community;
