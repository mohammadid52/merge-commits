import React, {useEffect, useState, useContext, ReactNode} from 'react';

interface MessageGroupWrapperProps {
  senderName?: string;
  senderIsMe?: boolean;
  messageGroup?: any[];
  children?: ReactNode;
}

const MessageGroupWrapper = (props: MessageGroupWrapperProps) => {
  const {senderName, senderIsMe, messageGroup, children} = props;
  return (
    <div className={`pt-2 px-4 my-2 font-base text-sm text-gray-800 `}>
      <p
        className={`
            mb-1
            ${senderIsMe ? 'text-right' : 'text-left'}`}>
        {senderName}:
      </p>
      <div
        className={`
            w-max max-w-64 min-w-16 flex flex-col flex-1
            ${senderIsMe ? 'mr-0 ml-auto' : 'ml-0 mr-auto'}
            `}>
        {children}
      </div>
    </div>
  );
};

export default MessageGroupWrapper;