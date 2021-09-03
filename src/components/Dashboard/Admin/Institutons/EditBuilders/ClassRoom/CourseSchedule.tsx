import React, {useContext, useEffect, useState} from 'react';
import {CgNotes} from 'react-icons/cg';
import {FiAlertCircle, FiClock, FiRefreshCw} from 'react-icons/fi';
import {IoIosCalendar} from 'react-icons/io';
// import {IoGlobeOutline, IoLocation} from 'react-icons/io5';
import {FaCalendarDay} from 'react-icons/fa';
import API, {graphqlOperation} from '@aws-amplify/api';
import moment from 'moment';

import * as mutation from '../../../../../../graphql/mutations';

import {frequencyOptions, weekdaysOption} from '../../../../../../utilities/staticData';
import Buttons from '../../../../../Atoms/Buttons';
import FormInput from '../../../../../Atoms/Form/FormInput';
import Selector from '../../../../../Atoms/Form/Selector';
import DatePickerInput from '../../../../../Atoms/Form/DatePickerInput';
import {awsFormatDate, dateString, timeIntervals} from '../../../../../../utilities/time';
import useDictionary from '../../../../../../customHooks/dictionary';
import {GlobalContext} from '../../../../../../contexts/GlobalContext';

import ClassRoomHolidays from './ClassRoomHolidays';
import UnitPlanner from './UnitPlanner/UnitPlanner';
// import ScheduleAlertPopUp from './ScheduleAlertPopUp';
import Modal from '../../../../../Atoms/Modal';

export interface ICourseScheduleProps {
  roomData: any;
}

export interface ICourseScheduleFields {
  startDate: Date | null;
  endDate: Date | null;
  startTime: string;
  endTime: string;
  frequency: string;
  location: string;
  notes: string;
  weekDay: string;
  conferenceCallLink: string;
}

