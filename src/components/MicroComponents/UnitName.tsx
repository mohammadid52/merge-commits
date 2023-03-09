import BriefPopover from '@components/Atoms/BriefPopover';
import Highlighted from '@components/Atoms/Highlighted';
import AttachedCourses from '@components/Dashboard/Admin/Institutons/EditBuilders/CurricularsView/TabsActions/Unit/AttachedCourses';
import {DataValue} from '@components/Dashboard/Csv/Csv';
import useAuth from '@customHooks/useAuth';
import {logError} from '@graphql/functions';
import {RoomStatus} from 'API';
import {truncate} from 'lodash';
import moment from 'moment';
import React from 'react';

const UnitName = ({
  editCurrentUnit,
  curricular,
  hoveringItem,
  item,
  currentSelectedItem,
  isLast,
  searchTerm,
  setHoveringItem
}: any) => {
  const {authId, email} = useAuth();

  const getAttachedCourses = (): any[] => {
    try {
      if (curricular) {
        const filtered = curricular?.items?.filter((__item: any) => {
          if (__item.universalSyllabus) {
            return __item.universalSyllabus?.items?.find(
              (_item: any) => _item?.unit?.id === item?.id
            );
          }
        });

        return filtered;
      }
      return [];
    } catch (error) {
      logError(error, {authId, email}, 'UnitName @getAttachedCourses');
      return [];
    }
  };
  return (
    <div
      className="cursor-pointer hover:underline hover:theme-text:400"
      onClick={() => editCurrentUnit(item.id)}
      onMouseEnter={() => {
        setHoveringItem({name: item.name});
      }}
      // onMouseLeave={() => {
      //   setHoveringItem({});
      // }}
    >
      <Highlighted text={item.name} highlight={searchTerm} />

      <BriefPopover
        header="Unit Details"
        isLast={isLast}
        clear={() => setHoveringItem({})}
        show={hoveringItem?.name === item.name && currentSelectedItem}>
        {hoveringItem?.name === item.name && currentSelectedItem && (
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
                withBg
                title={'Created date'}
                content={moment(item.createdAt).format('ll')}
              />
              <DataValue
                withBg
                title={'Last update'}
                content={moment(item.updatedAt).format('ll')}
              />
            </div>
            <DataValue
              withBg
              title={'Description'}
              content={truncate(currentSelectedItem?.description, {length: 200}) || '--'}
            />

            <div className="mt-2">
              <DataValue
                withBg
                title={`Attached courses (${getAttachedCourses().length})`}
                content={<AttachedCourses curricular={curricular} unitId={item.id} />}
              />
            </div>
          </>
        )}
      </BriefPopover>
    </div>
  );
};

export default UnitName;
