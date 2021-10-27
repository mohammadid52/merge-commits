import SectionTitleV3 from '@atoms/SectionTitleV3';
import BreadCrums from '@components/Atoms/BreadCrums';
import CardsModal from '@components/Community/CardsModal';
import CommanCommunityContent from '@components/Community/CommanCommunityContent';
import {CardType, NavStateTypes} from '@components/Community/constants.community';
import DashboardContainer from '@components/Dashboard/DashboardContainer';
import {useGlobalContext} from '@contexts/GlobalContext';
import useDictionary from '@customHooks/dictionary';
import useAuth from '@customHooks/useAuth';
import useOnScreen from '@customHooks/useOnScreen';
import * as mutations from '@graphql/mutations';
import {
  IAnnouncementInput,
  ICheckItOutInput,
  ICommunityCard,
  IEventInput,
  ISpotlightInput,
} from '@interfaces/Community.interfaces';
import {awsFormatDate, dateString} from '@utilities/time';
import {getAsset} from 'assets';
import {API, graphqlOperation} from 'aws-amplify';
import 'components/Community/community.scss';
import React, {useRef, useState} from 'react';
import {BsCardHeading} from 'react-icons/bs';
import {v4 as uuidV4} from 'uuid';

const Community = ({}: {role: string}) => {
  const {state, clientKey, userLanguage} = useGlobalContext();
  const instId = state.user.associateInstitute[0].institution.id;

  const [list, setList] = useState<ICommunityCard[]>([]);

  const {authId: personAuthID, email: personEmail} = useAuth();

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

  const [navState, setNavState] = useState<NavStateTypes>('init');

  const onCancel = (): void => {
    setShowCardsModal(false);
    setNavState('init');
  };

  const getCommonInput = (
    cardType: CardType
  ): {
    id: string;
    institutionID: string;
    cardDate: string;
    cardType: CardType;
    personAuthID: string;
    personEmail: string;
  } => ({
    id: uuidV4(),
    institutionID: instId,
    cardDate: awsFormatDate(dateString('-', 'WORLD')),
    cardType: cardType,
    personAuthID,
    personEmail,
  });

  const onSpotlightSubmit = async (spotlightDetails: ISpotlightInput) => {
    // @ts-ignore
    list.unshift({...spotlightDetails});
    setList((prev) => [...prev]);

    const commonInput = getCommonInput('spotlight');

    const input = {
      cardImageLink: spotlightDetails.cardImageLink,
      summary: spotlightDetails.summary,
      additionalLinks: spotlightDetails.additionalLinks,
      ...commonInput,
    };

    try {
      const res: any = await API.graphql(
        graphqlOperation(mutations.createCommunity, {
          input,
        })
      );
    } catch (error) {
      console.error(error);
    } finally {
      onCancel();
    }
  };

  const onAnnouncementSubmit = async (announcementDetails: IAnnouncementInput) => {
    // @ts-ignore
    list.unshift({...announcementDetails});
    setList((prev) => [...prev]);

    const commonInput = getCommonInput('announcement');

    const input = {
      cardImageLink: announcementDetails.cardImageLink,
      summary: announcementDetails.summary,
      cardName: announcementDetails.cardName,
      ...commonInput,
    };

    try {
      const res: any = await API.graphql(
        graphqlOperation(mutations.createCommunity, {
          input,
        })
      );
    } catch (error) {
      console.error(error);
    } finally {
      onCancel();
    }
  };

  const onEventSubmit = async (eventDetails: IEventInput) => {
    // @ts-ignore
    list.unshift({...eventDetails});
    setList((prev) => [...prev]);

    const commonInput = getCommonInput('event');

    const input = {
      ...eventDetails,
      ...commonInput,
    };

    try {
      const res: any = await API.graphql(
        graphqlOperation(mutations.createCommunity, {
          input,
        })
      );
    } catch (error) {
      console.error(error);
    } finally {
      onCancel();
    }
  };

  const onCheckItOutSubmit = async (checkItOutDetails: ICheckItOutInput) => {
    // @ts-ignore
    list.unshift({...checkItOutDetails});
    setList((prev) => [...prev]);

    const commonInput = getCommonInput('check_it_out');

    const input = {
      ...checkItOutDetails,
      ...commonInput,
    };

    try {
      const res: any = await API.graphql(
        graphqlOperation(mutations.createCommunity, {
          input,
        })
      );
    } catch (error) {
      console.error(error);
    } finally {
      onCancel();
    }
  };

  // Ref
  const cardRef = useRef(null);
  const isCardVisible = useOnScreen(cardRef);

  const FAB = () => {
    return (
      <div
        onClick={() => setShowCardsModal(true)}
        className="fixed bottom-5 cursor-pointer flex items-center justify-center right-5 h-14 w-14  rounded-full iconoclast:bg-main curate:bg-main">
        <BsCardHeading className="text-white text-lg" />
      </div>
    );
  };

  return (
    <DashboardContainer
      showTitleBanner={false}
      bannerImg={bannerImg}
      bannerTitle={CommunityDict[userLanguage]['TITLE']}>
      {/* ~~~~~~~~~~~~~CARDS MODAL STARTS~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      <CardsModal
        navState={navState}
        setNavState={setNavState}
        functions={{
          onSpotlightSubmit,
          onAnnouncementSubmit,
          onEventSubmit,
          onCheckItOutSubmit,
        }}
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
          extraClass="leading-6 text-gray-900 "
          borderBottom
        />

        <CommanCommunityContent
          list={list}
          contentOnlyForTeachers={
            <div>
              {/* Add new card */}
              {/* <AddNewCard cardRef={cardRef} onClick={() => setShowCardsModal(true)} /> */}
              {<FAB />}
            </div>
          }
        />
      </div>
    </DashboardContainer>
  );
};

export default Community;
