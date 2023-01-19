import BriefPopover from '@components/Atoms/BriefPopover';
import Highlighted from '@components/Atoms/Highlighted';
import Placeholder from '@components/Atoms/Placeholder';
import {DataValue} from '@components/Dashboard/Csv/Csv';
import useGraphqlQuery from '@customHooks/useGraphqlQuery';
import {getImageFromS3Static} from '@utilities/services';
import {createFilterToFetchSpecificItemsOnly} from '@utilities/strings';
import {ModelPersonFilterInput, Role, PersonStatus, RoomStatus} from 'API';
import {truncate} from 'lodash';
import moment from 'moment';
import React, {useState} from 'react';

const CourseName = ({
  item,
  isLast,
  searchTerm,
  editCurrentCurricular,
  setHoveringItem,
  hoveringItem,
  currentSelectedItem
}: any) => {
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
      onSuccess: (data: any) => {
        setDesigners(data);
      },
      enabled:
        showPopover && item && item?.designers?.length > 0 && designers.length === 0
    }
  );
  return (
    <div
      onMouseEnter={() => {
        setHoveringItem({name: item.name, id: item.id});
      }}
      onMouseLeave={() => {
        setHoveringItem({});
      }}
      data-cy={`curriculum-${item.name.split(' ').join('-')}`}
      onClick={() => editCurrentCurricular(item.id)}
      className="flex hover:underline hover:theme-text:400 cursor-pointer items-center">
      <div className="flex-shrink-0 h-10 w-10 flex items-center">
        {item.image ? (
          <img src={getImageFromS3Static(item.image)} className="h-8 w-8 rounded-full" />
        ) : (
          <Placeholder name={item.name} size="h-8 w-8" />
        )}
      </div>
      <div className="ml-2 relative  ">
        <Highlighted text={item.name} highlight={searchTerm} />

        <BriefPopover
          header="Course Details"
          isLast={isLast}
          clear={() => setHoveringItem({})}
          show={showPopover}>
          {showPopover && (
            <>
              <div className="bg-white rounded-md py-2 px-4 my-2 gap-x-4 flex items-center justify-between">
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
                      withBg
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
                  withBg
                  content={truncate(item.summary || '--', {length: 200})}
                />
              </div>
              <hr />

              <div className="my-2">
                <DataValue
                  title={'Description'}
                  withBg
                  content={truncate(item.description || '--', {length: 200})}
                />
              </div>
            </>
          )}
        </BriefPopover>
      </div>
    </div>
  );
};

export default CourseName;
