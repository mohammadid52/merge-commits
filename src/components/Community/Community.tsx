import ContentCard from '@atoms/ContentCard';
import SectionTitleV3 from '@atoms/SectionTitleV3';
import BreadCrums from '@components/Atoms/BreadCrums';
import AddNewCard from '@components/Community/AddNewCard';
import Card from '@components/Community/Card';
import CardsModal from '@components/Community/CardsModal';
import {communityTypes, NavStateTypes} from '@components/Community/constants.community';
import DashboardContainer from '@components/Dashboard/DashboardContainer';
import {useGlobalContext} from '@contexts/GlobalContext';
import useDictionary from '@customHooks/dictionary';
import {getAsset} from 'assets';
import React, {useEffect, useRef, useState} from 'react';
import {API, graphqlOperation} from 'aws-amplify';
import * as mutations from '@graphql/mutations';
import * as queries from '@graphql/queries';
import {v4 as uuidV4} from 'uuid';
import useAuth from '@customHooks/useAuth';
import {
  IAnnouncementInput,
  ICheckItOutInput,
  ICommunityCard,
  IEventInput,
  ISpotlightInput,
} from '@interfaces/Community.interfaces';
import {awsFormatDate, dateString} from '@utilities/time';
import AnimatedContainer from '@uiComponents/Tabs/AnimatedContainer';
import useOnScreen from '@customHooks/useOnScreen';
import {BsCardHeading} from 'react-icons/bs';
import Loader from '@components/Atoms/Loader';

const Community = ({}: {role: string}) => {
  const {state, clientKey, userLanguage} = useGlobalContext();
  const instId = state.user.associateInstitute[0].institution.id;

  const [list, setList] = useState<ICommunityCard[]>([]);

  const [isFetched, setIsFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState('');
  const {authId: personAuthID, email: personEmail} = useAuth();

  const fetchCommunities = async () => {
    try {
      setIsLoading(true);
      let payload: any = {
        institutionID: instId,
        limit: 12,
      };
      const res: any = await API.graphql(
        graphqlOperation(queries.listCommunitys, payload)
      );
      const data = res.data.listCommunitys.items;
      setList([...data]);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setIsLoading(false);
      setIsFetched(true);
    }
  };

  useEffect(() => {
    if (!isFetched) {
      fetchCommunities();
    }
  }, [isFetched]);

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

  const getCommonInput = (): {
    id: string;
    institutionID: any;
    cardDate: string;
    personAuthID: any;
    personEmail: any;
  } => ({
    id: uuidV4(),
    institutionID: instId,
    cardDate: awsFormatDate(dateString('-', 'WORLD')),

    personAuthID,
    personEmail,
  });

  const onSpotlightSubmit = async (spotlightDetails: ISpotlightInput) => {
    // @ts-ignore
    list.push({...spotlightDetails, type: communityTypes.SPOTLIGHT});
    setList((prev) => [...prev]);

    const commonInput = getCommonInput();

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
    list.push({...announcementDetails, type: communityTypes.ANNOUNCEMENTS});
    setList((prev) => [...prev]);

    const commonInput = getCommonInput();

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
    list.push({...eventDetails, type: communityTypes.EVENT});
    setList((prev) => [...prev]);

    const commonInput = getCommonInput();

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
    list.push({...checkItOutDetails, type: communityTypes.CHECK_IT_OUT});
    setList((prev) => [...prev]);

    const commonInput = getCommonInput();

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
      bannerImg={bannerImg}
      label={'Community'}
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
          extraClass="leading-6 text-gray-900"
          borderBottom
        />
        <ContentCard
          hasBackground={false}
          additionalClass="shadow bg-white space-y-12 p-6 rounded-b-lg">
          {/* Add new card */}
          <AddNewCard cardRef={cardRef} onClick={() => setShowCardsModal(true)} />
          {!isCardVisible && <FAB />}

          {!Boolean(error) && isLoading && !isFetched && (
            <Loader withText="Loading cards..." className="w-auto text-gray-400" />
          )}

          {/* Error */}
          <AnimatedContainer show={Boolean(error)}>
            {error && <p className="text-red-500 text-xs">{error}</p>}
          </AnimatedContainer>

          {/* Other Cards here */}
          {!isLoading &&
            isFetched &&
            list &&
            list.length > 0 &&
            list.map((card, idx) => (
              <Card
                key={idx}
                cardDetails={{...card, cardType: communityTypes.SPOTLIGHT}}
              />
            ))}
        </ContentCard>
      </div>
    </DashboardContainer>
  );
};

export default Community;
