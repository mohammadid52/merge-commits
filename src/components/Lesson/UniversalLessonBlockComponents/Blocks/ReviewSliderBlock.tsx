import React, {useContext, useState} from 'react';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import {FormControlProps} from './FormBlock';
import './styles/ReviewSliderStyles.scss';
const genSlideStyle = (value: number) => {
  return {
    point: {
      left: `calc(${value * 20}% - ${5 + 3 * value}px)`,
    },
    range: {
      width: `${value * 20}%`,
    },
  };
};
interface ReviewSliderBlockProps extends FormControlProps {
  onChange: (e: any) => void;
  disabled: boolean;
}

const ReviewSliderBlock = ({
  value = 0,
  disabled,
  onChange,
  label,
}: ReviewSliderBlockProps) => {
  const [range, setRange] = useState(value);

  const {state} = useContext(GlobalContext);

  const isDark = state.lessonPage.theme === 'dark';

  const slideStyle = genSlideStyle(range);

  return (
    <div className="p-4">
      {/* */}
      <div
        style={{
          border: !isDark ? '1px solid #ececec' : 'none',
          boxShadow: '0 10px 20px 0 rgba(0, 0, 0, 0.05)',
        }}
        className={`review-slider-container p-4 py-6 w-auto  flex flex-col items-start justify-center  ${
          isDark ? 'bg-gray-700' : 'bg-white'
        } h-auto rounded-lg shadow`}>
        <div className="flex items-center justify-between">
          <p
            className={`${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }  block text-lg w-auto font-semibold leading-5 `}>
            {label}
          </p>
          <p
            className={`${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }  block text-lg w-auto font-semibold leading-5 `}>
            {range}
          </p>
        </div>
        <div className={`range ${isDark ? 'dark' : 'light'} mt-4`}>
          <span className="range-value" style={slideStyle.range} />
          <span className="circle" style={slideStyle.point} />
          <input
            className={`range-slide }`}
            name="range"
            type="range"
            min={'0'}
            max={'5'}
            disabled={disabled}
            value={range}
            step="1"
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ReviewSliderBlock;
