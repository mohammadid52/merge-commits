import Modal from 'atoms/Modal';
import React, {useState} from 'react';
import ReactCrop, {Crop} from 'react-image-crop';
import 'react-image-crop/src/ReactCrop.scss';

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
  const {closeAction, upImg, open} = props;

  const [crop, setCrop] = useState<Crop>();

  // const handleCropComplete = (croppedArea: Crop, croppedAreaPixels: PixelCrop) => {
  //   const canvas = document.createElement('canvas');
  //   const image = new Image();
  //   image.src = upImg;
  //   image.onload = () => {
  //     const scaleX = image.naturalWidth / image.width;
  //     const scaleY = image.naturalHeight / image.height;
  //     canvas.width = croppedAreaPixels.width * scaleX;
  //     canvas.height = croppedAreaPixels.height * scaleY;
  //     const ctx = canvas.getContext('2d');
  //     ctx?.drawImage(
  //       image,
  //       croppedAreaPixels.x * scaleX,
  //       croppedAreaPixels.y * scaleY,
  //       croppedAreaPixels.width * scaleX,
  //       croppedAreaPixels.height * scaleY,
  //       0,
  //       0,
  //       croppedAreaPixels.width * scaleX,
  //       croppedAreaPixels.height * scaleY
  //     );
  //     const croppedImageUrl = canvas.toDataURL('image/png');
  //     saveCroppedImage(croppedImageUrl);
  //   };
  // };

  // this file is still in progress

  return (
    <Modal
      open={open}
      showHeader={true}
      showHeaderBorder={false}
      title={'Preview image'}
      showFooter={false}
      closeAction={closeAction}>
      <div className="">
        <ReactCrop
          crop={crop}
          onChange={(newCrop) => setCrop(newCrop)}
          // onComplete={handleCropComplete}

          circularCrop>
          <img src={upImg} alt="" />
        </ReactCrop>
      </div>
    </Modal>
  );
};

export default ProfileCropModal;
