import SectionTitleV3 from '@atoms/SectionTitleV3';
import BreadCrums from '@components/Atoms/BreadCrums';
import ContentCard from '@components/Atoms/ContentCard';
import Selector from '@components/Atoms/Form/Selector';
import Loader from '@components/Atoms/Loader';
import Card from '@components/Community/Card';
import CardsModal from '@components/Community/CardsModal';
import {
  CardType,
  COMMUNITY_UPLOAD_KEY,
  NavStateTypes,
} from '@components/Community/constants.community';
import DashboardContainer from '@components/Dashboard/DashboardContainer';
import HeroBanner from '@components/Header/HeroBanner';
import AnimatedContainer from '@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import {useGlobalContext} from '@contexts/GlobalContext';
import useDictionary from '@customHooks/dictionary';
import useAuth from '@customHooks/useAuth';
import * as mutations from '@graphql/mutations';
import useGraphqlMutation from '@graphql/useGraphqlMutation';
import useGraphqlQuery from '@graphql/useGraphqlQuery';
import {
  IAnnouncementInput,
  ICheckItOutInput,
  ICommunityCard,
  IEventInput,
  ISpotlightInput,
} from '@interfaces/Community.interfaces';
import {deleteImageFromS3} from '@utilities/services';
import {awsFormatDate, dateString} from '@utilities/time';
import {getAsset} from 'assets';
import {API, graphqlOperation} from 'aws-amplify';
import 'components/Community/community.scss';
import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';
import remove from 'lodash/remove';
import React, {useEffect, useState} from 'react';
import {BsCardHeading} from 'react-icons/bs';
import {useHistory, useRouteMatch} from 'react-router';
import {v4 as uuidV4} from 'uuid';

