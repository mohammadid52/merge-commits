import React, { useContext } from 'react';
import Banner from './Banner';
import { LessonContext } from '../../../contexts/LessonContext';
import { LessonControlContext } from '../../../contexts/LessonControlContext';

interface InstructionBlockProps {
  isTeacher?: boolean;
  titleVisible?: boolean;
  instructionsTitle?: string;
  instructions?: string | string[];
}

const InstructionsBlock = (props: InstructionBlockProps) => {
  const { isTeacher, titleVisible, instructionsTitle, instructions } = props;
  const switchContext = isTeacher ? useContext(LessonControlContext) : useContext(LessonContext);
  const { state, theme, dispatch } = switchContext;

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
