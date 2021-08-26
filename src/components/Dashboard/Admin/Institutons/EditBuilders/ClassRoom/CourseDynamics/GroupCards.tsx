import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { HiPencil } from 'react-icons/hi';
import Selector from '../../../../../../Atoms/Form/Selector';

interface IGroupCardProps {
  group: any;
}

const GroupCard = ({group}: IGroupCardProps) => {
  return (
    <div className="flex shadow flex-col white_back overflow-hidden mx-2">
      <div className="flex-shrink-0">
        <div className="flex p-4 bg-gray-200">
          <div className="text-xl font-bold flex items-center justify-center">
            {group.name}
            <span className="w-auto">
              <HiPencil className="w-6 h-6 pl-2" />
            </span>
          </div>
        </div>
        <div className="mt-5 h-48 overflow-y-auto p-4 pt-0">
          {group.students?.length ? (
            group.students.map((student: any, studentIndex: number) => (
              <div key={student.id} className="flex items-center justify-between">
                <div className="text-lg font-medium mb-1">
                  {studentIndex + 1}.{student.name}
                </div>
                <span className="w-auto">
                  <FaTimes className="w-6 h-6 text-red-600"/>
                </span>
              </div>
            ))
          ) : (
            <div className="text-sm">No Student added</div>
          )}
        </div>
        <div className="border-t-0 border-gray-400">
          <div className="p-4">
            <Selector
              onChange={(_: string, name: string) => console.log(name, 'endTime')}
              selectedItem={''}
              list={[{name: 'teacher', id: 1}]}
              placeholder={''}
              label={'Advisor'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupCard;