import React, {useState} from 'react';
import {FiEdit, FiTrash2} from 'react-icons/fi';
import Popover from '@atoms/Popover';
import {SelectedEmotion, useGameChangers} from '../context/GameChangersContext';
import {remove} from 'lodash';
import Button from './Button';
import Tooltip from '@components/Atoms/Tooltip';
const Emotion = ({
  selectedEmotion,
  removeEmotion,
  idx,
}: {
  selectedEmotion: SelectedEmotion;
  removeEmotion: any;
  idx?: number;
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const {
    // @ts-ignore
    secondaryEmotion,
    // @ts-ignore
    setSecondaryEmotion,
    // @ts-ignore
    primaryEmotion,
    // @ts-ignore
    setPrimaryEmotion,
    selectedEmotions,
    // @ts-ignore
    setReplaceIdx,
  } = useGameChangers();

  const className = 'cursor-pointer hover:bg-gray-800 p-2 rounded-md';

  return (
    <>
      <Popover
        show={showMenu}
        bottom={2.5}
        minWidth={32}
        minHeight={16}
        dir={'top'}
        containerClass="bg-gray-900 border-gray-800"
        rounded="lg"
        setShow={setShowMenu}
        content={
          <dl className="flex flex-row">
            <dt
              onClick={() => {
                setReplaceIdx(idx);
                setPrimaryEmotion(selectedEmotion.primary);
              }}
              className={`${className} text-white`}>
              <FiEdit />
            </dt>

            <dt
              onClick={() => {
                setShowMenu(false);
                removeEmotion(selectedEmotion.secondary);
              }}
              className={`${className} text-red-500`}>
              <FiTrash2 />
            </dt>
          </dl>
        }>
        <Tooltip placement="top" text="Edit">
          <div
            className={`${selectedEmotion.primary.toLowerCase()}_card  cursor-pointer py-1 px-2 rounded-md text-white`}>
            {selectedEmotion.secondary}
          </div>
        </Tooltip>
      </Popover>
    </>
  );
};

const SelectedEmotionsContainer = ({}: {selectedEmotions: SelectedEmotion[]}) => {
  const {setSelectedEmotions, selectedEmotions} = useGameChangers();

  const removeEmotion = (emName: string) => {
    remove(selectedEmotions, (n) => n.secondary === emName);
    setSelectedEmotions([...selectedEmotions]);
  };

  // const onSave = () => {
  //   try {
  //     const payload: any = {
  //       personAuthID: authId,
  //       personEmail: email,
  //       sentimentId: `${getEmoji()}-${nanoid(24)}`,
  //       id: nanoid(24),
  //       sentimentName: [secondaryEmotion],
  //       // sentimentType: lessonState.currentPage.toString(),
  //       time: new Date().toTimeString().split(' ')[0],
  //       date: awsFormatDate(dateString('-', 'WORLD')),
  //       classRoomID: classId,
  //       lessonID: lessonId,
  //     };
  //     mutate({input: payload});
  //     setShowFinalStep(true);
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setChangesSaved(true);
  //   }
  // };

  return (
    <div className="flex flex-row select-none 2xl:mt-4 gap-x-4 items-center w-auto">
      <div
        style={{
          background: 'rgba(21, 19, 21, .8)',
        }}
        className="p-4 emoji-cart-container transition-all  border-2 w-auto  border-gray-900 rounded-md flex flex-row gap-x-4">
        {selectedEmotions.map((selectedEmotion, idx) => {
          return (
            <Emotion
              key={selectedEmotion.secondary}
              removeEmotion={removeEmotion}
              selectedEmotion={selectedEmotion}
              idx={idx}
            />
          );
        })}
      </div>
      <Button mt="none" width="w-auto" onClick={() => {}} text="Save" />
    </div>
  );
};

export default SelectedEmotionsContainer;
