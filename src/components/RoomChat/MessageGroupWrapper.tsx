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
    <div className={`pt-2 px-4 my-2`}>
      <p
        className={`
            font-medium text-sm text-charcoal mb-1
            ${senderIsMe ? 'text-right' : 'text-left'}`}>
        {senderName}:
      </p>
      <div
        className={`
            w-max max-w-64 min-w-16 flex flex-col flex-1 p-2 rounded-lg shadow text-sm
            ${senderIsMe ? 'mr-0 ml-auto bg-green-300' : 'ml-0 mr-auto bg-gray-100'}
            `}>
        {children}
      </div>
    </div>
  );
};

export default MessageGroupWrapper;