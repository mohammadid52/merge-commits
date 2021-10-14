import Popover from '@components/Atoms/Popover';
import {GlobalContext} from '@contexts/GlobalContext';
import useDictionary from '@customHooks/dictionary';
import {UnitLookupDict} from '@dictionary/dictionary.iconoclast';
import React, {useContext, useState} from 'react';
import {BiDotsVerticalRounded} from 'react-icons/bi';

interface IUnitManagerRowProps {
  index: number;
  item: any;
  checkIfRemovable: any;
  handleToggleDelete: any;
  goToUnitBuilder: any;
  courseObj: any;
}

const UnitManagerRow = ({
  index,
  item,
  checkIfRemovable,
  handleToggleDelete,
  goToUnitBuilder,
  courseObj,
}: IUnitManagerRowProps) => {
  // ~~~~~~~~~~ CONTEXT_SPLITTING ~~~~~~~~~~ //
  const gContext = useContext(GlobalContext);
  const clientKey = gContext.clientKey;
  const userLanguage = gContext.userLanguage;
  // ~~~~~~~~~~~~~~~~ STATE ~~~~~~~~~~~~~~~~ //
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const textClass = `text-sm leading-5 text-gray-800 hover:iconoclast:text-500 transition-all duration-50 hover:curate:text-500`;
  const textDisabledClass = ` line-through text-sm leading-5 text-gray-500 hover:text-gray-600 transition-all duration-50`;

  return (
    <div
      key={index}
      className={`flex justify-between items-center w-full px-8 py-4 whitespace-nowrap border-b-0 border-gray-200 ${
        index % 2 !== 0 ? 'bg-gray-50' : ''
      }`}>
      <div className="flex w-1/10 items-center px-8 py-3 text-left text-s leading-4">
        {index + 1}.
      </div>
      <div className="flex w-8/10 items-center px-8 py-3 text-center text-s leading-4 font-medium ">
        {item.name ? item.name : ''}
      </div>

      <div
        className={`w-1/10 flex justify-center items-center px-4 py-4 whitespace-nowrap text-sm leading-5 font-medium`}>
        <span className="w-auto">
          <Popover
            show={showMenu}
            bottom={0.6}
            dir={'top'}
            minWidth={48}
            minHeight={16}
            rounded="lg"
            setShow={setShowMenu}
            content={
              <dl className="grid grid-cols-1 gap-y-3">
                <div className="col-span-1">
                  {checkIfRemovable(item, courseObj) ? (
                    <dt
                      onClick={() => handleToggleDelete(item.name, item)}
                      className={`cursor-pointer ${textClass}`}>
                      Delete
                    </dt>
                  ) : (
                    <dt
                      className={`${textDisabledClass} whitespace-normal break-normal pointer-events-none`}>
                      Delete {UnitLookupDict[userLanguage]['NO_DELETE']}
                    </dt>
                  )}
                </div>
                <div className="col-span-1">
                  <dt
                    onClick={() => goToUnitBuilder(item.unitId, item.type)}
                    className={`${textClass} cursor-pointer`}>
                    View
                  </dt>
                </div>
              </dl>
            }>
            <span className="h-6 w-6 flex items-center justify-center p-1 hover:bg-gray-200 transition-all cursor-pointer rounded-full">
              <BiDotsVerticalRounded
                title="show menu"
                className="h-full w-full text-lg text-gray-500"
              />
            </span>
          </Popover>
        </span>
      </div>
    </div>
  );
};

export default UnitManagerRow;
