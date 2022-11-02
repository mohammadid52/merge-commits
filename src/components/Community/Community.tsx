import BreadCrums from 'atoms/BreadCrums';
import ContentCard from 'atoms/ContentCard';
import Selector from 'atoms/Form/Selector';
import Loader from 'atoms/Loader';
import SectionTitleV3 from 'atoms/SectionTitleV3';
import Card from 'components/Community/Card';
import CardsModal from 'components/Community/CardsModal';
import {
  CardType,
  COMMUNITY_UPLOAD_KEY,
  NavStateTypes
} from 'components/Community/constants.community';
import DashboardContainer from 'components/Dashboard/DashboardContainer';
import HeroBanner from 'components/Header/HeroBanner';
import AnimatedContainer from 'components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';

import {
  IAnnouncementInput,
  ICheckItOutInput,
  ICommunityCard,
  IEventInput,
  ISpotlightInput
} from 'interfaces/Community.interfaces';
import {getAsset} from 'assets';
import {API, graphqlOperation} from 'aws-amplify';
import 'components/Community/community.scss';
import HeaderTextBar from 'components/Dashboard/HeaderTextBar/HeaderTextBar';
import useAuth from 'customHooks/useAuth';
import useGraphqlMutation from 'customHooks/useGraphqlMutation';
import useGraphqlQuery from 'customHooks/useGraphqlQuery';
import * as mutations from 'graphql/mutations';
import {findIndex, isEmpty} from 'lodash';
import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';
import remove from 'lodash/remove';
import React, {useEffect, useState} from 'react';
import {BsCardHeading} from 'react-icons/bs';
import {useHistory, useRouteMatch} from 'react-router';
import {deleteImageFromS3} from 'utilities/services';
import {awsFormatDate, dateString} from 'utilities/time';
import {v4 as uuidV4} from 'uuid';
import {ListCommunitiesQuery, ListCommunitiesQueryVariables} from 'API';

