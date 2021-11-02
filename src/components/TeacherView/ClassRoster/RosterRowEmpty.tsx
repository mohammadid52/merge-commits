// import {PersonalizeEvents} from 'aws-sdk';
import {getAsset} from 'assets';
import React, {useContext, useEffect, useState} from 'react';
import {GlobalContext} from '../../../contexts/GlobalContext';

interface RosterRowEmptyProps {
  message?: string;
}

const RosterRowEmpty: React.FC<RosterRowEmptyProps> = ({
  message,
}: RosterRowEmptyProps) => {
  // ~~~~~~~~~~~~~~~ CONTEXT ~~~~~~~~~~~~~~~ //

  // ##################################################################### //
  // ############################### OUTPUT ############################## //
  // ##################################################################### //

  return (
    <div draggable={false} className={`w-full flex h-10 border-t-0 border-gray-400`}>
      <span className="w-full text-gray-600 overflow-hidden mr-2 flex items-center pointer-events-none text-sm whitespace-pre truncate ...">
        {message ? message : `Empty roster row...`}
      </span>
    </div>
  );
};

export default RosterRowEmpty;
