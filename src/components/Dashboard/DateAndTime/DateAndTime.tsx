import React from 'react';

const DateAndTime = () => {
  const d = new Date();
  const localeDate = d.toLocaleDateString();

  const day = d.getDay();

  const daySwitch = () => {
    switch(day){
      case 0:
        return 'Sunday';
      case 1:
        return 'Monday';
      case 2:
        return 'Tuesday';
      case 3:
        return 'Wednesday';
      case 4:
        return 'Thursday';
      case 5:
        return 'Friday';
      case 6:
        return 'Saturday';
    }
  }

  return (
    <>{`${daySwitch()} - ${localeDate}`}</>
  )
}

export default DateAndTime;