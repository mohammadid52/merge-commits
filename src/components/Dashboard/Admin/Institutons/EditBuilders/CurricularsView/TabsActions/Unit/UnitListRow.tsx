import Popover from '@components/Atoms/Popover';
import {GlobalContext} from '@contexts/GlobalContext';
import {UnitLookupDict} from '@dictionary/dictionary.iconoclast';
import React, {useContext, useState} from 'react';
import {BiDotsVerticalRounded} from 'react-icons/bi';

interface IUnitListRowProps {
  index: number;
  isSuperAdmin?: boolean;
  item: any;
  checkIfRemovable: any;
  handleToggleDelete: any;
  editCurrentUnit: any;
  redirectToInstitution: () => void;
  redirectToLesson: (id: string) => void;
}

const UnitListRow = ({
  index,
  isSuperAdmin,
  item,
  checkIfRemovable,
  handleToggleDelete,
  editCurrentUnit,
  redirectToInstitution,
  redirectToLesson,
}: IUnitListRowProps) => {
  // ~~~~~~~~~~ CONTEXT_SPLITTING ~~~~~~~~~~ //
  const gContext = useContext(GlobalContext);
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
      <div
        onClick={() => editCurrentUnit(item.id)}
        className={`cursor-pointer flex w-4/10 items-center px-8 py-3 text-left text-s leading-4 font-medium whitespace-normal`}>
        {item.name ? item.name : ''}
      </div>
      {isSuperAdmin && (
        <div
          className="flex w-2/10 items-center px-8 py-3 text-left text-sm font-bold leading-4 whitespace-normal cursor-pointer"
          onClick={redirectToInstitution}>
          {item.institution?.name}
        </div>
      )}
      <div
        className={`${
          isSuperAdmin ? 'w-2/10' : 'w-4/10'
        } items-center px-8 py-3 text-left text-sm leading-4 whitespace-normal cursor-pointer`}>
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
      </div>
    </div>
  );
};

export default UnitListRow;
