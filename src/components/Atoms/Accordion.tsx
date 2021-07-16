import React, { Fragment, useContext, useState } from 'react';
import {IoChevronDownCircleOutline, IoChevronUpCircleOutline} from 'react-icons/io5';

import {IconContext} from 'react-icons/lib/esm/iconContext';
import { getAsset } from '../../assets';
import { GlobalContext } from '../../contexts/GlobalContext';

const Accordion = ({actionOnAccordionClick, titleList}: any) => {
  const {theme, clientKey} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const [selectedItem, setSelectedItem] = useState('');

  const changeView = (step: string, uniqueId?: string) => {
    if (selectedItem !== step) {
      setSelectedItem(step);
      if (actionOnAccordionClick) {
        actionOnAccordionClick(uniqueId);
      }
    } else {
      setSelectedItem('');
    }
  };
  return (
    <div className="bg-white mx-auto  border-0 border-gray-200">
      <div>
        <ul className="rounded-xl">
          {titleList.map(
            (
              item: {
                id: string;
                title: string;
                scope?: string;
                subtitle?: string;
                content: React.ReactNode;
                uniqueId?: string;
              },
              index: number
            ) => (
              <Fragment key={item.id}>
                <li className={`relative border-b-0 border-gray-200`}>
                  <div className="bg-gray-500">
                    <div className={`w-full px-8 py-3 text-left ${theme.outlineNone}`}>
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs md:text-base font-bold cursor-pointer flex ${
                            selectedItem === item.id && theme.textColor[themeColor]
                          } `}
                          onClick={() => changeView(item.id, item.uniqueId)}>
                          <div className="w-auto text-white">
                            <span className="mr-4">{index + 1}. </span>
                          </div>
                          <div>
                            <span className="text-white">{item.title}</span>
                          </div>
                        </span>
                        <span
                          className="w-8 h-8 flex items-center cursor-pointer transition ease duration-500"
                          onClick={() => changeView(item.id, item.uniqueId)}>
                          <IconContext.Provider
                            value={{
                              size: '2rem',
                              color: 'white',
                            }}>
                            {selectedItem === item.id ? (
                              <IoChevronUpCircleOutline />
                            ) : (
                              <IoChevronDownCircleOutline />
                            )}
                          </IconContext.Provider>
                        </span>
                      </div>
                    </div>
                  </div>
                  {selectedItem === item.id && (
                    <div className="px-8 py-3 max-h-140 overflow-auto ease duration-500">
                      {item.content}
                    </div>
                  )}
                </li>
              </Fragment>
            )
          )}
        </ul>
      </div>
    </div>
  );
};

export default Accordion;
