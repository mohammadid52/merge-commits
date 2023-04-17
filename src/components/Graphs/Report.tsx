import {Divider} from 'antd';
import React from 'react';

/**
 * This component is to display the report of the graph on the graph section
 * @param param0 description - description of the report
 * @returns JSX.Element
 */
const Report = ({description}: {description: React.ReactNode}) => {
  return (
    <>
      <Divider />
      <div className="report">
        <h4 className="text-darkest font-semibold text-lg">Reports:</h4>
        <p className="text-dark text-base">{description}</p>
      </div>
    </>
  );
};

export default Report;
