import React, {useContext} from 'react';
import Banner from './Banner';
import {LessonContext} from '../../../contexts/LessonContext';
import {LessonControlContext} from '../../../contexts/LessonControlContext';
import {stripStyleFromHTML} from '../../../utilities/strings';

interface InstructionBlockProps {
  isTeacher?: boolean;
  titleVisible?: boolean;
  instructionsTitle?: string;
  instructions?: string | string[];
  animate?: boolean;
}

const InstructionsBlock = (props: InstructionBlockProps) => {
  const {isTeacher, animate, titleVisible, instructionsTitle, instructions} = props;
  const switchContext = isTeacher
    ? useContext(LessonControlContext)
    : useContext(LessonContext);
  const {state, theme, dispatch} = switchContext;

  return (
    <>
      {/**
       * DISPLAY PROPS TITLE...
       */}
      {titleVisible && instructionsTitle ? (
        <Banner titleSection={instructionsTitle} />
      ) : null}
      {/**
       * ARRAY OF INSTRUCTIONS...
       */}
      {Array.isArray(instructions) &&
        instructions.map((inst: any, key: number) => (
          <p
            key={key}
            className={`mb-1 text-gray-100 ${animate && 'fade__animation2'}  ${
              theme.elem.text
            }`}
            dangerouslySetInnerHTML={{__html: inst && stripStyleFromHTML(inst)}}></p>
        ))}
      {/**
       * STRING OF INSTRUCTIONS...
       */}
      {typeof instructions === 'string' && (
        <p
          className={`mb-1 text-gray-100 ${animate && 'fade__animation2'}  ${
            theme.elem.text
          }`}
          dangerouslySetInnerHTML={{
            __html: instructions && stripStyleFromHTML(instructions),
          }}></p>
      )}
    </>
  );
};

export default InstructionsBlock;
