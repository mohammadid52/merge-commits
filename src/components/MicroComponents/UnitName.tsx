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
  setHoveringItem,
  isSuperAdmin
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
      logError(error, {authId, email}, 'UnitListRow @getAttachedCourses');
      return [];
    }
  };
  return (
    <div
      className="cursor-pointer"
      onClick={() => editCurrentUnit(item.id)}
      onMouseEnter={() => {
        setHoveringItem({name: item.name});
      }}
      onMouseLeave={() => {
        setHoveringItem({});
      }}>
      <Highlighted text={item.name} highlight={searchTerm} />

      <BriefPopover
        header="Unit Details"
        isLast={isLast}
        clear={() => setHoveringItem({})}
        show={hoveringItem?.name === item.name && currentSelectedItem}>
        {hoveringItem?.name === item.name && currentSelectedItem && (
          <>
            <div className="gap-x-4 mt-2 grid grid-cols-3">
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
            <DataValue
              title={'Description'}
              content={truncate(currentSelectedItem?.description, {length: 200}) || '--'}
            />

            <div className="mt-2">
              <DataValue
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
