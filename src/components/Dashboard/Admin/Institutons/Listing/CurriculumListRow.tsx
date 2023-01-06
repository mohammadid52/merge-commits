import Popover from 'atoms/Popover';
import {GlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import React, {useContext, useState} from 'react';
import {BiDotsVerticalRounded} from 'react-icons/bi';
import {stringToHslColor, initials, getInitialsFromString} from 'utilities/strings';
import {getImageFromS3Static} from 'utilities/services';
import Highlighted from '@components/Atoms/Highlighted';
import {Status} from '../../UserManagement/UserStatus';

interface ICurriculumListRowProps {
  index: number;
  item: any;
  isSuperAdmin: boolean;
  checkIfRemovable: any;
  handleToggleDelete: any;
  editCurrentCurricular: any;
  redirectToInstitution: () => void;
  redirectToUnit: (unitId: string) => void;
  searchInput?: string;
}

const CurriculumListRow = ({
  index,
  isSuperAdmin,
  item,
  checkIfRemovable,
  handleToggleDelete,
  editCurrentCurricular,
  redirectToInstitution,
  redirectToUnit,
  searchInput
}: ICurriculumListRowProps) => {
  // ~~~~~~~~~~ CONTEXT_SPLITTING ~~~~~~~~~~ //
  const gContext = useContext(GlobalContext);
  const clientKey = gContext.clientKey;
  const {InstitueCurriculum} = useDictionary(clientKey);
  const userLanguage = gContext.userLanguage;
  // ~~~~~~~~~~~~~~~~ STATE ~~~~~~~~~~~~~~~~ //
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const textClass = `text-sm leading-5 text-gray-800 hover:iconoclast:text-500 transition-all duration-50 hover:curate:text-500`;

  const filteredUnits =
    item.universalSyllabus?.items && item.universalSyllabus?.items.length > 0
      ? item.universalSyllabus?.items.filter((d: any) => d.unit.status === item.status)
      : [];

  return (
    <tr
      key={index}
      className={`flex justify-between items-center w-full whitespace-nowrap border-b-0 border-gray-200 ${
        index % 2 !== 0 ? 'bg-gray-50' : ''
      } hover:bg-gray-200 transition-all`}>
      <td className="flex w-.5/10 items-center px-8 py-3 text-left text-sm leading-4">
        {index + 1}.
      </td>
      <td
        data-cy={`curriculum-${item.name.split(' ').join('-')}`}
        onClick={() => editCurrentCurricular(item.id)}
        className={`cursor-pointer flex ${
          isSuperAdmin ? 'w-2/10' : 'w-3.5/10'
        } items-center px-8 py-4 text-left text-sm leading-4 font-medium whitespace-normal`}>
        <div className="flex-shrink-0 h-10 w-10 flex items-center">
          {item.image ? (
            <img
              src={getImageFromS3Static(item.image)}
              className="h-8 w-8 rounded-full"
            />
          ) : (
            <div
              className="h-8 w-8 rounded-full flex justify-center items-center text-white text-sm text-bold"
              style={{
                background: `${stringToHslColor(
                  getInitialsFromString(item.name)[0] +
                    ' ' +
                    getInitialsFromString(item.name)[1]
                )}`,
                textShadow: '0.1rem 0.1rem 2px #423939b3'
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
        <div className="ml-2 hover:underline hover:theme-text:400">
          <Highlighted text={item.name} highlight={searchInput} />
        </div>
      </td>
      {isSuperAdmin && (
        <td
          className="flex w-1.5/10 text-gray-500 items-center px-8 py-4 text-left text-sm font-medium leading-4 whitespace-normal cursor-pointer"
          onClick={redirectToInstitution}>
          <Highlighted text={item.institutionName} highlight={searchInput} />
        </td>
      )}
      <td
        className={`flex w-2/10 items-center text-gray-500 px-8 py-4 text-left text-sm leading-4 font-medium whitespace-normal`}>
        {item.type || '-'}
      </td>
      <td
        className={`w-3/10 items-center text-gray-500 px-8 py-4 text-left text-sm leading-4 font-medium whitespace-normal`}>
        <ul className="list-disc">
          {filteredUnits?.length > 0 ? (
            filteredUnits?.map(
              ({
                id,
                unit: {id: unitId, name}
              }: {
                id: string;
                unit: {id: string; name: string};
              }) => (
                <li
                  className="mb-2 cursor-pointer hover:underline hover:theme-text:400"
                  key={id}
                  onClick={() => redirectToUnit(unitId)}>
                  {name}
                </li>
              )
            )
          ) : (
            <p className="">No unit</p>
          )}
        </ul>
      </td>
      <td
        className={`text-sm w-1/10 leading-4 font-medium whitespace-normal break-normal text-gray-500`}>
        <Status
          className={
            item.status?.toLowerCase() === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }>
          {item.status ? item.status : 'ACTIVE'}
        </Status>
      </td>
      <td
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
      </td>
    </tr>
  );
};

export default CurriculumListRow;
