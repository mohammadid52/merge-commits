import Buttons from '@atoms/Buttons';
import FormInput from '@atoms/Form/FormInput';
import Label from '@atoms/Form/Label';
import RichTextEditor from '@atoms/RichTextEditor';
import Media from '@components/Community/Components/Media';
import {IFile} from '@components/Community/constants.community';
import {ICheckItOutInput} from '@interfaces/Community.interfaces';
import AnimatedContainer from '@uiComponents/Tabs/AnimatedContainer';
import isEmpty from 'lodash/isEmpty';
import React, {useState} from 'react';

const CheckItOut = ({
  onCancel,
  onSubmit,
}: {
  onCancel: () => void;
  onSubmit: (input: ICheckItOutInput) => void;
}) => {
  const [file, setFile] = useState<IFile>();
  const [overlayText, setOverlayText] = useState('');
  const [unsavedChanges, setUnsavedChanges] = useState(false);

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
      const checkItOutDetails: ICheckItOutInput = {
        cardImageLink: file.fileKey,
        summary: fields.summary,
        cardName: overlayText,
      };
      onSubmit(checkItOutDetails);
      onCancel();
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
              'What do you want people in the community to check out this video or image you uploaded?'
            }
            withStyles
            initialValue={fields.summary}
            onChange={(htmlContent, plainText) =>
              onEditorStateChange(htmlContent, plainText, 'summaryHtml', 'summary')
            }
          />

          <div className="text-right text-gray-400">{fields.summary.length} of 750</div>
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

export default CheckItOut;
