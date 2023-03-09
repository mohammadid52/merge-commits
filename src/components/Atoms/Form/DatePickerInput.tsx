import {getAsset} from 'assets';
import {useGlobalContext} from 'contexts/GlobalContext';
import {forwardRef, useEffect, useRef} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {IconContext} from 'react-icons';
import React from 'react';
import {IoIosCalendar} from 'react-icons/io';

const DatePickerInput = ({
  focus,
  date,
  onChange,
  placeholder,
  minDate,
  isClearable = false
}: any) => {
  const datepickerRef = useRef(null);

  useEffect(() => {
    if (focus) {
      const datepickerElement: any = datepickerRef.current;

      datepickerElement?.focus();
    }
  }, [focus]);
  const {theme, clientKey} = useGlobalContext();
  const themeColor = getAsset(clientKey, 'themeClassName');
  const DateCustomInput = forwardRef(({value, onClick, ...rest}: any) => (
    <div
      className={`flex w-auto py-2 px-3 rounded-full  ${theme.formSelect} ${theme.outlineNone}`}
      onClick={onClick}>
      <span className="w-6 mr-4 cursor-pointer">
        <IconContext.Provider
          value={{size: '1.5rem', color: theme.iconColor[themeColor]}}>
          <IoIosCalendar />
        </IconContext.Provider>
      </span>
      <input
        placeholder={'Search by date...'}
        id="searchInput"
        className={`${theme.outlineNone}`}
        value={value}
        ref={datepickerRef}
        {...rest}
      />
    </div>
  ));
  let otherProps = {};
  if (minDate) {
    otherProps = {...otherProps, minDate};
  }
  return (
    <DatePicker
      dateFormat={'dd/MM/yyyy'}
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
