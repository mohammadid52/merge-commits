import Buttons from 'atoms/Buttons';
import FormInput from 'atoms/Form/FormInput';
import Label from 'atoms/Form/Label';
import RichTextEditor from 'atoms/RichTextEditor';
import Media from 'components/Community/Components/Media';
import {COMMUNITY_UPLOAD_KEY, IFile} from 'components/Community/constants.community';
import {REGEX} from 'components/Lesson/UniversalLessonBuilder/UI/common/constants';
import {ICheckItOutInput, ICommunityCardProps} from 'interfaces/Community.interfaces';
import isEmpty from 'lodash/isEmpty';
import {useEffect, useState} from 'react';
import AnimatedContainer from 'uiComponents/Tabs/AnimatedContainer';
import {getImageFromS3Static} from 'utilities/services';

const CheckItOut = ({onCancel, onSubmit, editMode, cardDetails}: ICommunityCardProps) => {
  const [file, setFile] = useState<IFile>();
  const [overlayText, setOverlayText] = useState('');
  const [_, setUnsavedChanges] = useState(false);

  const [error, setError] = useState('');

  const [fields, setFields] = useState<{
    summary: string;
    summaryHtml: string;
  }>({
    summary: editMode && !isEmpty(cardDetails) ? cardDetails?.summary || '' : '',
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

  const [isLoading, setIsLoading] = useState(false);

  const _onSubmit = () => {
    const isValid = validateFields();
    if (isValid) {
      setIsLoading(true);
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
        cardName: overlayText
      };
      if (!editMode) {
        delete checkItOutDetails.id;
      }
      if (youtubeVideoLink) {
        checkItOutDetails = {
          ...checkItOutDetails,
          cardImageLink: '',
          additionalLinks: [youtubeVideoLink]
        };
      }
      onSubmit(checkItOutDetails, () => setIsLoading(false));
    }
  };

  const validateFields = () => {
    let isValid = true;
    const isUrlValid = REGEX.Youtube.test(youtubeVideoLink);

    if (!editMode && !youtubeVideoLink && isEmpty(file)) {
      setError('Image or video not found');
      isValid = false;
    } else {
      setError('');
      isValid = true;
    }
    if (!overlayText) {
      setError('Overlay text not found');
      isValid = false;
    } else {
      setError('');
      isValid = true;
    }
    if (!fields.summary) {
      setError('Description not found');
      isValid = false;
    } else {
      setError('');
      isValid = true;
    }
    if (!youtubeVideoLink && !tempData?.image && !youtubeVideoLink && isEmpty(file)) {
      setError('Please add youtube/vimeo link');
      isValid = false;
    } else {
      setError('');
      isValid = true;
    }
    if (youtubeVideoLink && !isUrlValid) {
      setError('Invalid Url');
      isValid = false;
    } else {
      setError('');
      isValid = true;
    }
    return isValid;
  };

  const [tempData, setTempData] = useState<any>(null);

  useEffect(() => {
    if (editMode && !isEmpty(cardDetails)) {
      setTempData({
        image: cardDetails.cardImageLink
      });

      if (cardDetails?.additionalLinks && cardDetails?.additionalLinks?.length > 0) {
        setYoutubeVideoLink(cardDetails.additionalLinks[0]);
      }

      cardDetails?.cardName && setOverlayText(cardDetails?.cardName);
    }
  }, [editMode, cardDetails]);

  const [youtubeVideoLink, setYoutubeVideoLink] = useState('');

  const mediaProps = {
    videoLink: youtubeVideoLink,
    setVideoLink: setYoutubeVideoLink,
    setError: setError,
    setFile: setFile,
    file: file
  };

  return (
    <div className="">
      {tempData && tempData?.image ? (
        <div>
          {/*  @ts-ignore */}
          <Media
            initialImage={getImageFromS3Static(
              COMMUNITY_UPLOAD_KEY +
                (!isEmpty(file) && file?._status === 'success'
                  ? file?.fileKey
                  : tempData?.image)
            )}
            {...mediaProps}
          />
        </div>
      ) : (
        // @ts-ignore
        <Media
          initialImage={
            !isEmpty(file) && file?._status === 'success'
              ? getImageFromS3Static(COMMUNITY_UPLOAD_KEY + file?.fileKey)
              : undefined
          }
          {...mediaProps}
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
          <RichTextEditor
            placeholder={
              'What do you want people in the community to check out this video or image you uploaded?'
            }
            rounded
            customStyle
            initialValue={fields.summary}
            onChange={(htmlContent, plainText) =>
              onEditorStateChange(htmlContent, plainText, 'summaryHtml', 'summary')
            }
          />

          <div className="text-right text-light ">{fields.summary.length} of 750</div>
        </div>
      </div>

      <AnimatedContainer show={Boolean(error)}>
        {error && <p className="mx-4 text-red-500 text-xs">{error}</p>}
      </AnimatedContainer>
      <div className="flex mt-8 justify-center px-6 pb-4">
        <div className="flex justify-end gap-4">
          <Buttons label={'Cancel'} onClick={onCancel} transparent />
          <Buttons loading={isLoading} label={'Save'} onClick={_onSubmit} />
        </div>
      </div>
    </div>
  );
};

export default CheckItOut;
