import FormInput from '@atoms/Form/FormInput';
import Label from '@atoms/Form/Label';
import Buttons from '@components/Atoms/Buttons';
import RichTextEditor from '@components/Atoms/RichTextEditor';
import Media from '@components/Community/Components/Media';
import {IFile} from '@components/Community/constants.community';
import {IEventInput} from '@interfaces/Community.interfaces';
import AnimatedContainer from '@uiComponents/Tabs/AnimatedContainer';
import isEmpty from 'lodash/isEmpty';
import React, {useState} from 'react';
import DatePicker from 'react-datepicker';

const Event = ({
  onCancel,
  onSubmit,
}: {
  onCancel: () => void;
  onSubmit: (input: IEventInput) => void;
}) => {
  const [file, setFile] = useState<IFile>();
  const [overlayText, setOverlayText] = useState('');
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const [details, setDetails] = useState({
    startTime: null,
    endTime: null,
    date: null,
    address: '',
  });
  const [error, setError] = useState('');

  const [fields, setFields] = useState<{summary: string; summaryHtml: string}>({
    summary: '',
    summaryHtml: '',
  });

  const onEditorStateChange = (
    html: string,
    text: string,
    fieldHtml: string,
    field: string
  ) => {
    setError('');
    setUnsavedChanges(true);
    setFields({...fields, [field]: text, [fieldHtml]: html});
  };

  const _onSubmit = () => {
    const isValid = validateFields();
    if (isValid) {
      const eventDetails: IEventInput = {
        cardImageLink: file.fileKey,
        summary: fields.summary,
        cardName: overlayText,
        ...details,
      };
      onSubmit(eventDetails);
      onCancel();
    }
  };

  const handleDateChange = (data: any, type: string) => {
    setError('');

    if (type === 'startTime') {
      setDetails({...details, startTime: data});
    } else if (type === 'endTime') {
      setDetails({...details, endTime: data});
    } else if (type === 'date') {
      setDetails({...details, date: data});
    } else {
      setDetails({...details, address: data});
    }
  };

  const validateFields = () => {
    let isValid = true;
    if (isEmpty(file)) {
      setError('Image or video not found');
      isValid = false;
    } else if (!overlayText) {
      setError('Overlay text not found');
      isValid = false;
    } else if (!fields.summary) {
      setError('Description not found');
      isValid = false;
    } else {
      setError('');
      isValid = true;
    }
    return isValid;
  };

  return (
    <div className="min-w-256 max-w-256">
      <Media setError={setError} setFile={setFile} file={file} />

      <div className="px-3 py-4">
        <div>
          <FormInput
            label="Step 2: Add overlay text"
            placeHolder="Overlay text"
            onChange={(e) => {
              setError('');
              setOverlayText(e.target.value);
            }}
            value={overlayText}
          />
        </div>
      </div>
      <div className="px-3 py-4">
        <Label label="Step 3: Add a description" />

        <div>
          <RichTextEditor
            placeholder={
              'Why do you want people in the community to know about the event'
            }
            withStyles
            initialValue={fields.summary}
            onChange={(htmlContent, plainText) =>
              onEditorStateChange(
                htmlContent,
                plainText,
                'descriptionHtml',
                'description'
              )
            }
          />

          <div className="text-right text-gray-400">{fields.summary.length} of 750</div>
        </div>
      </div>
      <div className="px-3 py-4">
        <Label label="Step 4: Provide details about the event" />

        <div className="grid grid-cols-2 mt-4 gap-6">
          <div className="relative event-details-datepicker">
            <Label label="Start Time" />
            <DatePicker
              selected={details.startTime}
              onChange={(date) => handleDateChange(date, 'startTime')}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              placeholderText={'Start Time'}
              isClearable={true}
              dateFormat="h:mm aa"
            />
          </div>
          <div className="relative event-details-datepicker">
            <Label label="Date" />

            <DatePicker
              dateFormat={'dd/MM/yyyy'}
              selected={details.date}
              placeholderText={'Date'}
              onChange={(date: any) => handleDateChange(date, 'date')}
              isClearable={true}
            />
          </div>
          <div className="relative event-details-datepicker">
            <Label label="End Time" />

            <DatePicker
              selected={details.endTime}
              onChange={(date) => handleDateChange(date, 'endTime')}
              showTimeSelect
              showTimeSelectOnly
              placeholderText={'End Time'}
              timeIntervals={15}
              timeCaption="Time"
              isClearable={true}
              dateFormat="h:mm aa"
            />
          </div>
          <div className="relative">
            <FormInput
              label="Address"
              placeHolder="Address"
              onChange={(e) => handleDateChange(e.target.value, 'address')}
              value={details.address}
            />
          </div>
        </div>
      </div>
      <AnimatedContainer show={Boolean(error)}>
        {error && <p className="text-red-500 text-xs">{error}</p>}
      </AnimatedContainer>
      <div className="flex mt-8 justify-center px-6 pb-4">
        <div className="flex justify-end">
          <Buttons
            btnClass="py-1 px-4 text-xs mr-2"
            label={'Cancel'}
            onClick={onCancel}
            transparent
          />
          <Buttons btnClass="py-1 px-8 text-xs ml-2" label={'Save'} onClick={_onSubmit} />
        </div>
      </div>
    </div>
  );
};

export default Event;
