import Buttons from '@atoms/Buttons';
import FormInput from '@atoms/Form/FormInput';
import Label from '@atoms/Form/Label';
import RichTextEditor from '@atoms/RichTextEditor';
import Media from '@components/Community/Components/Media';
import {COMMUNITY_UPLOAD_KEY, IFile} from '@components/Community/constants.community';
import CustomRichTextEditor from '@components/Lesson/UniversalLessonBlockComponents/Blocks/HighlighterBlock/CustomRichTextEditor';
import {ICheckItOutInput, ICommunityCardProps} from '@interfaces/Community.interfaces';
import AnimatedContainer from '@uiComponents/Tabs/AnimatedContainer';
import {getImageFromS3Static} from '@utilities/services';
import isEmpty from 'lodash/isEmpty';
import React, {useEffect, useState} from 'react';

const CheckItOut = ({onCancel, onSubmit, editMode, cardDetails}: ICommunityCardProps) => {
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
      let checkItOutDetails: ICheckItOutInput = {
        cardImageLink: editMode
          ? !isEmpty(file) && file?.fileKey
            ? file?.fileKey
            : cardDetails?.cardImageLink
          : file?.fileKey,
        summary: fields.summary,
        id: cardDetails?.id,
        isEditedCard: editMode,
        summaryHtml: fields.summaryHtml,
        cardName: overlayText,
      };
      if (!editMode) {
        delete checkItOutDetails.id;
      }
      onSubmit(checkItOutDetails);
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
      isValid = true;
    }
    return isValid;
  };

  const [tempData, setTempData] = useState(null);

  useEffect(() => {
    if (editMode && !isEmpty(cardDetails)) {
      setTempData({
        image: cardDetails.cardImageLink,
      });

      setOverlayText(cardDetails?.cardName);

      setFields({
        ...fields,
        summary: cardDetails?.summary || '',
        summaryHtml: cardDetails?.summaryHtml || '',
      });
    }
  }, [editMode, cardDetails]);

  return (
    <div className="min-w-256 max-w-256">
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
              : null
          }
          setError={setError}
          setFile={setFile}
          file={file}
        />
      )}

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
          <CustomRichTextEditor
            placeholder={
              'What do you want people in the community to check out this video or image you uploaded?'
            }
            withStyles
            rounded
            customStyle
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
