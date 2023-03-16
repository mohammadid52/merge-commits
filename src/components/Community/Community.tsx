import BreadCrums from 'atoms/BreadCrums';
import Selector from 'atoms/Form/Selector';
import SectionTitleV3 from 'atoms/SectionTitleV3';
import CardsModal from 'components/Community/CardsModal';
import {
  CardType,
  COMMUNITY_UPLOAD_KEY,
  NavStateTypes
} from 'components/Community/constants.community';
import DashboardContainer from 'components/Dashboard/DashboardContainer';
import HeroBanner from 'components/Header/HeroBanner';
import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';

import ErrorBoundary from '@components/Error/ErrorBoundary';
import {logError, updatePageState} from '@graphql/functions';
import {ListCommunitiesQueryVariables, UserPageState} from 'API';
import {getAsset} from 'assets';
import {API, graphqlOperation} from 'aws-amplify';
import 'components/Community/community.scss';
import HeaderTextBar from 'components/Dashboard/HeaderTextBar/HeaderTextBar';
import useAuth from 'customHooks/useAuth';
import useGraphqlMutation from 'customHooks/useGraphqlMutation';
import useGraphqlQuery from 'customHooks/useGraphqlQuery';
import * as mutations from 'graphql/mutations';
import {
  IAnnouncementInput,
  ICheckItOutInput,
  ICommunityCard,
  IEventInput,
  ISpotlightInput
} from 'interfaces/Community.interfaces';
import {findIndex} from 'lodash';
import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';
import remove from 'lodash/remove';
import {useEffect, useState} from 'react';
import {useHistory, useRouteMatch} from 'react-router';
import {deleteImageFromS3} from 'utilities/services';
import {awsFormatDate, dateString} from 'utilities/time';
import {v4 as uuidV4} from 'uuid';
import CommonList from 'components/Community/CommanList';

const TitleBar = ({
  selectedFilterType,
  filterList,
  changeFilter
}: {
  selectedFilterType: any;
  filterList: any;
  changeFilter: any;
}) => (
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

const Community = () => {
  const {clientKey, userLanguage} = useGlobalContext();

  const {
    authId: personAuthID,
    email: personEmail,
    instId,
    isStudent,
    pageState
  } = useAuth();

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
  const {CommunityDict, BreadcrumsTitles} = useDictionary();

  const breadCrumsList = [
    {
      title: BreadcrumsTitles[userLanguage]['HOME'],
      href: '/dashboard',
      last: false
    },
    {
      title: BreadcrumsTitles[userLanguage]['COMMUNTIY'],
      href: `/dashboard/`,
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
        cb?.(orderedList);
      }
    }
  );

  useEffect(() => {
    if (isStudent) {
      updatePageState(UserPageState.COMMUNITY, {
        authId: personAuthID,
        email: personEmail,
        pageState
      });
    }
  }, [isStudent]);

  const [navState, setNavState] = useState<NavStateTypes>('init');
  const [filteredList, setFilteredList] = useState<any[]>([]);

  const onCancel = (): void => {
    setShowCardsModal(false);
    setNavState('init');
  };

  const [isCardEditMode, setIsCardEditMode] = useState(false);

  const [cardForEdit, setCardForEdit] = useState<any>(null);

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
        setList?.([...list]);
      }
    }
  });
  const updateCommunity = useGraphqlMutation('updateCommunity', {
    onCancel,
    onSuccess: (data: ICommunityCard) => {
      let listCopy = [...list];
      const cardIdx = findIndex(list, (item: ICommunityCard) => item.id === data.id);

      listCopy[cardIdx] = data;
      setList?.(listCopy);
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
      logError(
        error,
        {authId: personAuthID, email: personEmail},
        'Community @onSpotlightSubmit'
      );
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
      logError(
        error,
        {authId: personAuthID, email: personEmail},
        'Community @onAnnouncementSubmit'
      );
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
      logError(
        error,
        {authId: personAuthID, email: personEmail},
        'Community @onEventSubmit'
      );
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
      logError(
        error,
        {authId: personAuthID, email: personEmail},
        'Community @onCheckItOutSubmit'
      );
      console.error('Error while updating community list', error);
    }
  };

  const deleteImage = async (fileKey: string) => {
    deleteImageFromS3(`${COMMUNITY_UPLOAD_KEY}${fileKey}`);
  };

  const onDelete = async (cardId: string, fileKey?: string) => {
    try {
      remove(list, ['id', cardId]);
      setList?.([...list]);
      if (fileKey) {
        await deleteImage(fileKey);
      }
      await API.graphql(
        graphqlOperation(mutations.deleteCommunity, {input: {id: cardId}})
      );
    } catch (error) {
      logError(error, {authId: personAuthID, email: personEmail}, 'Community @onDelete');
      console.error(error);
    }
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
    {id: 1434, label: 'All', value: 'all'},
    {id: 1, label: 'Spotlight', value: 'spotlight'},
    {id: 2, label: 'Announcement', value: 'announcement'},
    {id: 3, label: 'Event', value: 'event'},
    {id: 4, label: 'Check It Out', value: 'check_it_out'}
  ];

  if (isStudent) {
    return (
      <div className="w-full">
        <div className="w-full">
          <HeroBanner imgUrl={bannerImg} title={'Community'} />
        </div>

        <HeaderTextBar>Here is what is happening today</HeaderTextBar>
        <div className="px-10">
          <TitleBar
            selectedFilterType={selectedFilterType}
            filterList={filterList}
            changeFilter={changeFilter}
          />
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

          <CommonList
            selectedFilterType={selectedFilterType}
            filteredList={filteredList}
            list={list}
            onDelete={onDelete}
            onCardEdit={onCardEdit}
            error={error}
            isFetched={isFetched}
            isLoading={isLoading}
            setShowCardsModal={setShowCardsModal}
          />
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary componentName="Community">
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
          <TitleBar
            selectedFilterType={selectedFilterType}
            filterList={filterList}
            changeFilter={changeFilter}
          />

          <CommonList
            selectedFilterType={selectedFilterType}
            filteredList={filteredList}
            list={list}
            onDelete={onDelete}
            onCardEdit={onCardEdit}
            error={error}
            isFetched={isFetched}
            isLoading={isLoading}
            setShowCardsModal={setShowCardsModal}
          />
        </div>
      </DashboardContainer>
    </ErrorBoundary>
  );
};

export default Community;
