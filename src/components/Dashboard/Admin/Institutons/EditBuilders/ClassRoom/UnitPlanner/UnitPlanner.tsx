import {API, graphqlOperation} from 'aws-amplify';
import moment, {Moment} from 'moment';
import React, {useEffect, useState} from 'react';

import {getClassroomSyllabus} from 'customGraphql/customQueries';

import SectionTitleV3 from '@components/Atoms/SectionTitleV3';
import TableComponent from '@components/Molecules/Table';
import {frequencyMapping} from '@utilities/staticData';
import {Divider, Empty, Typography} from 'antd';
import Buttons from 'atoms/Buttons';
import Loader from 'atoms/Loader';
import {useHistory} from 'react-router-dom';
import {IImpactLog} from '../ClassRoomHolidays';

interface IUnitPlannerProps {
  isDetailsComplete: boolean;
  lessonImpactLogs: IImpactLog[];
  logsChanged: boolean;
  roomData: any;
  saveRoomDetails: any;
  saving: boolean;
  setLogsChanged: React.Dispatch<React.SetStateAction<boolean>>;
}

const calculateAvailableStartDate = (
  date: Moment,
  frequency: any,
  step: number,
  duration: number,
  scheduleDates: Date[],
  frequencyMapping: any
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

    if (
      !isOccupied &&
      (frequencyMapping !== 'M/W/F' ||
        (frequencyMapping === 'M/W/F' &&
          [1, 3, 5].includes(moment(date).add(i, frequency).day()))) &&
      (frequencyMapping !== 'Tu/Th' ||
        (frequencyMapping === 'Tu/Th' &&
          [2, 4].includes(moment(date).add(i, frequency).day())))
    ) {
      if (iteration === 1) {
        startDate = new Date(moment(date).add(i, frequency).toDate());
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

export const calculateSchedule = (
  syllabusList: any[],
  startDate: any,
  frequency: any,
  lessonImpactLogs: any[]
) => {
  let count: number = 0,
    lastOccupiedDate: any = startDate,
    scheduleDates = lessonImpactLogs
      .filter((log: any) => log.adjustment === 'Push')
      .map((log: any) => log.impactDate);

  return syllabusList.map((syllabus: any) => ({
    ...syllabus,
    startDate: lastOccupiedDate,
    lessons: {
      ...syllabus.lessons,
      items: syllabus.lessons.items
        .filter((item: any) => item.lesson)
        .map((item: any) => {
          const freq = frequency || 'One Time';
          if (count !== 0 && 1 - count < item.lesson.duration) {
            lastOccupiedDate = moment(lastOccupiedDate).add(
              frequencyMapping[freq].step,
              frequencyMapping[freq].unit
            );
            count = 0;
          }
          count += item.lesson.duration;

          const {startDate, estEndDate}: any = calculateAvailableStartDate(
            moment(lastOccupiedDate),
            frequencyMapping[freq].unit,
            frequencyMapping[freq].step,
            item.lesson.duration,
            scheduleDates,
            frequency
          );

          item.startDate = startDate;
          item.estEndDate = estEndDate;

          lastOccupiedDate = Number.isInteger(count)
            ? moment(item.estEndDate).add(
                frequencyMapping[freq].step,
                frequencyMapping[freq].unit
              )
            : item.estEndDate;
          count = count >= 1 ? 0 : count;

          return item;
        })
    }
  }));
};

const UnitPlanner = ({
  lessonImpactLogs,
  logsChanged,
  roomData,
  saveRoomDetails,
  saving,
  setLogsChanged,
  isDetailsComplete
}: IUnitPlannerProps) => {
  const [loading, setLoading] = useState(roomData.curricular?.id);
  const [syllabusList, setSyllabusList] = useState<any[]>([]);

  useEffect(() => {
    if (roomData.curricular?.id) {
      fetchClassRoomSyllabus();
    }
  }, [roomData.curricular?.id]);
  const history = useHistory();

  const setImpactLogs = () => {
    const logs = calculateSchedule(
      syllabusList,
      roomData.startDate,
      roomData.frequency,
      lessonImpactLogs
    );

    if (logs.length > 0) {
      setSyllabusList(logs);
      setLogsChanged(true);
    }
  };

  const fetchClassRoomSyllabus = async () => {
    try {
      setLoading(true);
      const list: any = await API.graphql(
        graphqlOperation(getClassroomSyllabus, {
          id: roomData.curricular?.id
        })
      );
      const result: any = list.data?.getCurriculum;
      setSyllabusList(
        result?.universalSyllabus.items
          ?.map((item: any) => ({
            ...item,
            ...item.unit,
            index: result?.universalSyllabusSeq?.indexOf(item.unitId),
            lessons: {
              ...item.unit.lessons,
              items: item.unit.lessons?.items
                .map((t: any) => {
                  let index = result?.universalLessonsSeq?.indexOf(t.id);
                  return {...t, index};
                })
                .sort((a: any, b: any) => (a.index > b.index ? 1 : -1))
            }
          }))
          .sort((a: any, b: any) => (a.index > b.index ? 1 : -1)) || []
      );
      setTimeout(() => {
        if (isDetailsComplete) {
          setImpactLogs();
        }
      }, 500);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isDetailsComplete && syllabusList.length) {
      setImpactLogs();
    }
  }, [isDetailsComplete, syllabusList.length]);

  const tableConfig = (lessons: any[]) => {
    return {
      headers: [
        'Lesson Name',
        `Duration (${roomData.frequency})`,
        'Start Date',
        'Est End Date',
        'Act End Date'
      ],
      dataList: lessons.map((lesson: any, idx) => ({
        lessonName: lesson.lesson?.title,
        onClick: () => {},
        duration: lesson.lesson?.duration,
        startDate: moment(lesson.startDate).format('MM/DD/YYYY'),
        estEndDate: (
          <>
            {moment(lesson?.estEndDate).format('MM/DD/YYYY')}
            {lesson === syllabusList.length - 1 &&
            idx === lessons.length - 1 &&
            moment(lesson.estEndDate).isBefore(moment(roomData.endDate))
              ? '*'
              : ''}
          </>
        ),
        actEndDate: '--'
      }))
    };
  };

  return (
    <div className="py-0">
      <Typography.Title level={4} className="flex-1">
        Schedule
      </Typography.Title>
      <Divider />
      {/* <h3 className="text-xl leading-6 font-bold text-darkest">Schedule</h3> */}

      <div className="my-8">
        {loading ? (
          <div className="py-20 text-center mx-auto flex justify-center items-center w-full h-48">
            <div className="w-5/10">
              <Loader withText="Loading schedule..." />
            </div>
          </div>
        ) : syllabusList.length ? (
          <>
            {syllabusList.map((syllabus: any) => {
              const tableProps = tableConfig(syllabus?.lessons?.items);
              return (
                <div className="border-0 border-light  rounded-md my-2" key={syllabus.id}>
                  <SectionTitleV3
                    title={syllabus.name}
                    subtitle={`Start Date: ${
                      syllabus.lessons.items?.length &&
                      syllabus.lessons.items[0].startDate
                        ? new Date(
                            syllabus.lessons.items[0].startDate
                          ).toLocaleDateString()
                        : '-'
                    }`}
                  />

                  <TableComponent {...tableProps} />
                </div>
              );
            })}
            <div className="flex text-medium  justify-end">*Past course end date</div>
          </>
        ) : (
          <Empty description="No unit added in the course" />
        )}
      </div>
      <div className="flex my-8 gap-4 justify-end w-full mr-2 2xl:mr-0">
        <Buttons label={'Cancel'} onClick={history.goBack} transparent size="middle" />
        <Buttons
          disabled={saving || !logsChanged}
          label={'Run calculations and save'}
          size="middle"
          onClick={() => {
            setImpactLogs();
            saveRoomDetails();
          }}
        />
      </div>
    </div>
  );
};

export default UnitPlanner;
