import React, {useEffect, useState} from 'react';
import API, {graphqlOperation} from '@aws-amplify/api';
import moment, {Moment} from 'moment';

import * as customQueries from '../../../../../../../customGraphql/customQueries';

import Buttons from '../../../../../../Atoms/Buttons';
// import DatePickerInput from '../../../../../../Atoms/Form/DatePickerInput';
import Loader from '../../../../../../Atoms/Loader';
import { IImpactLog } from '../ClassRoomHolidays';

const frequencyMapping: {[key: string]: {unit: any; step: number}} = {
  Weekly: {unit: 'week', step: 1},
  Monthly: {unit: 'month', step: 1},
  Trimestral: {unit: 'month', step: 4},
  Quarterly: {unit: 'month', step: 3},
  Semestral: {unit: 'month', step: 6},
  'M/W/F': {unit: 'day', step: 1},
  'Tu/Th': {unit: 'day', step: 1},
  'One Time': {unit: 'day', step: 1},
};

interface IUnitPlannerProps {
  isDetailsComplete: boolean;
  lessonImpactLogs: IImpactLog[];
  logsChanged: boolean;
  roomData: any;
  saveRoomDetails: any;
  saving: boolean;
  setLogsChanged: React.Dispatch<React.SetStateAction<boolean>>;
}

