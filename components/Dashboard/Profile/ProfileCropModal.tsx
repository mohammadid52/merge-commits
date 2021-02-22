import React, { useState, useRef, useContext, useCallback } from 'react';
import ReactCrop from 'react-image-crop';
import Modal from '../../Atoms/Modal';
import { GlobalContext } from '../../../contexts/GlobalContext';
import useDictionary from '../../../customHooks/dictionary';

interface ProfileCropModalProps {
  upImg?: string;
  saveCroppedImage: (img: any) => void
  closeAction: () => void
}

const ProfileCropModal: React.FC<ProfileCropModalProps> = (props: ProfileCropModalProps) => {
  const { upImg, saveCroppedImage, closeAction } = props
  const [crop, setCrop] = useState<any>({ unit: '%', x: 0, y: 0, width: 100, aspect: 1 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const { userLanguage, clientKey } = useContext(GlobalContext);
  const { BUTTONS } = useDictionary(clientKey);
  const imgRef = useRef(null);

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  const saveCroped = async () => {
    const image = imgRef.current;
    const croppedImg = await getCroppedImg(image, completedCrop);
    saveCroppedImage(croppedImg);
  }


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
      finalCrop.height,
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((file: any) => {
        file.name = 'fileName';
        resolve(file);
      }, 'image/jpeg');
    });
  }


  return (
    <Modal showHeader={true} showHeaderBorder={false} showFooter={false} saveAction={saveCroped} closeAction={closeAction}>
      <div className="mx-auto my-5 max-w-112 w-112 max-h-100 overflow-hidden">
        <ReactCrop
          src={upImg}
          onImageLoaded={onLoad}
          crop={crop}
          // imageStyle={{ width: 'auto', margin: 'auto', height: '25rem' }}        // style for the image tag in cropper
          onChange={(c: any) => setCrop(c)}
          onComplete={(c: any) => setCompletedCrop(c)}
        />
      </div>
      <div className="mx-auto w-2/10 my-4">
        <button type="submit" onClick={saveCroped} className="inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out items-center">
          {BUTTONS[userLanguage].SAVE}
        </button>
      </div>
    </Modal>
  )

}

export default ProfileCropModal;