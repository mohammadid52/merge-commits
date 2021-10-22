import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import React, {useContext, useEffect, useState} from 'react';
import {FaCompress, FaExpand} from 'react-icons/fa';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {GlobalContext} from '@contexts/GlobalContext';
import * as mutations from '@graphql/mutations';
import {UniversalLessonPage} from '@interfaces/UniversalLessonInterfaces';
import {getLocalStorageData, setLocalStorageData} from '@utilities/localStorage';

interface IOpenClosePagesToggle {
  currentPage?: number;
  activePageData?: any;
  handleOpenCloseComponent?: (pageNr: number) => void;
}

const OpenClosePagesToggle = ({
  currentPage,
  activePageData,
  handleOpenCloseComponent,
}: IOpenClosePagesToggle) => {
  return (
    <div className="w-1/3 flex justify-start h-8 pl-2 align-middle font-bold text-xs leading-8 ">
      <span className="mr-2 w-auto">Workspace:</span>
      {/**
       *
       * TITLEBAR LESSON CONTROL
       *
       * open/close & enable/disable buttons are only
       * visible when teacher is NOT on the intro,
       * and when you're NOT currently viewing a studento
       *
       */}
      {currentPage !== 0 && activePageData && activePageData.disabled !== true ? (
        activePageData.open !== false ? (
          <span
            className="mr-2 w-auto h-6 my-auto leading-4 text-xs text-white bg-red-600 hover:bg-red-500 hover:text-underline p-1 rounded-lg cursor-pointer"
            onClick={() => handleOpenCloseComponent(currentPage)}>
            Close Component
          </span>
        ) : (
          <span
            className="mr-2 w-auto h-6 my-auto leading-4 text-xs text-white bg-sea-green hover:bg-green-500 hover:text-underline p-1 rounded-lg cursor-pointer"
            onClick={() => handleOpenCloseComponent(currentPage)}>
            Open Component
          </span>
        )
      ) : null}
    </div>
  );
};

export default OpenClosePagesToggle;
