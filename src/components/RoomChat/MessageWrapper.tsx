import React, {useEffect, useState, useContext, ReactNode} from 'react';
import {GrClose} from 'react-icons/gr';
import {IconContext} from 'react-icons';
import ButtonsRound from '../Atoms/ButtonsRound';
import {IoCloseOutline} from 'react-icons/io5';
import {AiOutlineArrowLeft} from 'react-icons/ai';

interface MessageWrapperProps {
  senderIsMe?: boolean;
  children?: ReactNode;
  deleteMessage?: () => void | undefined;
}

const MessageWrapper = (props: MessageWrapperProps) => {
  const {senderIsMe, children, deleteMessage} = props;
  const [deleteToggle, setDeleteToggle] = useState<boolean>(false);

  return (
    <div className={`flex flex-row`}>
      {senderIsMe && (
        <div className={`w-auto mr-2 ml-auto my-auto relative z-100 `}>
          <ButtonsRound
            Icon={deleteToggle ? AiOutlineArrowLeft : IoCloseOutline}
            iconSizePX={24}
            buttonWHClass={`noWHClass`}
            containerWHClass={`w-6 h-6 hover:w-8 hover:h-8 rounded-full cursor-pointer `}
            onClick={() => setDeleteToggle(!deleteToggle)}
            containerBgClass={`bg-transparent`}
            buttonBgClass={`bg-transparent`}
            iconTxtColorClass={`${
              deleteToggle
                ? 'text-gray-600 hover:text-gray-500'
                : 'text-gray-400 hover:text-red-600'
            }`}
            pointerEvents={true}
          />
        </div>
      )}

      <div
        className={`
            mb-1 w-max max-w-64 min-w-16 p-2 rounded-lg
            transition ease-in-out duration-400
            ${senderIsMe ? (deleteToggle ? 'bg-white' : 'bg-green-300') : 'bg-gray-100'}
            ${deleteToggle ? 'flex items-center justify-center' : ''}
            ${deleteToggle ? 'shadow hover:shadow-lg' : 'shadow'}
            `}>
        <span
          className={`absolute w-auto h-auto ${
            deleteToggle
              ? 'text-sm fond-semibold hover:font-bold text-red-600 cursor-pointer'
              : 'hidden opacity-0 h-0'
          }`}>
          Delete
        </span>

        <div
          className={`transition ease-in-out duration-400 ${
            deleteToggle ? 'invisible bg-opacity-0' : ''
          }`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default MessageWrapper;