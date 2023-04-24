import {G2, Heatmap, HeatmapConfig} from '@ant-design/plots';
import Loader from '@components/Atoms/Loader';
import {calculateSchedule} from '@components/Dashboard/Admin/Institutons/EditBuilders/ClassRoom/UnitPlanner/UnitPlanner';
import {SEARCH_LIMIT} from '@components/Lesson/constants';
import {useGlobalContext} from '@contexts/GlobalContext';
import {listRoomsCalendar} from '@customGraphql/customQueries';
import {useQuery} from '@tanstack/react-query';
import {withZoiqFilter} from '@utilities/functions';
import {RoomStatus} from 'API';
import {Card, List} from 'antd';
import {API, graphqlOperation} from 'aws-amplify';
import {get} from 'lodash';
import moment from 'moment';

const InstitutionCalendar = () => {
  G2.registerShape('polygon', 'boundary-polygon', {
    draw(cfg, container) {
      const group = container.addGroup();
      const attrs = {
        stroke: '#fff',
        lineWidth: 1,
        fill: cfg.color,
        paht: []
      };
      const points = cfg.points;
      const path = [
        ['M', points[0].x, points[0].y],
        ['L', points[1].x, points[1].y],
        ['L', points[2].x, points[2].y],
        ['L', points[3].x, points[3].y],
        ['Z']
      ]; // @ts-ignore

      attrs.path = this.parsePath(path);
      group.addShape('path', {
        attrs
      });

      if (cfg.data.lastWeek) {
        const linePath = [
          ['M', points[2].x, points[2].y],
          ['L', points[3].x, points[3].y]
        ];

        group.addShape('path', {
          attrs: {
            path: this.parsePath(linePath),
            lineWidth: 4,
            stroke: '#404040'
          }
        });

        if (cfg.data.lastDay) {
          group.addShape('path', {
            attrs: {
              path: this.parsePath([
                ['M', points[1].x, points[1].y],
                ['L', points[2].x, points[2].y]
              ]),
              lineWidth: 4,
              stroke: '#404040'
            }
          });
        }
      }

      return group;
    }
  });

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
    console.log('🚀 ~ file: InstitutionCalendar.tsx:153 ~ allDates:', allDates);

    const config: HeatmapConfig = {
      data: allDates,
      height: 400,
      autoFit: false,
      xField: 'week',
      yField: 'day',
      colorField: 'holidays',
      reflect: 'y',
      shape: 'boundary-polygon',

      meta: {
        day: {
          type: 'cat',
          values: ['Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat']
        },
        week: {
          type: 'cat'
        },
        holidays: {
          sync: true
        },
        date: {
          type: 'cat'
        },
        lessonName: {
          sync: true
        }
      },
      yAxis: {
        grid: null
      },
      tooltip: {
        title: 'date',

        showMarkers: false,
        customContent(title, data) {
          if (data && data.length > 0) {
            const current = allDates.find((d) => d.date === data[0]?.data.date);

            return (
              <Card>
                <Card.Meta
                  // title={current?.lessonName}
                  description={moment(current?.date).format('DD MMM YYYY')}
                />
              </Card>
            );
          }
        }
      },
      interactions: [
        {
          type: 'element-active'
        }
      ],

      xAxis: {
        position: 'top',
        tickLine: null,
        line: null,
        label: {
          offset: 12,
          style: {
            fontSize: 12,
            fill: '#666',
            textBaseline: 'top'
          },
          formatter: (val) => {
            // get month name by week number
            const item = allDates.find((item) => item.week === val);
            if (item) {
              const month = item.month;
              // get month name by month number
              const monthName = moment().month(month).format('MMM');

              return monthName;
            }

            return '';
          }
        }
      }
    };

    return <Heatmap {...config} />;
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
