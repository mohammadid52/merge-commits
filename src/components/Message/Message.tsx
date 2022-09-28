import React from 'react';

export interface MessageProps {
  type: string;
  message: string;
  show: boolean;
}

const Message = ({message}: {message: MessageProps}) => {
  return (
    <div>
      {' '}
      {message.show ? (
        <p
          className={`text-xs text-center ${
            message.type === 'success'
              ? 'text-green-500'
              : message.type === 'error'
              ? 'text-red-500'
              : null
          }`}>
          {message.message}
        </p>
      ) : null}
    </div>
  );
};

export default Message;
