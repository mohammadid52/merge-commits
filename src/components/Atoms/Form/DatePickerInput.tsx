import React, {forwardRef, useContext} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {IconContext} from 'react-icons';
import {IoIosCalendar} from 'react-icons/io';
import {getAsset} from '../../../assets';
import {GlobalContext} from '../../../contexts/GlobalContext';

const DatePickerInput = ({
  date,
  onChange,
  placeholder,
  minDate,
  isClearable = false,
}: any) => {
  const {theme, clientKey} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const DateCustomInput = forwardRef(({value, onClick, ...rest}: any, ref: any) => (
    <div
      className={`flex w-auto py-2 px-3 rounded  ${theme.formSelect} ${theme.outlineNone}`}
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
