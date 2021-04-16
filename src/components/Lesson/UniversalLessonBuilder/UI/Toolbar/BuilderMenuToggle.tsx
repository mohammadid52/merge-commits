import Buttons from '../../../../Atoms/Buttons';
import React from 'react';
import { FiLayers } from 'react-icons/Fi';
import { CgMenuGridO } from 'react-icons/cg';

interface BuilderMenuToggleProps {
  handleSetBuilderMenuVisibility: () => void;
}

export const BuilderMenuToggle = (props: BuilderMenuToggleProps) => {
  const { handleSetBuilderMenuVisibility } = props;
  return <Buttons Icon={CgMenuGridO} label="Menu" onClick={handleSetBuilderMenuVisibility} btnClass="px-4" />;
};
