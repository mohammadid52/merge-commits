import {List, Tooltip} from 'antd';
import React from 'react';

const CourseUnits = ({item, redirectToUnit, courseName, courseId}: any) => {
  const units = item.universalSyllabus?.items.filter((d: any) => d.unit !== null);

  return (
    <List className="list-decimal">
      {units?.length > 0 ? (
        units?.map((unit: any) => (
          <Tooltip key={unit.unit.id} placement="left" title={`Go to ${unit.unit.name}`}>
            <List.Item
              className=" cursor-pointer hover:underline hover:theme-text:400"
              key={unit.unit.id}
              onClick={() =>
                redirectToUnit(item.institution.id, unit.unit.id, courseId, courseName)
              }>
              {unit.unit.name}
            </List.Item>
          </Tooltip>
        ))
      ) : (
        <p className="">No unit</p>
      )}
    </List>
  );
};

export default CourseUnits;
