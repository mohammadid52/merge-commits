import React, {useState, useEffect} from 'react';

import ContentCard from '../../Atoms/ContentCard';
import ImageAlternate from '../../Atoms/ImageAlternative';

import slice from 'lodash/slice';
import filter from 'lodash/filter';
import Buttons from '../../Atoms/Buttons';
import SectionTitleV3 from '../../Atoms/SectionTitleV3';

const StudentsTiles = (props: {studentsList: any; state: any; title: string}) => {
  const {studentsList, title, state} = props;
  const [viewMore, setViewMore] = useState(false);

  const filteredList: object[] = filter(
    studentsList,
    ({student}: any) => student.id !== state.user.id
  );

  return (
    <>
      <SectionTitleV3
        title={title}
        extraContainerClass="max-w-256 px-6"
        fontSize="xl"
        fontStyle="semibold"
        borderBottom
        extraClass="leading-6 text-gray-900"
        withButton={
          filteredList.length > 12 && (
            <div className="flex justify-end">
              <Buttons
                label={!viewMore ? 'Show All' : 'Show Few'}
                onClick={() => setViewMore(!viewMore)}
                type="button"
              />
            </div>
          )
        }
      />
      <ContentCard
        hasBackground={false}
        additionalClass="shadow bg-white mb-20 rounded-b-lg">
        <div className="max-w-7xl mx-auto py-12 px-4 text-center sm:px-6 lg:px-8">
          <div className="space-y-8 sm:space-y-12">
            {filteredList && filteredList.length > 0 ? (
              <ul className="mx-auto grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 md:gap-x-6 lg:max-w-5xl lg:gap-x-8 lg:gap-y-12 xl:grid-cols-6">
                {filteredList &&
                  filteredList.length > 0 &&
                  filteredList.slice(0, viewMore ? filteredList.length - 1 : 12).map(
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
                                <h3 className="font-medium">
                                  {student.firstName + ' ' + student.lastName}
                                </h3>
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    }
                  )}
              </ul>
            ) : (
              <div className="flex justify-center items-center p-12">
                No students found
              </div>
            )}
          </div>
        </div>
      </ContentCard>
    </>
  );
};

export default StudentsTiles;
