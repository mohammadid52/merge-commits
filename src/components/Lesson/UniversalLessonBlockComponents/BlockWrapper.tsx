import React from 'react';
import {PagePart} from '../../../interfaces/UniversalLessonInterfaces';
import {RowWrapperProps} from '../../../interfaces/UniversalLessonBuilderInterfaces';

export const RowWrapper = (props: RowWrapperProps) => {
  const {contentID, mode, children, pagePart, toggleMouseLeave, toggleMouseEnter} = props;
  return <div id={contentID}>{children}</div>;
};
