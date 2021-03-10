import React, { useContext } from 'react';
import Banner from './Banner';
import { LessonContext } from '../../../contexts/LessonContext';

interface InstructionBlockProps {
  isTeacher?: boolean;
  titleVisible?: boolean;
  instructionsTitle?: string;
  instructions?: string | string[];
}

const InstructionsBlock = (props: InstructionBlockProps) => {
  const {theme} = useContext(LessonContext);
  const { isTeacher, titleVisible, instructionsTitle, instructions } = props;

  return (
    <>
      {/**
       * DISPLAY PROPS TITLE...
       */}
      {titleVisible && instructionsTitle ? <Banner titleSection={instructionsTitle} /> : null}
      {/**
       * ARRAY OF INSTRUCTIONS...
       */}
      {Array.isArray(instructions) &&
        instructions.map((inst: any, key: number) => (
          <p key={key} className={`mb-1 text-gray-100 ${theme.elem.text}`} dangerouslySetInnerHTML={{ __html: inst }}></p>
        ))}
      {/**
       * STRING OF INSTRUCTIONS...
       */}
      {typeof instructions === 'string' && (
        <p className={`mb-1 text-gray-100 ${theme.elem.text}`} dangerouslySetInnerHTML={{ __html: instructions }}></p>
      )}
    </>
  );
};

export default InstructionsBlock;
