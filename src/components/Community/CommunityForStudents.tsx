import SectionTitleV3 from '@atoms/SectionTitleV3';
import CardsModal from '@components/Community/CardsModal';
import CommanCommunityContent from '@components/Community/CommanCommunityContent';
import {CardType, NavStateTypes} from '@components/Community/constants.community';
import HeroBanner from '@components/Header/HeroBanner';
import {GlobalContext} from '@contexts/GlobalContext';
import useAuth from '@customHooks/useAuth';
import useGraphql from '@customHooks/useGraphqlMutation';
import {ICheckItOutInput, ICommunityCard} from '@interfaces/Community.interfaces';
import {awsFormatDate, dateString} from '@utilities/time';
import {getAsset} from 'assets';
import React, {useContext, useState} from 'react';
import {BsCardHeading} from 'react-icons/bs';
import {v4 as uuidV4} from 'uuid';

const CommunityForStudents = ({
  role,
  setList,
  list,
}: {
  role: string;
  list: ICommunityCard[];
  setList: React.Dispatch<React.SetStateAction<ICommunityCard[]>>;
}) => {
  const {clientKey} = useContext(GlobalContext);

  const dashboardBanner1 = getAsset(clientKey, 'dashboardBanner1');
  const [navState, setNavState] = useState<NavStateTypes>('init');
  const {authId: personAuthID, email: personEmail, instId} = useAuth();
  const [showCardsModal, setShowCardsModal] = useState(false);

  const FAB = () => {
    return (
      <div
        onClick={() => setShowCardsModal(true)}
        className="fixed bottom-5 cursor-pointer flex items-center justify-center right-5 h-14 w-14  rounded-full iconoclast:bg-main curate:bg-main">
        <BsCardHeading className="text-white text-lg" />
      </div>
    );
  };

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

  const {mutate} = useGraphql('createCommunity', {
    onCancel,
  });

  const onCheckItOutSubmit = async (checkItOutDetails: ICheckItOutInput) => {
    // @ts-ignore
    list.unshift({...checkItOutDetails});
    setList((prev) => [...prev]);

    const commonInput = getCommonInput('check_it_out');

    const input = {
      ...checkItOutDetails,
      ...commonInput,
    };
    mutate({input});
  };

  return (
    <div>
      <div>
        <HeroBanner imgUrl={dashboardBanner1} title={'Community'} />
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
      <CommanCommunityContent list={list} customContent={<div> {<FAB />}</div>} />
    </div>
  );
};

export default CommunityForStudents;
