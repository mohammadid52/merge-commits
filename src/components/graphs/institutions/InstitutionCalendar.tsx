import {G2, Heatmap, HeatmapConfig} from '@ant-design/plots';
import Loader from '@components/Atoms/Loader';
import {calculateSchedule} from '@components/Dashboard/Admin/Institutons/EditBuilders/ClassRoom/UnitPlanner/UnitPlanner';
import {SEARCH_LIMIT} from '@components/Lesson/constants';
import {useGlobalContext} from '@contexts/GlobalContext';
import {listRoomsCalendar} from '@customGraphql/customQueries';
import {useQuery} from '@tanstack/react-query';
import {withZoiqFilter} from '@utilities/functions';
import {RoomStatus} from 'API';
import {Calendar, Card, List} from 'antd';

import {API, graphqlOperation} from 'aws-amplify';

import {get} from 'lodash';
import moment from 'moment';
import type {Dayjs} from 'dayjs';
import type {CalendarMode} from 'antd/es/calendar/generateCalendar';

const InstitutionCalendar = () => {
  const {zoiqFilter} = useGlobalContext();

  const fetchRooms = async () => {
    const res: any = await API.graphql(
      graphqlOperation(listRoomsCalendar, {
        limit: SEARCH_LIMIT,
        filter: withZoiqFilter(
          {
            status: {
              eq: RoomStatus.ACTIVE
            }
          },
          zoiqFilter
        )
      })
    );
    return res.data.listRooms.items;
  };

  const {
    data: rooms,
    isLoading,
    isFetched
  } = useQuery<any[]>({
    queryKey: ['syllabus-list-calendar'],
    queryFn: fetchRooms
  });

  if (isLoading && !isFetched) {
    return (
      <div className="min-h-56 flex items-center justify-center">
        <Loader withText="Getting institutions...." />
      </div>
    );
  }

  if (rooms && rooms.length > 0) {
    const syllabusList = rooms
      .map((d) => {
        const syllabus = get(
          d,
          `curricula.items[0].curriculum.universalSyllabus.items`,
          []
        );

        const lessons = syllabus.map((d: any) => {
          return {
            ...d,
            lessons: get(d, `unit.lessons`, [])
          };
        });

        return {
          id: d.id,
          startDate: d.startDate,
          frequency: d.frequency,
          syllabusList: lessons,
          lessonImpactLogs: d?.lessonImpactLog || []
        };
      })
      .filter((d) => d.syllabusList.length > 0);

    const getLogs = () => {
      const finalLogs = syllabusList.map((syllabus) => {
        const logs = calculateSchedule(
          syllabus.syllabusList,
          syllabus.startDate,
          syllabus.frequency,
          syllabus.lessonImpactLogs
        );
        return logs;
      });

      return finalLogs;
    };

    const filtered = getLogs()
      .flat()
      .filter(
        (d) => Boolean(d.startDate) && moment(d.startDate).year() === moment().year()
      );

    let allDates: any[] = [];

    filtered.forEach((d) => {
      d.lessons.items.forEach(
        (lesson: {
          startDate: moment.MomentInput;
          endDate: moment.MomentInput;
          date: string;
          lesson: {title: string};
        }) => {
          const startDate = moment(lesson.startDate);
          const endDate = moment(lesson.endDate);

          const diff = endDate.diff(startDate, 'days');
          const dates = [];
          for (let i = 0; i <= diff; i++) {
            const date = moment(startDate).add(i, 'days').format('YYYY-MM-DD');

            const existingDate = allDates.find((lesson) => lesson.date === date);

            dates.push({
              date,
              holidays: 1,
              week: moment(date).week().toString(),
              day: moment(date).weekday(),
              month: moment(date).month(),
              // get last week of the month
              lastWeek: moment(date).week() === moment(date).endOf('month').week(),
              // get last day of the week
              lastDay: moment(date).weekday() === 6,
              lessonName: lesson.lesson.title
            });
          }
          allDates.push(...dates);
        }
      );
    });

    const onPanelChange = (value: Dayjs, mode: CalendarMode) => {
      console.log(value.format('YYYY-MM-DD'), mode);
    };

    return <Calendar onPanelChange={onPanelChange} />;
  }

  // if (insitutionList && insitutionList?.length > 0) {
  //   //   filter rooms with null startDate and endDate

  //   const institutionsWithRooms = insitutionList.filter(
  //     (d) => d?.rooms?.items?.length > 0
  //   );

  //   const filteredInstitutionList = institutionsWithRooms
  //     .map((d) => {
  //       return {
  //         id: d.id,
  //         rooms: d?.rooms?.items?.filter(
  //           (room: {startDate: any; endDate: any}) => room.startDate && room.endDate
  //         )
  //       };
  //     })
  //     .filter((d) => d.rooms.length > 0);

  //   const rooms = filteredInstitutionList.map((d) => d.rooms).flat();

  return <div>progress</div>;
};

export default InstitutionCalendar;
