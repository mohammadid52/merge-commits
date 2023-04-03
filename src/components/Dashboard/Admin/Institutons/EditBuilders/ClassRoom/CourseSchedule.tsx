import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {CgNotes} from 'react-icons/cg';
import {FaCalendarDay} from 'react-icons/fa';
import {FiAlertCircle, FiClock, FiRefreshCw} from 'react-icons/fi';
import dayJs from 'dayjs';
import * as customQueries from 'customGraphql/customQueries';
import * as mutation from 'graphql/mutations';

import Buttons from 'atoms/Buttons';
import FormInput from 'atoms/Form/FormInput';
import Selector from 'atoms/Form/Selector';
import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import {frequencyOptions, weekdaysOption} from 'utilities/staticData';
import {awsFormatDate, dateString, timeIntervals} from 'utilities/time';

import ClassRoomHolidays, {IImpactLog} from './ClassRoomHolidays';
import UnitPlanner from './UnitPlanner/UnitPlanner';

import {DatePicker, Divider} from 'antd';
import Modal from 'atoms/Modal';
import SectionTitleV3 from '@components/Atoms/SectionTitleV3';
import PageLayout from 'layout/PageLayout';

interface ICourseScheduleProps {
  roomData: any;
}

interface ICourseScheduleFields {
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
  const {userLanguage} = useGlobalContext();
  const {CourseScheduleDict} = useDictionary();

  const [_, setStartDateFocus] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [logsChanged, setLogsChanged] = useState(false);
  const [saving, setSaving] = useState(false);
  const [logsLoading, setLogsLoading] = useState(false);
  const [lessonImpactLogs, setLessonImpactLogs] = useState<IImpactLog[]>([]);
  const [timeIntervalOptions] = useState(timeIntervals());
  const [errors, setErrors] = useState({
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: ''
  });
  const [scheduleData, setScheduleData] = useState<ICourseScheduleFields>({
    startDate: new Date(),
    endDate: new Date(),
    startTime: '',
    endTime: '',
    frequency: 'One Time',
    location: '',
    notes: '',
    weekDay: '',
    conferenceCallLink: ''
  });

  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [serverMessage, setServerMessage] = useState({
    message: '',
    isError: false
  });

