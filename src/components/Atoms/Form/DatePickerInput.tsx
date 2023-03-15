import {useGlobalContext} from 'contexts/GlobalContext';
import {forwardRef, useEffect, useRef} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {IoIosCalendar} from 'react-icons/io';

const DateCustomInput = forwardRef<any, any>(({value, onClick, ...rest}, ref) => {
  const {theme} = useGlobalContext();
  return (
    <div
      className={`flex w-auto py-2 px-3 rounded-full  ${theme.formSelect} ${theme.outlineNone}`}
      onClick={onClick}>
      <span className="w-6 mr-4 cursor-pointer">
        <IoIosCalendar size={'1.5rem'} className="theme-text" />
      </span>
      <input
        placeholder={'Search by date...'}
        id="searchInput"
        className={`${theme.outlineNone}`}
        value={value}
        ref={ref}
        {...rest}
      />
    </div>
  );
});

const DatePickerInput = ({
  focus,
  date,
  onChange,
  placeholder,
  minDate,
  isClearable = false
}: any) => {
  const datepickerRef = useRef<any>(null);

  useEffect(() => {
    if (focus) {
      const datepickerElement: any = datepickerRef.current;

      datepickerElement?.focus();
    }
  }, [focus]);

  let otherProps = {};
  if (minDate) {
    otherProps = {...otherProps, minDate};
  }
  return (
    <DatePicker
      dateFormat={'dd/MM/yyyy'}
      ref={datepickerRef}
      selected={date}
      placeholderText={placeholder || 'Enter date'}
      onChange={onChange}
      customInput={<DateCustomInput />}
      isClearable={isClearable}
      {...otherProps}
    />
  );
};

export default DatePickerInput;
