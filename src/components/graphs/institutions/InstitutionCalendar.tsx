import {G2, Heatmap} from '@ant-design/plots';
import Loader from '@components/Atoms/Loader';
import {SEARCH_LIMIT} from '@components/Lesson/constants';
import {useGlobalContext} from '@contexts/GlobalContext';
import {listInstitutionsForCalendarGraphs} from '@customGraphql/customQueries';
import {useQuery} from '@tanstack/react-query';
import {withZoiqFilter} from '@utilities/functions';
import {API, graphqlOperation} from 'aws-amplify';
import moment from 'moment';
import {useEffect, useState} from 'react';

const InstitutionCalendar = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    asyncFetch();
  }, []);

  const asyncFetch = () => {
    fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/github-commit.json')
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => {
        console.log('fetch data failed', error);
      });
  };

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

  const fetchInstitutionLocation = async () => {
    const res: any = await API.graphql(
      graphqlOperation(listInstitutionsForCalendarGraphs, {
        limit: SEARCH_LIMIT,
        filter: withZoiqFilter({}, zoiqFilter)
      })
    );
    return res.data.listInstitutions.items;
  };

  const {
    data: insitutionList,
    isLoading,
    isFetched
  } = useQuery<any[]>({
    queryKey: ['institution-list-calendar'],
    queryFn: fetchInstitutionLocation
  });

  if (isLoading && !isFetched) {
    return (
      <div className="min-h-56 flex items-center justify-center">
        <Loader withText="Getting institutions...." />
      </div>
    );
  }

  if (insitutionList && insitutionList?.length > 0) {
    //   filter rooms with null startDate and endDate

    const institutionsWithRooms = insitutionList.filter(
      (d) => d?.rooms?.items?.length > 0
    );

    const filteredInstitutionList = institutionsWithRooms
      .map((d) => {
        return {
          id: d.id,
          rooms: d?.rooms?.items?.filter(
            (room: {startDate: any; endDate: any}) => room.startDate && room.endDate
          )
        };
      })
      .filter((d) => d.rooms.length > 0);

    const rooms = filteredInstitutionList.map((d) => d.rooms).flat();

    const filterOnlyCurrentYear = rooms.filter(
      (d) => moment(d.startDate).year() === moment().year()
    );
    const sortedDate = filterOnlyCurrentYear.sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    let allDates: any[] = [];

    sortedDate.forEach((d) => {
      const startDate = moment(d.startDate);
      const endDate = moment(d.endDate);

      const diff = endDate.diff(startDate, 'days');
      const dates = [];
      for (let i = 0; i <= diff; i++) {
        const date = moment(startDate).add(i, 'days').format('YYYY-MM-DD');

        const existingDate = allDates.find((d) => d.date === date);

        dates.push({
          date,
          holidays: existingDate ? existingDate.holidays + 1 : 1,
          week: moment(date).week().toString(),
          day: moment(date).weekday(),
          month: moment(date).month(),
          // get last week of the month
          lastWeek: moment(date).week() === moment(date).endOf('month').week(),
          // get last day of the week
          lastDay: moment(date).weekday() === 6
        });
      }
      allDates.push(...dates);
    });

    console.log(allDates.slice(0, 20));

    let monthNames: string[] = [];

    const config = {
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
        }
      },
      yAxis: {
        grid: null
      },
      tooltip: {
        title: 'date',
        showMarkers: false
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
  return null;
};

export default InstitutionCalendar;
