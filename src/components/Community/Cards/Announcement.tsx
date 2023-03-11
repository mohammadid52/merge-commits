import FormInput from "atoms/Form/FormInput";
import Buttons from "atoms/Buttons";
import Label from "atoms/Form/Label";
import RichTextEditor from "atoms/RichTextEditor";
import Media from "components/Community/Components/Media";
import {
  COMMUNITY_UPLOAD_KEY,
  IFile,
} from "components/Community/constants.community";
import { REGEX } from "components/Lesson/UniversalLessonBuilder/UI/common/constants";
import {
  IAnnouncementInput,
  ICommunityCardProps,
} from "interfaces/Community.interfaces";
import AnimatedContainer from "uiComponents/Tabs/AnimatedContainer";
import { getImageFromS3Static } from "utilities/services";
import isEmpty from "lodash/isEmpty";
import React, { useEffect, useState } from "react";

const Announcements = ({
  onCancel,
  onSubmit,
  editMode,
  cardDetails,
}: ICommunityCardProps) => {
  const [file, setFile] = useState<IFile | any>({ _status: "other" });
  const [overlayText, setOverlayText] = useState("");
  const [_, setUnsavedChanges] = useState(false);
  const [fields, setFields] = useState<{
    summary: string;
    summaryHtml: string;
  }>({
    summary:
      editMode && !isEmpty(cardDetails) ? cardDetails?.summary || "" : "",
    summaryHtml:
      editMode && !isEmpty(cardDetails) ? cardDetails?.summaryHtml || "" : "",
  });

  const [tempData, setTempData] = useState<null | { image: string | null }>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editMode && !isEmpty(cardDetails)) {
      setTempData({
        image: cardDetails?.cardImageLink || "",
      });

      if (
        cardDetails?.additionalLinks &&
        cardDetails?.additionalLinks?.length > 0
      ) {
        setYoutubeVideoLink(cardDetails.additionalLinks[0]);
      }

      cardDetails?.cardName && setOverlayText(cardDetails?.cardName);
    }
  }, [editMode, cardDetails]);

  const [error, setError] = useState("");

  const onEditorStateChange = (
    html: string,
    text: string,
    fieldHtml: string,
    field: string
  ) => {
    setUnsavedChanges(true);
    setError("");
    setFields({ ...fields, [field]: text, [fieldHtml]: html });
  };

  const _onSubmit = () => {
    const isValid = validateFields();
    if (isValid) {
      setIsLoading(true);
      let announcementsDetails: IAnnouncementInput = {
        summary: fields.summary,
        summaryHtml: fields.summaryHtml,
        cardName: overlayText,
        cardImageLink: editMode
          ? file && file?.fileKey
            ? file?.fileKey
            : cardDetails?.cardImageLink
          : file?.fileKey,
        id: cardDetails?.id,
        isEditedCard: editMode,
      };

      if (!editMode) {
        delete announcementsDetails.id;
      }
      if (youtubeVideoLink) {
        announcementsDetails = {
          ...announcementsDetails,
          cardImageLink: "",
          additionalLinks: [youtubeVideoLink],
        };
      }

      onSubmit(announcementsDetails, () => setIsLoading(false));
    }
  };

  const validateFields = () => {
    let isValid = true;
    if (!editMode && !youtubeVideoLink && isEmpty(file)) {
      setError("Image or video not found");
      isValid = false;
    } else if (!overlayText) {
      setError("Overlay text not found");
      isValid = false;
    } else if (!fields.summary) {
      setError("Please add description");
      isValid = false;
    } else if (
      !youtubeVideoLink &&
      !tempData?.image &&
      !youtubeVideoLink &&
      isEmpty(file)
    ) {
      setError("Please add youtube/vimeo link or image");
      isValid = false;
    } else if (youtubeVideoLink && !REGEX.Youtube.test(youtubeVideoLink)) {
      setError("Invalid Url");
      isValid = false;
    } else {
      setError("");
      isValid = true;
    }
    return isValid;
  };

  const [youtubeVideoLink, setYoutubeVideoLink] = useState("");

  const mediaProps = {
    videoLink: youtubeVideoLink,
    setVideoLink: setYoutubeVideoLink,
    setError: setError,
    setFile: setFile,
    file: file,
  };

  return (
    <div className="">
      {tempData && tempData?.image ? (
        <div>
          {file && (
            // @ts-ignore
            <Media
              initialImage={getImageFromS3Static(
                COMMUNITY_UPLOAD_KEY +
                  (!isEmpty(file) && file?._status === "success"
                    ? file?.fileKey
                    : tempData?.image)
              )}
              {...mediaProps}
            />
          )}
        </div>
      ) : (
        file && (
          // @ts-ignore
          <Media
            initialImage={
              !isEmpty(file) && file?._status === "success"
                ? getImageFromS3Static(COMMUNITY_UPLOAD_KEY + file?.fileKey)
                : undefined
            }
            {...mediaProps}
          />
        )
      )}

      <div className="px-3 py-4">
        <div>
          <FormInput
            dataCy="announcement-overlay-input"
            label="Step 2: Add overlay text"
            onChange={(e) => {
              setError("");
              setOverlayText(e.target.value);
            }}
            placeHolder={"Overlay Text"}
            value={overlayText}
          />
        </div>
      </div>
      <div className="px-3 py-4">
        <Label label="Step 3: Add a description" />

        <div>
          <RichTextEditor
            placeholder={
              "Why do you want people in the community to know about what is happening"
            }
            rounded
            customStyle
            initialValue={fields.summary}
            onChange={(htmlContent, plainText) =>
              onEditorStateChange(
                htmlContent,
                plainText,
                "summaryHtml",
                "summary"
              )
            }
          />

          <div className="text-right text-gray-400">
            {fields.summary.length} of 750
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
            label={"Cancel"}
            onClick={onCancel}
            transparent
          />
          <Buttons
            dataCy="save-announcement-button"
            loading={isLoading}
            disabled={!editMode && isEmpty(file) && file?._status !== "success"}
            btnClass="py-1 px-8 text-xs ml-2"
            label={"Save"}
            onClick={_onSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default Announcements;
