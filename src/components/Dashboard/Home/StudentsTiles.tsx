import React, { useState, useEffect } from 'react';

import ContentCard from '../../Atoms/ContentCard';
import ImageAlternate from '../../Atoms/ImageAlternative';
import ViewMore from '../../Atoms/ViewMore';
import { getImageFromS3 } from '../../../utilities/services';

import slice from 'lodash/slice';
import filter from 'lodash/filter';

const StudentsTiles = (props: { studentsList: any; state: any }) => {
  const { studentsList, state } = props;

  const [slicedList, setSlicedList] = useState<any[]>([]);

  const filteredList: object[] = filter(studentsList, ({ student }: any) => student.id !== state.user.id);

  useEffect(() => {
    if (studentsList && studentsList.length > 0) {
      if (filteredList && slicedList.length === 0) {
        setSlicedList(slice(filteredList, 0, 12));
      }
    }
  }, [filteredList]);

  const onViewMore = () => {
    if (slicedList.length <= 6) {
      setSlicedList(studentsList);
    } else {
      setSlicedList(slice(studentsList, 0, 12));
    }
  };

  return (
    <ContentCard hasBackground={false} additionalClass="shadow bg-white mb-20 rounded-lg">
      <div className="max-w-7xl mx-auto py-12 px-4 text-center sm:px-6 lg:px-8">
        <div className="space-y-8 sm:space-y-12">
          <ul className="mx-auto grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 md:gap-x-6 lg:max-w-5xl lg:gap-x-8 lg:gap-y-12 xl:grid-cols-6">
            {slicedList &&
              slicedList.length > 0 &&
              slicedList.map(
                (
                  {
                    student,
                  }: {
                    student: {
                      image?: string;
                      firstName: string;
                      lastName: string;
                      id: string;
                    };
                  },
                  idx: number
                ) => {
                  return (
                    <li key={`homepage__student-${idx}`} className="">
                      <div className="space-y-4">
                        {student.image ? (
                          <img
                            className="transform hover:scale-105 cursor-pointer transition duration-150 ease-in-out mx-auto h-20 w-20 rounded-full lg:w-24 lg:h-24"
                            src={student.image}
                            alt=""
                          />
                        ) : (
                          <ImageAlternate
                            user={student}
                            textSize={'text-3xl'}
                            styleClass="transform hover:scale-105 cursor-pointer transition duration-150 ease-in-out mx-auto h-20 w-20 rounded-full lg:w-24 lg:h-24"
                          />
                        )}
                        <div className="space-y-2">
                          <div className="text-xs font-medium lg:text-sm">
                            <h3 className="font-semibold">{student.firstName + ' ' + student.lastName}</h3>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                }
              )}
          </ul>
          {studentsList && studentsList.length > 12 && (
            <ViewMore onClick={onViewMore} text={`${slicedList.length <= 12 ? 'View All' : 'Hide All'}`} />
          )}
        </div>
      </div>
    </ContentCard>
  );
};

export default StudentsTiles;
