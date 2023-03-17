import DroppableMedia from '@components/Molecules/DroppableMedia';
import React from 'react';
import Buttons from '../Buttons';
import Label from '../Form/Label';

const UploadImageBtn = ({
  className,
  label,
  setImage,
  setImageLoading,
  toggleCropper,
  mediaRef,
  imageUrl,
  handleImage
}: {
  className?: string;
  label: string;
  setImage: any;
  setImageLoading: any;
  toggleCropper: () => void;
  mediaRef: any;
  imageUrl: string | null;
  handleImage: any;
}) => {
  return (
    <div className={className}>
      <Label label={label} />
      <DroppableMedia
        mediaRef={mediaRef}
        className="mt-1 w-full"
        setImage={setImage}
        toggleCropper={toggleCropper}>
        <Buttons
          className=" w-full"
          label={imageUrl ? 'Change image' : 'Upload image'}
          transparent
          onClick={handleImage}
          insideElement={
            imageUrl ? (
              <img
                className={`profile  w-6 h-6 theme-border bg-gray-100  border-0 flex flex-shrink-0 rounded-xl theme-card-shadow`}
                src={imageUrl}
                onLoad={() => setImageLoading(false)}
              />
            ) : null
          }
        />
      </DroppableMedia>
    </div>
  );
};

export default UploadImageBtn;
