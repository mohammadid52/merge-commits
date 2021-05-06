import Buttons from '../../../../Atoms/Buttons';
import React from 'react';
import { FiLayers } from 'react-icons/fi';

interface PageGalleryToggleProps {
  handleSetGalleryVisibility: () => void;
}

export const PageGalleryToggle = (props: PageGalleryToggleProps) => {
  const { handleSetGalleryVisibility } = props;
  return <Buttons Icon={FiLayers} label="Page Gallery" onClick={handleSetGalleryVisibility} btnClass="px-4" />;
};
