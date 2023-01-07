import BriefPopover from '@components/Atoms/BriefPopover';
import Highlighted from '@components/Atoms/Highlighted';
import Placeholder from '@components/Atoms/Placeholder';
import Tooltip from '@components/Atoms/Tooltip';
import {DataValue} from '@components/Dashboard/Csv/Csv';
import useGraphqlQuery from '@customHooks/useGraphqlQuery';
import {Curriculum, ModelPersonFilterInput, PersonStatus, Role, RoomStatus} from 'API';
import Popover from 'atoms/Popover';
import {GlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import {truncate} from 'lodash';
import moment from 'moment';
import React, {useContext, useState} from 'react';
import {BiDotsVerticalRounded} from 'react-icons/bi';
import {getImageFromS3Static} from 'utilities/services';
import {
  createFilterToFetchSpecificItemsOnly,
  getInitialsFromString,
  initials,
  stringToHslColor
} from 'utilities/strings';
import {Status} from '../../UserManagement/UserStatus';

interface ICurriculumListRowProps {
  index: number;
  item: Curriculum;
  isLast: boolean;
  isSuperAdmin: boolean;
  checkIfRemovable: any;
  handleToggleDelete: any;
  editCurrentCurricular: any;
  redirectToInstitution: () => void;
  redirectToUnit: (unitId: string) => void;
  searchInput?: string;
  hoveringItem?: any;
  setHoveringItem?: any;
  currentSelectedItem?: any;
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
  searchInput,
  hoveringItem,
  setHoveringItem,
  currentSelectedItem,
  isLast
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
    item.universalSyllabus?.items && item.universalSyllabus?.items?.length > 0
      ? item.universalSyllabus?.items?.filter((d: any) => d.unit.status === item.status)
      : [];

  const showPopover = hoveringItem?.id === item.id && currentSelectedItem;

  const filter: ModelPersonFilterInput = {
    role: {
      ne: Role.ST
    },
    status: {
      ne: PersonStatus.INACTIVE
    },
    ...createFilterToFetchSpecificItemsOnly(item?.designers || [], 'id')
  };
  const [designers, setDesigners] = useState([]);

  const {isLoading, isFetched} = useGraphqlQuery(
    'fetchPersons',
    {
      filter: filter,
      limit: 50
    },
    {
      custom: true,
      originalName: 'listPeople',
      onSuccess: (data) => {
        setDesigners(data);
      },
      enabled:
        showPopover && item && item?.designers?.length > 0 && designers.length === 0
    }
  );

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
        onMouseEnter={() => {
          setHoveringItem({name: item.name, id: item.id});
        }}
        onMouseLeave={() => {
          setHoveringItem({});
        }}
        data-cy={`curriculum-${item.name.split(' ').join('-')}`}
        onClick={() => editCurrentCurricular(item.id)}
        className={`cursor-pointer flex ${
          isSuperAdmin ? 'w-2/10' : 'w-3.5/10'
        } items-center px-8 py-4 cursor-pointer hover:underline hover:theme-text:400 text-left text-sm leading-4 font-medium whitespace-normal`}>
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
        <div className="ml-2 relative ">
          <Highlighted text={item.name} highlight={searchInput} />

          <BriefPopover
            header="Course Details"
            isLast={isLast}
            clear={() => setHoveringItem({})}
            show={showPopover}>
            {showPopover && (
              <>
                <div className=" my-2 gap-x-4 flex items-start justify-between">
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
                    title={'Created date'}
                    content={moment(item.createdAt).format('ll')}
                  />
                  <DataValue
                    title={'Last update'}
                    content={moment(item.updatedAt).format('ll')}
                  />
                </div>

                <hr />

                {item?.designers && item?.designers.length > 0 && (
                  <>
                    <div className="mt-2">
                      <DataValue
                        title={'Designers'}
                        content={
                          isLoading && !isFetched && designers.length === 0 ? (
                            <p className="text-xs text-gray-400">loading...</p>
                          ) : (
                            <ul className="grid grid-cols-2 gap-x-4">
                              {designers.map((person) => {
                                return (
                                  <li key={person.authId} className="flex items-center">
                                    <div className="flex-shrink-0 h-8 w-8 flex items-center">
                                      {person.image ? (
                                        <img
                                          src={getImageFromS3Static(person.image)}
                                          className="h-5 w-5 rounded-full"
                                        />
                                      ) : (
                                        <Placeholder
                                          firstName={person.firstName}
                                          lastName={person.lastName}
                                          size="h-5 w-5"
                                        />
                                      )}
                                    </div>
                                    <h4 className="text-gray-700 cursor-pointer hover:underline hover:theme-text:400 text-sm">
                                      {person.firstName} {person.lastName}
                                    </h4>
                                  </li>
                                );
                              })}
                            </ul>
                          )
                        }
                      />
                    </div>

                    <hr />
                  </>
                )}

                <div className="mt-2">
                  <DataValue
                    title={'Summary'}
                    content={truncate(item.summary || '--', {length: 200})}
                  />
                </div>
                <hr />

                <div className="my-2">
                  <DataValue
                    title={'Description'}
                    content={truncate(item.description || '--', {length: 200})}
                  />
                </div>
              </>
            )}
          </BriefPopover>
        </div>
      </td>
      {isSuperAdmin && (
        <td
          className="flex w-1.5/10 text-gray-500 items-center px-8 py-4 text-left text-sm font-medium leading-4 whitespace-normal cursor-pointer"
          onClick={redirectToInstitution}>
          <Highlighted text={item.institution.name} highlight={searchInput} />
        </td>
      )}
      <td
        className={`flex w-2/10 items-center text-gray-500 px-8 py-4 text-left text-sm leading-4 font-medium whitespace-normal`}>
        {item.type || '-'}
      </td>
      <td
        className={`w-3/10 items-center text-gray-500 px-8 py-4 text-left text-sm leading-4 font-medium whitespace-normal`}>
        <ul className="list-decimal">
          {filteredUnits?.length > 0 ? (
            filteredUnits?.map((unit) => (
              <Tooltip
                key={unit.unit.id}
                placement="left"
                text={`Go to ${unit.unit.name}`}>
                <li
                  className="mb-2 cursor-pointer hover:underline hover:theme-text:400"
                  key={unit.unit.id}
                  onClick={() => redirectToUnit(unit.unit.id)}>
                  {unit.unit.name}
                </li>
              </Tooltip>
            ))
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
