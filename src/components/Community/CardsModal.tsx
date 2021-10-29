import Modal from '@components/Atoms/Modal';
import Announcements from '@components/Community/Cards/Announcement';
import CheckItOut from '@components/Community/Cards/CheckItOut';
import Event from '@components/Community/Cards/Event';
import Spotlight from '@components/Community/Cards/Spotlight';
import {
  communityContent,
  communityTypes,
  NavStateTypes,
} from '@components/Community/constants.community';
import {classNames} from '@components/Lesson/UniversalLessonBuilder/UI/FormElements/TextInput';
import useAuth from '@customHooks/useAuth';
import {
  ISpotlightInput,
  IAnnouncementInput,
  ICheckItOutInput,
  IEventInput,
} from '@interfaces/Community.interfaces';
import {setState} from '@interfaces/index';
import AnimatedContainer from '@uiComponents/Tabs/AnimatedContainer';
import React from 'react';
import {HiOutlineArrowRight} from 'react-icons/hi';

const getModalHeader = (navState: NavStateTypes) => {
  switch (navState) {
    case communityTypes.INIT:
      return 'Select Card';

    case communityTypes.SPOTLIGHT:
      return 'Spotlight Card';

    case communityTypes.ANNOUNCEMENTS:
      return 'Announcement Card';

    case communityTypes.EVENT:
      return 'Event Card';

    case communityTypes.CHECK_IT_OUT:
      return 'Check It Out Card';

    default:
      return 'Select Card';
  }
};

const Item = ({
  content,
  setNavState,
}: {
  content: any;
  setNavState: React.Dispatch<React.SetStateAction<NavStateTypes>>;
}) => {
  return (
    <div
      onClick={() => setNavState(content.type)}
      className={`relative  form-button rounded-lg border-0 border-gray-300  bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:${content.iconBackground}  transition-all focus-within:ring-2`}>
      <>
        <span
          className={classNames(
            content.iconBackground,
            content.iconForeground,
            'rounded-lg inline-flex p-3 w-auto'
          )}>
          <content.icon className="h-6 w-6" aria-hidden="true" />
        </span>
        <div className="flex-1 min-w-0 flex items-center justify-between">
          <div className="focus:outline-none cursor-pointer">
            <span className="absolute inset-0" aria-hidden="true" />
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {content.name}
            </p>
            <p className="text-sm text-gray-500  truncate">{content.subtitle}</p>
          </div>
        </div>

        <div className="w-auto">
          <HiOutlineArrowRight
            className={`arrow-icon w-auto ${content.iconForeground}`}
          />
        </div>
      </>
    </div>
  );
};

const CardsModal = ({
  showCardsModal,
  setShowCardsModal,
  functions,
  instId,
  navState,
  setNavState,
}: {
  showCardsModal: boolean;
  instId: string;
  functions: {
    onSpotlightSubmit?: (input: ISpotlightInput) => void;
    onAnnouncementSubmit?: (input: IAnnouncementInput) => void;
    onEventSubmit?: (input: IEventInput) => void;
    onCheckItOutSubmit?: (input: ICheckItOutInput) => void;
  };
  setShowCardsModal: setState['boolean'];
  navState?: NavStateTypes;
  setNavState?: React.Dispatch<React.SetStateAction<NavStateTypes>>;
}) => {
  const onInit = navState === 'init';
  const onSpotlight = navState === 'spotlight';
  const onAnnouncement = navState === 'announcement';
  const onEvent = navState === 'event';
  const onCheckItOut = navState === 'check_it_out';

  const onCancel = (): void => {
    setShowCardsModal(false);
    setNavState('init');
  };
  const {isStudent} = useAuth();

  let cardList = isStudent
    ? communityContent.filter((d) => d.type === communityTypes.CHECK_IT_OUT)
    : communityContent;

  return (
    <div>
      {showCardsModal && (
        <Modal
          showHeader
          closeAction={onCancel}
          showFooter={false}
          title={getModalHeader(navState)}>
          <>
            <AnimatedContainer show={onInit} animationType="translateY">
              {onInit && (
                <div
                  className={`grid grid-cols-1 ${
                    cardList.length > 1 ? 'sm:grid-cols-2' : ''
                  } gap-4   px-2 my-4`}>
                  {cardList.map((content, idx) => (
                    <Item setNavState={setNavState} key={idx} content={content} />
                  ))}
                </div>
              )}
            </AnimatedContainer>
            <AnimatedContainer show={onSpotlight} animationType="translateY">
              {onSpotlight && (
                <div className="">
                  <Spotlight
                    onSubmit={(input: ISpotlightInput) =>
                      functions.onSpotlightSubmit(input)
                    }
                    onCancel={onCancel}
                    instId={instId}
                  />
                </div>
              )}
            </AnimatedContainer>
            <AnimatedContainer show={onAnnouncement} animationType="translateY">
              {onAnnouncement && (
                <div className="">
                  <Announcements
                    onSubmit={(input: IAnnouncementInput) =>
                      functions.onAnnouncementSubmit(input)
                    }
                    onCancel={onCancel}
                  />
                </div>
              )}
            </AnimatedContainer>
            <AnimatedContainer show={onEvent} animationType="translateY">
              {onEvent && (
                <div className="">
                  <Event
                    onSubmit={(input: IEventInput) => functions.onEventSubmit(input)}
                    onCancel={onCancel}
                  />
                </div>
              )}
            </AnimatedContainer>
            <AnimatedContainer show={onCheckItOut} animationType="translateY">
              {onCheckItOut && (
                <div className="">
                  <CheckItOut
                    onSubmit={(input: IEventInput) => functions.onCheckItOutSubmit(input)}
                    onCancel={onCancel}
                  />
                </div>
              )}
            </AnimatedContainer>
          </>
        </Modal>
      )}
    </div>
  );
};

export default CardsModal;