const UnitPlanner = ({
  lessonImpactLogs,
  logsChanged,
  roomData,
  saveRoomDetails,
  saving,
  setLogsChanged,
  isDetailsComplete,
}: IUnitPlannerProps) => {
  const [loading, setLoading] = useState(true);
  const [syllabusList, setSyllabusList] = useState([]);

  useEffect(() => {
    if (roomData.curricular?.id) {
      fetchClassRoomSyllabus();
    }
  }, [roomData.curricular?.id]);

  const fetchClassRoomSyllabus = async () => {
    console.log('fetchClassRoomSyllabus');
    try {
      setLoading(true);
      const list: any = await API.graphql(
        graphqlOperation(customQueries.getClassroomSyllabus, {
          id: roomData.curricular?.id,
        })
      );
      const result: any = list.data?.getCurriculum;
      setSyllabusList(
        result?.universalSyllabus.items
          ?.map((item: any) => ({
            ...item,
            index: result?.universalSyllabusSeq?.indexOf(item.id),
            lessons: {
              ...item.lessons,
              items: item.lessons?.items
                .map((t: any) => {
                  let index = result?.universalLessonsSeq?.indexOf(t.id);
                  return {...t, index};
                })
                .sort((a: any, b: any) => (a.index > b.index ? 1 : -1)),
            },
          }))
          .sort((a: any, b: any) => (a.index > b.index ? 1 : -1)) || []
      );
      setTimeout(() => {
        if (isDetailsComplete) {
          calculateSchedule();
        }
      }, 500);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isDetailsComplete && syllabusList.length) {
      calculateSchedule();
    }
  }, [isDetailsComplete, syllabusList.length]);

  // useEffect(() => {
  //   if (logsChanged) {
  //     calculateSchedule();
  //   }
  // }, [logsChanged, syllabusList.length]);

  // useEffect(() => {
  //   console.log(
  //     'inside room data change useeffect',
  //     syllabusList?.length,
  //     roomData.startDate,
  //     roomData.endDate,
  //     roomData.frequency
  //   );

  //   if (
  //     syllabusList?.length &&
  //     roomData.startDate &&
  //     roomData.endDate &&
  //     roomData.frequency
  //   ) {
  //     console.log("inside if above calculation");

  //     calculateSchedule();
  //   }
  // }, [roomData.startDate, roomData.endDate, roomData.frequency]);

  const calculateAvailableStartDate = (
    date: Moment,
    frequency: any,
    step: number,
    duration: number,
    scheduleDates: Date[]
  ) => {
    if (frequency === 'M/W/F' && ![1, 3, 5].includes(moment(date).day())) {
      date = moment(new Date(moment(date).add(2, frequency).toDate()));
    }
    if (frequency === 'Tu/Th' && ![2, 4].includes(moment(date).day())) {
      date = moment(new Date(moment(date).add(2, frequency).toDate()));
    }
    let iteration: number = 1,
      startDate,
      estEndDate,
      i = 0;
    while (iteration <= Math.ceil(duration)) {
      const isOccupied = scheduleDates.find(
        (ele) =>
          new Date(new Date(ele).toDateString()).getTime() ===
          new Date(moment(date).add(i, frequency).toDate()).getTime()
      );
      console.log(
        isOccupied,
        'isOccupied',
        iteration,
        moment(date).add(i, frequency).day()
      );
      if (
        !isOccupied &&
        (roomData.frequency !== 'M/W/F' ||
          (roomData.frequency === 'M/W/F' &&
            [1, 3, 5].includes(moment(date).add(i, frequency).day()))) &&
        (roomData.frequency !== 'Tu/Th' ||
          (roomData.frequency === 'Tu/Th' &&
            [2, 4].includes(moment(date).add(i, frequency).day())))
      ) {
        console.log('inside finalization if');

        if (iteration === 1) {
          startDate = new Date(moment(date).add(i, frequency).toDate());
          console.log(startDate, moment(startDate).day(), 'startDate inside if+++++++++');
        }
        if (iteration === duration) {
          estEndDate = new Date(moment(date).add(i, frequency).toDate());
        }
        iteration++;
      }
      i += step;
    }
    return {startDate, estEndDate: estEndDate || startDate};
  };

  const calculateSchedule = () => {
    console.log('inside calculateSchedule');

    let count: number = 0,
      lastOccupiedDate: any = roomData.startDate,
      scheduleDates = lessonImpactLogs
        .filter((log: any) => log.adjustment === 'Push')
        .map((log: any) => log.impactDate);

    setSyllabusList((prevSyllabusList: any) =>
      prevSyllabusList.map((syllabus: any) => ({
        ...syllabus,
        startDate: lastOccupiedDate,
        lessons: {
          ...syllabus.lessons,
          items: syllabus.lessons.items.map((item: any) => {
            if (count !== 0 && 1 - count < item.lesson.duration) {
              lastOccupiedDate = moment(lastOccupiedDate).add(
                frequencyMapping[roomData.frequency].step,
                frequencyMapping[roomData.frequency].unit
              );
              count = 0;
            }
            count += item.lesson.duration;

            const {startDate, estEndDate}: any = calculateAvailableStartDate(
              moment(lastOccupiedDate),
              frequencyMapping[roomData.frequency].unit,
              frequencyMapping[roomData.frequency].step,
              item.lesson.duration,
              scheduleDates
            );
            console.log(startDate, estEndDate, 'startDate, estEndDate');

            item.startDate = startDate;
            item.estEndDate = estEndDate;

            // item.startDate = calculateAvailableStartDate(
            //   moment(lastOccupiedDate),
            //   7,
            //   item.lesson.duration,
            //   scheduleDates
            // );
            // item.estEndDate = moment(item.startDate).add(
            //   Math.ceil(count - 1),
            //   'day'
            // );
            // const datesBetweenSchedules = scheduleDates.filter(
            //   (ele) =>
            //     new Date(new Date(ele).toDateString()).getTime() >=
            //       new Date(item.startDate).getTime() &&
            //     new Date(new Date(ele).toDateString()).getTime() <=
            //       new Date(item.estEndDate).getTime()
            // );

            // if (datesBetweenSchedules.length) {
            //   item.estEndDate = moment(item.estEndDate).add(
            //     datesBetweenSchedules.length,
            //     'day'
            //   );
            // }
            lastOccupiedDate = Number.isInteger(count)
              ? moment(item.estEndDate).add(
                  frequencyMapping[roomData.frequency].step,
                  frequencyMapping[roomData.frequency].unit
                )
              : item.estEndDate;
            count = count >= 1 ? 0 : count;
            return item;
          }),
        },
      }))
    );
    // saveRoomDetails();
    setLogsChanged(false);
  };

  return (
    <div className="py-8">
      <div className="flex my-4">
        <h3 className="text-xl leading-6 font-bold text-gray-900">Schedule</h3>
        {/* <div className="w-68">
          <Buttons
            btnClass="py-3 text-sm"
            label={'Calculate Schedule'}
            onClick={calculateSchedule}
          />
        </div> */}
      </div>
      <div className="my-8">
        {loading ? (
          <div className="py-20 text-center mx-auto flex justify-center items-center w-full h-48">
            <div className="w-5/10">
              <Loader color="rgba(107, 114, 128, 1)" />
            </div>
          </div>
        ) : syllabusList.length ? (
          <>
            {syllabusList.map((syllabus: any, index: number) => (
              <div className="border-0 border-gray-400 rounded-md my-2" key={syllabus.id}>
                <div className="mb-4 bg-gray-200 flex justify-between">
                  <div className="px-4 py-2">
                    <div className="text-lg">{syllabus.name}</div>
                  </div>
                  <div className="px-4 py-2 w-88">
                    <div className="text-lg">
                      Start Date:{' '}
                      {syllabus.lessons.items?.length &&
                      syllabus.lessons.items[0].startDate
                        ? new Date(
                            syllabus.lessons.items[0].startDate
                          ).toLocaleDateString()
                        : '-'}
                    </div>
                  </div>
                  {/* <div className="inline-flex">
                <span className="w-30 inline-flex items-center">Start Date:</span>
                <div className="px-4 py-2">
                  {roomData.startDate}
                  <DatePickerInput
                    date={syllabus.startDate}
                    placeholder={'Start Date'}
                    minDate={new Date()}
                    onChange={(date: Date | null) => handleDateChange(date, index)}
                  />
                </div>
              </div> */}
                </div>
                <div>
                  <div className="w-full flex justify-between mt-4">
                    <div className="w-4/10 flex px-4 py-3 text-xs leading-4 font-medium text-gray-700 uppercase tracking-wider whitespace-normal">
                      Lesson Name
                    </div>
                    <div className="w-2/10 flex justify-center px-4 py-3 text-xs leading-4 font-medium text-gray-700 uppercase tracking-wider whitespace-normal">
                      Duration ({roomData.frequency})
                    </div>
                    <div className="w-2/10 flex px-4 py-3 text-xs leading-4 font-medium text-gray-700 uppercase tracking-wider whitespace-normal">
                      Start date
                    </div>
                    <div className="w-2/10 flex px-4 py-3 text-xs leading-4 font-medium text-gray-700 uppercase tracking-wider whitespace-normal">
                      Est. end date
                    </div>
                    <div className="w-2/10 flex px-4 py-3 text-xs leading-4 font-medium text-gray-700 uppercase tracking-wider whitespace-normal">
                      Act. end date
                    </div>
                  </div>

                  <div className="mb-4 w-full m-auto max-h-88 overflow-y-auto">
                    {syllabus.lessons.items?.length ? (
                      syllabus.lessons.items.map((item: any, idx: number) => {
                        return (
                          <div
                            key={`${idx}`}
                            className={`flex justify-between bg-white w-full`}>
                            <div className="w-4/10 flex px-4 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider whitespace-normal">
                              {item.lesson?.title}
                            </div>
                            <div className="w-2/10 flex justify-center px-4 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider whitespace-normal">
                              {item.lesson?.duration}
                            </div>
                            <div className="w-2/10 flex px-4 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider whitespace-normal">
                              {item.startDate
                                ? new Date(item.startDate).toLocaleDateString()
                                : '-'}
                            </div>
                            <div className="w-2/10 flex px-4 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider whitespace-normal">
                              {item.estEndDate ? (
                                <>
                                  {new Date(item.estEndDate).toLocaleDateString()}
                                  {index === syllabusList.length - 1 &&
                                  idx === syllabus.lessons.items.length - 1 &&
                                  moment(item.estEndDate).isBefore(
                                    moment(roomData.endDate)
                                  )
                                    ? '*'
                                    : ''}
                                </>
                              ) : (
                                '-'
                              )}
                            </div>
                            <div className="w-2/10 flex px-4 py-3 text-gray-500">-</div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center p-5">No lesson assigned</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-end">*Past course end date</div>
          </>
        ) : (
          <div>No unit added in the course</div>
        )}
      </div>
      <div className="flex my-8 justify-end w-full mr-2 2xl:mr-0">
        <Buttons
          btnClass="py-3 px-12 text-sm mr-4"
          label={'Cancel'}
          // onClick={history.goBack}
          transparent
        />
        <Buttons
          disabled={saving || !logsChanged}
          btnClass="py-3 px-12 text-sm ml-4"
          label={'Run calculations and save'}
          onClick={() => {
            calculateSchedule();
            saveRoomDetails()
          }}
        />
      </div>
    </div>
  );
};

export default UnitPlanner;