const CourseSchedule = ({roomData}: ICourseScheduleProps) => {
  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {BUTTONS, CourseScheduleDict} = useDictionary(clientKey);

  const [startDateFocus, setStartDateFocus] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [logsChanged, setLogsChanged] = useState(false);
  const [saving, setSaving] = useState(false);
  const [timeIntervalOptions, setTimeIntervalOptions] = useState(timeIntervals());
  const [errors, setErrors] = useState({
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
  });
  const [scheduleData, setScheduleData] = useState<ICourseScheduleFields>({
    startDate: null,
    endDate: null,
    startTime: '',
    endTime: '',
    frequency: '',
    location: '',
    notes: '',
    weekDay: '',
    conferenceCallLink: '',
  });

  useEffect(() => {
    const {
      startDate,
      endDate,
      startTime,
      endTime,
      frequency,
      location,
      notes,
      weekDay,
      conferenceCallLink,
      id,
    } = roomData;
    if (id) {
      setScheduleData({
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        startTime,
        endTime,
        frequency,
        location,
        notes,
        weekDay,
        conferenceCallLink,
      });
      if (!(startDate && endDate && startTime && endTime && frequency && weekDay)) {
        setShowAlert(true);
      }
    }
  }, [roomData]);

  const handleSelection = (value: string, fieldName: string) => {
    let valueNeedsToUpdate = {
      [fieldName]: value,
    };
    if (fieldName === 'frequency' && (value === 'M/W/F' || value === 'Tu/Th')) {
      valueNeedsToUpdate.weekDay = value === 'M/W/F' ? 'Monday' : 'Tuesday';
    }
    setScheduleData((prevData: ICourseScheduleFields) => ({
      ...prevData,
      ...valueNeedsToUpdate,
    }));
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name: string = (event.target as HTMLInputElement).name;
    const value: string = (event.target as HTMLInputElement).value;

    setScheduleData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (date: Date | null, fieldName: string) => {
    setScheduleData((prevData) => ({
      ...prevData,
      [fieldName]: date,
    }));
  };

  const validateForm = async () => {
    const errorMessages: any = {};
    let isValid: boolean = true;
    if (!scheduleData.startDate) {
      errorMessages.startDate =
        CourseScheduleDict[userLanguage]['MESSAGES']['START_DATE'];
      isValid = false;
    }
    if (!scheduleData.endDate) {
      errorMessages.endDate = CourseScheduleDict[userLanguage]['MESSAGES']['END_DATE'];
      isValid = false;
    }
    if (!scheduleData.startTime) {
      errorMessages.startTime =
        CourseScheduleDict[userLanguage]['MESSAGES']['START_TIME'];
      isValid = false;
    }
    if (!scheduleData.endTime) {
      errorMessages.endTime = CourseScheduleDict[userLanguage]['MESSAGES']['END_TIME'];
      isValid = false;
    }
    setErrors(errorMessages);
    return isValid;
  };

  const {name: classRoomName = '', id} = roomData || {};

  const saveRoomDetails = async () => {
    setSaving(true);
    const isValid = await validateForm();
    if (isValid) {
      try {
        const input = {
          id,
          startDate: awsFormatDate(dateString('-', 'WORLD', scheduleData.startDate)),
          endDate: awsFormatDate(dateString('-', 'WORLD', scheduleData.endDate)),
          startTime: moment(scheduleData.startTime, 'h:mm A').format('hh:mm:ss'),
          endTime: moment(scheduleData.endTime, 'h:mm A').format('hh:mm:ss'),
          frequency: scheduleData.frequency,
          // location: scheduleData.location,
          notes: scheduleData.notes,
          weekDay: scheduleData.weekDay,
          // conferenceCallLink: scheduleData.conferenceCallLink,
        };
        const newRoom: any = await API.graphql(
          graphqlOperation(mutation.updateRoom, {input: input})
        );
        setSaving(false);
      } catch (error) {
        setSaving(false);
      }
    }
  };

  const onAlertClose = () => {
    setShowAlert(false);
    setStartDateFocus(true);
  };

  return (
    <div className="p-4">
      {/* <div className="pb-3">
        <span className="font-bold text-lg">
          {classRoomName} {CourseScheduleDict[userLanguage].HEADING}
        </span>
      </div> */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="mt-3">
          <div className="text-lg font-medium mb-4">
            {CourseScheduleDict[userLanguage].HEADING}
          </div>
          <div className="mt-8">
            <div className="flex mt-4">
              <span className="w-auto inline-flex items-center">
                <IoIosCalendar className="w-6 h-6 mr-2" />
              </span>
              <div className="mr-2 w-64 relative">
                <DatePickerInput
                  date={scheduleData.startDate}
                  placeholder={CourseScheduleDict[userLanguage].PLACEHOLDERS.START_DATE}
                  onChange={(date: Date | null) => handleDateChange(date, 'startDate')}
                  focus={startDateFocus}
                />
                <div className="text-xs 2xl:text-base text-red-500">
                  {errors.startDate}
                </div>
              </div>
              <span className="w-auto inline-flex items-center ml-2 mr-4">to</span>
              <div className="mr-2 w-64 relative">
                <DatePickerInput
                  date={scheduleData.endDate}
                  placeholder={CourseScheduleDict[userLanguage].PLACEHOLDERS.END_DATE}
                  minDate={scheduleData.startDate || new Date()}
                  onChange={(date: Date | null) => handleDateChange(date, 'endDate')}
                />
                <div className="text-xs 2xl:text-base text-red-500">{errors.endDate}</div>
              </div>
            </div>
            <div className="flex mt-4">
              <span className="w-auto inline-flex items-center">
                <FiClock className="w-6 h-6 mr-2" />
              </span>
              <div className="mr-2 w-64">
                <Selector
                  onChange={(_: string, name: string) =>
                    handleSelection(name, 'startTime')
                  }
                  selectedItem={scheduleData.startTime}
                  list={timeIntervalOptions}
                  placeholder={CourseScheduleDict[userLanguage].PLACEHOLDERS.START_TIME}
                />
                <div className="text-xs 2xl:text-base text-red-500">
                  {errors.startTime}
                </div>
              </div>
              <span className="w-auto inline-flex items-center ml-2 mr-4">to</span>
              <div className="mr-2 w-64">
                <Selector
                  onChange={(_: string, name: string) => handleSelection(name, 'endTime')}
                  selectedItem={scheduleData.endTime}
                  list={timeIntervalOptions}
                  placeholder={CourseScheduleDict[userLanguage].PLACEHOLDERS.END_TIME}
                />
                <div className="text-xs 2xl:text-base text-red-500">{errors.endTime}</div>
              </div>
            </div>
            <div className="grid grid-cols-1 2xl:grid-cols-2 w-full 2xl:w-148">
              <div className="flex mt-4">
                <span className="w-auto inline-flex items-center">
                  <FiRefreshCw className="w-6 h-6 mr-2" />
                </span>
                <div className="2xl:w-64 w-full mr-2 2xl:mr-0">
                  <Selector
                    onChange={(_: string, name: string) =>
                      handleSelection(name, 'frequency')
                    }
                    selectedItem={scheduleData.frequency}
                    list={frequencyOptions}
                    placeholder={CourseScheduleDict[userLanguage].PLACEHOLDERS.FREQUENCY}
                  />
                </div>
              </div>
              <div className="flex mt-4">
                <span className="w-auto inline-flex items-center">
                  <FaCalendarDay className="w-6 h-6 ml-1 mr-3" />
                </span>
                <div className="2xl:w-64 w-full mr-2 2xl:mr-0">
                  <Selector
                    onChange={(_: string, name: string) =>
                      handleSelection(name, 'weekDay')
                    }
                    selectedItem={scheduleData.weekDay}
                    list={weekdaysOption}
                    placeholder={CourseScheduleDict[userLanguage].PLACEHOLDERS.WEEK_DAY}
                    disabled={
                      scheduleData.frequency === 'M/W/F' ||
                      scheduleData.frequency === 'Tu/Th'
                    }
                  />
                </div>
              </div>
            </div>
            {/* <div className="flex mt-4">
              <span className="w-auto inline-flex items-center">
                <IoGlobeOutline className="w-6 h-6 mr-2" />
              </span>
              <div className="w-full 2xl:w-140 mr-2 2xl:mr-0">
                <FormInput
                  name="conferenceCallLink"
                  value={scheduleData.conferenceCallLink}
                  onChange={handleInputChange}
                  placeHolder={
                    CourseScheduleDict[userLanguage].PLACEHOLDERS.CONFERENCE_CALL_LINK
                  }
                />
              </div>
            </div>
            <div className="flex mt-4">
              <span className="w-auto inline-flex items-center">
                <IoLocation className="w-6 h-6 mr-2" />
              </span>
              <div className="w-full 2xl:w-140 mr-2 2xl:mr-0">
                <FormInput
                  name="location"
                  value={scheduleData.location}
                  onChange={handleInputChange}
                  placeHolder={CourseScheduleDict[userLanguage].PLACEHOLDERS.LOCATION}
                />
              </div>
            </div>
             */}
            <div className="flex mt-4">
              <span className="w-auto inline-flex">
                <CgNotes className="w-6 h-6 mr-2" />
              </span>
              <div className="w-full 2xl:w-140 mr-2 2xl:mr-0">
                <FormInput
                  name="notes"
                  value={scheduleData.notes || ''}
                  onChange={handleInputChange}
                  textarea
                  placeHolder={
                    CourseScheduleDict[userLanguage].PLACEHOLDERS.ADDITIONAL_NOTES
                  }
                  rows={3}
                />
              </div>
            </div>
          </div>
          {/* <div className="flex my-8 justify-end w-full 2xl:w-148 mr-2 2xl:mr-0">
            <Buttons
              btnClass="py-3 px-12 text-sm mr-4"
              label={BUTTONS[userLanguage]['CANCEL']}
              // onClick={history.goBack}
              transparent
            />
            <Buttons
              // disabled={loading}
              btnClass="py-3 px-12 text-sm ml-4"
              label={false ? 'Saving...' : BUTTONS[userLanguage]['SAVE']}
              onClick={saveRoomDetails}
            />
          </div> */}
        </div>
        <div className="mt-3">
          <ClassRoomHolidays logsChanged={logsChanged} setLogsChanged={setLogsChanged} />
        </div>
      </div>
      <UnitPlanner
        roomData={{
          ...roomData,
          ...scheduleData,
          startDate: awsFormatDate(dateString('-', 'WORLD', scheduleData.startDate)),
          endDate: awsFormatDate(dateString('-', 'WORLD', scheduleData.endDate)),
        }}
        saveRoomDetails={saveRoomDetails}
        saving={saving}
        isDetailsComplete={
          scheduleData.startDate &&
          scheduleData.endDate &&
          scheduleData.startTime &&
          scheduleData.endTime &&
          scheduleData.frequency &&
          scheduleData.weekDay
        }
      />
      {/* <div className="flex my-8 justify-end w-full mr-2 2xl:mr-0">
        <Buttons
          btnClass="py-3 px-12 text-sm mr-4"
          label={BUTTONS[userLanguage]['CANCEL']}
          // onClick={history.goBack}
          transparent
        />
        <Buttons
          // disabled={loading}
          btnClass="py-3 px-12 text-sm ml-4"
          label={false ? 'Saving...' : BUTTONS[userLanguage]['SAVE']}
          onClick={saveRoomDetails}
        />
      </div> */}
      {showAlert && (
        <Modal
          showHeader={false}
          showFooter={false}
          closeAction={() => setShowAlert(false)}>
          <div className="py-8 px-16">
            <div className="mx-auto flex items-center justify-center rounded-full">
              <FiAlertCircle className="w-8 h-8" />
            </div>
            <div className="mt-4">Enter classroom details</div>
            <div className="flex justify-center mt-4">
              <Buttons
                btnClass={'abc'}
                label={'Ok'}
                labelClass={'leading-6'}
                onClick={onAlertClose}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CourseSchedule;
