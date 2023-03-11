import React from "react";
import { useDropzone } from "react-dropzone";

const DroppableMedia = ({
  children,
  mediaRef,
  className = "w-auto",
  setImage,
  toggleCropper,
}: {
  mediaRef: any;
  setImage?: any;
  className?: string;
  toggleCropper?: () => void;
  children: React.ReactNode;
}) => {
  const _setImage = (file: any) => {
    const fileReader = new FileReader();
    fileReader.onload = function () {
      setImage(fileReader.result, file);
    };
    fileReader.readAsDataURL(file);
    if (typeof toggleCropper === "function") {
      toggleCropper();
    }
  };

  const cropSelectedImage = async (e: any, files: any) => {
    if (e) {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        _setImage(file);
      }
    } else {
      if (Array.isArray(files)) {
        if (files && files.length > 0) {
          const file = files[0];
          _setImage(file);
        }
      } else {
        const file = files;
        _setImage(file);
      }
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (files) => cropSelectedImage(undefined, files),
  });

  return (
    <div className={className} {...getRootProps()}>
      {children}
      <input
        {...getInputProps()}
        type="file"
        ref={mediaRef}
        className="hidden"
        onChange={(e: any) => cropSelectedImage(e, undefined)}
        onClick={(e: any) => (e.target.value = "")}
        accept="image/*"
        multiple={false}
      />
    </div>
  );
};

export default DroppableMedia;
