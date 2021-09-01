import React, {useEffect, useState} from 'react';
import API, {graphqlOperation} from '@aws-amplify/api';
import moment, {Moment} from 'moment';

import * as customQueries from '../../../../../../../customGraphql/customQueries';
import DatePickerInput from '../../../../../../Atoms/Form/DatePickerInput';
import {IImpactLog} from '../ClassRoomHolidays';

const frequencyMapping: {[key: string]: {unit: any; step: number}} = {
  Weekly: {unit: 'week', step: 1},
  Monthly: {unit: 'month', step: 1},
};

const UnitPlanner = ({roomData}: any) => {
  const [syllabusList, setSyllabusList] = useState([]);
  const [lessonImpactLogs, setLessonImpactLogs] = useState<IImpactLog[]>([]);

  useEffect(() => {
    if (roomData.curricular?.id) {
      fetchClassRoomSyllabus();
      getImpactLogs();
    }
  }, [roomData.curricular?.id]);

  const fetchClassRoomSyllabus = async () => {
    const list: any = await API.graphql(
      graphqlOperation(customQueries.getClassroomSyllabus, {
        id: roomData.curricular?.id,
      })
    );
    setSyllabusList(list.data?.getCurriculum?.universalSyllabus.items || []);
  };

  const getImpactLogs = async () => {
    try {
      const result: any = await API.graphql(
        graphqlOperation(customQueries.getRoomLessonImpactLogs, {id: roomData.id})
      );
      setLessonImpactLogs(result?.data?.getRoom.lessonImpactLog || []);
    } catch (error) {
      setLessonImpactLogs([]);
    }
  };

  const calculateAvailableStartDate = (
    date: Moment,
    frequency: any,
    step:number,
    duration: number,
    scheduleDates: Date[]
  ) => {
    let iteration: number = 1,
      startDate,
      estEndDate,
      i = 0;
    while (iteration <= duration) {
      const isOccupied = scheduleDates.find(
        (ele) =>
          new Date(new Date(ele).toDateString()).getTime() ===
          new Date(moment(date).add(i, 'month').toDate()).getTime()
      );
      if (!isOccupied) {
        if (iteration === 1) {
          startDate = new Date(moment(date).add(i, 'month').toDate());
        }
        if (iteration === duration) {
          estEndDate = new Date(moment(date).add(i, 'month').toDate());
        }
        iteration++;
      }
      i += step;
    }
    return {startDate, estEndDate};
  };

  const handleDateChange = (date: Date, syllabusIndex: number) => {
    let count: number = 0,
      lastOccupiedDate: Date = date,
      scheduleDates = lessonImpactLogs.map((log: any) => log.impactDate);

    setSyllabusList((prevSyllabusList: any) =>
      prevSyllabusList.map((syllabus: any, index: number) =>
        index === syllabusIndex
          ? {
              ...syllabus,
              startDate: date,
              lessons: {
                ...syllabus.lessons,
                items: syllabus.lessons.items.map((item: any) => {
                  count += item.lesson.duration;
                  const {startDate, estEndDate}: any = calculateAvailableStartDate(
                    moment(lastOccupiedDate),
                    frequencyMapping[roomData.frequency].unit,
                    frequencyMapping[roomData.frequency].step,
                    item.lesson.duration,
                    scheduleDates
                  );
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
                        frequencyMapping[roomData.frequency].unit,
                      )
                    : item.estEndDate;
                  count = count >= 1 ? 0 : count;
                  return item;
                }),
              },
            }
          : syllabus
      )
    );
  };

  return (
    <div className="p-4">
      {syllabusList.map((syllabus: any, index: number) => (
        <div className="border-0 border-gray-400 rounded-md my-2" key={syllabus.id}>
          <div className="mb-4 bg-gray-200 flex justify-between">
            <div className="px-4 py-2">
              <div className="text-lg">{syllabus.name}</div>
            </div>
            <div className="inline-flex">
              <span className="w-30 inline-flex items-center">Start Date</span>
              <div className="px-4 py-2">
                <DatePickerInput
                  date={syllabus.startDate}
                  placeholder={'Start Date'}
                  minDate={new Date()}
                  onChange={(date: Date | null) => handleDateChange(date, index)}
                />
              </div>
            </div>
          </div>
          <div>
            <div className="w-full flex justify-between mt-4">
              <div className="w-4/10 flex px-4 py-3 text-xs leading-4 font-medium text-gray-700 uppercase tracking-wider whitespace-normal">
                Lesson Name
              </div>
              <div className="w-2/10 flex px-4 py-3 text-xs leading-4 font-medium text-gray-700 uppercase tracking-wider whitespace-normal">
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
                      <div className="w-2/10 flex px-4 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider whitespace-normal">
                        {item.lesson?.duration}
                      </div>
                      <div className="w-2/10 flex px-4 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider whitespace-normal">
                        {item.startDate
                          ? new Date(item.startDate).toLocaleDateString()
                          : '-'}
                      </div>
                      <div className="w-2/10 flex px-4 py-3 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider whitespace-normal">
                        {item.estEndDate
                          ? new Date(item.estEndDate).toLocaleDateString()
                          : '-'}
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
    </div>
  );
};

export default UnitPlanner;
