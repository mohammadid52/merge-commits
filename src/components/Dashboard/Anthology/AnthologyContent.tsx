import React, { useContext } from 'react';
import { useState, useEffect } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import ContentCard from '../../Atoms/ContentCard';

interface ContentCardProps {
  content?: any;
}

const AnthologyContent = (props: ContentCardProps) => {
  const {content} = props;
  const { theme } = useContext(GlobalContext);
  return (
    <>
      <ContentCard>
        Your {content} content will appear here...
      </ContentCard>
      </>
  );
};

export default AnthologyContent;
