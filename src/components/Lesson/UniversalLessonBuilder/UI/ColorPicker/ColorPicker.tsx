import React from 'react';
import {FaCheck, FaSortUp} from 'react-icons/fa';
import Buttons from '../../../../Atoms/Buttons';

interface ColorPickerProps {
  callbackColor: (pickedColor: string) => void;
  classString?: string;
  isPagePart?: boolean;
  isMainPage?: boolean;
  styleString?: {[key: string]: string};
  customColors?: {
    colors: ColorObject[];
    values: ColorObject[];
  };
  noneLabel?: string;
  onNoneClick?: () => void;
}

interface ColorObject {
  value: string | number;
  label: string | number;
}

const ColorPicker = (props: ColorPickerProps) => {
  const {
    callbackColor,
    classString,
    noneLabel,
    onNoneClick,
    isMainPage,
    isPagePart,
    styleString,
    customColors = null,
  } = props;

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

  const dynamicColors = customColors ? customColors.colors : availableColors;
  const dynamicValues = customColors ? customColors.values : colorCodes;

  const colorGrid = () =>
    dynamicColors.map((color: ColorObject, idx: number) => {
      return (
        <div key={`${color.value}_${idx}`} className={`w-auto h-auto my-1`}>
          <div className={`${customColors ? 'flex ' : 'grid grid-cols-9'} `}>
            {dynamicValues.map((code: ColorObject, idx2: number) => {
              return (
                <div
                  key={`${color.value}_${code.value}_${idx2}`}
                  className={`relative bg-${color.value}-${code.value} w-12 h-12 rounded-full shadow-sm cursor-pointer mx-1 border-2 border-${color.value}-${code.value}`}
                  onClick={() => callbackColor(`${color.value}-${code.value}`)}>
                  {classString?.split(' ').indexOf(`bg-${color.value}-${code.value}`) >
                    -1 ||
                  classString?.split(' ').indexOf(`border-${color.value}-${code.value}`) >
                    -1 ? (
                    <div
                      className={`absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 left-1/2`}>
                      <FaCheck color="white" />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      );
    });

  const styles = {
    padding: isPagePart ? 'pr-2' : 'pl-2',
    pickerTransform: isPagePart
      ? {right: '100%'}
      : isMainPage
      ? {bottom: '0%'}
      : {left: '100%'},
    rotation: isPagePart ? 'rotate-90' : isMainPage ? '' : '-rotate-90',
    svgTransform: isPagePart
      ? {right: '-5px'}
      : isMainPage
      ? {top: '-4px', left: '8px', color: 'white'}
      : {left: '-5px'},
    icon: isMainPage ? '' : '-translate-y-1/2 top-1/2',
  };

  return (
    <div
      className={`absolute z-100 transform -translate-y-1/2 left-full top-1/2 ${styles.padding} w-max`}
      style={{...styles.pickerTransform, ...styleString}}>
      <div
        className={`absolute w-10 transform ${styles.rotation} ${styles.icon}`}
        style={styles.svgTransform}>
        <FaSortUp size="40" />
      </div>
      <div className={`bg-white shadow-lg  my-3 rounded-lg p-6`}>
        <div className="flex items-center mb-2 justify-between">
          <p className={`text-gray-900 w-auto font-medium text-2xl`}>Select a color</p>
          {noneLabel && (
            <Buttons
              onClick={onNoneClick}
              btnClass="py-1 px-4 text-xs "
              label={noneLabel}>
              {noneLabel}
            </Buttons>
          )}
        </div>
        <div className={`my-4 ${customColors ? 'flex items-center' : ''}`}>
          {dynamicColors.length > 0 && dynamicValues.length > 0 ? colorGrid() : null}
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