const Community = ({}: {role: string}) => {
  const {clientKey, userLanguage} = useGlobalContext();

  const {authId: personAuthID, email: personEmail, instId, isStudent} = useAuth();

  const route: any = useRouteMatch();

  const action = route.params.action;
  const [showCardsModal, setShowCardsModal] = useState(false);

  useEffect(() => {
    if (action === 'builder') {
      if (!showCardsModal) {
        setShowCardsModal(true);
      }
    }
  }, [action, showCardsModal]);

  useEffect(() => {
    if (!showCardsModal && action === 'builder') {
      history.push(`/dashboard/community/front`);
    }
  }, [showCardsModal, action]);

  const history = useHistory();

  const bannerImg = getAsset(clientKey, 'dashboardBanner1');
  const {CommunityDict, BreadcrumsTitles} = useDictionary(clientKey);

  const breadCrumsList = [
    {title: BreadcrumsTitles[userLanguage]['HOME'], url: '/dashboard', last: false},
    {
      title: BreadcrumsTitles[userLanguage]['COMMUNTIY'],
      url: `/dashboard/`,
      last: true,
    },
  ];
  const payloadForCommunities = {institutionID: instId, limit: 12};

  const {data: list, setData: setList, error, isFetched, isLoading} = useGraphqlQuery(
    'listCommunitys',
    payloadForCommunities,
    {
      onSuccess: (data, cb) => {
        const orderedList = orderBy(data, ['createdAt'], 'desc');
        cb(orderedList);
      },
    }
  );

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

  const {mutate} = useGraphqlMutation('createCommunity', {
    onCancel,
    onSuccess: (data) => {
      list.unshift({...data});
      setList([...list]);
    },
  });

  const onSpotlightSubmit = async (spotlightDetails: ISpotlightInput) => {
    const commonInput = getCommonInput('spotlight');

    const input = {
      cardImageLink: spotlightDetails.cardImageLink,
      summary: spotlightDetails.summary,
      additionalLinks: spotlightDetails.additionalLinks,
      ...commonInput,
    };

    mutate({input});
  };

  const onAnnouncementSubmit = async (announcementDetails: IAnnouncementInput) => {
    const commonInput = getCommonInput('announcement');

    const input = {
      cardImageLink: announcementDetails.cardImageLink,
      summary: announcementDetails.summary,
      cardName: announcementDetails.cardName,
      ...commonInput,
    };

    mutate({input});
  };

  const onEventSubmit = async (eventDetails: IEventInput) => {
    const commonInput = getCommonInput('event');

    const input = {
      ...eventDetails,
      ...commonInput,
    };

    mutate({input});
  };

  const onCheckItOutSubmit = async (checkItOutDetails: ICheckItOutInput) => {
    const commonInput = getCommonInput('check_it_out');

    const input = {
      ...checkItOutDetails,
      ...commonInput,
    };

    mutate({input});
  };

  const FAB = () => {
    return (
      <div
        onClick={() => setShowCardsModal(true)}
        className="fixed bottom-5 cursor-pointer flex items-center justify-center right-5 h-14 w-14  rounded-full iconoclast:bg-main curate:bg-main">
        <BsCardHeading className="text-white text-lg" />
      </div>
    );
  };

  const deleteImage = async (fileKey: string) => {
    deleteImageFromS3(`${COMMUNITY_UPLOAD_KEY}${fileKey}`);
  };

  const onDelete = async (cardId: string, fileKey: string) => {
    try {
      remove(list, ['id', cardId]);
      setList([...list]);
      await deleteImage(fileKey);
      const res: any = await API.graphql(
        graphqlOperation(mutations.deleteCommunity, {input: {id: cardId}})
      );
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  const CommonList = () => {
    return (
      <ContentCard
        hasBackground={false}
        additionalClass="shadow bg-white space-y-12 p-6 rounded-b-lg">
        <div> {<FAB />}</div>

        {!Boolean(error) && isLoading && !isFetched && (
          <Loader withText="Loading cards..." className="w-auto text-gray-400" />
        )}

        {/* Error--1213 */}
        <AnimatedContainer show={Boolean(error)}>
          {error && <p className="text-red-500 text-xs">{error}</p>}
        </AnimatedContainer>

        {/* Other Cards here */}
        {!isLoading &&
          isFetched &&
          list &&
          list.length > 0 &&
          list.map((card: ICommunityCard, idx: number) => (
            <Card onDelete={onDelete} key={idx} cardDetails={card} />
          ))}
      </ContentCard>
    );
  };

  const changeFilter = (val: string, name: string, id: string) => {
    const filtered = filter(list, (d: ICommunityCard) => {
      return d.cardType === name;
    });

    setList([...filtered]);
    setSelectedFilterType({id: id, name: name, value: val});
  };

  const [selectedFilterType, setSelectedFilterType] = useState<any>({});

  const filterList = [
    {id: 1, name: 'Spotlight'},
    {id: 2, name: 'Announcement'},
    {id: 3, name: 'Event'},
    {id: 4, name: 'Check It Out'},
  ];

  if (isStudent) {
    return (
      <div>
        <div>
          <HeroBanner imgUrl={bannerImg} title={'Community'} />
        </div>
        <div
          className={`w-full lg:max-w-192 md:max-w-none 2xl:max-w-256 mx-auto z-10 flex flex-col justify-between  items-center -mt-4 2xl:-mt-6 mb-4 px-6 py-1 2xl:py-4 m-auto relative iconoclast:bg-main curate:bg-main text-white rounded`}>
          <h2 className={`text-sm 2xl:text-base text-center font-normal`}>
            Here is what is happening today
          </h2>
        </div>
        <SectionTitleV3
          extraContainerClass="lg:max-w-192 md:max-w-none 2xl:max-w-256 my-8 px-6"
          title={'Community'}
          fontSize="xl"
          fontStyle="semibold"
          extraClass="leading-6 text-gray-900"
          borderBottom
          withButton={
            <div className="w-auto">
              <Selector
                selectedItem={selectedFilterType.name}
                list={filterList}
                additionalClass="w-56"
                placeholder={'Show all'}
                onChange={changeFilter}
              />
            </div>
          }
        />
        <CardsModal
          navState={navState}
          setNavState={setNavState}
          functions={{
            onCheckItOutSubmit,
          }}
          instId={instId}
          showCardsModal={showCardsModal}
          setShowCardsModal={setShowCardsModal}
        />

        <CommonList />
      </div>
    );
  }

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
        <CommonList />
      </div>
    </DashboardContainer>
  );
};

export default Community;
