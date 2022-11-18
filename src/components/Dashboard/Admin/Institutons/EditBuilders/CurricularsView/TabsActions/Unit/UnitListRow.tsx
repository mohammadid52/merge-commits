import Popover from 'atoms/Popover';
import {GlobalContext} from 'contexts/GlobalContext';
import {UnitLookupDict} from '@dictionary/dictionary.iconoclast';
import React, {useContext, useState} from 'react';
import {BiDotsVerticalRounded} from 'react-icons/bi';
import Highlighted from '@components/Atoms/Highlighted';

interface IUnitListRowProps {
  index: number;
  isSuperAdmin?: boolean;
  item: any;
  checkIfRemovable: any;
  handleToggleDelete: any;
  editCurrentUnit: any;
  searchInput?: string;
  redirectToInstitution: () => void;
  redirectToLesson: (id: string) => void;
}

const UnitListRow = ({
  index,
  searchInput,
  isSuperAdmin,
  item,
  checkIfRemovable,
  handleToggleDelete,
  editCurrentUnit,
  redirectToInstitution,
  redirectToLesson
}: IUnitListRowProps) => {
  // ~~~~~~~~~~ CONTEXT_SPLITTING ~~~~~~~~~~ //
  const gContext = useContext(GlobalContext);
  const userLanguage = gContext.userLanguage;
  // ~~~~~~~~~~~~~~~~ STATE ~~~~~~~~~~~~~~~~ //
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const textClass = `text-sm leading-5 text-gray-800 hover:iconoclast:text-500 transition-all duration-50 hover:curate:text-500`;

  return (
    <tr
      key={index}
      className={`flex
      hover:iconoclast:bg-200 hover:iconoclast:text-600
hover:curate:bg-200 hover:curate:text-600 transition-all
      justify-between items-center w-full  whitespace-nowrap border-b-0 border-gray-200 ${
        index % 2 !== 0 ? 'bg-gray-50' : ''
      }`}>
      <td className="flex w-1/10 px-8 py-4 items-center  text-left text-s leading-4">
        {index + 1}.
      </td>
      <td
        onClick={() => editCurrentUnit(item.id)}
        className={`${
          isSuperAdmin ? 'w-1.5/10' : 'w-3/10'
        } flex items-center  px-8 py-4 hover:text-gray-600 cursor-pointer text-sm leading-5 font-medium text-gray-900 whitespace-normal`}>
        <Highlighted text={item.name} highlight={searchInput} />
      </td>
      {isSuperAdmin && (
        <td
          className="flex w-1.5/10 px-8 py-4 items-center  text-left text-sm font-bold leading-4 whitespace-normal cursor-pointer"
          onClick={redirectToInstitution}>
          <Highlighted
            text={item?.institutionName || item?.institution?.name}
            highlight={searchInput}
          />
        </td>
      )}
      <td
        className={`${
          isSuperAdmin ? 'w-2/10' : 'w-4/10'
        } items-center text-left px-8 py-4 text-sm leading-4 text-gray-500 whitespace-normal cursor-pointer`}>
        {item.lessons?.items?.map(
          (lesson: {id: string; lesson: {id: string; title: string}}) => {
            if (lesson) {
              return (
                <li
                  key={lesson.lesson.id}
                  onClick={() => redirectToLesson(lesson.lesson.id)}>
                  {lesson.lesson.title}
                </li>
              );
            }
          }
        )}
      </td>
      <td
        className={`w-1/10 flex px-8 py-4 justify-center items-center  whitespace-nowrap text-sm leading-5 font-medium`}>
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
                    onClick={() => editCurrentUnit(item.id)}
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
                        Delete {UnitLookupDict[userLanguage]['NO_DELETE']}
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

export default UnitListRow;
