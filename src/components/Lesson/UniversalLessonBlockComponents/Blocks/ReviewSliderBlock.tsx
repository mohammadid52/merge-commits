import React, {useContext, useState} from 'react';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import {FormControlProps} from './FormBlock';
import './styles/ReviewSliderStyles.scss';

/**
 *
 * @param value the range value
 * @param max maximum numer for value
 * @returns dynamic style object for  slider
 */

const genSlideStyle = (value: number | string, max: number | string) => {
  let val = Number(max) === 10 ? Number(value) / 2 : Number(value);
  let updatedVal = Number(max) === 5 ? (val === 1 ? 0 : val) : val === 0.5 ? 0 : val;

  return {
    point: {
      left: `calc(${updatedVal * 20}% - ${5 + 3 * updatedVal}px)`,
    },
    range: {
      width: `${updatedVal * 20}%`,
    },
  };
};
interface ReviewSliderBlockProps extends FormControlProps {
  onChange: (e: any) => void;
  disabled: boolean;
}
/**
 *
 * @param el the element you want to split
 * @param splitBy specify the pattern by which you want to split the element
 * @returns splitted values
 */
export const getFirstLastValue = (el: string, splitBy: string) => el.split(splitBy);

/**
 * @return extracted values from classString like min-max, background color and foreground color.
 */
export const extractValuesFromClassString = (
  classString: string = `1-5 || gray-700 || gray-800 || gray-700 || rounded-lg`
) => {
  if (classString) {
    let [minMax, bgColor, fgColor, cardBgColor, rounded] = classString.split(' || ');
    let [min, max] = getFirstLastValue(minMax, '-');
    return {min, max, bgColor, fgColor, cardBgColor, rounded};
  }
};

const ReviewSliderBlock = (props: ReviewSliderBlockProps) => {
  const {
    value = 1,
    disabled,
    id,
    onChange,
    inputID,
    classString = `1-5 || gray-700 || gray-800 || dark-gray || rounded-lg`,
    label,
  } = props;

  const {state} = useContext(GlobalContext);

  const values = extractValuesFromClassString(classString);

  const isDark = state.lessonPage.theme === 'dark';

  const slideStyle = genSlideStyle(value, values?.max);

  return (
    <div className="p-4" id={id} key={id}>
      {/* */}
      <div
        style={{
          border: !isDark ? '1px solid #ececec' : 'none',
          boxShadow: '0 10px 20px 0 rgba(0, 0, 0, 0.05)',
        }}
        className={`review-slider-container p-6 w-auto  flex flex-col items-start justify-center bg-${values?.cardBgColor} h-auto ${values?.rounded} shadow`}>
        <div className="flex items-center justify-between">
          <p
            className={`${
              isDark ? 'text-gray-400' : 'text-gray-600'
            } block text-lg w-auto font-semibold leading-5 `}>
            {label}
          </p>
          <p
            className={`${
              isDark ? 'text-gray-400' : 'text-gray-600'
            } block text-lg w-auto font-semibold leading-5 `}>
            {value}
          </p>
        </div>
        <div className={`range relative rounded-full bg-${values?.bgColor} mt-4`}>
          <span
            className={`range-value bg-${values?.fgColor}`}
            style={slideStyle.range}
          />
          <span className={`circle bg-${values?.fgColor}`} style={slideStyle.point} />
          <input
            className={`range-slide`}
            name="range"
            type="range"
            id={inputID}
            min={values?.min || 1}
            max={values?.max || 5}
            disabled={disabled}
            value={value}
            step="1"
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ReviewSliderBlock;
