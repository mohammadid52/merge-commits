import React, { useState, useRef, useCallback } from 'react';
import ReactCrop from 'react-image-crop';


interface ProfileCropModalProps {
  upImg?: any;
}

interface Crop {
  unit: string
  width: number
  aspect: number
}
// TODO:
// Specify field type insted of any
 
const ProfileCropModal: React.FC<ProfileCropModalProps> = (props: ProfileCropModalProps) => {
  const { upImg } = props
  const [crop, setCrop] = useState<any>({ unit: '%', width: 30, aspect: 16 / 9 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  return (
    <div className="animated fadeIn fixed z-50 pin top-2 overflow-auto bg-smoke-dark flex">
      <div className="animated fadeInUp fixed shadow-inner max-w-md md:relative pin-b pin-x align-top m-auto justify-end md:justify-center p-8 bg-white md:rounded w-full md:h-auto md:shadow flex flex-col">
        <div style={{ width: '500px', height: '500px' }}>
          <ReactCrop
            src={upImg}
            onImageLoaded={onLoad}
            crop={crop}
            onChange={(c: any) => setCrop(c)}
            onComplete={(c: any) => setCompletedCrop(c)}
          />
        </div>
      </div>
    </div>
  )

}

export default ProfileCropModal;