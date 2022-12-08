// import {PersonalizeEvents} from 'aws-sdk';
import React from 'react';

interface RosterRowEmptyProps {
  message?: string;
}

const RosterRowEmpty: React.FC<RosterRowEmptyProps> = ({
  message
}: RosterRowEmptyProps) => {
  // ~~~~~~~~~~~~~~~ CONTEXT ~~~~~~~~~~~~~~~ //

  // ##################################################################### //
  // ############################### OUTPUT ############################## //
  // ##################################################################### //

  return (
    <div draggable={false} className={`w-full px-4 flex h-10 border-t-0 border-gray-400`}>
      <span className="w-full text-gray-500 overflow-hidden mr-2 flex items-center pointer-events-none text-sm whitespace-pre truncate ...">
        {message ? message : `Empty roster row...`}
      </span>
    </div>
  );
};

export default RosterRowEmpty;
