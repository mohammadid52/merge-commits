import React from 'react';
import {PieChart, Pie, Cell, Tooltip} from 'recharts';

const COLORS = [
  '#084081',
  '#4eb3d3',
  '#2b8cbe',
  '#0868ac',
  '#7bccc4',
  '#a8ddb5',
  '#ccebc5',
  '#e0f3db',
  '#f7fcf0',
];
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = (obj: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
  name: string;
  key: string;
  tooltipPayload: string;
}) => {
  const radius = obj.innerRadius + (obj.outerRadius - obj.innerRadius) * 0.5;
  const x = obj.cx + radius * Math.cos(-obj.midAngle * RADIAN);
  const y = obj.cy + radius * Math.sin(-obj.midAngle * RADIAN);
  return (
    <>
      {obj.key === 'Institute' && (
        <>
          <text></text>
          <text x={obj.cx} y={obj.cy} dy={8} textAnchor="middle" fill={'#333'}>
            {'Institute'}
          </text>
          <text
            x={obj.cx}
            y={obj.cy + 20}
            textAnchor="middle"
            fontSize={11}
            fill={'#999'}>
            {'Details'}
          </text>
        </>
      )}
      {obj.key === 'Course' && (
        <>
          <text
            x={x}
            y={y}
            fontSize={12}
            fill="white"
            textAnchor={'middle'}
            dominantBaseline="central">
            {obj.name}
          </text>
          <text x={obj.cx} y={obj.cy} dy={8} textAnchor="middle" fill={'#333'}>
            {'Course'}
          </text>
          <text
            x={obj.cx}
            y={obj.cy + 20}
            textAnchor="middle"
            fontSize={11}
            fill={'#999'}>
            {'Details'}
          </text>
        </>
      )}
      {obj.key === 'Inactive_course' && null}
      {obj.key === 'Classes' && (
        <>
          <text
            x={x}
            y={y}
            fontSize={12}
            fill="white"
            textAnchor={'middle'}
            dominantBaseline="central">
            {obj.name}
          </text>
          <text x={obj.cx} y={obj.cy} dy={8} textAnchor="middle" fill={'#333'}>
            {'Classes'}
          </text>
          <text
            x={obj.cx}
            y={obj.cy + 20}
            textAnchor="middle"
            fontSize={11}
            fill={'#999'}>
            {'Details'}
          </text>
        </>
      )}
      {obj.key === 'Inactive_Classes' && null}
      {obj.key === 'Lessons' && (
        <>
          <text
            x={x}
            y={y}
            fontSize={12}
            fill="white"
            textAnchor={'middle'}
            dominantBaseline="central">
            {obj.name}
          </text>
          <text x={obj.cx} y={obj.cy} dy={8} textAnchor="middle" fill={'#333'}>
            {'Lessons'}
          </text>
          <text
            x={obj.cx}
            y={obj.cy + 20}
            textAnchor="middle"
            fontSize={11}
            fill={'#999'}>
            {'Details'}
          </text>
        </>
      )}
      {obj.key === 'Inactive_Lessons' && null}
      {obj.key === 'Surveys' && (
        <>
          <text
            x={x}
            y={y}
            fontSize={12}
            fill="white"
            textAnchor={'middle'}
            dominantBaseline="central">
            {obj.name}
          </text>
          <text x={obj.cx} y={obj.cy} dy={8} textAnchor="middle" fill={'#333'}>
            {'Surveys'}
          </text>
          <text
            x={obj.cx}
            y={obj.cy + 20}
            textAnchor="middle"
            fontSize={11}
            fill={'#999'}>
            {'Details'}
          </text>
        </>
      )}
      {obj.key === 'Inactive_Surveys' && null}
      {obj.key === 'taken_Survey' && (
        <>
          <text
            x={x}
            y={y}
            fontSize={12}
            fill="white"
            textAnchor={'middle'}
            dominantBaseline="central">
            {obj.name}
          </text>
          <text x={obj.cx} y={obj.cy} dy={8} textAnchor="middle" fill={'#333'}>
            {'Taken Surveys'}
          </text>
          <text
            x={obj.cx}
            y={obj.cy + 20}
            textAnchor="middle"
            fontSize={11}
            fill={'#999'}>
            {'Details'}
          </text>
        </>
      )}
      {obj.key === 'total_Survey' && (
        <>
          <text
            x={x}
            y={y}
            fontSize={12}
            fill="white"
            textAnchor={'middle'}
            dominantBaseline="central">
            {obj.name}
          </text>
        </>
      )}
    </>
  );
};

const CustomTooltip = ({active, payload}: any) => {
  if (active && payload?.length) {
    return (
      <>
        {payload[0].payload.key === 'Institute' && (
          <div className="piechart-tooltip">
            <p>
              Institute Name: &nbsp;
              <span>{`${payload[0].name}`}</span>
            </p>
          </div>
        )}
        {payload[0].payload.key === 'Course' && (
          <div className="piechart-tooltip">
            <p>
              Total Courses: &nbsp;
              <span>{`${payload[0].value === 10 ? 0 : payload[0].value}`}</span>
            </p>
          </div>
        )}
        {payload[0].payload.key === 'Inactive_Course' && null}
        {payload[0].payload.key === 'Classes' && (
          <div className="piechart-tooltip">
            <p>
              Total Classrooms: &nbsp;
              <span>{`${payload[0].value === 10 ? 0 : payload[0].value}`}</span>
            </p>
          </div>
        )}
        {payload[0].payload.key === 'Inactive_Classes' && null}
        {payload[0].payload.key === 'Lessons' && (
          <div className="piechart-tooltip">
            <p>
              Total Lessons: &nbsp;
              <span>{`${payload[0].value === 10 ? 0 : payload[0].value}`}</span>
            </p>
          </div>
        )}
        {payload[0].payload.key === 'Inactive_Lessons' && null}
        {payload[0].payload.key === 'Surveys' && (
          <div className="piechart-tooltip">
            <p>
              Total Surveys: &nbsp;
              <span>{`${payload[0].value === 10 ? 0 : payload[0].value}`}</span>
            </p>
          </div>
        )}
        {payload[0].payload.key === 'Inactive_Surveys' && null}
        {payload[0].payload.key === 'taken_Survey' && (
          <div className="piechart-tooltip">
            <p>
              Taken Survey: &nbsp;
              <span>{`${
                payload[0].value === 5 && payload[0].payload.allData.allTakenSurveys === 0
                  ? 0
                  : payload[0].value
              }`}</span>
            </p>
          </div>
        )}
        {payload[0].payload.key === 'total_Survey' && (
          <div className="piechart-tooltip">
            <p>
              Total Survey: &nbsp;
              <span>{`${payload[0].value === 10 ? 0 : payload[0].value}`}</span>
            </p>
          </div>
        )}
      </>
    );
  }
  return null;
};

const PieChartWrapper = ({
  getNameandValuefromData = () => {
    return {name: '', value: 0, key: '', allData: {}} as any;
  },
}) => {
  const chartData = getNameandValuefromData();
  return (
    <PieChart width={500} height={380}>
      <Pie
        dataKey="value"
        data={chartData}
        isAnimationActive={false}
        innerRadius={65}
        outerRadius={160}
        cy={180}
        label={renderCustomizedLabel}
        labelLine={false}>
        {chartData.map((_: any, index: any) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip content={<CustomTooltip />} />
    </PieChart>
  );
};

export default React.memo(PieChartWrapper);
