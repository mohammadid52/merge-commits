import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {getRoomLessonImpactLogs} from 'customGraphql/customQueries';
import dayJs from 'dayjs';
import {updateRoom} from 'graphql/mutations';
import moment from 'moment';
import React, {useCallback, useEffect, useState} from 'react';

import FormInput from 'atoms/Form/FormInput';
import Selector from 'atoms/Form/Selector';
import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import {frequencyOptions, weekdaysOption} from 'utilities/staticData';
import {awsFormatDate, dateString} from 'utilities/time';

import ClassRoomHolidays, {IImpactLog} from './ClassRoomHolidays';
import UnitPlanner from './UnitPlanner/UnitPlanner';

import Label from '@components/Atoms/Form/Label';
import Loader from '@components/Atoms/Loader';
import {DATE_FORMAT, DATE_TIME_FORMAT, TIME_FORMAT} from '__constants';
import {DatePicker, Divider, message} from 'antd';
import PageLayout from 'layout/PageLayout';
import ErrorBoundary from '@components/Error/ErrorBoundary';

const getDate = (date: any, format = DATE_FORMAT) =>
  dayJs(date).format(format).toString();

const getTime = (time: any, format = TIME_FORMAT) =>
  dayJs(`${dayJs().format(DATE_FORMAT)} ${time}`)
    .format(format)
    .toString();

interface ICourseScheduleProps {
  roomData: any;
}

interface ICourseScheduleFields {
  startDate: string | null;
  endDate: string | null;
  startTime: string;
  endTime: string;
  frequency: string;
  location: string;
  notes: string;
  weekDay: string;
  conferenceCallLink: string;
}

const {RangePicker} = DatePicker;

const DEFAULT_TIME = dayJs().format(TIME_FORMAT).toString();

