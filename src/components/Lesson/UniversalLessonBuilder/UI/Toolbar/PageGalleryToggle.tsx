import Buttons from '../../../../Atoms/Buttons';
import React from 'react';
import { FiLayers } from 'react-icons/fi';
import { ToolbarProps } from '../Toolbar';

interface PageGalleryToggleProps extends ToolbarProps {
  handleSetGalleryVisibility?: () => void;
  handleModalPopToggle?: (dialogToToggle: string) => void;
}

export const PageGalleryToggle = (props: PageGalleryToggleProps) => {
  const { handleSetGalleryVisibility } = props;
  return <Buttons Icon={FiLayers} label="Page Gallery" onClick={handleSetGalleryVisibility} btnClass="px-4" />;
};
