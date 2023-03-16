import FormInput from 'atoms/Form/FormInput';
import Label from 'atoms/Form/Label';
import Buttons from 'atoms/Buttons';
import RichTextEditor from 'atoms/RichTextEditor';
import Media from 'components/Community/Components/Media';
import {COMMUNITY_UPLOAD_KEY, IFile} from 'components/Community/constants.community';
import {ICommunityCardProps, IEventInput} from 'interfaces/Community.interfaces';
import AnimatedContainer from 'uiComponents/Tabs/AnimatedContainer';
import {getImageFromS3Static} from 'utilities/services';
import isEmpty from 'lodash/isEmpty';
import React, {useEffect, useState} from 'react';
import DatePicker from 'react-datepicker';

const Event = ({onCancel, onSubmit, editMode, cardDetails}: ICommunityCardProps) => {
  const [file, setFile] = useState<IFile | any>();
  const [overlayText, setOverlayText] = useState('');
  const [_, setUnsavedChanges] = useState(false);

  const [details, setDetails] = useState({
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
    date: new Date().toISOString(),
    address: ''
  });

  const [error, setError] = useState('');

  const [fields, setFields] = useState<{
    summary: string;
    summaryHtml: string;
  }>({
    summary: editMode && !isEmpty(cardDetails) ? cardDetails?.summary : '',
    summaryHtml: editMode && !isEmpty(cardDetails) ? cardDetails?.summaryHtml || '' : ''
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

  const [tempData, setTempData] = useState<any>(null);

  useEffect(() => {
    if (editMode && !isEmpty(cardDetails)) {
      setTempData({
        image: cardDetails.cardImageLink
      });

      cardDetails?.cardName && setOverlayText(cardDetails?.cardName);

      const info = cardDetails?.additionalInfo?.split(' || ');
      const date = info?.[0] || new Date().toISOString();
      const address = info?.[1] || '';

      setDetails({
        ...details,
        startTime: new Date(cardDetails?.startTime).toISOString(),
        endTime: new Date(cardDetails?.endTime).toISOString(),
        date: new Date(date).toISOString(),
        address: address
      });
    }
  }, [editMode, cardDetails]);

  const [isLoading, setIsLoading] = useState(false);

  const _onSubmit = () => {
    const isValid = validateFields();
    if (isValid) {
      setIsLoading(true);
      let eventDetails: IEventInput = {
        cardImageLink: editMode
          ? file && file?.fileKey
            ? file?.fileKey
            : cardDetails?.cardImageLink
          : file?.fileKey,
        summaryHtml: fields.summaryHtml,
        summary: fields.summary,
        cardName: overlayText,
        startTime: details?.startTime || new Date().toISOString(),
        endTime: details.endTime || new Date().toISOString(),
        additionalInfo: `${details.date} || ${details.address}`,
        id: cardDetails?.id,
        isEditedCard: editMode
      };
      if (!editMode) {
        delete eventDetails.id;
      }
      onSubmit(eventDetails, () => setIsLoading(false));
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
    if (!editMode && isEmpty(file)) {
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
    }
    return isValid;
  };

  return (
    <div className="">
      {tempData && tempData?.image ? (
        <div>
          <Media
            initialImage={getImageFromS3Static(
              COMMUNITY_UPLOAD_KEY +
                (!isEmpty(file) && file?._status === 'success'
                  ? file?.fileKey
                  : tempData?.image)
            )}
            setError={setError}
            setFile={setFile}
            file={file}
          />
        </div>
      ) : (
        <Media
          initialImage={
            !isEmpty(file) && file?._status === 'success'
              ? getImageFromS3Static(COMMUNITY_UPLOAD_KEY + file?.fileKey)
              : ''
          }
          setError={setError}
          setFile={setFile}
          file={file}
        />
      )}

      <div className="px-3 py-4">
        <div>
          <FormInput
            dataCy="event-overlay-input"
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
            rounded
            customStyle
            placeholder={
              'Why do you want people in the community to know about the event'
            }
            initialValue={fields.summary}
            onChange={(htmlContent, plainText) =>
              onEditorStateChange(htmlContent, plainText, 'summaryHtml', 'summary')
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
              // @ts-ignore
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
              // @ts-ignore
              selected={details.date}
              placeholderText={'Date'}
              onChange={(date: any) => handleDateChange(date, 'date')}
              isClearable={true}
            />
          </div>
          <div className="relative event-details-datepicker">
            <Label label="End Time" />

            <DatePicker
              // @ts-ignore
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
        </div>
      </div>

      <AnimatedContainer show={Boolean(error)}>
        {error && <p className="mx-4 text-red-500 text-xs">{error}</p>}
      </AnimatedContainer>
      <div className="flex mt-8 justify-center px-6 pb-4">
        <div className="flex justify-end">
          <Buttons
            btnClass="py-1 px-4 text-xs mr-2"
            label={'Cancel'}
            onClick={onCancel}
            transparent
          />
          <Buttons
            dataCy="save-event-button"
            loading={isLoading}
            btnClass="py-1 px-8 text-xs ml-2"
            disabled={!editMode && isEmpty(file) && file?._status !== 'success'}
            label={'Save'}
            onClick={_onSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default Event;
