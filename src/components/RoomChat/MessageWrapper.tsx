import React, {useEffect, useState, useContext, ReactNode} from 'react';

interface MessageWrapperProps {
  senderIsMe?: boolean;
  children?: ReactNode;
}

const MessageWrapper = (props: MessageWrapperProps) => {
  const {senderIsMe, children} = props;
  return (
    <div
      className={`
            mb-1 w-max max-w-64 min-w-16 p-2 rounded-lg shadow
            ${senderIsMe ? 'mr-0 ml-auto bg-green-300' : 'ml-0 mr-auto bg-gray-100'}
            `}>
      {children}
    </div>
  );
};

export default MessageWrapper;