import Popover from '@components/Atoms/Popover';
import {GlobalContext} from '@contexts/GlobalContext';
import useDictionary from '@customHooks/dictionary';
import React, {useContext, useState} from 'react';
import {BiDotsVerticalRounded} from 'react-icons/bi';
import {
  stringToHslColor,
  initials,
  getInitialsFromString,
} from '@utilities/strings';
import { getImageFromS3Static } from '@utilities/services';

interface ICurriculumListRowProps {
  index: number;
  item: any;
  isSuperAdmin: boolean;
  checkIfRemovable: any;
  handleToggleDelete: any;
  editCurrentCurricular: any;
  redirectToInstitution: () => void;
  redirectToUnit: (unitId: string) => void;
}

const CurriculumListRow = ({
  index,
  isSuperAdmin,
  item,
  checkIfRemovable,
  handleToggleDelete,
  editCurrentCurricular,
  redirectToInstitution,
  redirectToUnit
}: ICurriculumListRowProps) => {
  // ~~~~~~~~~~ CONTEXT_SPLITTING ~~~~~~~~~~ //
  const gContext = useContext(GlobalContext);
  const clientKey = gContext.clientKey;
  const {InstitueCurriculum, BreadcrumsTitles} = useDictionary(clientKey);
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
      <div className="flex w-.5/10 items-center px-8 py-3 text-left text-sm leading-4">
        {index + 1}.
      </div>
      <div
        onClick={() => editCurrentCurricular(item.id)}
        className={`cursor-pointer flex ${
          isSuperAdmin ? 'w-2/10' : 'w-3.5/10'
        } items-center px-8 py-3 text-left text-sm leading-4 font-medium whitespace-normal`}>
        <div className="flex-shrink-0 h-10 w-10 flex items-center">
          {item.image ? (
            <img src={getImageFromS3Static(item.image)} className="h-8 w-8 rounded-full" />
          ) : (
            <div
              className="h-8 w-8 rounded-full flex justify-center items-center text-white text-sm text-bold"
              style={{
                background: `${stringToHslColor(
                  getInitialsFromString(item.name)[0] +
                    ' ' +
                    getInitialsFromString(item.name)[1]
                )}`,
                textShadow: '0.1rem 0.1rem 2px #423939b3',
              }}>
              {item.name
                ? initials(
                    getInitialsFromString(item.name)[0],
                    getInitialsFromString(item.name)[1]
                  )
                : initials('N', 'A')}
            </div>
          )}
        </div>
        <div className="ml-2">{item.name ? item.name : ''}</div>
      </div>
      {isSuperAdmin && (
        <div
          className="flex w-1.5/10 items-center px-8 py-3 text-left text-sm font-medium leading-4 whitespace-normal cursor-pointer"
          onClick={redirectToInstitution}>
          {item.institution?.name}
        </div>
      )}
      <div
        className={`flex w-2/10 items-center px-8 py-3 text-left text-sm leading-4 font-medium whitespace-normal`}>
        {item.type || '-'}
      </div>
      <div
        className={`w-3/10 items-center px-8 py-3 text-left text-sm leading-4 font-medium whitespace-normal`}>
        {item.universalSyllabus?.items?.map(
          ({id, unit: {id: unitId, name}}: {id: string; unit: {id: string;name: string}}) => (
            <li key={id} className="cursor-pointer" onClick={() => redirectToUnit(unitId)}>{name}</li>
          )
        )}
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
                  <dt
                    onClick={() => editCurrentCurricular(item.id)}
                    className={`${textClass} cursor-pointer`}>
                    View
                  </dt>
                </div>
                <div className="col-span-1">
                  {checkIfRemovable(item) ? (
                    <dt
                      onClick={() => handleToggleDelete(item.name, item)}
                      className={`cursor-pointer text-red-500 hover:text-red-600`}>
                      {/* <HiOutlineTrash className="w-4 h-4 pointer-events-none" /> */}
                      Delete
                    </dt>
                  ) : (
                    <dt
                      className={`text-center text-gray-500 flex flex-row text-xs pointer-events-none`}>
                      <span className="w-auto">
                        Delete {InstitueCurriculum[userLanguage]['NO_DELETE']}
                      </span>
                    </dt>
                  )}
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

export default CurriculumListRow;
