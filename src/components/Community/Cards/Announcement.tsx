import FormInput from '@atoms/Form/FormInput';
import Buttons from '@components/Atoms/Buttons';
import Label from '@components/Atoms/Form/Label';
import RichTextEditor from '@components/Atoms/RichTextEditor';
import Media from '@components/Community/Components/Media';
import {IFile} from '@components/Community/constants.community';
import AnimatedContainer from '@uiComponents/Tabs/AnimatedContainer';
import isEmpty from 'lodash/isEmpty';
import React, {useState} from 'react';

const Announcements = ({onCancel, onSubmit}: {onCancel: () => void; onSubmit: any}) => {
  const [file, setFile] = useState<IFile>();
  const [overlayText, setOverlayText] = useState('');
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [fields, setFields] = useState<{summary: string; summaryHtml: string}>({
    summary: '',
    summaryHtml: '',
  });

  const [error, setError] = useState('');

  const onEditorStateChange = (
    html: string,
    text: string,
    fieldHtml: string,
    field: string
  ) => {
    setUnsavedChanges(true);
    setError('');
    setFields({...fields, [field]: text, [fieldHtml]: html});
  };

  const _onSubmit = () => {
    const isValid = validateFields();
    if (isValid) {
      const announcementsDetails = {
        cardImageLink: file.fileKey,
        summary: fields.summary,
        cardName: overlayText,
      };
      onSubmit(announcementsDetails);
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
      setError('Please add description');
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
            onChange={(e) => {
              setError('');
              setOverlayText(e.target.value);
            }}
            placeHolder={'Overlay Text'}
            value={overlayText}
          />
        </div>
      </div>
      <div className="px-3 py-4">
        <Label label="Step 3: Add a description" />

        <div>
          <RichTextEditor
            placeholder={
              'Why do you want people in the community to know about what is happening'
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

export default Announcements;
