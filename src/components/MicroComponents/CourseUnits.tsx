import {List, Tooltip} from 'antd';
import React from 'react';

const CourseUnits = ({item, redirectToUnit, courseName, courseId}: any) => {
  const units = item.universalSyllabus?.items.filter((d: any) => d.unit !== null);

  return (
    <List
      className="table-list"
      dataSource={units}
      renderItem={(unit: any, index: number) => (
        <Tooltip key={unit.unit.id} placement="left" title={`Go to ${unit.unit.name}`}>
          <List.Item
            className=" cursor-pointer hover:underline hover:theme-text:400"
            key={unit.unit.id}
            onClick={() =>
              redirectToUnit(item.institution.id, unit.unit.id, courseId, courseName)
            }>
            {index + 1}. {unit.unit.name}
          </List.Item>
        </Tooltip>
      )}
    />
  );
};

export default CourseUnits;
