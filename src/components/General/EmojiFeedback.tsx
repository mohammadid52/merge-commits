import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import AnimatedContainer from '@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import {useNotifications} from '@contexts/NotificationContext';
import '@style/general/EmojiFeedback.scss';
import Modal from 'atoms/Modal';
import {GlobalContext} from 'contexts/GlobalContext';
import * as customMutations from 'customGraphql/customMutations';
import {gsap} from 'gsap';
import moment from 'moment';
import React, {useContext, useEffect, useState} from 'react';
import {IoClose} from 'react-icons/io5';
import {awsFormatDate, dateString} from 'utilities/time';

const CloseButton = ({onClick}: {onClick: () => void}) => (
  <button
    className={`ml-auto absolute top-0 right-0 p-2 w-auto outline-none`}
    onClick={() => {
      onClick();
    }}>
    <span className="w-8 h-8 flex cursor-pointer items-center justify-center rounded transition-all duration-150">
      <IoClose size={'1.5rem'} style={{color: '#fff'}} />
    </span>
  </button>
);

const EmojiCard = ({
  eye,
  mouth,
  label,
  setSelectedEmotion,
  selectedCard,
  setShowJournal,
  onSave
}: {
  setSelectedEmotion: React.Dispatch<React.SetStateAction<string>>;
  setShowJournal?: React.Dispatch<React.SetStateAction<boolean>>;
  selectedEmotion: string;
  eye: string;
  mouth: string;
  label: string;
  onSave: (emotionName: string) => void;
  selectedCard?: boolean;
}) => {
  const $ = (s: any, o = document) => o?.querySelector(s);

  const id = `emoji-slider-feedback-${label}${selectedCard ? '-selected' : ''}`;

  const onClose = () => {
    let emoji = $(`#${id}`);
    gsap.to(emoji, {
      opacity: 0,
      scale: 0,
      ease: 'ease.in',
      duration: 0.5,
      onComplete: () => {
        setSelectedEmotion(null);
      }
    });
  };

  return (
    <div
      onClick={() => {
        onSave(label);
      }}
      className="w-auto z-100 theme-card-shadow">
      <div
        id={id}
        className={` ${selectedCard ? 'selected-card' : ''} ${
          !selectedCard ? 'cursor-pointer' : ''
        } ${label} transition-all  emoji-slider-feedback flex items-center justify-center`}>
        <ul>
          <li>{label}</li>
        </ul>
        {selectedCard && <CloseButton onClick={onClose} />}
        <div className="smiley">
          <svg className="eye left" viewBox="0 0 18 22">
            <path d={eye}></path>
          </svg>
          <svg className="eye right" viewBox="0 0 18 22">
            <path d={eye}></path>
          </svg>
          <svg className="mouth" viewBox="0 0 64 28">
            <path d={mouth}></path>
          </svg>
          {label === 'great' && (
            <svg className="teeth" viewBox="0 0 64 28">
              <path d="M32,7.83261436 C41.5729357,7.83261436 52.5729357,7.05507624 63,1.5 C63,10.3056732 46.3594035,14.5 32,14.5 C17.6405965,14.5 1,10.3056732 1,1.5 C11.4270643,7.05507624 22.4270643,7.83261436 32,7.83261436 Z"></path>
            </svg>
          )}
        </div>
        {selectedCard && (
          <div className="emoji-slider-bottom">
            <button
              onClick={() => {
                setShowJournal(true);
              }}
              className="emoji-response-save w-auto">
              Journal
            </button>
            <button
              data-cy="emoji-feedback-button"
              onClick={() => {
                onSave(label);
              }}
              className="emoji-response-save w-auto">
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const EmojiFeedback = () => {
  const [showSentimentModal, setShowSentimentModal] = useState(false);

  const {state} = useContext(GlobalContext);
  const {authId, email, lastEmotionSubmission} = state.user;

  // What am i doing down here?

  // First of all, I am fetching last submission date
  // Then i am putting it in moment function to get the difference in days (numeric), matching with current date.
  // Then i am checking if the difference (will be numeric always) is greater than or equals to 0 (Zero).
  // Its not possible to have number greater than zero. it will be either zero or negative.
  // if difference is less than zero, which means it is negative than we'll ask for user mood submission.

  useEffect(() => {
    const prevDate = moment(`${lastEmotionSubmission}`);

    const curDate = moment();
    const diff = moment(prevDate).diff(curDate, 'days'); // will be numeric always and zero or negative

    if (diff >= 0) {
      setShowSentimentModal(false);
    } else {
      setShowSentimentModal(true);
    }
  }, []);

  const [showJournal, setShowJournal] = useState(false);

  let points: any = {
    awful: {
      name: 'awful',
      mouth:
        'M32,2 C41.5729357,2 58,10.8218206 58,21 C50.2396023,18.9643641 41.5729357,17.9465462 32,17.9465462 C22.4270643,17.9465462 13.7603977,18.9643641 6,21 C6,10.8218206 22.4270643,2 32,2 Z',
      eye:
        'M12.6744144,18.0128897 C17.3794842,15.6567898 19.3333811,9.83072065 17.0385652,5 C15.7595661,7.57089081 13.5517099,9.64170285 10.4149967,11.2124361 C7.27828344,12.7831694 3.80661788,13.5564215 0,13.5321925 C2.2948159,18.3629131 7.9693445,20.3689896 12.6744144,18.0128897 Z'
    },
    bad: {
      name: 'bad',
      mouth:
        'M32,6 C41.5729357,6 62,10.80044 62,23 C52.2396023,17.5602347 42.2396023,14.840352 32,14.840352 C21.7603977,14.840352 11.7603977,17.5602347 2,23 C2,10.80044 22.4270643,6 32,6 Z',
      eye:
        'M9,19 C14.418278,19 17,15.418278 17,11 C17,6.581722 14.418278,3 9,3 C3.581722,3 1,6.581722 1,11 C1,15.418278 3.581722,19 9,19 Z'
    },
    okay: {
      name: 'okay',
      mouth:
        'M32,11.3326144 C41.5729357,11.3326144 51.5729357,9.55507624 62,4 C62,12.8056732 46.3594035,23 32,23 C17.6405965,23 2,12.8056732 2,4 C12.4270643,9.55507624 22.4270643,11.3326144 32,11.3326144 Z',
      eye:
        'M9,19 C14.418278,19 17,15.418278 17,11 C17,6.581722 14.418278,3 9,3 C3.581722,3 1,6.581722 1,11 C1,15.418278 3.581722,19 9,19 Z'
    },
    good: {
      name: 'good',
      mouth:
        'M32,6.33261436 C41.5729357,6.33261436 51.5729357,5.55507624 62,0 C62,8.80567319 46.3594035,25 32,25 C17.6405965,25 2,8.80567319 2,0 C12.4270643,5.55507624 22.4270643,6.33261436 32,6.33261436 Z',
      eye:
        'M9,21 C13.418278,21 17,16.418278 17,11 C17,5.581722 13.418278,1 9,1 C4.581722,1 1,5.581722 1,11 C1,16.418278 4.581722,21 9,21 Z'
    },
    great: {
      name: 'great',
      mouth:
        'M32,6.33261436 C41.5729357,6.33261436 53.5729357,5.55507624 64,0 C64,8.80567319 51.3594035,27 32,27 C12.6405965,27 0,8.80567319 0,0 C10.4270643,5.55507624 22.4270643,6.33261436 32,6.33261436 Z',
      eye:
        'M9,22 C13.418278,22 17,16.418278 17,11 C17,5.581722 13.418278,0 9,0 C4.581722,0 1,5.581722 1,11 C1,16.418278 4.581722,22 9,22 Z'
    }
  };

  const [selectedEmotion, setSelectedEmotion] = useState(null);

  const date = awsFormatDate(dateString('-', 'WORLD'));

  const time = new Date().toTimeString().split(' ')[0];

  const onSuccess = () => {
    setShowSentimentModal(false);
    setShowJournal(false);
    setSelectedEmotion(false);
  };

  const {setNotification} = useNotifications();
  const onSave = async (response: string) => {
    try {
      setShow({great: false, awful: false, okay: false, bad: false});
      setShowSentimentModal(false);
      const payload = {
        personAuthID: authId,
        personEmail: email,
        time,
        date,
        responseText: response,
        backstory: ''
      };
      await API.graphql(
        graphqlOperation(customMutations.createPersonSentiments, {
          input: payload
        })
      );
      await API.graphql(
        graphqlOperation(customMutations.updateLastSubmissionDate, {
          input: {
            authId: authId,
            email: email,
            lastEmotionSubmission: date
          }
        })
      );

      setNotification({
        show: true,
        title: 'Your response has been saved',
        type: 'success'
      });

      console.log('data saved'); // <=== data saved here
    } catch (error) {
      console.error(error);
    } finally {
      onSuccess();
    }
  };

  const onCancel = () => {
    setShowSentimentModal(false);
    onSave('none');
  };

  const commonEmojiProps = {
    setSelectedEmotion,
    selectedEmotion,
    onSave
  };

  // const backstoryData = {
  //   personAuthID: authId,
  //   personEmail: email,
  //   date,
  //   time,
  //   responseText: selectedEmotion
  // };

  useEffect(() => {
    const elements = document.querySelectorAll('.emoji-slider-feedback');
    if (elements) {
      elements.forEach((e) => {
        e.addEventListener('mouseenter', (e2) => {
          // @ts-ignore
          e2.target.classList.add('scale');
        });
        e.addEventListener('mouseleave', (e2) => {
          // @ts-ignore
          e2.target.classList.remove('scale');
        });
      });
    }
  });

  const [show, setShow] = useState({great: false, awful: false, okay: false, bad: false});

  useEffect(() => {
    setInterval(() => {
      setShow({great: true, awful: true, okay: true, bad: true});
    }, 1000);
  }, []);

  return (
    showSentimentModal && (
      <Modal
        title={'How are you today?'}
        scrollHidden
        intenseOpacity
        width={showJournal ? 'w-full' : 'w-auto'}
        modalCloseId="sentiment-modal-close"
        closeAction={onCancel}
        closeOnBackdrop={false}
        hidePadding
        className="bg-white rounded-b-xl"
        showHeader
        showHeaderBorder
        showFooter={false}>
        {!showJournal && (
          <>
            <div className="relative rounded-b-xl w-auto grid bg-white grid-cols-2 p-4 gap-4">
              <AnimatedContainer delay=".2s" show={show.great}>
                {show.great && (
                  <EmojiCard
                    {...commonEmojiProps}
                    label="great"
                    eye={points['great']['eye']}
                    mouth={points['great']['mouth']}
                  />
                )}
              </AnimatedContainer>

              <AnimatedContainer delay=".4s" show={show.okay}>
                {show.okay && (
                  <EmojiCard
                    {...commonEmojiProps}
                    label="okay"
                    eye={points['okay']['eye']}
                    mouth={points['okay']['mouth']}
                  />
                )}
              </AnimatedContainer>
              <AnimatedContainer delay=".6s" show={show.bad}>
                {show.bad && (
                  <EmojiCard
                    {...commonEmojiProps}
                    label="bad"
                    eye={points['bad']['eye']}
                    mouth={points['bad']['mouth']}
                  />
                )}
              </AnimatedContainer>

              <AnimatedContainer delay=".8s" show={show.awful}>
                {show.awful && (
                  <EmojiCard
                    {...commonEmojiProps}
                    label="awful"
                    eye={points['awful']['eye']}
                    mouth={points['awful']['mouth']}
                  />
                )}
              </AnimatedContainer>
            </div>
          </>
        )}
      </Modal>
    )
  );
};

export default EmojiFeedback;
