import React, { useState } from 'react';
import { PagePart, PartContent, UniversalLessonPage } from '../../../../../interfaces/UniversalLessonInterfaces';
import TextArea from '../../../../Atoms/Form/TextArea';

interface EditPanelFormProps {
  selectedPageDetails?: UniversalLessonPage;
  selectedPagePartDetails: PagePart;
  setSelectedPagePartDetails: React.Dispatch<React.SetStateAction<PagePart>>;
  selectedPartContentDetails: PartContent;
  setSelectedPartContentDetails: React.Dispatch<React.SetStateAction<PartContent>>;
}

export const EditPanelForm = (props: EditPanelFormProps) => {
  const {
    selectedPageDetails,
    selectedPagePartDetails,
    setSelectedPagePartDetails,
    selectedPartContentDetails,
    setSelectedPartContentDetails,
  } = props;

  //TODO: this update function needs to do more complex stuff
  const updatePartContentValue = (e: any) => {
    const value = e.target.value;
    const newPartContentDetails = { ...selectedPartContentDetails, value: [value] };
    setSelectedPartContentDetails(newPartContentDetails);
  };

  const composeEditForm = (partContent: PartContent) => {
    if (partContent.type.includes('paragraph')) {
      return (
        <TextArea
          id={partContent.id}
          onChange={updatePartContentValue}
          value={partContent.value.length > 0 ? partContent.value[0] : ''}
          placeHolder={partContent.value.length > 0 ? partContent.value[0] : ''}
        />
      );
    } else {
      return <p className={`text-center`}>No edit form available</p>;
    }
  };

  return selectedPartContentDetails && composeEditForm(selectedPartContentDetails);
};
