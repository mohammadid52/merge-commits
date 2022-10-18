import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import React, {useContext, useEffect, useState} from 'react';
import {FaCompress, FaExpand} from 'react-icons/fa';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {GlobalContext} from 'contexts/GlobalContext';
import * as mutations from 'graphql/mutations';
import {UniversalLessonPage} from '@interfaces/UniversalLessonInterfaces';
import {getLocalStorageData, setLocalStorageData} from 'utilities/localStorage';
import {StudentWindowTitleBarProps} from '../StudentWindowTitleBar';

interface IOpenClosePagesToggle extends StudentWindowTitleBarProps {
  currentPage?: number;
  activePageData?: any;
  handleOpenComponent?: (pageNr: number) => void;
  handleCloseComponent?: (pageNr: number) => void;
}

const OpenClosePagesToggle = ({
  theme,
  themeColor,
  currentPage,
  activePageData,
  handleOpenComponent,
  handleCloseComponent
}: IOpenClosePagesToggle) => {
  return (
    <div className="w-1/3 flex justify-start h-8 align-middle leading-8 ">
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
            className={`mr-2 ${theme.textColor[themeColor]} w-auto h-6 my-auto text-sm text-gray-600 underline leading-4 text-underline transform hover:scale-110 transition-transform duration-150 p-1 cursor-pointer`}
            onClick={() => handleCloseComponent(currentPage)}>
            Close Component
          </span>
        ) : (
          <span
            className={`mr-2 ${theme.textColor[themeColor]} w-auto h-6 my-auto text-sm text-gray-600 underline leading-4 text-underline transform hover:scale-110 transition-transform duration-150 p-1 cursor-pointer`}
            onClick={() => handleOpenComponent(currentPage)}>
            Open Component
          </span>
        )
      ) : null}
    </div>
  );
};

export default OpenClosePagesToggle;
