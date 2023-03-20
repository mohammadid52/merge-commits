import {useGlobalContext} from '@contexts/GlobalContext';
import Buttons from 'atoms/Buttons';
import Modal from 'atoms/Modal';
import useDictionary from 'customHooks/dictionary';
import React, {useRef, useState} from 'react';
import ReactCrop from 'react-image-crop';
import AnimatedContainer from '../../Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';

interface ProfileCropModalProps {
  upImg: string;
  saveCroppedImage: (img: any) => void;
  closeAction: () => void;
  handleImage?: () => void;
  imageClassName?: string;
  customCropProps?: {[key: string]: any};
  locked?: boolean;
  cardLayout?: boolean;
  open: boolean;
}

const ProfileCropModal: React.FC<ProfileCropModalProps> = (
  props: ProfileCropModalProps
) => {
  const {
    upImg = '',
    customCropProps,
    locked = false,
    imageClassName,

    saveCroppedImage,
    closeAction,
    open
  } = props;
  const initial = customCropProps
    ? {...customCropProps}
    : {unit: '%', x: 0, y: 0, width: 100, aspect: 1};
  const [crop, setCrop] = useState<any>(initial);
  const [completedCrop, setCompletedCrop] = useState<any | null>(null);
  const {userLanguage} = useGlobalContext();
  const {BUTTONS} = useDictionary();
  const imgRef = useRef<any>(null);

  const saveCroped = async () => {
    const image = imgRef.current;
    if (image) {
      const croppedImg = await getCroppedImg(image, completedCrop);
      saveCroppedImage(croppedImg);
    }
  };

  const getCroppedImg = (image: any, finalCrop: any) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = finalCrop.width;
    canvas.height = finalCrop.height;
    const ctx: any = canvas.getContext('2d');

    ctx.drawImage(
      image,
      finalCrop.x * scaleX,
      finalCrop.y * scaleY,
      finalCrop.width * scaleX,
      finalCrop.height * scaleY,
      0,
      0,
      finalCrop.width,
      finalCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((file: any) => {
        file.name = 'fileName';
        resolve(file);
      }, 'image/jpeg');
    });
  };

  const [showCropper] = useState(false);

  return (
    <Modal
      open={open}
      showHeader={true}
      showHeaderBorder={false}
      title={'Preview image'}
      showFooter={false}
      closeAction={closeAction}>
      <div className="mx-auto mb-5  max-w-256 w-140  overflow-hidden">
        <AnimatedContainer show={!showCropper}>
          {!showCropper && (
            <div className="flex items-center gap-x-6 w-auto">
              <img
                src={upImg}
                className={
                  imageClassName ||
                  'profile w-20 h-20 md:w-40 md:h-40 rounded-full  border-0 flex flex-shrink-0 border-gray-400 shadow-elem-light mx-auto'
                }
              />
            </div>
          )}
        </AnimatedContainer>
        <AnimatedContainer show={showCropper}>
          {showCropper && (
            <ReactCrop
              locked={locked}
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c: any) => setCompletedCrop(c)}>
              <img src={upImg} />
            </ReactCrop>
          )}
        </AnimatedContainer>
      </div>
      <div className="flex gap-x-4 items-center justify-end my-4">
        <Buttons
          label={'Cancel'}
          onClick={closeAction}
          size="middle"
          btnClass=""
          transparent
        />

        <Buttons
          size="middle"
          dataCy="save-profile-image"
          label={showCropper ? 'Save cropped image' : BUTTONS[userLanguage].SAVE}
          onClick={showCropper ? saveCroped : () => saveCroppedImage(undefined)}
          btnClass=""
        />
      </div>
    </Modal>
  );
};

export default ProfileCropModal;