const CourseSchedule = ({roomData}: ICourseScheduleProps) => {
  const {userLanguage} = useGlobalContext();
  const {CourseScheduleDict} = useDictionary();

  const [logsChanged, setLogsChanged] = useState(false);
  const [saving, setSaving] = useState(false);
  const [logsLoading, setLogsLoading] = useState(false);
  const [lessonImpactLogs, setLessonImpactLogs] = useState<IImpactLog[]>([]);

  const [scheduleData, setScheduleData] = useState<ICourseScheduleFields>({
    startDate: new Date().toString(),
    endDate: new Date().toString(),
    startTime: DEFAULT_TIME,
    endTime: DEFAULT_TIME,
    frequency: 'One Time',
    location: '',
    notes: '',
    weekDay: '',
    conferenceCallLink: ''
  });
  console.log(
    '🚀 ~ file: CourseSchedule.tsx:73 ~ CourseSchedule ~ scheduleData:',
    scheduleData
  );

  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [serverMessage, setServerMessage] = useState({
    message: '',
    isError: false
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (roomData) {
      const {
        startDate,
        endDate,
        startTime = '',
        endTime = '',
        frequency = 'One Time',
        location,
        notes,
        weekDay,
        conferenceCallLink,
        id
      } = roomData;
      if (id) {
        setScheduleData({
          startDate: startDate
            ? getDate(startDate)
            : dayJs(new Date()).format(DATE_FORMAT).toString(),
          endDate: endDate ? getDate(endDate) : dayJs().format(DATE_FORMAT).toString(),
          startTime: startTime ? getTime(startTime) : DEFAULT_TIME,
          endTime: endTime ? getTime(endTime) : DEFAULT_TIME,

          frequency: frequency || 'One Time',
          location,
          notes,
          weekDay,
          conferenceCallLink
        });
        setIsLoading(false);
      }
    }
  }, [roomData]);

  const sortLogsByDate = (data: IImpactLog[], order: string = 'asc') => {
    return data
      ? data.sort((a: IImpactLog, b: IImpactLog) =>
          order === 'asc'
            ? +new Date(a.impactDate) - +new Date(b.impactDate)
            : +new Date(b.impactDate) - +new Date(a.impactDate)
        )
      : [];
  };

  useEffect(() => {
    if (roomData.id) {
      getImpactLogs();
    }
  }, [roomData.id]);

  const getImpactLogs = async () => {
    try {
      setLogsLoading(true);
      const result: any = await API.graphql(
        graphqlOperation(getRoomLessonImpactLogs, {
          id: roomData.id
        })
      );

      setLessonImpactLogs(sortLogsByDate(result?.data?.getRoom.lessonImpactLog));
      setLogsLoading(false);
    } catch (error) {
      setLessonImpactLogs([]);
      setLogsLoading(false);
    }
  };

  const handleSelection = (value: string, fieldName: string) => {
    setUnsavedChanges(true);
    let valueNeedsToUpdate = {
      [fieldName]: value
    };
    if (fieldName === 'frequency' && (value === 'M/W/F' || value === 'Tu/Th')) {
      valueNeedsToUpdate.weekDay = value === 'M/W/F' ? 'Monday' : 'Tuesday';
    }
    setScheduleData((prevData: ICourseScheduleFields) => ({
      ...prevData,
      ...valueNeedsToUpdate
    }));
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name: string = (event.target as HTMLInputElement).name;
    const value: string = (event.target as HTMLInputElement).value;

    setScheduleData((prevData) => ({
      ...prevData,
      [name]: value
    }));
    setUnsavedChanges(true);
  };

  const handleDateChange = (dateString: dayJs.Dayjs, start: boolean) => {
    let [date, time] = dayJs(dateString).format(DATE_TIME_FORMAT).split(' ');

    if (start) {
      setScheduleData((prevData) => ({
        ...prevData,
        startDate: date,
        startTime: time
      }));
    } else {
      setScheduleData((prevData) => ({
        ...prevData,
        endDate: date,
        endTime: time
      }));
    }
    setUnsavedChanges(true);
  };

  const [messageApi, contextHolder] = message.useMessage();

  const validateForm = async () => {
    const errorMessages: any = {};
    let isValid: boolean = true;
    if (!scheduleData.startDate) {
      errorMessages.startDate =
        CourseScheduleDict[userLanguage]['MESSAGES']['START_DATE'];
      isValid = false;
      messageApi.error(errorMessages.startDate);
    }
    if (!scheduleData.endDate) {
      errorMessages.endDate = CourseScheduleDict[userLanguage]['MESSAGES']['END_DATE'];
      isValid = false;
      messageApi.error(errorMessages.endDate);
    }
    if (!scheduleData.startTime) {
      errorMessages.startTime =
        CourseScheduleDict[userLanguage]['MESSAGES']['START_TIME'];
      isValid = false;
      messageApi.error(errorMessages.startTime);
    }
    if (!scheduleData.endTime) {
      errorMessages.endTime = CourseScheduleDict[userLanguage]['MESSAGES']['END_TIME'];
      isValid = false;
      messageApi.error(errorMessages.endTime);
    }

    return isValid;
  };

  const {id} = roomData || {};

  const saveRoomDetails = async () => {
    setSaving(true);
    const isValid = await validateForm();

    if (isValid) {
      try {
        const input = {
          id,
          startDate: awsFormatDate(
            dateString(
              '-',
              'WORLD',
              dayJs(scheduleData?.startDate).toDate() || new Date()
            )
          ),
          endDate: awsFormatDate(
            dateString('-', 'WORLD', dayJs(scheduleData?.endDate).toDate() || new Date())
          ),
          startTime: moment(scheduleData.startTime, 'h:mm A').format('HH:mm:ss'),
          endTime: moment(scheduleData.endTime, 'h:mm A').format('HH:mm:ss'),
          frequency: scheduleData.frequency,
          // location: scheduleData.location,
          notes: scheduleData.notes,
          weekDay: scheduleData.weekDay
          // conferenceCallLink: scheduleData.conferenceCallLink,
        };
        await API.graphql(graphqlOperation(updateRoom, {input: input}));
        setServerMessage({
          message: CourseScheduleDict[userLanguage]['MESSAGES']['SUCCESS_MESSAGE'],
          isError: false
        });
        setTimeout(() => {
          setServerMessage({
            message: '',
            isError: false
          });
        }, 4000);
        setUnsavedChanges(false);
        setSaving(false);
      } catch (error) {
        setSaving(false);
      }
    }
  };

  const getDateFormatted = useCallback((date: string | null, time: string) => {
    const [hours, minutes] = time.split(':');
    if (date) {
      const updatedDate = dayJs(date)
        .set('hour', Number(hours))
        .set('minute', Number(minutes));

      return updatedDate;
    }
    return dayJs();
  }, []);

  const startDateTime = getDateFormatted(scheduleData.startDate, scheduleData.startTime);

  const endDateTime = getDateFormatted(scheduleData.endDate, scheduleData.endTime);

  return (
    <ErrorBoundary componentName="CourseSchedule">
      <div className="">
        {contextHolder}
        <PageLayout type="inner" title={CourseScheduleDict[userLanguage].HEADING}>
          {isLoading ? (
            <div className="min-h-56 flex items-center justify-center">
              <Loader />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="col-span-2">
                <Label label="Start and End Date/Time" />
                <RangePicker
                  className="w-full"
                  showTime
                  size="large"
                  format={DATE_TIME_FORMAT}
                  value={[
                    startDateTime.isValid() ? startDateTime : null,
                    endDateTime.isValid() ? endDateTime : null
                  ]}
                  onChange={(dateString: any) => {
                    if (dateString !== null) {
                      handleDateChange(dateString[0], true);
                      handleDateChange(dateString[1], false);
                    }
                  }}
                />
              </div>

              <div className="col-span-2 ">
                <div className="grid grid-cols-2 gap-4">
                  <div className="">
                    <Label label="Frequency" />

                    <Selector
                      onChange={(name: string) => handleSelection(name, 'frequency')}
                      selectedItem={scheduleData.frequency}
                      list={frequencyOptions}
                      placeholder={
                        CourseScheduleDict[userLanguage].PLACEHOLDERS.FREQUENCY
                      }
                    />
                  </div>

                  <div className="">
                    <Label label="Weekday" />
                    <Selector
                      onChange={(name: string) => handleSelection(name, 'weekDay')}
                      selectedItem={scheduleData.weekDay}
                      list={weekdaysOption}
                      placeholder={CourseScheduleDict[userLanguage].PLACEHOLDERS.WEEK_DAY}
                      disabled={
                        scheduleData.frequency === 'M/W/F' ||
                        scheduleData.frequency === 'Tu/Th' ||
                        scheduleData.frequency === 'Daily'
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-2">
                <div className="">
                  <Label label="Additional Notes" />
                  <FormInput
                    name="notes"
                    value={scheduleData.notes || ''}
                    onChange={handleInputChange}
                    placeHolder={
                      CourseScheduleDict[userLanguage].PLACEHOLDERS.ADDITIONAL_NOTES
                    }
                  />
                </div>
              </div>
            </div>
          )}

          <div
            className={`flex flex-col-reverdsse flex-col w-full ${
              lessonImpactLogs.length > 0 ? '' : ''
            }`}>
            <UnitPlanner
              lessonImpactLogs={lessonImpactLogs}
              logsChanged={logsChanged || unsavedChanges}
              setLogsChanged={setLogsChanged}
              roomData={{
                ...roomData,
                ...scheduleData,
                startDate: awsFormatDate(
                  dateString(
                    '-',
                    'WORLD',
                    dayJs(scheduleData?.startDate).toDate() || new Date()
                  )
                ),
                endDate: awsFormatDate(
                  dateString(
                    '-',
                    'WORLD',
                    dayJs(scheduleData?.endDate).toDate() || new Date()
                  )
                )
              }}
              saveRoomDetails={saveRoomDetails}
              saving={saving}
              isDetailsComplete={Boolean(
                scheduleData.startDate && scheduleData.endDate && scheduleData.frequency
              )}
            />
            <Divider />

            <div className="mt-3">
              <ClassRoomHolidays
                lessonImpactLogs={lessonImpactLogs}
                logsLoading={logsLoading}
                setLessonImpactLogs={setLessonImpactLogs}
                setLogsChanged={setLogsChanged}
                sortLogsByDate={sortLogsByDate}
              />
            </div>
          </div>
        </PageLayout>

        {serverMessage.message && (
          <div className="py-2 m-auto text-center">
            <p className={`${serverMessage.isError ? 'text-red-600' : 'text-green-600'}`}>
              {serverMessage.message}
            </p>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default CourseSchedule;
