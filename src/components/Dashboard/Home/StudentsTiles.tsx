import React, { useState, useEffect } from 'react';

import ContentCard from '../../Atoms/ContentCard';
import ImageAlternate from '../../Atoms/ImageAlternative';
import ViewMore from '../../Atoms/ViewMore';

import { slice } from 'lodash';
import { getImageFromS3 } from '../../../utilities/services';

const StudentsTiles = (props: { studentsList: any }) => {
  const { studentsList } = props;

  // studentsList.forEach(async ({student}) => {
  //   const image = student.img ? await getImageFromS3(`instituteImages/curricular_image_${student.img}`) : false;
  //   return
  // });

  const [slicedList, setSlicedList] = useState<any[]>([]);

  useEffect(() => {
    if (studentsList && slicedList.length === 0) {
      setSlicedList(slice(studentsList, 0, 12));
    }
  }, [studentsList]);

  const onViewMore = () => {
    if (slicedList.length <= 6) {
      setSlicedList(studentsList);
    } else {
      setSlicedList(slice(studentsList, 0, 12));
    }
  };

  interface studentObj {
    student: {
      firstName: String;
      lastName: String;
      img?: String;
    };
  }

  return (
    <ContentCard>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 text-center sm:px-6 lg:px-8 lg:py-24">
          <div className="space-y-8 sm:space-y-12">
            <ul className="mx-auto grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 md:gap-x-6 lg:max-w-5xl lg:gap-x-8 lg:gap-y-12 xl:grid-cols-6">
              {slicedList &&
                slicedList.length > 0 &&
                slicedList.map(({ student }: studentObj, idx: number) => {
                  return (
                    <li key={`homepage__student-${idx}`} className="">
                      <div className="space-y-4">
                        {student.img ? (
                          <img
                            className="transform hover:scale-105 cursor-pointer transition duration-150 ease-in-out mx-auto h-20 w-20 rounded-full lg:w-24 lg:h-24"
                            src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80"
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
                })}
            </ul>
            {studentsList && studentsList.length > 12 && (
              <ViewMore onClick={onViewMore} text={`${slicedList.length <= 12 ? 'View All' : 'Hide All'}`} />
            )}
          </div>
        </div>
      </div>
    </ContentCard>
  );
};

export default StudentsTiles;