  useEffect(() => {
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
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        startTime: startTime
          ? moment(startTime, 'HH:mm:ss').format('h:mm A')
          : new Date().toISOString(),
        endTime: endTime
          ? moment(endTime, 'HH:mm:ss').format('h:mm A')
          : new Date().toISOString(),
        frequency: frequency || 'One Time',
        location,
        notes,
        weekDay,
        conferenceCallLink
      });
      if (!(startDate && endDate && startTime && endTime && frequency && weekDay)) {
        setShowAlert(true);
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
        graphqlOperation(customQueries.getRoomLessonImpactLogs, {
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

  const handleDateChange = (dateString: any, fieldName: string) => {
    setScheduleData((prevData) => ({
      ...prevData,
      [fieldName]: dateString
    }));
    setUnsavedChanges(true);
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

  const {id} = roomData || {};

  const saveRoomDetails = async () => {
    setSaving(true);
    const isValid = await validateForm();
    if (isValid) {
      try {
        const input = {
          id,
          startDate: awsFormatDate(
            dateString('-', 'WORLD', scheduleData?.startDate || new Date())
          ),
          endDate: awsFormatDate(
            dateString('-', 'WORLD', scheduleData?.endDate || new Date())
          ),
          startTime: moment(scheduleData.startTime, 'h:mm A').format('HH:mm:ss'),
          endTime: moment(scheduleData.endTime, 'h:mm A').format('HH:mm:ss'),
          frequency: scheduleData.frequency,
          // location: scheduleData.location,
          notes: scheduleData.notes,
          weekDay: scheduleData.weekDay
          // conferenceCallLink: scheduleData.conferenceCallLink,
        };
        await API.graphql(graphqlOperation(mutation.updateRoom, {input: input}));
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

  const onAlertClose = () => {
    setShowAlert(false);
    setStartDateFocus(true);
  };

  return (
    <div className="">
      <PageLayout type="inner" title={CourseScheduleDict[userLanguage].HEADING}>
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 mb-8">
          <div className="">
            <div className="">
              <div className="flex mt-4">
                <DatePicker
                  defaultValue={dayJs(scheduleData.startDate)}
                  placeholder={CourseScheduleDict[userLanguage].PLACEHOLDERS.START_DATE}
                  onChange={(_, dateString: string) =>
                    handleDateChange(dateString, 'startDate')
                  }
                />

                <div className="text-xs 2xl:text-base text-red-500">
                  {errors.startDate}
                </div>

                <span className="w-auto inline-flex items-center ml-2 mr-4">to</span>

                <DatePicker
                  defaultValue={dayJs(scheduleData.endDate)}
                  placeholder={CourseScheduleDict[userLanguage].PLACEHOLDERS.END_DATE}
                  onChange={(_, dateString: string) =>
                    handleDateChange(dateString, 'startDate')
                  }
                />
                <div className="text-xs 2xl:text-base text-red-500">{errors.endDate}</div>
              </div>
              <div className="flex mt-4">
                <span className="w-auto inline-flex items-center">
                  <FiClock className="w-6 h-6 mr-2" />
                </span>
                <div className="mr-2 w-64">
                  <Selector
                    onChange={(name: string) => handleSelection(name, 'startTime')}
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
                    onChange={(name: string) => handleSelection(name, 'endTime')}
                    selectedItem={scheduleData.endTime}
                    list={timeIntervalOptions}
                    placeholder={CourseScheduleDict[userLanguage].PLACEHOLDERS.END_TIME}
                  />
                  <div className="text-xs 2xl:text-base text-red-500">
                    {errors.endTime}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 2xl:grid-cols-2 w-full 2xl:w-148">
                <div className="flex mt-4">
                  <span className="w-auto inline-flex items-center">
                    <FiRefreshCw className="w-6 h-6 mr-2" />
                  </span>
                  <div className="2xl:w-64 w-full mr-2 2xl:mr-0">
                    <Selector
                      onChange={(name: string) => handleSelection(name, 'frequency')}
                      selectedItem={scheduleData.frequency}
                      list={frequencyOptions}
                      placeholder={
                        CourseScheduleDict[userLanguage].PLACEHOLDERS.FREQUENCY
                      }
                    />
                  </div>
                </div>
                <div className="flex mt-4">
                  <span className="w-auto inline-flex items-center">
                    <FaCalendarDay className="w-6 h-6 ml-1 mr-3" />
                  </span>
                  <div className="2xl:w-64 w-full mr-2 2xl:mr-0">
                    <Selector
                      onChange={(name: string) => handleSelection(name, 'weekDay')}
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
          </div>
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

        <Divider />

        <UnitPlanner
          lessonImpactLogs={lessonImpactLogs}
          logsChanged={logsChanged || unsavedChanges}
          setLogsChanged={setLogsChanged}
          roomData={{
            ...roomData,
            ...scheduleData,
            startDate: awsFormatDate(
              dateString('-', 'WORLD', scheduleData?.startDate || new Date())
            ),
            endDate: awsFormatDate(
              dateString('-', 'WORLD', scheduleData?.endDate || new Date())
            )
          }}
          saveRoomDetails={saveRoomDetails}
          saving={saving}
          isDetailsComplete={Boolean(
            scheduleData.startDate &&
              scheduleData.endDate &&
              scheduleData.startTime &&
              scheduleData.endTime &&
              scheduleData.frequency &&
              scheduleData.weekDay
          )}
        />
      </PageLayout>

      {serverMessage.message && (
        <div className="py-2 m-auto text-center">
          <p className={`${serverMessage.isError ? 'text-red-600' : 'text-green-600'}`}>
            {serverMessage.message}
          </p>
        </div>
      )}

      <Modal
        open={showAlert}
        showHeader={false}
        showFooter={false}
        closeAction={() => setShowAlert(false)}>
        <div className="py-8 px-16">
          <div className="mx-auto flex items-center justify-center rounded-full">
            <FiAlertCircle className="w-8 h-8" />
          </div>
          <div className="mt-4">Enter schedule details</div>
          <div className="flex justify-center mt-4">
            <Buttons label={'Ok'} onClick={onAlertClose} />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CourseSchedule;
