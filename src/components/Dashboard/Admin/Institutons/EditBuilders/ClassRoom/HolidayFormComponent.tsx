import React, {useContext, useEffect, useState} from 'react';
import API, {graphqlOperation} from '@aws-amplify/api';

import DatePickerInput from '../../../../../Atoms/Form/DatePickerInput';
import FormInput from '../../../../../Atoms/Form/FormInput';
import Selector from '../../../../../Atoms/Form/Selector';
import Buttons from '../../../../../Atoms/Buttons';
import {GlobalContext} from '../../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../../customHooks/dictionary';

import * as mutation from '../../../../../../graphql/mutations';
import {awsFormatDate, dateString} from '../../../../../../utilities/time';

const durationOptions = [
  {id: 1, name: '.25'},
  {id: 2, name: '.5'},
  {id: 3, name: '.75'},
  {id: 4, name: '1'},
];

const adjustmentOptions = [
  {id: 1, name: 'Push'},
  {id: 2, name: 'Compact'},
];

interface IImpactLog {
  impactDate: Date | null;
  reasonComment: string;
  lessonImpact: string;
  adjustment: string;
}

interface IHolidayFormComponentProps {
  activeIndex: number;
  handleCancel: () => void;
  lessonImpactLogs: {
    impactDate: Date;
    reasonComment: string;
    lessonImpact: number;
    adjustment: string;
  }[];
  postMutation: (data: any) => void;
  roomId: string;
}

const HolidayFormComponent = ({
  activeIndex,
  handleCancel,
  lessonImpactLogs = [],
  postMutation,
  roomId,
}: IHolidayFormComponentProps) => {
  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {BUTTONS} = useDictionary(clientKey);

  const [loading, setLoading] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<IImpactLog>({
    impactDate: null,
    reasonComment: '',
    lessonImpact: '1',
    adjustment: 'Push',
  });
  const [serverSideLog, setServerSideLog] = useState({
    message: '',
    isError: false,
  });
  const [errors, setErrors] = useState({
    impactDate: '',
  });

  useEffect(() => {
    if (activeIndex !== null) {
      if (lessonImpactLogs[activeIndex]) {
        const {impactDate, reasonComment, lessonImpact, adjustment} = lessonImpactLogs[
          activeIndex
        ];
        setFormValues({
          impactDate: impactDate ? new Date(impactDate) : null,
          reasonComment,
          lessonImpact: lessonImpact?.toString(),
          adjustment,
        });
      }
    } else {
      setFormValues({
        impactDate: null,
        reasonComment: '',
        lessonImpact: '1',
        adjustment: 'Push',
      });
    }
  }, [activeIndex, lessonImpactLogs]);

  const handleDateChange = (date: Date | null) => {
    setFormValues((prevData) => ({
      ...prevData,
      impactDate: date,
    }));
  };
  const handleSelection = (value: string, fieldName: string) => {
    setFormValues((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name: string = (event.target as HTMLInputElement).name;
    const value: string = (event.target as HTMLInputElement).value;

    setFormValues((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = async () => {
    const errorMessages: any = {};
    let isValid: boolean = true;
    if (!formValues.impactDate) {
      errorMessages.impactDate = 'Date is required';
      isValid = false;
    }
    setErrors(errorMessages);
    return isValid;
  };

  const handleSubmit = async () => {
    const isValid = await validateForm();
    if (isValid) {
      try {
        setLoading(true);
        const payload = {
          impactDate: awsFormatDate(dateString('-', 'WORLD', formValues.impactDate)),
          reasonComment: formValues.reasonComment,
          lessonImpact: Number(formValues.lessonImpact),
          adjustment: formValues.adjustment,
        };
        const input = {
          id: roomId,
          lessonImpactLog:
            activeIndex !== null
              ? lessonImpactLogs.map((log: any, index: number) =>
                  activeIndex === index ? payload : log
                )
              : [...lessonImpactLogs, payload],
        };
        const result: any = await API.graphql(
          graphqlOperation(mutation.updateRoom, {input: input})
        );
        setLoading(false);
        postMutation(result?.data?.updateRoom.lessonImpactLog);
      } catch (error) {
        setServerSideLog({
          message: 'Error while updating logs',
          isError: true,
        });
      }
    }
  };

  return (
    <div className="min-w-172">
      <div className="w-full m-auto">
        <div className="">
          <div className="grid grid-cols-2">
            <div className="px-3 py-4">
              <label className={'text-gray-700 block text-xs font-semibold leading-5'}>
                Date<span className="text-red-500">*</span>
              </label>
              <DatePickerInput
                date={formValues.impactDate}
                placeholder={'Date'}
                onChange={(date: Date | null) => handleDateChange(date)}
              />
              <div className="text-red-500">{errors.impactDate}</div>
            </div>
            <div className="px-3 py-4">
              <FormInput
                value={formValues.reasonComment}
                onChange={handleInputChange}
                name="reasonComment"
                label={'Reason'}
              />
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="px-3 py-4">
              <Selector
                onChange={(_: string, name: string) =>
                  handleSelection(name, 'lessonImpact')
                }
                selectedItem={formValues.lessonImpact}
                list={durationOptions}
                label={'Time Impact'}
                placeholder={'Select time impact'}
              />
            </div>
            <div className="px-3 py-4">
              <Selector
                onChange={(_: string, name: string) =>
                  handleSelection(name, 'adjustment')
                }
                selectedItem={formValues.adjustment}
                list={adjustmentOptions}
                label={'Adjustment'}
                placeholder={'Select adjustment'}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="py-2 m-auto text-center">
        <p className={`${serverSideLog.isError ? 'text-red-600' : 'text-green-600'}`}>
          {serverSideLog.message}
        </p>
      </div>
      <div className="flex my-8 justify-center">
        <Buttons
          btnClass="py-3 px-10 mr-4"
          label={BUTTONS[userLanguage]['CANCEL']}
          onClick={handleCancel}
          transparent
        />
        <Buttons
          btnClass="py-3 px-10 ml-4"
          label={BUTTONS[userLanguage]['SAVE']}
          onClick={handleSubmit}
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default HolidayFormComponent;
