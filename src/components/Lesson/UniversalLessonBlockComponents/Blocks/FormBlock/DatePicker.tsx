import React, {useState} from 'react';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

interface DatePickerProps {
  id: string;
  disabled: boolean;
  value: string;
  onChange: (e: any) => void;
}

const CustomDatePicker = (props: DatePickerProps) => {
  const {id, disabled = false, value, onChange} = props;
  const [startDate, setStartDate] = useState<any>(value || new Date());
  return (
    <DatePicker
      disabled={disabled}
      id={id}
      selected={startDate}
      onChange={(date, e) => {
        onChange(e);
        setStartDate(date);
      }}
    />
  );
};

export default CustomDatePicker;
