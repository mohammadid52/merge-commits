import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactCrop from 'react-image-crop';


interface ProfileCropModalProps {
  upImg?: any;
  saveCroppedImage?:any
}

interface Crop {
  unit: string
  width: number
  aspect: number
}

// TODO:
// Specify field type insted of any

const ProfileCropModal: React.FC<ProfileCropModalProps> = (props: ProfileCropModalProps) => {
  const { upImg, saveCroppedImage } = props
  const [crop, setCrop] = useState<any>({ unit: '%', width: 30, aspect: 1 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);

  
  useEffect(() => {
    document.getElementById('abcd').scrollIntoView();
  }, []);
  
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
      canvas.toBlob((file:any) => {
        file.name = 'fileName';
        resolve(file);
      }, 'image/jpeg');
    });
  }


  return (
    <div>
      <div className="mx-auto my-5 max-h-120 max-w-120 overflow-hidden" id="abcd">
        <ReactCrop
          src={upImg}
          onImageLoaded={onLoad}
          crop={crop}
          onChange={(c: any) => setCrop(c)}
          onComplete={(c: any) => setCompletedCrop(c)}
        />
      </div>
      <div className="mx-auto w-2/10 my-4">
        <button type="submit" onClick={saveCroped} className="inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out items-center">
          Save
        </button>
      </div>
    </div>
  )

}

export default ProfileCropModal;