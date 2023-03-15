import Tooltip from '@components/Atoms/Tooltip';
import React from 'react';

const CourseUnits = ({item, redirectToUnit, courseName, courseId}: any) => {
  const units = item.universalSyllabus?.items.filter((d: any) => d.unit !== null);

  return (
    <ol className="list-decimal">
      {units?.length > 0 ? (
        units?.map((unit: any) => (
          <Tooltip key={unit.unit.id} placement="left" text={`Go to ${unit.unit.name}`}>
            <li
              className="mb-2 cursor-pointer hover:underline hover:theme-text:400"
              key={unit.unit.id}
              onClick={() =>
                redirectToUnit(item.institution.id, unit.unit.id, courseId, courseName)
              }>
              {unit.unit.name}
            </li>
          </Tooltip>
        ))
      ) : (
        <p className="">No unit</p>
      )}
    </ol>
  );
};

export default CourseUnits;
