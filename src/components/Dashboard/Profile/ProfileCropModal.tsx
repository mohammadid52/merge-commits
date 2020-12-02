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
// REmove any type 
const ProfileCropModal: React.FC<ProfileCropModalProps> = (props: ProfileCropModalProps) => {
  const { upImg } = props
  const [crop, setCrop] = useState<any>({ unit: '%', width: 30, aspect: 16 / 9 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);


  // useEffect(() => {
  //   if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
  //     return;
  //   }

  //   const image = imgRef.current;
  //   const canvas = previewCanvasRef.current;
  //   const crop = completedCrop;

  //   const scaleX = image.naturalWidth / image.width;
  //   const scaleY = image.naturalHeight / image.height;
  //   const ctx = canvas.getContext("2d");

  //   canvas.width = crop.width * pixelRatio;
  //   canvas.height = crop.height * pixelRatio;

  //   ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  //   ctx.imageSmoothingQuality = "high";

  //   ctx.drawImage(
  //     image,
  //     crop.x * scaleX,
  //     crop.y * scaleY,
  //     crop.width * scaleX,
  //     crop.height * scaleY,
  //     0,
  //     0,
  //     crop.width,
  //     crop.height
  //   );
  // }, [completedCrop]);

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