import Label from '@components/Atoms/Form/Label';
import {Slider, Tooltip} from 'antd';
import {useState} from 'react';
import {FormControlProps} from './FormBlock';
import './styles/ReviewSliderStyles.scss';

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
const getFirstLastValue = (el: string, splitBy: string) => el.split(splitBy);

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
  return {};
};

const ReviewSliderBlock = (props: ReviewSliderBlockProps) => {
  const {
    value = 1,
    disabled,
    id,
    onChange,
    inputID,

    classString = `1-5 || gray-700 || gray-800 || dark-gray || rounded-lg`,
    label
  } = props;

  const values = extractValuesFromClassString(classString);

  const min = Number(values?.min) || 1;
  const max = Number(values?.max) || 5;
  const [sliderValue, setSliderValue] = useState(value || 1);

  return (
    <Tooltip title={disabled ? 'Disabled in building mode' : undefined}>
      <div className="review-icon-wrapper lesson-form-block">
        {label && <Label disabled={disabled} label={label} />}
        <Slider
          min={min}
          disabled={disabled}
          max={max}
          onChange={(sliderValue) => {
            setSliderValue(sliderValue);
            onChange({target: {id: inputID, value: sliderValue.toString()}});
          }}
          value={Number(sliderValue)}
        />
      </div>
    </Tooltip>
  );
};

export default ReviewSliderBlock;
