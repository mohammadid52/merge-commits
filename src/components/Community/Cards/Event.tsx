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
import {DatePicker} from 'antd';

import type {DatePickerProps, RangePickerProps} from 'antd/es/date-picker';

const {RangePicker} = DatePicker;

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

  const onChange = (value: DatePickerProps['value'] | RangePickerProps['value']) => {
    // @ts-ignore
    const startTime = value?.[0]?.$d as Date;
    // @ts-ignore
    const endTime = value?.[1]?.$d as Date;
    setDetails({
      ...details,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString()
    });
  };

  const onOk = (value: DatePickerProps['value'] | RangePickerProps['value']) => {
    console.log('onOk: ', value);
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

          <div className="text-right text-light ">{fields.summary.length} of 750</div>
        </div>
      </div>

      <div className="px-3 py-4">
        <Label label="Step 4: Provide details about the event" />

        <RangePicker
          className="w-full"
          showTime={{format: 'HH:mm'}}
          format="YYYY-MM-DD HH:mm"
          onChange={onChange}
          onOk={onOk}
        />
      </div>

      <AnimatedContainer show={Boolean(error)}>
        {error && <p className="mx-4 text-red-500 text-xs">{error}</p>}
      </AnimatedContainer>
      <div className="flex mt-8 justify-center px-6 pb-4">
        <div className="flex justify-end gap-4">
          <Buttons label={'Cancel'} onClick={onCancel} transparent />
          <Buttons
            dataCy="save-event-button"
            loading={isLoading}
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
