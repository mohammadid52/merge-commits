import React from 'react';

interface ColorPickerProps {
  callbackColor: (pickedColor: string) => void;
}

interface ColorObject {
  value: string | number;
  label: string | number;
}

const ColorPicker = (props: ColorPickerProps) => {
  const {callbackColor} = props;

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
        <div key={`${color.value}_${idx}`} className={`w-32 h-auto bg-white`}>
          <p className={`bg-white text-indigo-500`}>{color.label}:</p>
          <div className={`grid grid-cols-6`}>
            {colorCodes.map((code: ColorObject, idx2: number) => {
              return (
                <div
                  key={`${color.value}_${code.value}_${idx2}`}
                  className={`bg-${color.value}-${code.value} w-4 h-4`}
                  onClick={() => callbackColor(`${color.value}-${code.value}`)}
                />
              );
            })}
          </div>
        </div>
      );
    });

  return (
    <div className={`absolute `}>
      {availableColors.length > 0 && colorCodes.length > 0 ? colorGrid() : null}
    </div>
  );
};

export default ColorPicker;
