import Popover from 'atoms/Popover';
import {GlobalContext} from 'contexts/GlobalContext';
import {UnitLookupDict} from '@dictionary/dictionary.iconoclast';
import React, {useContext, useState} from 'react';
import {BiDotsVerticalRounded} from 'react-icons/bi';
import Highlighted from '@components/Atoms/Highlighted';
import {Status} from '@components/Dashboard/Admin/UserManagement/UserStatus';
import ClickAwayListener from 'react-click-away-listener';
import {Transition} from '@headlessui/react';
import {RoomStatus} from 'API';
import {DataValue} from '@components/Dashboard/Csv/Csv';
import AttachedCourses from './AttachedCourses';

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
  hoveringItem?: any;
  setHoveringItem?: any;
  currentSelectedItem?: any;
  curricular?: any;
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
  redirectToLesson,
  hoveringItem,
  setHoveringItem,
  curricular,
  currentSelectedItem
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
      hover:bg-gray-200
 transition-all
      justify-between items-center w-full  whitespace-nowrap border-b-0 border-gray-200 ${
        index % 2 !== 0 ? 'bg-gray-50' : ''
      }`}>
      <td className="flex w-1/10 px-8 py-4 items-center  text-left text-s leading-4">
        {index + 1}.
      </td>
      <td
        onClick={() => editCurrentUnit(item.id)}
        onMouseEnter={() => {
          setHoveringItem({name: item.name});
        }}
        onMouseLeave={() => {
          setHoveringItem({});
        }}
        className={`${
          isSuperAdmin ? 'w-1.5/10' : 'w-4/10'
        } flex items-center relative hover:underline hover:theme-text:400 px-8 py-4  cursor-pointer text-sm leading-5 font-medium whitespace-normal`}>
        <Highlighted text={item.name} highlight={searchInput} />
        {hoveringItem?.name === item.name && currentSelectedItem && (
          <ClickAwayListener onClickAway={() => setHoveringItem({})}>
            <Transition
              style={{
                top: '0rem',
                bottom: '1.5rem',
                right: '-90%',
                zIndex: 999999
              }}
              className="hidden md:block cursor-pointer select-none  absolute  text-black "
              show={Boolean(hoveringItem && hoveringItem.name)}>
              <div className="bg-white flex flex-col border-gray-200 rounded-xl  customShadow border-0 p-4  min-w-70 max-w-70 w-auto">
                <DataValue
                  title={'Institution Name'}
                  content={currentSelectedItem?.institution?.name || '--'}
                />

                <DataValue
                  title={'Status'}
                  content={
                    <p
                      className={`${
                        currentSelectedItem.status === RoomStatus.ACTIVE
                          ? 'text-green-500'
                          : 'text-yellow-500'
                      } uppercase`}>
                      {currentSelectedItem.status || RoomStatus.ACTIVE}
                    </p>
                  }
                />

                <DataValue
                  title={'Attached courses'}
                  content={<AttachedCourses curricular={curricular} unitId={item.id} />}
                />

                <DataValue
                  title={'Description'}
                  content={currentSelectedItem?.description || '--'}
                />
              </div>
            </Transition>
          </ClickAwayListener>
        )}
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
        {item.lessons?.items?.length > 0 ? (
          <ul className="list-disc">
            {item.lessons?.items?.map(
              (lesson: {id: string; lesson: {id: string; title: string}}) => {
                if (lesson) {
                  return (
                    <li
                      className="mb-2 hover:underline hover:theme-text:400"
                      key={lesson.lesson.id}
                      onClick={() => redirectToLesson(lesson.lesson.id)}>
                      {lesson.lesson.title}
                    </li>
                  );
                }
              }
            )}
          </ul>
        ) : (
          <p className="">No lesson plan</p>
        )}
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