const Community = ({}: {role: string}) => {
  const {clientKey, userLanguage} = useGlobalContext();

  const {authId: personAuthID, email: personEmail, instId, isStudent} = useAuth();

  const route: any = useRouteMatch();

  const action = route.params.action;
  const [showCardsModal, setShowCardsModal] = useState(false);

  useEffect(() => {
    if (action === 'builder' && !isStudent) {
      if (!showCardsModal) {
        setShowCardsModal(true);
      }
    }
  }, [action, showCardsModal]);

  useEffect(() => {
    if ((!showCardsModal && action === 'builder') || (isStudent && !showCardsModal)) {
      history.push(`/dashboard/community/front`);
    }
  }, [showCardsModal, isStudent, action]);

  const history = useHistory();

  const bannerImg = getAsset(clientKey, 'dashboardBanner1');
  const {CommunityDict, BreadcrumsTitles} = useDictionary(clientKey);

  const breadCrumsList = [
    {title: BreadcrumsTitles[userLanguage]['HOME'], url: '/dashboard', last: false},
    {
      title: BreadcrumsTitles[userLanguage]['COMMUNTIY'],
      url: `/dashboard/`,
      last: true
    }
  ];
  const payloadForCommunities = {};

  const {
    data: list,
    setData: setList,
    refetch,
    error,
    isFetched,
    isLoading
  } = useGraphqlQuery<ListCommunitiesQueryVariables, any[]>(
    'listCommunities',
    payloadForCommunities,
    {
      onSuccess: (data, cb) => {
        const orderedList = orderBy(data, ['createdAt'], 'desc');
        cb(orderedList);
      }
    }
  );

  const [navState, setNavState] = useState<NavStateTypes>('init');
  const [filteredList, setFilteredList] = useState([]);

  const onCancel = (): void => {
    setShowCardsModal(false);
    setNavState('init');
  };

  const [isCardEditMode, setIsCardEditMode] = useState(false);

  const [cardForEdit, setCardForEdit] = useState(null);

  const onCardEdit = (cardDetails: ICommunityCard) => {
    // @ts-ignore
    setNavState(cardDetails.cardType);
    setIsCardEditMode(true);
    setShowCardsModal(true);
    setCardForEdit(cardDetails);
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
    personEmail
  });

  const createCommunity = useGraphqlMutation('createCommunity', {
    onCancel,
    onSuccess: (data: any) => {
      if (data) {
        // @ts-ignore
        list.unshift({...data});
        setList([...list]);
      }
    }
  });
  const updateCommunity = useGraphqlMutation('updateCommunity', {
    onCancel,
    onSuccess: (data: ICommunityCard) => {
      let listCopy = [...list];
      const cardIdx = findIndex(list, (item: ICommunityCard) => item.id === data.id);

      listCopy[cardIdx] = data;
      setList(listCopy);
    }
  });

  const onSpotlightSubmit = async (
    spotlightDetails: ISpotlightInput,
    successCallback?: () => void
  ) => {
    const commonInput = getCommonInput('spotlight');

    const input = {
      ...spotlightDetails,
      ...commonInput
    };

    if (isCardEditMode) {
      updateCommunity.mutate({input: {...input, id: cardForEdit.id}}, successCallback);
    } else {
      createCommunity.mutate({input}, successCallback);
    }

    try {
      await refetch();
      console.log('Community list updated');
    } catch (error) {
      console.error('Error while updating community list', error);
    }
  };

  const onAnnouncementSubmit = async (
    announcementDetails: IAnnouncementInput,
    successCallback?: () => void
  ) => {
    const commonInput = getCommonInput('announcement');

    const input = {
      ...announcementDetails,
      ...commonInput
    };

    if (isCardEditMode) {
      updateCommunity.mutate({input: {...input, id: cardForEdit.id}}, successCallback);
    } else {
      createCommunity.mutate({input}, successCallback);
    }

    try {
      await refetch();
      console.log('Community list updated');
    } catch (error) {
      console.error('Error while updating community list', error);
    }
  };

  const onEventSubmit = async (
    eventDetails: IEventInput,
    successCallback?: () => void
  ) => {
    const commonInput = getCommonInput('event');

    const input = {
      ...eventDetails,
      ...commonInput
    };

    if (isCardEditMode) {
      updateCommunity.mutate({input: {...input, id: cardForEdit.id}}, successCallback);
    } else {
      createCommunity.mutate({input}, successCallback);
    }

    try {
      await refetch();
      console.log('Community list updated');
    } catch (error) {
      console.error('Error while updating community list', error);
    }
  };

  const onCheckItOutSubmit = async (
    checkItOutDetails: ICheckItOutInput,
    successCallback?: () => void
  ) => {
    const commonInput = getCommonInput('check_it_out');

    const input = {
      ...checkItOutDetails,
      ...commonInput
    };

    if (isCardEditMode) {
      updateCommunity.mutate({input: {...input, id: cardForEdit.id}}, successCallback);
    } else {
      createCommunity.mutate({input}, successCallback);
    }

    try {
      await refetch();
      console.log('Community list updated');
    } catch (error) {
      console.error('Error while updating community list', error);
    }
  };

  const FAB = () => {
    return (
      <div
        data-cy="open-builder-button"
        onClick={() => setShowCardsModal(true)}
        className="fixed z-100 bottom-8 md:bottom-5 cursor-pointer flex items-center justify-center right-2 md:right-5 h-14 w-14  rounded-full iconoclast:bg-main curate:bg-main">
        <BsCardHeading className="text-white text-lg" />
      </div>
    );
  };

  const deleteImage = async (fileKey: string) => {
    deleteImageFromS3(`${COMMUNITY_UPLOAD_KEY}${fileKey}`);
  };

  const onDelete = async (cardId: string, fileKey?: string) => {
    try {
      remove(list, ['id', cardId]);
      setList([...list]);
      if (fileKey) {
        await deleteImage(fileKey);
      }
      const res: any = await API.graphql(
        graphqlOperation(mutations.deleteCommunity, {input: {id: cardId}})
      );
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  const CommonList = () => {
    let data =
      isEmpty(selectedFilterType) || selectedFilterType.value === 'all'
        ? list
        : filteredList;
    return (
      <ContentCard hasBackground={false} additionalClass=" space-y-12 p-6">
        <div> {<FAB />}</div>

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
            <Loader
              withText="Loading cards..."
              className="w-auto iconoclast:text-main curate:text-main"
            />
          </div>
        )}

        {!Boolean(error) &&
          !isLoading &&
          isFetched &&
          data &&
          data.length > 0 &&
          data.map((card: ICommunityCard, idx: number) => (
            <Card
              onCardEdit={onCardEdit}
              onDelete={onDelete}
              key={idx}
              cardDetails={card}
            />
          ))}

        <AnimatedContainer show={data.length === 0 && isFetched}>
          {data.length === 0 && isFetched && (
            <div className="flex items-center justify-center">
              <p className="text-gray-500 text-sm">
                No community posts... Be the first to start the conversation
              </p>
            </div>
          )}
        </AnimatedContainer>
      </ContentCard>
    );
  };

  const changeFilter = (val: string, name: string, id: string) => {
    if (val !== 'all') {
      const filtered = filter(list, (d: ICommunityCard) => {
        return d.cardType === val;
      });

      setFilteredList([...filtered]);
    }
    setSelectedFilterType({id: id, name: name, value: val});
  };

  const [selectedFilterType, setSelectedFilterType] = useState<any>({});

  const filterList = [
    {id: 1434, name: 'All', value: 'all'},
    {id: 1, name: 'Spotlight', value: 'spotlight'},
    {id: 2, name: 'Announcement', value: 'announcement'},
    {id: 3, name: 'Event', value: 'event'},
    {id: 4, name: 'Check It Out', value: 'check_it_out'}
  ];

  const TitleBar = () => (
    <SectionTitleV3
      extraContainerClass="mx-auto md:max-w-none lg:max-w-192 2xl:max-w-256 my-8 px-6 sticky top-0 z-1000"
      title={'Community'}
      fontSize="xl"
      fontStyle="semibold"
      extraClass="leading-6 text-gray-900"
      borderBottom
      shadowOff
      withButton={
        <div className="w-auto">
          <Selector
            selectedItem={selectedFilterType.name}
            list={filterList}
            additionalClass="md:w-56"
            placeholder={'All '}
            onChange={changeFilter}
          />
        </div>
      }
    />
  );

  if (isStudent) {
    return (
      <div>
        <div>
          <HeroBanner imgUrl={bannerImg} title={'Community'} />
        </div>

        <HeaderTextBar>Here is what is happening today</HeaderTextBar>
        <div className="px-10">
          <TitleBar />
          <CardsModal
            navState={navState}
            editMode={isCardEditMode}
            setNavState={setNavState}
            functions={{
              onCheckItOutSubmit
            }}
            instId={instId}
            showCardsModal={showCardsModal}
            setShowCardsModal={setShowCardsModal}
          />

          <CommonList />
        </div>
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
        editMode={isCardEditMode}
        cardDetails={cardForEdit}
        functions={{
          onSpotlightSubmit,
          onAnnouncementSubmit,
          onEventSubmit,
          onCheckItOutSubmit
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

      <div className="px-10">
        <TitleBar />

        <CommonList />
      </div>
    </DashboardContainer>
  );
};

export default Community;
