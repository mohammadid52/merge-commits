import {useGlobalContext} from '@contexts/GlobalContext';
import Buttons from 'atoms/Buttons';
import Modal from 'atoms/Modal';
import useDictionary from 'customHooks/dictionary';
import React, {useCallback, useRef, useState} from 'react';
import ReactCrop from 'react-image-crop';
import DummyContent from '../../Lesson/UniversalLessonBuilder/UI/Preview/DummyContent';
import AnimatedContainer from '../../Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
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
  const {
    upImg = '',
    customCropProps,
    locked = false,
    imageClassName,
    cardLayout = false,
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

  const onLoad = useCallback((img: any) => {
    imgRef.current = img;
  }, []);

  const saveCroped = async () => {
    const image = imgRef.current;
    if (image) {
      const croppedImg = await getCroppedImg(image, completedCrop);

      saveCroppedImage(croppedImg);
    }
  };

  const getCroppedImg = (image: any, finalCrop: any) => {
    const target = image.target;
    const canvas = document.createElement('canvas');
    const scaleX = target.naturalWidth / target.width;
    const scaleY = target.naturalHeight / target.height;
    canvas.width = finalCrop.width;
    canvas.height = finalCrop.height;
    const ctx = canvas.getContext('2d');

    ctx?.drawImage(
      target,
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

  const [showCropper, setShowCropper] = useState(false);

  return (
    <Modal
      open={open}
      showHeader={true}
      width={700}
      showHeaderBorder={false}
      title={'Preview image'}
      showFooter={false}
      closeAction={closeAction}>
      <div className="mx-auto mb-5  max-w-256 w-140  overflow-hidden">
        <AnimatedContainer show={!showCropper}>
          {!showCropper && (
            <div className="flex flex-col p-2 w-auto">
              {cardLayout ? (
                <div
                  className={`relative bg-white shadow items-center rounded-lg flex flex-col md:flex-row mb-8 `}>
                  {/**
                   *  LEFT SECTION IMAGE
                   */}

                  <div
                    className={`w-full md:h-56 h-48   rounded-tl rounded-bl shadow`}
                    style={{
                      /* stylelint-disable */
                      backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.52), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)),url(${upImg})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}></div>

                  {/**
                   *  RIGHT SECTION
                   */}
                  <div className={`w-full md:w-7.5/10 ml-4 flex flex-col rounded-b`}>
                    <DummyContent />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-x-6 w-auto">
                  <img
                    src={upImg}
                    className={
                      imageClassName ||
                      'profile w-20 h-20 md:w-40 md:h-40 rounded-full  border-0 flex flex-shrink-0 border-gray-400 shadow-elem-light mx-auto'
                    }
                  />
                  {/* <DummyContent /> */}
                </div>
              )}
              {/* <div>
                <DummyContent />
              </div> */}
            </div>
          )}
        </AnimatedContainer>
        <AnimatedContainer show={showCropper}>
          {showCropper && (
            <ReactCrop
              crop={crop}
              locked={locked}
              // imageStyle={{ width: 'auto', margin: 'auto', height: '25rem' }}        // style for the image tag in cropper
              onChange={(c: any) => setCrop(c)}
              onComplete={(c: any) => setCompletedCrop(c)}>
              <img src={upImg} onLoad={onLoad} />
            </ReactCrop>
          )}
        </AnimatedContainer>
      </div>
      <div className="flex gap-x-4 items-center justify-end my-4">
        <Buttons
          label={showCropper ? 'Cancel crop' : 'Crop image'}
          onClick={() => {
            if (showCropper) {
              setCrop(initial);
            }
            setShowCropper(!showCropper);
          }}
          transparent
        />

        <Buttons
          dataCy="save-profile-image"
          label={showCropper ? 'Save cropped image' : BUTTONS[userLanguage].SAVE}
          onClick={showCropper ? saveCroped : () => saveCroppedImage(undefined)}
        />
      </div>
    </Modal>
  );
};

export default ProfileCropModal;
