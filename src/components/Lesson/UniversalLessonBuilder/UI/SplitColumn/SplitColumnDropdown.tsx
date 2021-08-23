import React from 'react';
import {FaSortUp} from 'react-icons/fa';

interface SplitColumnDropdownProps {
  classString?: string;
  isPagePart?: boolean;
  handleSplitColumnChange:(column:number) => void;
}

const SplitColumnDropdown = ({
  handleSplitColumnChange,
  isPagePart,
}: SplitColumnDropdownProps) => {
  let styleConfig: any = {};
  if (isPagePart) {
    styleConfig = {
      padding: 'pr-2',
      pickerTransform: {right: '100%'},
      rotation: 'rotate-90',
      svgTransform: {right: '-5px'},
    };
  } else {
    styleConfig = {
      padding: 'pl-2',
      pickerTransform: {left: '100%'},
      rotation: '-rotate-90',
      svgTransform: {left: '-5px'},
    };
  }

  return (
    <div
      className={`absolute z-100 transform top-0 ${styleConfig.padding} w-max`}
      style={styleConfig.pickerTransform}>
      {/* <div className={`absolute w-max z-100 transform pl-2 top-0`} style={{left: '100%'}}> */}
      <div
        className={`absolute w-10 transform ${styleConfig.rotation}`}
        style={styleConfig.svgTransform}>
        <FaSortUp size="40" />
      </div>
      <div className={`bg-white rounded-lg`}>
        <p className={`text-black w-auto text-xl p-2`}>Split column into</p>
        <div>
          {[2, 3].map((col) => (
            <div
              className="text-black cursor-pointer border-t-2 pl-4 py-1"
              key={col}
              onClick={() => handleSplitColumnChange(col)}>
              {col}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SplitColumnDropdown;
