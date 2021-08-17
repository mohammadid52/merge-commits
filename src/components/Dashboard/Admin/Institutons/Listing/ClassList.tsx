import React, {Fragment, useContext, useState} from 'react';
import {useHistory} from 'react-router';

import PageWrapper from '../../../../Atoms/PageWrapper';
import Buttons from '../../../../Atoms/Buttons';
import {getAsset} from '../../../../../assets';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../customHooks/dictionary';
import Tooltip from '../../../../Atoms/Tooltip';
import { AddButton } from '../../../../Atoms/Buttons/AddButton';

interface ClassListProps {
  classes: {items: {name?: string; id: string}[]};
  instId: string;
  instName: string;
}

const ClassList = (props: ClassListProps) => {
  const {classes, instId, instName} = props;
  const [classList, setClassList] = useState([]);
  const history = useHistory();
  const {clientKey, theme, userLanguage} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const {Institute_class, BreadcrumsTitles} = useDictionary(clientKey);

  const createNewClass = () => {
    history.push(
      `/dashboard/manage-institutions/institution/class-creation?id=${instId}`
    );
  };

  return (
    <div className="pt-8 flex m-auto justify-center">
      <div className="">
        <PageWrapper defaultClass="">
          <h3 className="text-lg leading-6 font-medium uppercase text-gray-900 text-center pb-4">
            {`${instName} classes` || Institute_class[userLanguage]['TITLE']}
          </h3>

          {classes.items && classes.items.length > 0 ? (
            <Fragment>
              <div className="flex justify-end w-full m-auto ">
                <AddButton
                  className="mx-4"
                  label={Institute_class[userLanguage]['BUTTON']['ADD']}
                  onClick={createNewClass}
                />
              </div>

              <div className="flex justify-between w-full m-auto px-8 py-4 whitespace-nowrap border-b-0 border-gray-200">
                <div className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>{Institute_class[userLanguage]['NO']}</span>
                </div>
                <div className="w-6/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>{Institute_class[userLanguage]['CLASSNAME']}</span>
                </div>
                {/* <div className="w-4/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      <span>Active Students</span>
                    </div> */}
                <div className="w-3/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>{Institute_class[userLanguage]['ACTION']}</span>
                </div>
              </div>
              <div className="w-full m-auto max-h-88 overflow-y-auto">
                {classes.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between w-full px-8 py-2 whitespace-nowrap border-b-0 border-gray-200">
                    <div className="flex w-1/10 items-center px-8 py-3 text-left text-s leading-4">
                      {index + 1}.
                    </div>

                    <div className="flex w-6/10 items-center px-8 py-3 text-left text-s leading-4 font-medium ">
                      {item.name ? item.name : ''}
                    </div>
                    <span
                      className={`w-3/10 cursor-pointer flex items-center text-left px-8 py-3 ${theme.textColor[themeColor]}`}
                      onClick={() =>
                        history.push(
                          `/dashboard/manage-institutions/class-edit?id=${item.id}`
                        )
                      }>
                      <Tooltip text="Click to edit class" placement="left">
                        {Institute_class[userLanguage]['EDIT']}
                      </Tooltip>
                    </span>
                  </div>
                ))}
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <div className="flex justify-center mt-8">
                <AddButton
                  className="mx-4"
                  label={Institute_class[userLanguage]['BUTTON']['ADD']}
                  onClick={createNewClass}
                />
              </div>
              <p className="text-center p-16"> {Institute_class[userLanguage]['INFO']}</p>
            </Fragment>
          )}
        </PageWrapper>
      </div>
    </div>
  );
};

export default ClassList;
