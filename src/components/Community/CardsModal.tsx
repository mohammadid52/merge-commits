import ErrorBoundary from '@components/Error/ErrorBoundary';
import Modal from 'atoms/Modal';
import Announcements from 'components/Community/Cards/Announcement';
import CheckItOut from 'components/Community/Cards/CheckItOut';
import Event from 'components/Community/Cards/Event';
import Spotlight from 'components/Community/Cards/Spotlight';
import {
  communityContent,
  communityTypes,
  NavStateTypes
} from 'components/Community/constants.community';
import {classNames} from 'components/Lesson/UniversalLessonBuilder/UI/FormElements/TextInput';
import useAuth from 'customHooks/useAuth';

import {
  IAnnouncementInput,
  ICheckItOutInput,
  ICommunityCard,
  IEventInput,
  ISpotlightInput
} from 'interfaces/Community.interfaces';
import {setState} from 'interfaces/index';
import React from 'react';
import {HiOutlineArrowRight} from 'react-icons/hi';
import AnimatedContainer from 'uiComponents/Tabs/AnimatedContainer';

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
  setNavState
}: {
  content: any;
  setNavState?: React.Dispatch<React.SetStateAction<NavStateTypes>>;
}) => {
  const pathname = window.location.pathname;
  const isCommunity = pathname.includes('community');
  return (
    <div
      data-cy={content.type}
      onClick={() => setNavState?.(content.type)}
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
            <p
              className={`${
                isCommunity ? '' : 'dark:text-white'
              } text-sm font-medium text-gray-900 `}>
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
  editMode = false,
  cardDetails
}: {
  showCardsModal: boolean;

  cardDetails?: ICommunityCard;
  setShowCardsModal: setState['boolean'];
  editMode: boolean;
  instId: string;
  functions: {
    onSpotlightSubmit?: (input: ISpotlightInput, successCallback?: () => void) => void;
    onAnnouncementSubmit?: (
      input: IAnnouncementInput,
      successCallback?: () => void
    ) => void;
    onEventSubmit?: (input: IEventInput, successCallback?: () => void) => void;
    onCheckItOutSubmit?: (input: ICheckItOutInput, successCallback?: () => void) => void;
  };
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
    setNavState?.('init');
  };
  const {isStudent} = useAuth();

  let cardList = isStudent
    ? communityContent.filter((d) => d.type === communityTypes.CHECK_IT_OUT)
    : communityContent;

  const commonProps = {
    onCancel,
    editMode,
    cardDetails
  };

  return (
    <ErrorBoundary componentName="CardsModal">
      <div style={{zIndex: 99999}}>
        {showCardsModal && (
          <Modal
            showHeader
            closeAction={onCancel}
            showFooter={false}
            title={getModalHeader(navState || 'init')}>
            <div className="">
              {/* Showing all items in this block */}
              <AnimatedContainer show={onInit} animationType="translateY">
                {onInit && (
                  <div
                    className={`grid grid-cols-1 ${
                      cardList.length > 1 ? 'sm:grid-cols-2' : ''
                    } gap-4   px-2 my-4`}>
                    {cardList.map((content) => (
                      <Item
                        setNavState={setNavState}
                        key={content.name}
                        content={content}
                      />
                    ))}
                  </div>
                )}
              </AnimatedContainer>
              {/*  up --- Showing all items in this block --- up */}

              <AnimatedContainer show={onSpotlight} animationType="translateY">
                {onSpotlight && (
                  <div className="">
                    <Spotlight
                      onSubmit={(input: ISpotlightInput, cb) =>
                        functions.onSpotlightSubmit?.(input, cb)
                      }
                      instId={instId}
                      {...commonProps}
                    />
                  </div>
                )}
              </AnimatedContainer>
              <AnimatedContainer show={onAnnouncement} animationType="translateY">
                {onAnnouncement && (
                  <div className="">
                    <Announcements
                      onSubmit={(input: IAnnouncementInput, cb) =>
                        functions.onAnnouncementSubmit?.(input, cb)
                      }
                      {...commonProps}
                    />
                  </div>
                )}
              </AnimatedContainer>
              <AnimatedContainer show={onEvent} animationType="translateY">
                {onEvent && (
                  <div className="">
                    <Event
                      // @ts-ignore
                      onSubmit={(input: IEventInput, cb) =>
                        functions.onEventSubmit?.(input, cb)
                      }
                      {...commonProps}
                    />
                  </div>
                )}
              </AnimatedContainer>
              <AnimatedContainer show={onCheckItOut} animationType="translateY">
                {onCheckItOut && (
                  <div className="">
                    <CheckItOut
                      // @ts-ignore
                      onSubmit={(input: IEventInput, cb) =>
                        functions.onCheckItOutSubmit?.(input, cb)
                      }
                      {...commonProps}
                    />
                  </div>
                )}
              </AnimatedContainer>
            </div>
          </Modal>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default CardsModal;
