import AnimatedContainer from '@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import {useNotifications} from '@contexts/NotificationContext';
import useGraphqlMutation from '@customHooks/useGraphqlMutation';
import '@style/general/EmojiFeedback.scss';
import {CreatePersonSentimentsInput, UpdatePersonInput} from 'API';
import Modal from 'atoms/Modal';
import {GlobalContext} from 'contexts/GlobalContext';
import {gsap} from 'gsap';
import moment from 'moment';
import React, {useContext, useEffect, useState} from 'react';
import {BiArrowBack, BiPencil} from 'react-icons/bi';
import {awsFormatDate, dateString} from 'utilities/time';

const EmojiCard = ({
  eye,
  mouth,
  label,

  selectedCard,

  onSave
}: {
  setSelectedEmotion: React.Dispatch<React.SetStateAction<string>>;
  setShowJournal?: React.Dispatch<React.SetStateAction<boolean>>;
  selectedEmotion: string;

  eye: string;
  mouth: string;
  label: string;
  onSave: (emotionName: string, backstory?: string) => void;
  selectedCard?: boolean;
}) => {
  const $ = (s: any, o = document) => o?.querySelector(s);

  const id = `emoji-slider-feedback-${label}`;

  const [backstory, setBackstory] = useState('');

  const closePreviousCard = (closeThis?: boolean) => {
    setBackstory('');
    let list = ['awful', 'bad', 'okay', 'great'];
    list = closeThis ? list.filter((e) => e === label) : list.filter((e) => e !== label);
    if (closeThis) {
      setFlip(false);
    }
    list.forEach((e) => {
      const id = `emoji-slider-feedback-${e}`;

      let tl = gsap.timeline();
      tl.to(`#${id} .flip-card-inner`, {
        rotateY: 0,
        duration: 1.5,
        ease: 'back.out(2)'
      }).to(
        [`#${id} .smiley`, `#${id} ul`],
        {
          opacity: 1,
          duration: 0.5
        },
        '>-1'
      );

      gsap.to(`#${id} .flip-card-front`, {
        pointerEvents: 'all'
      });
    });
  };

  const [flip, setFlip] = useState(false);

  const focusOnTextArea = () => {
    const textarea = $(`#${id} textarea`);
    textarea.focus();
  };

  const flipCard = () => {
    setFlip(true);
    gsap.to(`#${id} .flip-card-inner`, {
      rotateY: 180,
      duration: 1.5,
      ease: 'back.out(2)',
      onComplete: () => focusOnTextArea()
    });
    gsap.to([`#${id} .smiley`, `#${id} ul`], {
      opacity: 0,
      duration: 1
    });
    gsap.to(`#${id} .flip-card-front`, {
      pointerEvents: 'none',
      onComplete: () => closePreviousCard()
    });
  };

  return (
    <div id={id} className="flip-card">
      <div
        data-cy={'emoji-feedback-card'}
        className="w-auto flip-card-inner z-100 rounded-xl theme-card-shadow">
        <div
          className={` ${selectedCard ? 'selected-card' : ''} ${
            !selectedCard ? 'cursor-pointer' : ''
          } ${label} transition-all  emoji-slider-feedback flex items-center justify-center flip-card-front`}>
          <ul>
            <li>{label}</li>
          </ul>
          <div
            onClick={() => {
              onSave(label);
            }}
            className="smiley">
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
          <div className="emoji-slider-bottom justify-end">
            <AnimatedContainer
              animationType="sliderInvert"
              delay=".5s"
              duration="500"
              className="w-auto"
              show={!flip}>
              {!flip && (
                <button
                  onClick={() => {
                    flipCard();
                  }}
                  className="emoji-response-save w-auto">
                  <BiPencil size={'1rem'} />
                </button>
              )}
            </AnimatedContainer>
          </div>
        </div>
        <div
          className={`flip-card-back sticky-container rounded-xl  emoji-slider-feedback ${label}`}>
          {/* Journal body */}

          <div className="flex p-4 flex-col items-center justify-center h-full">
            <textarea
              value={backstory}
              onChange={(e) => setBackstory(e.target.value)}
              className="text-xl text-white rounded-xl p-3"
              placeholder={`I feel ${label} because...`}
            />
          </div>

          <div className="emoji-slider-bottom justify-between">
            <AnimatedContainer
              animationType="slider"
              delay=".5s"
              duration="500"
              className="w-auto"
              show={flip}>
              {flip && (
                <button
                  data-cy="emoji-feedback-button"
                  onClick={() => {
                    closePreviousCard(true);
                  }}
                  className="emoji-response-save w-auto">
                  <BiArrowBack />
                </button>
              )}
            </AnimatedContainer>

            <AnimatedContainer
              animationType="sliderInvert"
              delay=".5s"
              duration="500"
              className="w-auto"
              show={flip}>
              {flip && (
                <button
                  data-cy="emoji-feedback-button"
                  onClick={() => {
                    onSave(label, backstory);
                  }}
                  className="emoji-response-save w-auto">
                  Save
                </button>
              )}
            </AnimatedContainer>
          </div>
        </div>
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

  const getDate = () => awsFormatDate(dateString('-', 'WORLD'));

  const getTime = () => new Date().toTimeString().split(' ')[0];

  const onSuccess = () => {
    setShowSentimentModal(false);

    setSelectedEmotion(false);
  };

  const [fakeLoading, setFakeLoading] = useState(true);

  const {setNotification} = useNotifications();

  const createPersonSentiments = useGraphqlMutation<
    {input: CreatePersonSentimentsInput},
    any
  >('createPersonSentiments', {
    custom: true
  });
  const updateLastSubmissionDate = useGraphqlMutation<{input: UpdatePersonInput}, any>(
    'updateLastSubmissionDate',
    {
      custom: true
    }
  );

  const onSave = async (response: string, backstory?: string) => {
    try {
      setShow({great: false, awful: false, okay: false, bad: false});
      setShowSentimentModal(false);
      const payload = {
        personAuthID: authId,
        personEmail: email,
        time: getTime(),
        date: getDate(),
        responseText: response,
        backstory: backstory || ''
      };

      createPersonSentiments.mutate({input: payload});

      updateLastSubmissionDate.mutate({
        input: {authId: authId, email: email, lastEmotionSubmission: getDate()}
      });

      if (response !== 'none') {
        setNotification({
          show: true,
          title: 'Thanks for checking in today',
          type: 'success'
        });
      }
    } catch (error) {
      console.error(error);
      setNotification({
        show: true,
        title: 'Something went wrong',
        type: 'error'
      });
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

  const [show, setShow] = useState({great: false, awful: false, okay: false, bad: false});

  useEffect(() => {
    setInterval(() => {
      setShow({great: true, awful: true, okay: true, bad: true});
      setFakeLoading(false);
    }, 1000);
  }, []);

  return (
    showSentimentModal && (
      <Modal
        // title={'How are you today?'}
        customTitle={
          <div className="w-auto">
            <h3 className="text-xl font-medium text-gray-900">How are you today?</h3>
            <p className="text-sm  text-gray-500">Click on emoji to save emotion</p>
          </div>
        }
        scrollHidden
        intenseOpacity
        width={'w-auto'}
        modalCloseId="sentiment-modal-close"
        closeAction={onCancel}
        closeOnBackdrop={false}
        hidePadding
        className="bg-white rounded-b-xl"
        showHeader
        showHeaderBorder
        showFooter={false}>
        <>
          <div className=" relative rounded-b-xl w-auto grid bg-white grid-cols-2 p-4 gap-4">
            <EmojiCard
              {...commonEmojiProps}
              label="great"
              eye={points['great']['eye']}
              mouth={points['great']['mouth']}
            />

            <EmojiCard
              {...commonEmojiProps}
              label="okay"
              eye={points['okay']['eye']}
              mouth={points['okay']['mouth']}
            />

            <EmojiCard
              {...commonEmojiProps}
              label="bad"
              eye={points['bad']['eye']}
              mouth={points['bad']['mouth']}
            />

            <EmojiCard
              {...commonEmojiProps}
              label="awful"
              eye={points['awful']['eye']}
              mouth={points['awful']['mouth']}
            />
          </div>
        </>
      </Modal>
    )
  );
};

export default EmojiFeedback;
