import React, {useContext, useState} from 'react';
import DatePickerInput from '../../../../../Atoms/Form/DatePickerInput';
import FormInput from '../../../../../Atoms/Form/FormInput';
import Selector from '../../../../../Atoms/Form/Selector';
import Buttons from '../../../../../Atoms/Buttons';
import {GlobalContext} from '../../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../../customHooks/dictionary';

const durationOptions = [
  {id: 1, name: '1'},
  {id: 2, name: '2'},
  {id: 3, name: '3'},
  {id: 4, name: '4'},
];

const adjustmentOptions = [
  {id: 1, name: 'Push'},
  {id: 2, name: 'Compact'},
];

const HolidayFormComponent = () => {
  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {BUTTONS} = useDictionary(clientKey);

  const [formValues, setFormValues] = useState({
    date: null,
    reason: '',
    duration: '1',
    adjustment: '',
  });

  const handleDateChange = (date: Date | null) => {
    setFormValues((prevData) => ({
      ...prevData,
      date,
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

  return (
    <div className="min-w-172">
      <div className="w-full m-auto">
        <div className="">
          <div className="grid grid-cols-2">
            <div className="px-3 py-4">
              <label className={'text-gray-700 block text-xs font-semibold leading-5'}>
                Date
              </label>
              <DatePickerInput
                date={formValues.date}
                placeholder={'Date'}
                onChange={(date: Date | null) => handleDateChange(date)}
              />
            </div>
            <div className="px-3 py-4">
              <FormInput
                value={formValues.reason}
                onChange={handleInputChange}
                name="reason"
                label={'Reason'}
                isRequired
              />
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="px-3 py-4">
              <Selector
                onChange={(_: string, name: string) => handleSelection(name, 'duration')}
                selectedItem={formValues.duration}
                list={durationOptions}
                label={'Duration'}
                placeholder={'Select duration'}
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
      <div className="flex my-8 justify-center">
        <Buttons
          btnClass="py-3 px-10 mr-4"
          label={BUTTONS[userLanguage]['CANCEL']}
          onClick={() => console.log()}
          transparent
        />
        <Buttons
          btnClass="py-3 px-10 ml-4"
          label={BUTTONS[userLanguage]['SAVE']}
          onClick={() => console.log()}
          // disabled={loading}
        />
      </div>
    </div>
  );
};

export default HolidayFormComponent;
