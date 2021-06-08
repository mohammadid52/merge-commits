import React from 'react';
import {FaCheck, FaSortUp} from 'react-icons/fa';

interface ColorPickerProps {
  callbackColor: (pickedColor: string) => void;
  classString?: string;
}

interface ColorObject {
  value: string | number;
  label: string | number;
}

const ColorPicker = (props: ColorPickerProps) => {
  const {callbackColor, classString} = props;
  
  const availableColors: ColorObject[] = [
    {value: 'gray', label: 'Gray'},
    {value: 'red', label: 'Red'},
    {value: 'yellow', label: 'Yellow'},
    {value: 'green', label: 'Green'},
    {value: 'blue', label: 'Blue'},
    {value: 'indigo', label: 'Indigo'},
    {value: 'purple', label: 'Purple'},
    {value: 'pink', label: 'Pink'},
  ];
  const colorCodes: ColorObject[] = [
    {value: 50, label: 50},
    {value: 100, label: 100},
    {value: 200, label: 200},
    {value: 300, label: 300},
    {value: 400, label: 400},
    {value: 500, label: 500},
    {value: 600, label: 600},
    {value: 700, label: 700},
    {value: 800, label: 800},
    {value: 900, label: 900},
  ];

  const colorGrid = () =>
    availableColors.map((color: ColorObject, idx: number) => {
      return (
        <div key={`${color.value}_${idx}`} className={`w-auto h-auto my-1`}>
          {/* <p className={`bg-white text-indigo-500`}>{color.label}:</p> */}
          <div className={`grid grid-cols-10`}>
            {colorCodes.map((code: ColorObject, idx2: number) => {
              return (
                <div
                  key={`${color.value}_${code.value}_${idx2}`}
                  className={`relative bg-${color.value}-${code.value} w-12 h-12 rounded-full shadow-sm cursor-pointer mx-1 border-2 border-${color.value}-${code.value}`}
                  onClick={() => callbackColor(`${color.value}-${code.value}`)}>
                  {classString?.includes(`bg-${color.value}-${code.value}`) ? 
                  <div
                    className={`absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 left-1/2`}>
                    <FaCheck />
                  </div> : null}
                </div>
              );
            })}
          </div>
        </div>
      );
    });

  return (
    <div className={`absolute w-max z-100 transform -translate-x-1/2 left-1/2 pt-2`}>
      <div className={`absolute top-0 transform -translate-x-1/2 left-1/2`}>
        <FaSortUp size="40" />
      </div>
      <div className={`bg-white my-2 rounded-lg p-4`}>
        <p className={`text-black w-auto text-2xl`}>Select a color</p>
        <div className={`my-4`}>
          {availableColors.length > 0 && colorCodes.length > 0 ? colorGrid() : null}
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
