import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import React, {useEffect, useState} from 'react';

import Buttons from 'atoms/Buttons';
import FormInput from 'atoms/Form/FormInput';
import Selector from 'atoms/Form/Selector';
import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';

import Label from '@components/Atoms/Form/Label';
import {DatePicker} from 'antd';
import dayJs from 'dayjs';
import * as mutation from 'graphql/mutations';
import {awsFormatDate, dateString} from 'utilities/time';
const durationOptions = [
  {id: 1, label: '.25', value: '.25'},
  {id: 2, label: '.5', value: '.5'},
  {id: 3, label: '.75', value: '.75'},
  {id: 4, label: '1', value: '1'}
];

const adjustmentOptions = [
  {id: 1, label: 'Push', value: 'Push'},
  {id: 2, label: 'Compact', value: 'Compact'}
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
  roomId
}: IHolidayFormComponentProps) => {
  const {userLanguage} = useGlobalContext();
  const {BUTTONS} = useDictionary();

  const [loading, setLoading] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<IImpactLog>({
    impactDate: new Date(),
    reasonComment: '',
    lessonImpact: '1',
    adjustment: 'Push'
  });
  const [serverSideLog, setServerSideLog] = useState({
    message: '',
    isError: false
  });
  const [errors, setErrors] = useState({
    impactDate: ''
  });

  useEffect(() => {
    if (activeIndex !== null) {
      if (lessonImpactLogs[activeIndex]) {
        const {impactDate, reasonComment, lessonImpact, adjustment} =
          lessonImpactLogs[activeIndex];
        setFormValues({
          impactDate: impactDate ? new Date(impactDate) : null,
          reasonComment,
          lessonImpact: lessonImpact?.toString(),
          adjustment
        });
      }
    } else {
      setFormValues({
        impactDate: null,
        reasonComment: '',
        lessonImpact: '1',
        adjustment: 'Push'
      });
    }
  }, [activeIndex, lessonImpactLogs]);

  const handleDateChange = (date: Date | null) => {
    setFormValues((prevData) => ({
      ...prevData,
      impactDate: date
    }));
  };
  const handleSelection = (value: string, fieldName: string) => {
    setFormValues((prevData) => ({
      ...prevData,
      [fieldName]: value
    }));
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name: string = (event.target as HTMLInputElement).name;
    const value: string = (event.target as HTMLInputElement).value;

    setFormValues((prevData) => ({
      ...prevData,
      [name]: value
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
          impactDate: awsFormatDate(
            dateString('-', 'WORLD', formValues?.impactDate || new Date())
          ),
          reasonComment: formValues.reasonComment,
          lessonImpact: Number(formValues.lessonImpact),
          adjustment: formValues.adjustment
        };
        const input = {
          id: roomId,
          lessonImpactLog:
            activeIndex !== null
              ? lessonImpactLogs.map((log: any, index: number) =>
                  activeIndex === index ? payload : log
                )
              : [...lessonImpactLogs, payload]
        };
        const result: any = await API.graphql(
          graphqlOperation(mutation.updateRoom, {input: input})
        );
        setLoading(false);
        postMutation(result?.data?.updateRoom.lessonImpactLog);
      } catch (error) {
        setServerSideLog({
          message: 'Error while updating logs',
          isError: true
        });
      }
    }
  };

  return (
    <div className="">
      <div className="grid grid-cols-2">
        <div className="px-3 py-4 flex flex-col">
          <Label isRequired label={'Date'} />

          <DatePicker
            defaultValue={dayJs(formValues.impactDate)}
            placeholder={'Date'}
            // @ts-ignore
            onChange={(value) => handleDateChange(value?.$d)}
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
            onChange={(name: string) => handleSelection(name, 'lessonImpact')}
            selectedItem={formValues.lessonImpact}
            list={durationOptions}
            label={'Time Impact'}
            placeholder={'Select time impact'}
          />
        </div>
        <div className="px-3 py-4">
          <Selector
            onChange={(name: string) => handleSelection(name, 'adjustment')}
            selectedItem={formValues.adjustment}
            list={adjustmentOptions}
            label={'Adjustment'}
            placeholder={'Select adjustment'}
          />
        </div>
      </div>

      <div className="py-2 m-auto text-center">
        <p className={`${serverSideLog.isError ? 'text-red-600' : 'text-green-600'}`}>
          {serverSideLog.message}
        </p>
      </div>
      <div className="flex my-8 gap-4 justify-end">
        <Buttons
          label={BUTTONS[userLanguage]['CANCEL']}
          onClick={handleCancel}
          transparent
          size="middle"
        />
        <Buttons
          label={BUTTONS[userLanguage]['SAVE']}
          onClick={handleSubmit}
          disabled={loading}
          size="middle"
        />
      </div>
    </div>
  );
};

export default HolidayFormComponent;
